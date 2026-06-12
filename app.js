(function () {
  'use strict';

  // ---- 0. Hero — char-by-char heading + staggered fade-ins
  var heading = document.getElementById('heroHeading');
  if (heading) {
    var raw = heading.getAttribute('data-text') || '';
    var lines = raw.split('\n');
    var charDelay = 30;
    var initialDelay = 200;
    var charNodes = [];
    lines.forEach(function (line, lineIndex) {
      var lineEl = document.createElement('span');
      lineEl.className = 'line';
      var lineLength = line.length;
      for (var i = 0; i < line.length; i++) {
        var ch = line.charAt(i);
        var span = document.createElement('span');
        span.className = 'char';
        // Resalta "Machalí" en verde acento
        if (line.indexOf('Machalí') !== -1 && i >= line.indexOf('Machalí') && i < line.indexOf('Machalí') + 'Machalí'.length) {
          span.classList.add('accent');
        }
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        var delay = (lineIndex * lineLength * charDelay) + (i * charDelay);
        span.style.transitionDelay = delay + 'ms';
        lineEl.appendChild(span);
        charNodes.push(span);
      }
      heading.appendChild(lineEl);
    });
    setTimeout(function () {
      charNodes.forEach(function (n) { n.classList.add('is-in'); });
    }, initialDelay);
  }

  function fadeIn(id, delay) {
    setTimeout(function () {
      var el = document.getElementById(id);
      if (el) el.classList.add('is-in');
    }, delay);
  }
  fadeIn('heroEyebrow',     400);
  fadeIn('heroSub',         800);
  fadeIn('heroActions',     1200);
  fadeIn('heroTag',         1400);
  fadeIn('scrollIndicator', 1800);

  // ---- 1. Header sticky on scroll
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 100) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- 2. Hamburger / mobile menu
  var hamb = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  hamb.addEventListener('click', function () {
    var open = navLinks.classList.toggle('is-open');
    hamb.classList.toggle('is-open', open);
    hamb.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('is-open');
      hamb.classList.remove('is-open');
      hamb.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- 3. Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- 4. Galería dinámica + Lightbox
  // [[ PEGA AQUÍ TUS URLS DE GHL — reemplaza el '' por la URL pública de cada imagen.
  //    Ej: { src: 'https://storage.googleapis.com/.../render-01.png', caption: 'Fachada principal' }
  //    Mientras el src esté vacío ('') se muestra un placeholder automático. ]]
  var galleryImages = [
    { src: 'https://assets.cdn.filesafe.space/WL4jgf6ojjr7XZeJDSmm/media/6a2b3838e5084c4b7194ef7e.png', caption: 'Fachada principal' },
    { src: 'https://assets.cdn.filesafe.space/WL4jgf6ojjr7XZeJDSmm/media/6a2b3c529bdda92b22daa38c.png', caption: 'Vista aérea · Polo Machalí' },
    { src: 'https://assets.cdn.filesafe.space/WL4jgf6ojjr7XZeJDSmm/media/6a2b3838c53e51acc09575db.png', caption: 'Pasillo comercial' },
    { src: 'https://assets.cdn.filesafe.space/WL4jgf6ojjr7XZeJDSmm/media/6a2b38380b818c92b3557aef.png', caption: 'Strip lineal' },
    { src: 'https://assets.cdn.filesafe.space/WL4jgf6ojjr7XZeJDSmm/media/6a2b3838e5084c4b7194ef83.png', caption: 'Acceso a locales' }
  ];

  // Genera placeholder SVG si no hay src real
  function placeholderSVG(label, hue) {
    var h = hue || 60;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">' +
              '<defs><pattern id="g'+h+'" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">' +
              '<rect width="20" height="20" fill="hsl('+h+', 8%, 88%)"/>' +
              '<line x1="0" y1="0" x2="0" y2="20" stroke="hsl('+h+', 8%, 78%)" stroke-width="3"/></pattern></defs>' +
              '<rect width="400" height="400" fill="url(#g'+h+')"/>' +
              '<text x="200" y="200" text-anchor="middle" font-family="monospace" font-size="13" fill="hsl('+h+', 8%, 40%)">[ '+label+' ]</text>' +
              '<text x="200" y="220" text-anchor="middle" font-family="monospace" font-size="11" fill="hsl('+h+', 8%, 50%)">800×800</text>' +
              '</svg>';
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  var galleryGrid = document.getElementById('galleryGrid');
  galleryImages.forEach(function (img, i) {
    var src = img.src || placeholderSVG(img.caption, 40 + (i * 23) % 60);
    galleryImages[i].resolvedSrc = src;
    var div = document.createElement('div');
    div.className = 'gallery-item reveal';
    div.innerHTML = '<img src="'+src+'" alt="" loading="lazy"/>' +
                    '<div class="overlay"></div>';
    div.addEventListener('click', function(){ openLightbox(i); });
    galleryGrid.appendChild(div);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(ents, obs){
        ents.forEach(function(e){
          if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1 }).observe(div);
    } else {
      div.classList.add('is-visible');
    }
  });

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var currentIdx = 0;
  function openLightbox(i) {
    currentIdx = i;
    lightboxImg.src = galleryImages[i].resolvedSrc;
    lightboxImg.alt = galleryImages[i].caption;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function nav(dir) {
    currentIdx = (currentIdx + dir + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIdx].resolvedSrc;
    lightboxImg.alt = galleryImages[currentIdx].caption;
  }
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function(){ nav(-1); });
  document.getElementById('lightboxNext').addEventListener('click', function(){ nav(1); });
  lightbox.addEventListener('click', function(e){ if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function(e){
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });

  // ---- 5. Form validation + submit
  var form = document.getElementById('cotizacion');
  var success = document.getElementById('formSuccess');

  function validate() {
    var ok = true;
    ['nombre', 'telefono', 'email'].forEach(function (id) {
      var input = document.getElementById(id);
      var field = input.closest('.form-field');
      var val = input.value.trim();
      var isInvalid = !val;
      if (id === 'email' && val) {
        isInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      if (id === 'telefono' && val) {
        isInvalid = val.replace(/\D/g, '').length < 8;
      }
      field.classList.toggle('invalid', isInvalid);
      if (isInvalid) ok = false;
    });
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var data = {
      nombre:   document.getElementById('nombre').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email:    document.getElementById('email').value.trim(),
      interes:  document.getElementById('interes').value,
      mensaje:  document.getElementById('mensaje').value.trim(),
      proyecto: 'Strip Box · Nuevo Polo Machalí',
      origen:   window.location.href
    };

    /* ============================================================
       INTEGRACIÓN — DESCOMENTA Y CONFIGURA TU WEBHOOK
       ============================================================ */
    // var GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/XXXXX';
    // fetch(GHL_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).catch(function(err){ console.error(err); });

    console.log('Datos del formulario (demo):', data);

    form.style.display = 'none';
    success.classList.add('show');
    var rect = success.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top - 120, behavior: 'smooth' });
  });

  // Limpia error al escribir
  ['nombre','telefono','email'].forEach(function(id){
    document.getElementById(id).addEventListener('input', function(){
      this.closest('.form-field').classList.remove('invalid');
    });
  });

})();

;

(function () {
  var modal = document.getElementById('wspModal');
  if (!modal) return;
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('.wsp-modal-close');
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('[data-wsp-open]').forEach(function (el) {
    el.addEventListener('click', openModal);
  });
  document.querySelectorAll('[data-wsp-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // Exponer para el controlador de flujo (cerrar el modal al ir a WhatsApp)
  window.__wspCloseModal = closeModal;
  window.__wspModalEl = modal;
})();

;

/* ============================================================
   FLUJO ENCADENADO GHL:  Formulario  →  Calendario  →  WhatsApp
   - Al completar el formulario, se muestra el calendario.
   - Al completar la reserva del calendario, redirige a WhatsApp.
   El número de WhatsApp se toma de data-wa en cada .ghl-flow.
   ============================================================ */
(function () {
  var flows = [];
  document.querySelectorAll('[data-ghl-flow]').forEach(function (root) {
    flows.push({
      root: root,
      wa: root.getAttribute('data-wa') || '',
      formStep: root.querySelector('[data-ghl-step="form"]'),
      calStep: root.querySelector('[data-ghl-step="calendar"]'),
      formIframe: root.querySelector('[data-ghl-step="form"] iframe'),
      calIframe: root.querySelector('[data-ghl-step="calendar"] iframe'),
      advanced: false
    });
  });
  if (!flows.length) return;

  function setTitles(flow, kind) {
    // Actualiza encabezados (modal o tarjeta) del contenedor del flow
    var scope = flow.root.closest('.wsp-modal-panel') || flow.root.closest('.cta-form-card');
    if (!scope) return;
    var titleEl = scope.querySelector('[data-ghl-title]');
    var eyebrowEl = scope.querySelector('[data-ghl-eyebrow]');
    var isModal = !!flow.root.closest('.wsp-modal-panel');
    if (kind === 'calendar') {
      if (eyebrowEl) eyebrowEl.textContent = 'Paso 2 de 2 · Agenda';
      if (titleEl) titleEl.textContent = isModal ? 'Elige día y hora' : 'Elige día y hora';
    }
  }

  function advanceToCalendar(flow) {
    if (flow.advanced || !flow.calStep) return;
    flow.advanced = true;
    if (flow.formStep) flow.formStep.setAttribute('hidden', '');
    flow.calStep.removeAttribute('hidden');
    setTitles(flow, 'calendar');
    // Reajuste de altura del iframe del calendario
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
    var body = flow.root.closest('.wsp-modal-body');
    if (body) body.scrollTop = 0;
  }

  function goToWhatsApp(flow) {
    var url = (flow && flow.wa) || (flows[0] && flows[0].wa);
    if (window.__wspCloseModal) { try { window.__wspCloseModal(); } catch (e) {} }
    if (!url) return;
    // Intenta abrir en nueva pestaña; si el navegador lo bloquea, navega en la misma.
    var win = window.open(url, '_blank');
    if (!win) window.location.href = url;
  }

  function classify(data) {
    var s;
    try { s = (typeof data === 'string') ? data : JSON.stringify(data); }
    catch (e) { s = String(data); }
    if (!s) return null;
    var l = s.toLowerCase();
    // Señal de reserva de calendario completada
    if (l.indexOf('booking-complete') !== -1 ||
        l.indexOf('appointment') !== -1 && (l.indexOf('book') !== -1 || l.indexOf('confirm') !== -1 || l.indexOf('success') !== -1) ||
        l.indexOf('slot') !== -1 && l.indexOf('confirm') !== -1) {
      return 'booking';
    }
    // Señal de envío de formulario
    if (l.indexOf('formsubmitted') !== -1 ||
        l.indexOf('form-submit') !== -1 ||
        (l.indexOf('form') !== -1 && l.indexOf('submit') !== -1) ||
        (l.indexOf('lead') !== -1 && l.indexOf('captur') !== -1)) {
      return 'form';
    }
    return null;
  }

  function flowBySource(win) {
    for (var i = 0; i < flows.length; i++) {
      var f = flows[i];
      if (f.formIframe && f.formIframe.contentWindow === win) return f;
      if (f.calIframe && f.calIframe.contentWindow === win) return f;
    }
    return null;
  }

  function activeFlow() {
    // Si el modal está abierto, su flow es el activo; si no, el primero visible.
    var modal = window.__wspModalEl;
    if (modal && modal.classList.contains('is-open')) {
      for (var i = 0; i < flows.length; i++) {
        if (flows[i].root.closest('.wsp-modal-panel')) return flows[i];
      }
    }
    for (var j = 0; j < flows.length; j++) {
      if (!flows[j].root.closest('.wsp-modal-panel')) return flows[j];
    }
    return flows[0];
  }

  window.addEventListener('message', function (e) {
    var kind = classify(e.data);
    if (!kind) return;
    if (kind === 'booking') {
      var fb = flowBySource(e.source) || activeFlow();
      goToWhatsApp(fb);
    } else if (kind === 'form') {
      var ff = flowBySource(e.source) || activeFlow();
      if (ff) advanceToCalendar(ff);
    }
  });
})();
