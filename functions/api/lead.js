/**
 * Cloudflare Pages Function — POST /api/lead
 * ------------------------------------------------------------------
 * Durable, mobile-safe intake for BOTH lead flows on the site. The browser
 * NEVER posts to GoHighLevel/LeadConnector directly — it POSTs JSON here, and
 * this same-origin endpoint validates, forwards to the correct CRM webhook(s)
 * server-side, then tells the browser where to go next.
 *
 *   type: 'membership'  → single webhook, BLOCKS on success, returns the
 *                         checkout/payment redirect (payment depends on capture).
 *   type: 'booking'     → free-class lead form. Fires ALL of the program's
 *                         webhooks SIMULTANEOUSLY (best-effort), then redirects
 *                         to the booking calendar. Never blocks the booker.
 *
 * Configure every URL below as a Cloudflare Pages *production* environment
 * variable (Settings → Environment variables). Do NOT hardcode URLs here or
 * in the browser JS. Mirror them into .dev.vars for `wrangler pages dev`.
 *
 *   Membership webhooks:
 *     WEBHOOK_ADULT            → adult-3x, adult-unlimited
 *     WEBHOOK_DROPIN           → drop-in
 *     WEBHOOK_KIDS             → kids-unlimited, kids-single
 *     WEBHOOK_FIRST_RESPONDERS → active-duty (membership checkout)
 *
 *   Membership payment links (per plan):
 *     PAY_ADULT_3X, PAY_ADULT_UNLIMITED, PAY_DROP_IN,
 *     PAY_KIDS_UNLIMITED, PAY_KIDS_SINGLE, PAY_ACTIVE_DUTY
 *
 *   Booking (free-class lead form) webhooks — all fire together on submit:
 *     WEBHOOK_MMA_1, WEBHOOK_MMA_2                 → mma
 *     WEBHOOK_MUAY_THAI_1, WEBHOOK_MUAY_THAI_2     → muay-thai
 *     WEBHOOK_JIU_JITSU_1, WEBHOOK_JIU_JITSU_2     → jiu-jitsu
 *     WEBHOOK_SC_1, WEBHOOK_SC_2                   → strength-conditioning
 *     WEBHOOK_FIGHT_FIT_1                          → fight-fit
 *     WEBHOOK_LAW_ENFORCEMENT_1                          → active-duty (free class)
 *     WEBHOOK_KIDS_JIU_JITSU_1, WEBHOOK_KIDS_JIU_JITSU_2 → kids-jiu-jitsu
 *     WEBHOOK_KIDS_MUAY_THAI_1, WEBHOOK_KIDS_MUAY_THAI_2 → kids-muay-thai
 *     WEBHOOK_AFTER_SCHOOL_1                          → after-school
 *
 *   Optional:
 *     ALLOWED_WEBHOOK_HOSTS  → comma-separated hostnames the server may
 *                              forward to. Defaults below.
 * ------------------------------------------------------------------
 */

// Membership plans → single webhook + payment link.
const PROGRAMS = {
  'adult-3x':        { webhookVar: 'WEBHOOK_ADULT',            payVar: 'PAY_ADULT_3X' },
  'adult-unlimited': { webhookVar: 'WEBHOOK_ADULT',            payVar: 'PAY_ADULT_UNLIMITED' },
  'drop-in':         { webhookVar: 'WEBHOOK_DROPIN',           payVar: 'PAY_DROP_IN' },
  'kids-unlimited':  { webhookVar: 'WEBHOOK_KIDS',             payVar: 'PAY_KIDS_UNLIMITED' },
  'kids-single':     { webhookVar: 'WEBHOOK_KIDS',             payVar: 'PAY_KIDS_SINGLE' },
  'active-duty':     { webhookVar: 'WEBHOOK_FIRST_RESPONDERS', payVar: 'PAY_ACTIVE_DUTY' },
};

// Free-class booking programs → the env var NAMES of every webhook that must
// fire simultaneously on submit. Each kids program has its own webhook.
const BOOKING_WEBHOOKS = {
  'mma':                   ['WEBHOOK_MMA_1', 'WEBHOOK_MMA_2'],
  'muay-thai':             ['WEBHOOK_MUAY_THAI_1', 'WEBHOOK_MUAY_THAI_2'],
  'jiu-jitsu':             ['WEBHOOK_JIU_JITSU_1', 'WEBHOOK_JIU_JITSU_2'],
  'strength-conditioning': ['WEBHOOK_SC_1', 'WEBHOOK_SC_2'],
  'fight-fit':             ['WEBHOOK_FIGHT_FIT_1'],
  'active-duty':           ['WEBHOOK_LAW_ENFORCEMENT_1'],
  'kids-jiu-jitsu':        ['WEBHOOK_KIDS_JIU_JITSU_1', 'WEBHOOK_KIDS_JIU_JITSU_2'],
  'kids-muay-thai':        ['WEBHOOK_KIDS_MUAY_THAI_1', 'WEBHOOK_KIDS_MUAY_THAI_2'],
  'after-school':          ['WEBHOOK_AFTER_SCHOOL_1'],
};

const DEFAULT_ALLOWED_HOSTS = ['services.leadconnectorhq.com', 'backend.leadconnectorhq.com'];
const WEBHOOK_TIMEOUT_MS = 8000;

// Programs whose same-site checkout page (/checkout-<slug>.html) is live.
const CHECKOUT_READY = new Set(['adult-3x', 'adult-unlimited', 'drop-in', 'kids-unlimited', 'kids-single', 'active-duty']);

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

