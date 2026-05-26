/* ============================================================
   THE MMA DISTRICT — scripts.js
   Lead modal, nav, scroll reveals, marquee duplication, booking router.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Dynamic copyright year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

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

    function open(programDefault) {
      if (programDefault && programSelect) {
        for (var i = 0; i < programSelect.options.length; i++) {
          if (programSelect.options[i].value === programDefault) {
            programSelect.selectedIndex = i;
            break;
          }
        }
      }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(function () {
        var first = card && card.querySelector('input, select');
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
        var program = trigger.getAttribute('data-program') || '';
        open(program);
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
        var data = {
          firstName: form.firstName.value,
          lastName: form.lastName.value,
          email: form.email.value,
          phone: form.phone.value,
          program: form.program.value,
          ts: Date.now()
        };
        try { sessionStorage.setItem('leadFormData', JSON.stringify(data)); } catch (_) {}
        // TODO: Wire to GHL webhook or backend CRM here.
        var qs = 'program=' + encodeURIComponent(data.program);
        window.location.href = 'booking.html?' + qs;
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

    function show(program) {
      calendars.forEach(function (cal) {
        if (cal.getAttribute('data-program') === program) cal.classList.add('is-active');
        else cal.classList.remove('is-active');
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

  /* ---------- Duty banner — apply dismissed state on load + wire dismiss ---------- */
  var dutyBanner = document.querySelector('[data-dismissible="duty-banner"]');
  if (dutyBanner) {
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('duty-banner-dismissed') === '1'; } catch (_) {}
    if (dismissed) {
      dutyBanner.style.display = 'none';
      document.body.classList.add('banner-dismissed');
    }
    var dismissBtn = dutyBanner.querySelector('[data-dismiss]');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        dutyBanner.style.display = 'none';
        document.body.classList.add('banner-dismissed');
        try { sessionStorage.setItem('duty-banner-dismissed', '1'); } catch (_) {}
      });
    }
  }

})();
