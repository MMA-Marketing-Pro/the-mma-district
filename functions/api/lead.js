/**
 * Cloudflare Pages Function — POST /api/lead
 * ------------------------------------------------------------------
 * Durable, mobile-safe intake for the membership lead form.
 *
 * The browser NEVER posts to GoHighLevel/LeadConnector directly. It POSTs
 * JSON to this same-origin endpoint, which validates, forwards the lead to
 * the correct CRM webhook (server-side secret), and only returns success
 * after that webhook responds 2xx. The success body includes the payment
 * link the browser should redirect to.
 *
 * Configure these as Cloudflare Pages *production* environment variables
 * (Settings → Environment variables). Do NOT hardcode URLs here or in the
 * browser JS.
 *
 *   Webhooks (4, grouped by category):
 *     WEBHOOK_ADULT              → adult-3x, adult-unlimited
 *     WEBHOOK_DROPIN             → drop-in
 *     WEBHOOK_KIDS               → kids-unlimited, kids-single
 *     WEBHOOK_FIRST_RESPONDERS   → active-duty
 *
 *   Payment links (per plan — prices differ, so each needs its own link):
 *     PAY_ADULT_3X, PAY_ADULT_UNLIMITED, PAY_DROP_IN,
 *     PAY_KIDS_UNLIMITED, PAY_KIDS_SINGLE, PAY_ACTIVE_DUTY
 *
 *   Optional:
 *     ALLOWED_WEBHOOK_HOSTS  → comma-separated hostnames the server is
 *                              permitted to forward to. Defaults below.
 * ------------------------------------------------------------------
 */

const PROGRAMS = {
  'adult-3x':        { webhookVar: 'WEBHOOK_ADULT',            payVar: 'PAY_ADULT_3X' },
  'adult-unlimited': { webhookVar: 'WEBHOOK_ADULT',            payVar: 'PAY_ADULT_UNLIMITED' },
  'drop-in':         { webhookVar: 'WEBHOOK_DROPIN',           payVar: 'PAY_DROP_IN' },
  'kids-unlimited':  { webhookVar: 'WEBHOOK_KIDS',             payVar: 'PAY_KIDS_UNLIMITED' },
  'kids-single':     { webhookVar: 'WEBHOOK_KIDS',             payVar: 'PAY_KIDS_SINGLE' },
  'active-duty':     { webhookVar: 'WEBHOOK_FIRST_RESPONDERS', payVar: 'PAY_ACTIVE_DUTY' },
};

const DEFAULT_ALLOWED_HOSTS = ['services.leadconnectorhq.com', 'backend.leadconnectorhq.com'];
const WEBHOOK_TIMEOUT_MS = 8000;

// Programs whose same-site checkout page (/checkout-<slug>.html) is live.
// Add a slug here when its checkout page (with the MindBody widget) ships.
const CHECKOUT_READY = new Set(['adult-3x']);

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

  // 2. Validate required fields server-side
  const firstName = trim(body.firstName);
  const lastName = trim(body.lastName);
  const email = trim(body.email);
  const phone = trim(body.phone);
  const program = trim(body.program);

  const invalid = [];
  if (!firstName) invalid.push('firstName');
  if (!isEmail(email)) invalid.push('email');
  if (phone.replace(/\D/g, '').length < 10) invalid.push('phone');
  if (!Object.prototype.hasOwnProperty.call(PROGRAMS, program)) invalid.push('program');
  if (invalid.length) {
    return json({ ok: false, error: 'validation_failed', fields: invalid }, 400);
  }

  // 3. Resolve the webhook + payment link for this program
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

  // 4. Allowlist the outbound host (defense-in-depth against misconfig)
  let parsed;
  try {
    parsed = new URL(webhookUrl);
  } catch (_) {
    return json({ ok: false, error: 'bad_webhook_config' }, 500);
  }
  const allowed = trim(env.ALLOWED_WEBHOOK_HOSTS)
    ? trim(env.ALLOWED_WEBHOOK_HOSTS).split(',').map((h) => h.trim().toLowerCase()).filter(Boolean)
    : DEFAULT_ALLOWED_HOSTS;
  if (parsed.protocol !== 'https:' || allowed.indexOf(parsed.host.toLowerCase()) === -1) {
    return json({ ok: false, error: 'webhook_host_not_allowed', host: parsed.host }, 500);
  }

  // 5. Forward the normalized lead to the CRM webhook, with a timeout
  const lead = {
    firstName,
    lastName,
    email,
    phone,
    program,
    type: 'membership',
    source: 'website-membership-form',
    submittedAt: new Date().toISOString(),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  let upstream;
  try {
    upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
  } catch (_) {
    clearTimeout(timer);
    return json({ ok: false, error: 'webhook_unreachable' }, 502);
  }
  clearTimeout(timer);

  // 6. Success only after the CRM webhook returns 2xx
  if (!upstream.ok) {
    return json({ ok: false, error: 'webhook_rejected', status: upstream.status }, 502);
  }

  return json({ ok: true, redirect: redirectUrl }, 200);
}