const trim = (v) => (v == null ? '' : String(v)).trim();
const isEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

function allowedHosts(env) {
  return trim(env.ALLOWED_WEBHOOK_HOSTS)
    ? trim(env.ALLOWED_WEBHOOK_HOSTS).split(',').map((h) => h.trim().toLowerCase()).filter(Boolean)
    : DEFAULT_ALLOWED_HOSTS;
}

function hostAllowed(url, allowed) {
  let parsed;
  try { parsed = new URL(url); } catch (_) { return false; }
  return parsed.protocol === 'https:' && allowed.indexOf(parsed.host.toLowerCase()) !== -1;
}

// POST a lead to one webhook with a timeout. Resolves true on 2xx, false on
// any error/timeout/non-2xx — never throws, so Promise.allSettled callers can
// count deliveries without a rejection short-circuiting the batch.
async function postWebhook(url, payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch (_) {
    clearTimeout(timer);
    return false;
  }
}

export async function onRequest({ request, env }) {
  // Only POST is accepted; everything else gets a JSON 405 (not a bare page).
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'method_not_allowed' }, 405);
  }

  // 1. Parse body
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }
  if (!body || typeof body !== 'object') {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  // 2. Common contact fields + validation (shared by both flows)
  const firstName = trim(body.firstName);
  const lastName = trim(body.lastName);
  const email = trim(body.email);
  const phone = trim(body.phone);
  const program = trim(body.program);
  // SMS consent — captured for TCPA record-keeping; never required to submit.
  const smsTransactionalConsent = body.smsTransactionalConsent === true || body.smsTransactionalConsent === 'yes';
  const smsMarketingConsent = body.smsMarketingConsent === true || body.smsMarketingConsent === 'yes';
  const isBooking = trim(body.type) === 'booking';

  const invalid = [];
  if (!firstName) invalid.push('firstName');
  if (!lastName) invalid.push('lastName');
  if (!isEmail(email)) invalid.push('email');
  // Phone is optional; only reject a malformed number when one was provided.
  if (phone && phone.replace(/\D/g, '').length < 10) invalid.push('phone');

  // ================= BOOKING (free-class lead form) =================
  if (isBooking) {
    if (!Object.prototype.hasOwnProperty.call(BOOKING_WEBHOOKS, program)) invalid.push('program');
    if (invalid.length) {
      return json({ ok: false, error: 'validation_failed', fields: invalid }, 400);
    }

    const allowed = allowedHosts(env);
    const urls = BOOKING_WEBHOOKS[program]
      .map((name) => trim(env[name]))
      .filter(Boolean)
      .filter((u) => hostAllowed(u, allowed));

    const lead = {
      firstName,
      lastName,
      email,
      phone,
      program,
      smsTransactionalConsent,
      smsMarketingConsent,
      type: 'booking',
      source: 'website-booking-form',
      submittedAt: new Date().toISOString(),
    };

    // Fire every mapped webhook simultaneously. Best-effort: we still send the
    // booker to the calendar even if a webhook is slow, down, or not yet
    // configured — a free-class booking must never be trapped behind the CRM.
    const results = await Promise.allSettled(urls.map((u) => postWebhook(u, lead)));
    const delivered = results.filter((r) => r.status === 'fulfilled' && r.value === true).length;

    return json({
      ok: true,
      redirect: '/booking.html?program=' + encodeURIComponent(program),
      dispatched: urls.length,
      delivered,
    }, 200);
  }

  // ===================== MEMBERSHIP (checkout) ======================
  if (!Object.prototype.hasOwnProperty.call(PROGRAMS, program)) invalid.push('program');
  if (invalid.length) {
    return json({ ok: false, error: 'validation_failed', fields: invalid }, 400);
  }

  const map = PROGRAMS[program];
  const webhookUrl = trim(env[map.webhookVar]);

  // Where to send the visitor after the lead is captured:
  //  1. an explicit PAY_* override (e.g. a direct external checkout URL), else
  //  2. the same-site MindBody checkout page if it's live, else
  //  3. the sign-up page as a safe fallback (never a dead link / 404).
  let redirectUrl = trim(env[map.payVar]);
  if (!redirectUrl) {
    redirectUrl = CHECKOUT_READY.has(program)
      ? '/checkout-' + program + '.html'
      : '/memberships-sign-up.html?program=' + encodeURIComponent(program);
  }

  if (!webhookUrl) {
    return json({ ok: false, error: 'server_not_configured', detail: map.webhookVar }, 500);
  }

  // Allowlist the outbound host (defense-in-depth against misconfig)
  if (!hostAllowed(webhookUrl, allowedHosts(env))) {
    let host = '';
    try { host = new URL(webhookUrl).host; } catch (_) {}
    return json({ ok: false, error: 'webhook_host_not_allowed', host: host }, 500);
  }

  // Forward the normalized lead to the CRM webhook, blocking on the result.
  const lead = {
    firstName,
    lastName,
    email,
    phone,
    program,
    smsTransactionalConsent,
    smsMarketingConsent,
    type: 'membership',
    source: 'website-membership-form',
    submittedAt: new Date().toISOString(),
  };

  const delivered = await postWebhook(webhookUrl, lead);
  // Success only after the CRM webhook returns 2xx (payment depends on capture).
  if (!delivered) {
    return json({ ok: false, error: 'webhook_failed' }, 502);
  }

  return json({ ok: true, redirect: redirectUrl }, 200);
}
