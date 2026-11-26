/* Solenne theme — homepage interactions. Location settings come from src/config.ts via <body data-*>. */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var themeMeta = $('meta[name="theme-color"]');
  function applyThemeColor() {
    themeMeta.setAttribute('content', root.getAttribute('data-theme') === 'light' ? '#fff8f8' : '#140c0e');
  }
  applyThemeColor();
  $('#themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('solenne-theme', next); } catch (e) {}
    applyThemeColor();
  });

  /* ---------- Local clock ---------- */
  var loc = document.body.dataset;
  var tz = { timeZone: loc.tz || undefined };
  function tick() {
    var now = new Date();
    $('#clockTime').textContent = now.toLocaleTimeString(loc.locale || undefined, Object.assign({ hour: '2-digit', minute: '2-digit' }, tz));
    $('#clockDate').textContent = now.toLocaleDateString(loc.locale || undefined, Object.assign({ weekday: 'long', day: 'numeric', month: 'long' }, tz));
  }
  tick();
  setInterval(tick, 15000);

  /* ---------- Weather (Open-Meteo, no key needed) ---------- */
  fetch('https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lon + '&current=temperature_2m,apparent_temperature,wind_speed_10m')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) {
      var c = d.current;
      $('#temp').textContent = Math.round(c.temperature_2m) + '°C';
      $('#weatherLine').textContent = 'Feels like ' + Math.round(c.apparent_temperature) + '°C · Wind ' + Math.round(c.wind_speed_10m) + ' km/h';
    })
    .catch(function () { $('#weatherLine').textContent = 'Weather unavailable'; });

  /* ---------- Booking state ---------- */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var S = {
    open: null,              // null | 'in' | 'out' | 'guests'
    calY: today.getFullYear(),
    calM: today.getMonth(),
    checkIn: null,
    checkOut: null,
    adults: 2,
    children: 0,
    pets: false
  };
  var LIMITS = { adults: [1, 6], children: [0, 4] };

  var form = $('#book');
  var backdrop = $('#bookingBackdrop');
  var calPop = $('#calPop');
  var guestPop = $('#guestPop');
  var cells = $$('.cell[data-open]', form);

  var fmt = function (d) { return d ? d.toLocaleDateString(loc.locale || undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Add date'; };
  var same = function (a, b) { return a && b && a.getTime() === b.getTime(); };
  var nights = function () { return S.checkIn && S.checkOut ? Math.round((S.checkOut - S.checkIn) / 864e5) : 0; };

  function setOpen(which) {
    var wasOpen = S.open;
    S.open = which;
    render();
    if (which && !wasOpen) revealPopover(which === 'guests' ? guestPop : calPop);
    if (which === 'in' || which === 'out') {
      var target = $('.day.is-end', calPop) || $('.day:not(:disabled)', calPop);
      if (target && document.activeElement && document.activeElement.classList.contains('cell')) target.focus({ preventScroll: true });
    } else if (which === 'guests') {
      $('[data-step]', guestPop).focus({ preventScroll: true });
    }
  }

  function pickDay(d) {
    if (S.open === 'out' && S.checkIn && d > S.checkIn) {
      S.checkOut = d;
      S.open = null;
      render();
      $('.cell[data-open="out"]', form).focus({ preventScroll: true });
      return;
    }
    S.checkOut = S.checkOut && d < S.checkOut ? S.checkOut : null;
    S.checkIn = d;
    S.open = 'out';
    render();
    var next = $('.day:not(:disabled)[data-t="' + (d.getTime() + 864e5) + '"]', calPop);
    if (next) next.focus({ preventScroll: true });
  }

  function renderCalendar() {
    var first = new Date(S.calY, S.calM, 1);
    var lead = (first.getDay() + 6) % 7;             // Monday-first
    var dim = new Date(S.calY, S.calM + 1, 0).getDate();
    $('#monthLabel').textContent = first.toLocaleDateString(loc.locale || undefined, { month: 'long', year: 'numeric' });
    $('#prevMonth').disabled = S.calY === today.getFullYear() && S.calM === today.getMonth();

    var grid = $('#calGrid');
    var frag = document.createDocumentFragment();
    for (var i = 0; i < lead; i++) {
      var blank = document.createElement('span');
      blank.className = 'day day--blank';
      frag.appendChild(blank);
    }
    for (var n = 1; n <= dim; n++) {
      var d = new Date(S.calY, S.calM, n);
      var b = document.createElement('button');
      var isEnd = same(d, S.checkIn) || same(d, S.checkOut);
      b.type = 'button';
      b.className = 'day';
      b.textContent = n;
      b.dataset.t = d.getTime();
      b.setAttribute('aria-label', d.toLocaleDateString(loc.locale || undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
      if (d < today) b.disabled = true;
      if (same(d, today)) { b.classList.add('is-today'); b.setAttribute('aria-current', 'date'); }
      if (isEnd) { b.classList.add('is-end'); b.setAttribute('aria-pressed', 'true'); }
      if (S.checkIn && S.checkOut && d > S.checkIn && d < S.checkOut) b.classList.add('in-range');
      frag.appendChild(b);
    }
    grid.replaceChildren(frag);

    var nt = nights();
    $('#calHint').textContent = nt ? nt + ' night' + (nt > 1 ? 's' : '') : S.open === 'out' && S.checkIn ? 'Select check-out' : 'Select check-in';
  }

  // Place a popover directly under the cell that opened it, kept inside the viewport
  function placePopover(pop, which) {
    var cell = $('.cell[data-open="' + which + '"]', form);
    var fr = form.getBoundingClientRect(), cr = cell.getBoundingClientRect();
    var w = pop.offsetWidth, gutter = 16;
    var minLeft = gutter - fr.left;
    var maxLeft = Math.min(fr.width - w, document.documentElement.clientWidth - gutter - w - fr.left);
    var left = Math.max(minLeft, Math.min(cr.left - fr.left, Math.max(minLeft, maxLeft)));
    pop.style.left = left + 'px';
    pop.style.top = ($('.booking__bar', form).offsetHeight + 10) + 'px';
  }

  // Bring a freshly opened popover fully on screen
  function revealPopover(pop) {
    var r = pop.getBoundingClientRect(), overflow = r.bottom + 16 - window.innerHeight;
    if (overflow > 0) window.scrollBy({ top: overflow, behavior: 'smooth' });
  }

  function render() {
    var calOpen = S.open === 'in' || S.open === 'out';
    calPop.hidden = !calOpen;
    guestPop.hidden = S.open !== 'guests';
    backdrop.hidden = !S.open;
    if (calOpen) {
      renderCalendar();
      placePopover(calPop, S.open);
    }
    if (S.open === 'guests') placePopover(guestPop, 'guests');
    cells.forEach(function (c) { c.setAttribute('aria-expanded', String(c.dataset.open === S.open)); });

    $('#inLabel').textContent = fmt(S.checkIn);
    $('#outLabel').textContent = fmt(S.checkOut);

    $('#adultsOut').textContent = S.adults;
    $('#childrenOut').textContent = S.children;
    $$('[data-step]', guestPop).forEach(function (btn) {
      var key = btn.dataset.step, by = +btn.dataset.by, lim = LIMITS[key];
      btn.disabled = by < 0 ? S[key] <= lim[0] : S[key] >= lim[1];
    });
    $('#guestLabel').textContent = S.adults + ' adult' + (S.adults > 1 ? 's' : '') +
      (S.children ? ' · ' + S.children + ' child' + (S.children > 1 ? 'ren' : '') : '');
    $('#petsToggle').setAttribute('aria-checked', String(S.pets));
    $('#petIcon').hidden = !S.pets;
  }

  /* ---------- Booking events ---------- */
  cells.forEach(function (c) {
    c.addEventListener('click', function () {
      var which = c.dataset.open;
      if (which !== 'guests' && (S.checkIn || S.checkOut)) {
        var ref = which === 'out' && S.checkOut ? S.checkOut : S.checkIn;
        if (ref) { S.calY = ref.getFullYear(); S.calM = ref.getMonth(); }
      }
      setOpen(S.open === which ? null : which);
    });
  });

  backdrop.addEventListener('click', function () { setOpen(null); });

  $('#calGrid').addEventListener('click', function (e) {
    var b = e.target.closest('.day');
    if (!b || b.disabled || !b.dataset.t) return;
    pickDay(new Date(+b.dataset.t));
  });

  // Arrow-key navigation within the calendar grid
  $('#calGrid').addEventListener('keydown', function (e) {
    var map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in map) || !e.target.dataset.t) return;
    e.preventDefault();
    var d = new Date(+e.target.dataset.t);
    d.setDate(d.getDate() + map[e.key]);
    if (d < today) return;
    if (d.getMonth() !== S.calM || d.getFullYear() !== S.calY) {
      S.calY = d.getFullYear(); S.calM = d.getMonth(); renderCalendar();
    }
    var t = $('.day[data-t="' + d.getTime() + '"]', calPop);
    if (t) t.focus();
  });

  function shift(k) {
    var d = new Date(S.calY, S.calM + k, 1);
    S.calY = d.getFullYear(); S.calM = d.getMonth();
    renderCalendar();
  }
  $('#prevMonth').addEventListener('click', function () { shift(-1); });
  $('#nextMonth').addEventListener('click', function () { shift(1); });

  $('#clearDates').addEventListener('click', function () {
    S.checkIn = null; S.checkOut = null; S.open = 'in';
    render();
  });

  guestPop.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-step]');
    if (!btn) return;
    var key = btn.dataset.step, lim = LIMITS[key];
    S[key] = Math.max(lim[0], Math.min(lim[1], S[key] + +btn.dataset.by));
    render();
  });
  $('#petsToggle').addEventListener('click', function () { S.pets = !S.pets; render(); });
  $('#guestsDone').addEventListener('click', function () {
    setOpen(null);
    $('.cell[data-open="guests"]', form).focus({ preventScroll: true });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.open) {
      var cell = $('.cell[data-open="' + S.open + '"]', form);
      setOpen(null);
      if (cell) cell.focus({ preventScroll: true });
    }
  });

  // "Check availability". The hotel's booking engine plugs in here.
  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 4200);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!S.checkIn) { setOpen('in'); return; }
    if (!S.checkOut) { setOpen('out'); return; }
    setOpen(null);
    var nt = nights();
    showToast('Searching ' + nt + ' night' + (nt > 1 ? 's' : '') + ', ' + fmt(S.checkIn) + ' → ' + fmt(S.checkOut) +
      ' for ' + $('#guestLabel').textContent + (S.pets ? ' with pets' : '') + '. (This is where the booking engine connects.)');
  });

  window.addEventListener('resize', function () {
    if (S.open === 'in' || S.open === 'out') placePopover(calPop, S.open);
    else if (S.open === 'guests') placePopover(guestPop, 'guests');
  });

  render();

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        // Stagger siblings that enter together
        var sibs = $$('.reveal', el.parentElement);
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 4) * 70 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  $('#year').textContent = new Date().getFullYear();
})();
