/* ═══════════════════════════════════════════════
   Ahlec Laia — script.js
   All interactive functionality for the portfolio site
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     HERO VIDEO
  ───────────────────────────────────────────── */
  function initHeroVideo() {
    var video = document.getElementById('heroVideo');
    var overlay = document.getElementById('heroVideoOverlay');
    var playBtn = document.getElementById('heroPlayBtn');

    if (!video || !overlay || !playBtn) return;

    playBtn.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    });

    video.addEventListener('pause', function () {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    });

    video.addEventListener('ended', function () {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      video.currentTime = 0;
    });

    // Click on video while playing — pause
    video.addEventListener('click', function () {
      if (!video.paused) {
        video.pause();
      }
    });
  }

  /* ─────────────────────────────────────────────
     HERO BENEFITS ANIMATION (IntersectionObserver)
  ───────────────────────────────────────────── */
  function initHeroBenefits() {
    var items = document.querySelectorAll('.hero-benefits li');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ─────────────────────────────────────────────
     PROBLEM CARDS ANIMATION
  ───────────────────────────────────────────── */
  function initProblemCards() {
    var cards = document.querySelectorAll('.problem-card');
    if (!cards.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* ─────────────────────────────────────────────
     SOLUTION ACCORDION
  ───────────────────────────────────────────── */
  function initSolutionAccordion() {
    var items = document.querySelectorAll('.accordion-item');
    if (!items.length) return;

    // Animate in on scroll
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (item) {
      observer.observe(item);

      var trigger = item.querySelector('.accordion-trigger');
      var body = item.querySelector('.accordion-body');
      var arrow = item.querySelector('.accordion-arrow');

      if (!trigger || !body) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all
        items.forEach(function (i) {
          i.classList.remove('open');
          var b = i.querySelector('.accordion-body');
          var a = i.querySelector('.accordion-arrow');
          if (b) b.style.maxHeight = null;
          if (a) a.textContent = '+';
        });

        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
          if (arrow) arrow.textContent = '−';
        }
      });
    });

    // Open first by default
    if (items[0]) {
      items[0].classList.add('open');
      var firstBody = items[0].querySelector('.accordion-body');
      var firstArrow = items[0].querySelector('.accordion-arrow');
      if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
      if (firstArrow) firstArrow.textContent = '−';
    }
  }

  /* ─────────────────────────────────────────────
     METHODOLOGY TIMELINE ANIMATION
  ───────────────────────────────────────────── */
  function initMethodologyTimeline() {
    var items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ─────────────────────────────────────────────
     COMPARISON ANIMATION
  ───────────────────────────────────────────── */
  function initComparisonAnimation() {
    var cols = document.querySelectorAll('.comparison-col, .comparison-callout');
    if (!cols.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    cols.forEach(function (col) {
      observer.observe(col);
    });
  }

  /* ─────────────────────────────────────────────
     PRICING ANIMATION
  ───────────────────────────────────────────── */
  function initPricingAnimation() {
    var cards = document.querySelectorAll('.pricing-card');
    if (!cards.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* ─────────────────────────────────────────────
     FREE CALL ANIMATION
  ───────────────────────────────────────────── */
  function initFreecallAnimation() {
    var card = document.querySelector('.freecall-card');
    if (!card) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    observer.observe(card);
  }

  /* ─────────────────────────────────────────────
     STICKY CTA STRIP
  ───────────────────────────────────────────── */
  function initCapacityStrip() {
    function attachClose() {
      var closeBtn = document.getElementById('stripClose');
      var strip = document.getElementById('capacityStrip');
      if (!closeBtn || !strip) return;

      closeBtn.addEventListener('click', function () {
        strip.style.opacity = '0';
        strip.style.transform = 'translateY(100%)';
        setTimeout(function () {
          strip.style.display = 'none';
        }, 300);
      });
    }

    // Multiple attachment attempts
    attachClose();
    document.addEventListener('DOMContentLoaded', attachClose);
    setTimeout(attachClose, 100);
    setTimeout(attachClose, 500);
  }

  /* ─────────────────────────────────────────────
     SIMPLE PORTFOLIO CAROUSEL
  ───────────────────────────────────────────── */
  function initSimpleCarousel() {
    var track = document.getElementById('simpleCarouselTrack');
    var modal = document.getElementById('simpleVideoModal');
    var modalWrapper = document.getElementById('simpleModalVideoWrapper');
    var modalClose = document.getElementById('simpleModalClose');
    var backdrop = document.getElementById('simpleModalBackdrop');

    if (!track) return;

    var velocity = -0.8;
    var position = 0;
    var isDragging = false;
    var dragStartX = 0;
    var dragStartPos = 0;
    var animFrame;
    var isAutoScrolling = true;

    function getTrackWidth() {
      return track.scrollWidth / 2; // half because cards are duplicated
    }

    function autoScroll() {
      if (!isDragging && isAutoScrolling) {
        position += velocity;
        var half = getTrackWidth();
        if (position <= -half) position = 0;
        if (position > 0) position = -half + 1;
        track.style.transform = 'translateX(' + position + 'px)';
      }
      animFrame = requestAnimationFrame(autoScroll);
    }

    animFrame = requestAnimationFrame(autoScroll);

    // Drag support
    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartPos = position;
      track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var delta = e.clientX - dragStartX;
      position = dragStartPos + delta;
      track.style.transform = 'translateX(' + position + 'px)';
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
      track.style.cursor = 'grab';
    });

    // Touch support
    track.addEventListener('touchstart', function (e) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartPos = position;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      var delta = e.touches[0].clientX - dragStartX;
      position = dragStartPos + delta;
      track.style.transform = 'translateX(' + position + 'px)';
    }, { passive: true });

    track.addEventListener('touchend', function () {
      isDragging = false;
    });

    // Hover video preview
    var cards = track.querySelectorAll('.video-card');
    cards.forEach(function (card) {
      var thumbVideo = card.querySelector('video.thumb-video');
      if (!thumbVideo) return;

      card.addEventListener('mouseenter', function () {
        isAutoScrolling = false;
        thumbVideo.play().catch(function () {});
      });

      card.addEventListener('mouseleave', function () {
        isAutoScrolling = true;
        thumbVideo.pause();
        thumbVideo.currentTime = 0;
      });
    });

    // Modal open
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        if (Math.abs(position - dragStartPos) > 5) return; // was dragging

        var src = card.dataset.videoSrc;
        var type = card.dataset.type;

        if (!src || !modal || !modalWrapper) return;

        modalWrapper.innerHTML = '';

        if (type === 'vimeo') {
          var iframe = document.createElement('iframe');
          iframe.src = src + '&autoplay=1';
          iframe.allow = 'autoplay; fullscreen; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          modalWrapper.appendChild(iframe);
        } else {
          var video = document.createElement('video');
          video.src = src;
          video.controls = true;
          video.autoplay = true;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.maxHeight = '80vh';
          video.style.objectFit = 'contain';
          modalWrapper.appendChild(video);
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Modal close
    function closeSimpleModal() {
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (modalWrapper) modalWrapper.innerHTML = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeSimpleModal);
    if (backdrop) backdrop.addEventListener('click', closeSimpleModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSimpleModal();
    });

    // Lazy load videos
    var lazyVideos = track.querySelectorAll('video.thumb-video[preload="none"]');
    var lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var v = entry.target;
          v.preload = 'metadata';
          lazyObserver.unobserve(v);
        }
      });
    }, { rootMargin: '200px' });

    lazyVideos.forEach(function (v) { lazyObserver.observe(v); });
  }

  /* ─────────────────────────────────────────────
     ADVANCED PORTFOLIO CAROUSEL
  ───────────────────────────────────────────── */
  function initAdvancedCarousel() {
    var track = document.getElementById('advancedCarouselTrack');
    var modal = document.getElementById('advancedVideoModal');
    var modalWrapper = document.getElementById('advancedModalVideoWrapper');
    var modalClose = document.getElementById('advancedModalClose');
    var backdrop = document.getElementById('advancedModalBackdrop');
    var toggleBtn = document.getElementById('toggleAutoScroll');

    if (!track) return;

    var velocity = -1.2;
    var position = 0;
    var isDragging = false;
    var dragStartX = 0;
    var dragStartPos = 0;
    var isAutoScrolling = true;
    var animFrame;

    function getHalfWidth() {
      return track.scrollWidth / 2;
    }

    function autoScroll() {
      if (!isDragging && isAutoScrolling) {
        position += velocity;
        var half = getHalfWidth();
        if (position <= -half) position = 0;
        if (position > 0) position = -half + 1;
        track.style.transform = 'translateX(' + position + 'px)';
      }
      animFrame = requestAnimationFrame(autoScroll);
    }

    animFrame = requestAnimationFrame(autoScroll);

    // Toggle auto-scroll button
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        isAutoScrolling = !isAutoScrolling;
        toggleBtn.textContent = isAutoScrolling ? '⏸ Pausar' : '▶ Retomar';
      });
    }

    // Drag
    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartPos = position;
      track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var delta = e.clientX - dragStartX;
      position = dragStartPos + delta;
      track.style.transform = 'translateX(' + position + 'px)';
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
      track.style.cursor = '';
    });

    // Touch
    track.addEventListener('touchstart', function (e) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartPos = position;
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      var delta = e.touches[0].clientX - dragStartX;
      position = dragStartPos + delta;
      track.style.transform = 'translateX(' + position + 'px)';
    }, { passive: true });

    track.addEventListener('touchend', function () {
      isDragging = false;
    });

    // Hover preview
    var cards = track.querySelectorAll('.adv-card');
    cards.forEach(function (card) {
      var thumbVideo = card.querySelector('video.thumb-video');
      if (!thumbVideo) return;

      card.addEventListener('mouseenter', function () {
        isAutoScrolling = false;
        thumbVideo.play().catch(function () {});
      });

      card.addEventListener('mouseleave', function () {
        isAutoScrolling = true;
        thumbVideo.pause();
        thumbVideo.currentTime = 0;
      });
    });

    // Modal open
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        if (Math.abs(position - dragStartPos) > 5) return;

        var src = card.dataset.videoSrc;
        var type = card.dataset.type;

        if (!src || !modal || !modalWrapper) return;

        modalWrapper.innerHTML = '';

        if (type === 'youtube') {
          var iframe = document.createElement('iframe');
          iframe.src = src + '?autoplay=1&rel=0';
          iframe.allow = 'autoplay; fullscreen; picture-in-picture';
          iframe.allowFullscreen = true;
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          modalWrapper.appendChild(iframe);
        } else {
          var video = document.createElement('video');
          video.src = src;
          video.controls = true;
          video.autoplay = true;
          video.style.width = '100%';
          video.style.maxHeight = '80vh';
          video.style.objectFit = 'contain';
          modalWrapper.appendChild(video);
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Modal close
    function closeAdvancedModal() {
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (modalWrapper) modalWrapper.innerHTML = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeAdvancedModal);
    if (backdrop) backdrop.addEventListener('click', closeAdvancedModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAdvancedModal();
    });

    // Lazy load
    var lazyVids = track.querySelectorAll('video.thumb-video[preload="none"]');
    var lazyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.preload = 'metadata';
          lazyObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '300px' });

    lazyVids.forEach(function (v) { lazyObs.observe(v); });
  }

  /* ─────────────────────────────────────────────
     SMOOTH SCROLL FOR ANCHOR LINKS
  ───────────────────────────────────────────── */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ─────────────────────────────────────────────
     GENERIC FADE-IN OBSERVER FOR REMAINING SECTIONS
  ───────────────────────────────────────────── */
  function initGenericFadeIn() {
    var els = document.querySelectorAll(
      '.framework-card, .section-header, .about-profile-block, .footer-col'
    );
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ─────────────────────────────────────────────
     INIT ALL
  ───────────────────────────────────────────── */
  function init() {
    initHeroVideo();
    initHeroBenefits();
    initProblemCards();
    initSolutionAccordion();
    initMethodologyTimeline();
    initComparisonAnimation();
    initPricingAnimation();
    initFreecallAnimation();
    initCapacityStrip();
    initSimpleCarousel();
    initAdvancedCarousel();
    initSmoothScroll();
    initGenericFadeIn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();