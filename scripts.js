/* ============================================================
   THE MMA DISTRICT — scripts.js
   Lead modal, nav, scroll reveals, marquee duplication, booking router.
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     MEMBERSHIP FORM  (durable, mobile-safe)
     The browser NEVER talks to the CRM/webhooks directly. It POSTs to the
     same-origin endpoint /api/lead, which forwards the lead to the correct
     GoHighLevel webhook (server-side secret) and returns the payment-link
     URL to redirect to. All webhook + payment URLs live as Cloudflare Pages
     production secrets — see functions/api/lead.js. No URLs live in the
     browser: only the display labels below.
     ============================================================ */
  var LEAD_ENDPOINT = '/api/lead';
  var LEAD_FALLBACK_TEL = '+13239904494';
  var LEAD_FALLBACK_PHONE = '(323) 990-4494';

  var PLAN_LABELS = {
    'adult-3x':        'Adult · 3× / Week — $180/mo',
    'adult-unlimited': 'Adult · Unlimited — $196/mo',
    'drop-in':         'Drop-In Class — $35',
    'kids-unlimited':  'Kids · Unlimited — $175/mo',
    'kids-single':     'Kids · Single Discipline — $150/mo',
    'active-duty':     'Law Enforcement & First Responders — $180/mo'
  };

  /* Free-class programs that have NO self-serve booking calendar. When one of
     these is submitted through the (free-class) lead form we fire the lead
     webhook and show an in-modal confirmation instead of routing to a
     calendar. The team follows up manually. */
  var NO_CALENDAR_PROGRAMS = ['fight-fit', 'active-duty', 'after-school'];

  /* ---------- Dynamic copyright year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Background videos: hold on the poster frame for reduced-motion users ---------- */
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.hero__video, .founder__video').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
    });
  }

  /* ---------- Nav: scroll behavior + mobile toggle ---------- */
  var nav = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav-toggle');
  if (nav) {
    function onScroll() {
      if (window.scrollY > 16) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var isOpen = nav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    /* Close menu when a mobile link is tapped */
    document.querySelectorAll('.nav-mobile a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Marquee — duplicate children for seamless loop (safe DOM clone) ---------- */
  document.querySelectorAll('.marquee__track').forEach(function (track) {
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* ---------- Lead Modal ---------- */
  function initLeadModal() {
    var modal = document.getElementById('lead-modal');
    if (!modal) return;
    var card = modal.querySelector('.lead-modal__card');
    var closeBtn = modal.querySelector('.lead-modal__close');
    var backdrop = modal.querySelector('.lead-modal__backdrop');
    var form = modal.querySelector('form');
    var programSelect = modal.querySelector('select[name="program"]');
    var programField = programSelect ? programSelect.closest('.lead-modal__field') : null;
    var head = modal.querySelector('.lead-modal__head');
    var flag = modal.querySelector('.lead-modal__flag');
    var sub = modal.querySelector('.lead-modal__sub');
    var submitBtn = modal.querySelector('.lead-modal__submit');

    /* Snapshot the page's default (free-class) copy so we can restore it. */
    var defaults = {
      head: head ? head.textContent : '',
      flag: flag ? flag.textContent : '',
      sub: sub ? sub.innerHTML : '',
      submit: submitBtn ? submitBtn.innerHTML : ''
    };

    /* Read-only "locked plan" line — injected once, shown only in membership mode. */
    var planEl = document.createElement('div');
    planEl.className = 'lead-modal__field lead-modal__plan';
    planEl.style.display = 'none';
    planEl.innerHTML = '<span class="lead-modal__label">Membership</span>' +
                       '<div class="lead-modal__plan-name"></div>';
    var planNameEl = planEl.querySelector('.lead-modal__plan-name');
    if (programField && programField.parentNode) {
      programField.parentNode.insertBefore(planEl, programField);
    }

    var currentPlan = null; /* non-null when opened from a membership card */
    var submitting = false; /* guards against duplicate submits */
    var MEMBERSHIP_SUBMIT_HTML = 'Continue to Payment <span class="btn__arrow">→</span>';

    /* Inline error line with a phone fallback, shown only if /api/lead fails. */
    var errorEl = document.createElement('p');
    errorEl.className = 'lead-modal__error';
    errorEl.setAttribute('role', 'alert');
    errorEl.style.display = 'none';
    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(errorEl, submitBtn.nextSibling);
    }
    function clearError() {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }
    function showError() {
      errorEl.innerHTML = 'We couldn’t complete that just now. Please call us at ' +
        '<a href="tel:' + LEAD_FALLBACK_TEL + '">' + LEAD_FALLBACK_PHONE + '</a> ' +
        'and we’ll get you signed up.';
      errorEl.style.display = '';
    }
    function setSubmitting(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      submitBtn.innerHTML = on ? 'Sending…' : MEMBERSHIP_SUBMIT_HTML;
    }

    /* Confirmation state — shown after a no-calendar program (Fight Fit, Law
       Enforcement, Youth After School) is submitted. Replaces the form with a
       thank-you message; the team follows up manually (no booking calendar).
       Injected once; toggled via showConfirmation()/resetConfirmation(). */
    var successEl = document.createElement('div');
    successEl.className = 'lead-modal__success';
    successEl.setAttribute('role', 'status');
    successEl.setAttribute('aria-live', 'polite');
    successEl.style.display = 'none';
    successEl.innerHTML =
      '<span class="lead-modal__success-mark" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</span>' +
      '<div class="mono mono-flag lead-modal__success-flag">Thank you</div>' +
      '<h2 class="lead-modal__success-head">We’ll be in touch shortly.</h2>' +
      '<p class="lead-modal__success-body">Thanks for reaching out to MMA District — a member of our team will contact you shortly to get you started. Keep an eye on your phone and email.</p>';
    if (card) card.appendChild(successEl);

    function showConfirmation() {
      if (flag) flag.style.display = 'none';
      if (head) head.style.display = 'none';
      if (sub) sub.style.display = 'none';
      if (form) form.style.display = 'none';
      planEl.style.display = 'none';
      successEl.style.display = '';
    }
    function resetConfirmation() {
      successEl.style.display = 'none';
      if (flag) flag.style.display = '';
      if (head) head.style.display = '';
      if (sub) sub.style.display = '';
      if (form) form.style.display = '';
    }

    function setMembershipMode(plan) {
      currentPlan = plan;
      var label = PLAN_LABELS[plan] || plan;
      if (planNameEl) planNameEl.textContent = label;
      planEl.style.display = '';
      if (programField) programField.style.display = 'none';
      if (programSelect) programSelect.disabled = true; /* keep out of validation + submit */
      if (flag) flag.textContent = 'Secure Your Spot';
      if (head) head.textContent = 'Join The District';
      if (sub) sub.innerHTML = 'Reserve your <span class="accent">' + label +
        '</span> membership. Fill this out and we’ll take you straight to secure checkout.';
      if (submitBtn) { submitBtn.innerHTML = MEMBERSHIP_SUBMIT_HTML; submitBtn.disabled = false; }
    }

    function setBookingMode() {
      currentPlan = null;
      planEl.style.display = 'none';
      if (programField) programField.style.display = '';
      if (programSelect) programSelect.disabled = false;
      if (flag) flag.textContent = defaults.flag;
      if (head) head.textContent = defaults.head;
      if (sub) sub.innerHTML = defaults.sub;
      if (submitBtn) { submitBtn.innerHTML = defaults.submit; submitBtn.disabled = false; }
    }

    function open(programDefault) {
      submitting = false;
      clearError();
      resetConfirmation();
      if (submitBtn) { submitBtn.disabled = false; }
      if (programDefault && Object.prototype.hasOwnProperty.call(PLAN_LABELS, programDefault)) {
        setMembershipMode(programDefault);
      } else {
        setBookingMode();
        if (programDefault && programSelect) {
          for (var i = 0; i < programSelect.options.length; i++) {
            if (programSelect.options[i].value === programDefault) {
              programSelect.selectedIndex = i;
              break;
            }
          }
        }
      }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(function () {
        var first = card && card.querySelector('input, select:not([disabled])');
        if (first) first.focus();
      });
    }
    function close() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-cta="lead-modal"]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        open(trigger.getAttribute('data-program') || '');
      });
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        /* Trigger native field validation even though the form is novalidate. */
        if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

        /* Free-class booking: fire the program's webhook(s) via the same-origin
           proxy, then head to the booking calendar. Best-effort — the booker is
           NEVER blocked: if the proxy fails or times out, we still send them to
           the calendar so they can pick a time. */
        if (!currentPlan) {
          if (submitting) return; /* prevent duplicate submits */
          submitting = true;
          clearError();
          if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Sending…'; }

          var cls = programSelect ? programSelect.value : '';
          var noCalendar = NO_CALENDAR_PROGRAMS.indexOf(cls) !== -1;
          var bookingRedirect = 'booking.html?program=' + encodeURIComponent(cls);

          var bookingLead = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            program: cls,
            type: 'booking',
            smsTransactionalConsent: !!(form.smsTransactionalConsent && form.smsTransactionalConsent.checked),
            smsMarketingConsent: !!(form.smsMarketingConsent && form.smsMarketingConsent.checked)
          };

          var bController = new AbortController();
          var bTimer = setTimeout(function () { bController.abort(); }, 12000);

          fetch(LEAD_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingLead),
            signal: bController.signal
          })
            .then(function (res) {
              return res.json().catch(function () { return {}; }).then(function (data) {
                return data;
              });
            })
            .then(function (data) {
              clearTimeout(bTimer);
              /* No-calendar programs (Fight Fit, Law Enforcement): confirm in
                 place — the team follows up. Everyone else goes to the calendar. */
              if (noCalendar) { showConfirmation(); return; }
              window.location.href = (data && data.redirect) || bookingRedirect;
            })
            .catch(function () {
              clearTimeout(bTimer);
              /* Network failure. Calendar programs still route through (they can
                 self-book); no-calendar programs have no fallback, so surface the
                 phone number and let them retry rather than promise a follow-up. */
              if (noCalendar) {
                submitting = false;
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = defaults.submit; }
                showError();
                return;
              }
              window.location.href = bookingRedirect; /* never block the booker */
            });
          return;
        }

        /* Membership: durable, mobile-safe path through the same-origin proxy.
           The browser posts to /api/lead; the server forwards to the CRM and
           only returns { ok:true, redirect } once the webhook succeeds. */
        if (submitting) return; /* prevent duplicate submits */
        submitting = true;
        clearError();
        setSubmitting(true);

        var lead = {
          firstName: form.firstName.value.trim(),
          lastName: form.lastName.value.trim(),
          email: form.email.value.trim(),
          phone: form.phone.value.trim(),
          program: currentPlan,
          type: 'membership',
          smsTransactionalConsent: !!(form.smsTransactionalConsent && form.smsTransactionalConsent.checked),
          smsMarketingConsent: !!(form.smsMarketingConsent && form.smsMarketingConsent.checked)
        };

        var controller = new AbortController();
        var timer = setTimeout(function () { controller.abort(); }, 12000);

        fetch(LEAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
          signal: controller.signal
        })
          .then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            clearTimeout(timer);
            /* Redirect ONLY after the server confirms the CRM webhook returned 2xx. */
            if (result.ok && result.data && result.data.ok) {
              window.location.href = result.data.redirect ||
                ('memberships-sign-up.html?program=' + encodeURIComponent(currentPlan));
              return;
            }
            throw new Error('lead_failed');
          })
          .catch(function () {
            clearTimeout(timer);
            submitting = false;
            setSubmitting(false);
            showError();
          });
      });
    }
  }
  initLeadModal();

  /* ---------- Phone masking on lead modal ---------- */
  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () {
      var digits = input.value.replace(/\D/g, '').slice(0, 10);
      var out = '';
      if (digits.length > 0) out = '(' + digits.slice(0, 3);
      if (digits.length >= 4) out += ') ' + digits.slice(3, 6);
      if (digits.length >= 7) out += '-' + digits.slice(6, 10);
      input.value = out;
    });
  });

  /* ---------- Scroll Reveal (IntersectionObserver — lighter than GSAP for this) ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Booking page router ---------- */
  function initBookingPage() {
    var holder = document.querySelector('[data-booking-page]');
    if (!holder) return;
    var calendars = document.querySelectorAll('.booking-calendar');
    var switches = document.querySelectorAll('.program-switcher button');
    var params = new URLSearchParams(window.location.search);
    var requestedProgram = params.get('program') || 'mma';

    /* Fall back to the first available calendar if the requested program has no
       panel (e.g. a stale ?program=fight-fit link — those are booked by follow-up,
       not a calendar). Prevents a blank booking page. */
    var hasRequested = Array.prototype.some.call(calendars, function (cal) {
      return cal.getAttribute('data-program') === requestedProgram;
    });
    if (!hasRequested && calendars.length) {
      requestedProgram = calendars[0].getAttribute('data-program');
    }

    /* Lazy-load a Go High Level calendar iframe the first time its tab is shown.
       Loading only while the panel is visible guarantees the iframe measures at
       full width, so form_embed.js sets the correct height on desktop AND mobile
       (iframes created inside a display:none panel render at 0 width → wrong height). */
    function loadCalendar(cal) {
      var embed = cal.querySelector('.ghl-embed');
      if (!embed || embed.getAttribute('data-loaded') === '1') return;
      var src = embed.getAttribute('data-ghl-src');
      if (!src) return;
      var iframe = document.createElement('iframe');
      iframe.src = src;
      var id = embed.getAttribute('data-ghl-id');
      if (id) iframe.id = id;
      iframe.title = embed.getAttribute('data-ghl-label') || 'Booking calendar';
      iframe.setAttribute('scrolling', 'no');
      iframe.style.width = '100%';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.minHeight = '700px';
      embed.appendChild(iframe);
      embed.setAttribute('data-loaded', '1');
    }

    function show(program) {
      calendars.forEach(function (cal) {
        if (cal.getAttribute('data-program') === program) {
          cal.classList.add('is-active');
          loadCalendar(cal);
        } else {
          cal.classList.remove('is-active');
        }
      });
      switches.forEach(function (btn) {
        if (btn.getAttribute('data-program') === program) btn.classList.add('is-active');
        else btn.classList.remove('is-active');
      });
    }
    show(requestedProgram);
    switches.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var program = btn.getAttribute('data-program');
        show(program);
      });
    });
  }
  initBookingPage();

  /* ---------- Smooth-anchor for in-page links (offset for nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var navH = 72;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- Promo banners — apply dismissed state on load + wire dismiss ---------- */
  /* Generic over any [data-dismissible] strip (duty banner, summer challenge, …);
     each keys its own sessionStorage entry by attribute value. Only one banner
     occupies the fixed top slot per page, so .banner-dismissed stays correct. */
  var promoBanners = document.querySelectorAll('[data-dismissible]');
  Array.prototype.forEach.call(promoBanners, function (banner) {
    var key = banner.getAttribute('data-dismissible') + '-dismissed';
    var dismissed = false;
    try { dismissed = sessionStorage.getItem(key) === '1'; } catch (_) {}
    if (dismissed) {
      banner.style.display = 'none';
      document.body.classList.add('banner-dismissed');
    }
    var dismissBtn = banner.querySelector('[data-dismiss]');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        banner.style.display = 'none';
        document.body.classList.add('banner-dismissed');
        try { sessionStorage.setItem(key, '1'); } catch (_) {}
      });
    }
  });

})();
