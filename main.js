'use strict';

/* ============================================================
   SCROLL PROGRESS BAR
============================================================ */
(function () {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;
    function update() {
        const h = document.documentElement;
        const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
})();

/* ============================================================
   SECTION INDICATOR DOTS + POPUP
============================================================ */
(function () {
    const dots = document.querySelectorAll('.section-dot');
    const popup = document.getElementById('section-popup');
    const popupText = document.getElementById('section-popup-text');
    if (!dots.length) return;

    const labels = {
        hero: 'Início', portfolio: 'Portfólio', problema: 'O Problema',
        solucao: 'A Solução', metodologia: 'Metodologia', diferenciacao: 'Diferenciação',
        precos: 'Preços', chamada: 'Chamada', sobre: 'Sobre Mim',
        'trabalhos-recentes': 'Trabalhos Recentes'
    };
    const sections = Array.from(dots).map(d => document.getElementById(d.getAttribute('data-section'))).filter(Boolean);

    let timer;
    function update() {
        const mid = window.scrollY + window.innerHeight * 0.35;
        let idx = 0;
        sections.forEach((s, i) => { if (s && mid >= s.offsetTop) idx = i; });
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        if (popup && popupText) {
            const id = dots[idx] && dots[idx].getAttribute('data-section');
            popupText.textContent = labels[id] || '';
            popup.classList.add('visible');
            clearTimeout(timer);
            timer = setTimeout(() => popup.classList.remove('visible'), 1600);
        }
    }
    dots.forEach(d => {
        d.addEventListener('click', e => {
            e.preventDefault();
            const t = document.getElementById(d.getAttribute('data-section'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
        });
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
})();

/* ============================================================
   STICKY HEADER
============================================================ */
(function () {
    const h = document.getElementById('site-header');
    if (!h) return;
    function tick() { h.classList.toggle('scrolled', window.scrollY > 50); }
    window.addEventListener('scroll', tick, { passive: true });
    tick();
})();

/* ============================================================
   HEADER ACTIVE NAV LINKS
============================================================ */
(function () {
    const links = document.querySelectorAll('.header-nav-link');
    if (!links.length) return;
    const ids = ['portfolio', 'metodologia', 'precos', 'sobre', 'chamada'];
    const secs = ids.map(id => document.getElementById(id)).filter(Boolean);
    function tick() {
        const mid = window.scrollY + window.innerHeight * 0.35;
        let cur = null;
        secs.forEach(s => { if (mid >= s.offsetTop) cur = s.id; });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
    }
    window.addEventListener('scroll', tick, { passive: true });
    tick();
})();

/* ============================================================
   HAMBURGER MENU (mobile only)
============================================================ */
(function () {
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    function close() {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    btn.addEventListener('click', () => {
        const isOpen = menu.classList.contains('open');
        if (isOpen) {
            close();
        } else {
            btn.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
            menu.classList.add('open');
            menu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    });
    document.querySelectorAll('[data-close-menu]').forEach(l => l.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ============================================================
   HERO VIDEO (VSL)
============================================================ */
(function () {
    const vid = document.getElementById('heroVideo');
    const overlay = document.getElementById('videoOverlay');
    const btn = document.getElementById('playButton');
    if (!vid || !overlay || !btn) return;
    btn.addEventListener('click', () => { vid.play(); overlay.classList.add('hidden'); });
    vid.addEventListener('click', () => {
        if (vid.paused) { vid.play(); overlay.classList.add('hidden'); }
        else { vid.pause(); overlay.classList.remove('hidden'); }
    });
    vid.addEventListener('ended', () => overlay.classList.remove('hidden'));
})();

/* ============================================================
   PORTFOLIO CAROUSEL (scroll infinito + drag)
============================================================ */
(function () {
    const wrapper = document.getElementById('carouselWrapper');
    const track = document.getElementById('carouselTrack');
    if (!wrapper || !track) return;

    const cardW = 300, gap = 24, count = 7;
    const totalW = (cardW + gap) * count;
    let vel = -0.8, isDrag = false, startX = 0, scrollL = 0, cur = 0, raf;
    let dragMoved = false;

    function loop() {
        if (!isDrag) {
            cur += vel;
            if (Math.abs(cur) >= totalW) cur = 0;
            track.style.transform = `translateX(${cur}px)`;
        }
        raf = requestAnimationFrame(loop);
    }
    loop();

    wrapper.addEventListener('mouseenter', () => { vel = 0; });
    wrapper.addEventListener('mouseleave', () => { if (!isDrag) vel = -0.8; });

    wrapper.addEventListener('mousedown', e => {
        isDrag = true; dragMoved = false; vel = 0;
        startX = e.pageX; scrollL = cur;
        wrapper.style.cursor = 'grabbing';
        cancelAnimationFrame(raf);
    });
    wrapper.addEventListener('mousemove', e => {
        if (!isDrag) return;
        e.preventDefault();
        const walk = (e.pageX - startX) * 2;
        if (Math.abs(walk) > 5) dragMoved = true;
        cur = scrollL + walk;
        track.style.transform = `translateX(${cur}px)`;
    });
    function endDrag() {
        isDrag = false;
        wrapper.style.cursor = 'grab';
        vel = -0.8;
        loop();
    }
    wrapper.addEventListener('mouseup', endDrag);
    wrapper.addEventListener('mouseleave', endDrag);

    // Touch
    wrapper.addEventListener('touchstart', e => {
        isDrag = true; dragMoved = false; vel = 0;
        startX = e.touches[0].pageX; scrollL = cur;
        cancelAnimationFrame(raf);
    }, { passive: true });
    wrapper.addEventListener('touchmove', e => {
        if (!isDrag) return;
        const walk = (e.touches[0].pageX - startX) * 2;
        if (Math.abs(walk) > 5) dragMoved = true;
        cur = scrollL + walk;
        track.style.transform = `translateX(${cur}px)`;
    }, { passive: true });
    wrapper.addEventListener('touchend', () => { isDrag = false; vel = -0.8; loop(); });

    // Hover preview videos
    track.querySelectorAll('.video-card').forEach(card => {
        const v = card.querySelector('video');
        const iframe = card.querySelector('iframe');
        if (v) {
            card.addEventListener('mouseenter', () => { v.load(); v.play().catch(() => {}); });
            card.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
        }
        if (iframe && !v) {
            card.addEventListener('mouseenter', () => {
                if (!iframe.src && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    setTimeout(() => iframe.classList.add('loaded'), 500);
                }
            });
        }
    });

    // Expor dragMoved para o modal
    wrapper._isDragMoved = () => dragMoved;
})();

/* ============================================================
   PORTFOLIO MODAL
============================================================ */
(function () {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('modalClose');
    const player = document.getElementById('modalPlayer');
    if (!modal || !closeBtn || !player) return;
    const wrapper = document.getElementById('carouselWrapper');

    document.querySelectorAll('#carouselTrack .video-card').forEach(card => {
        card.addEventListener('click', () => {
            if (wrapper && wrapper._isDragMoved && wrapper._isDragMoved()) return;
            const src = card.getAttribute('data-video-src');
            const type = card.getAttribute('data-video-type');
            if (!src) return;
            player.innerHTML = '';
            if (type === 'vimeo') {
                const f = document.createElement('iframe');
                f.src = src + '&autoplay=1';
                f.allow = 'autoplay; fullscreen; picture-in-picture';
                f.setAttribute('allowfullscreen', '');
                f.style.cssText = 'width:100%;height:100%;border:none;';
                player.appendChild(f);
            } else {
                const v = document.createElement('video');
                v.src = src; v.controls = true; v.autoplay = true;
                v.style.cssText = 'width:100%;height:100%;object-fit:contain;';
                player.appendChild(v);
            }
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        player.innerHTML = '';
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
})();

/* ============================================================
   ACCORDION (Solução)
============================================================ */
(function () {
    const items = document.querySelectorAll('.accordion-item');
    if (!items.length) return;

    // Abrir o primeiro por defeito
    function openItem(item) {
        item.classList.add('active');
        const content = item.querySelector('.accordion-content');
        const inner = content && content.querySelector('.accordion-content-inner');
        if (content) content.style.maxHeight = (inner ? inner.scrollHeight : 300) + 'px';
    }
    function closeItem(item) {
        item.classList.remove('active');
        const content = item.querySelector('.accordion-content');
        if (content) content.style.maxHeight = '0';
    }

    // Fechar todos exceto o primeiro
    items.forEach((item, i) => {
        const content = item.querySelector('.accordion-content');
        if (content) content.style.maxHeight = i === 0 ? (content.querySelector('.accordion-content-inner')?.scrollHeight || 300) + 'px' : '0';
    });

    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(closeItem);
            if (!isActive) openItem(item);
        });
    });
})();

/* ============================================================
   TIMELINE — Intersection Observer
============================================================ */
(function () {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(i => obs.observe(i));
})();

/* ============================================================
   SCROLL FADE-IN (problem cards, pricing, etc.)
============================================================ */
(function () {
    const els = document.querySelectorAll('.problem-card, .comparison-column, .pricing-card, .about-container, .cred-badge, .framework-pillar');
    if (!els.length) return;
    const style = document.createElement('style');
    style.textContent = '.fade-ready{opacity:0;transform:translateY(20px);transition:opacity 0.6s ease,transform 0.6s ease}.fade-in{opacity:1!important;transform:translateY(0)!important}';
    document.head.appendChild(style);
    els.forEach(el => el.classList.add('fade-ready'));
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fade-in'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
})();

/* ============================================================
   RECENT WORK CAROUSEL
============================================================ */
(function () {
    const wrapper = document.getElementById('recentCarouselWrapper');
    const track = document.getElementById('recentCarouselTrack');
    const toggleBtn = document.getElementById('toggleAutoScroll');
    if (!wrapper || !track) return;

    let vel = -1.2, isDrag = false, startX = 0, scrollL = 0, cur = 0, raf;
    let dragMoved = false, autoEnabled = true;

    const colW = 528; // 340+48 ou 480+48 approx
    const totalW = colW * 5;

    function loop() {
        if (!isDrag && autoEnabled) {
            cur += vel;
            if (Math.abs(cur) >= totalW) cur = 0;
            track.style.transform = `translateX(${cur}px)`;
        }
        raf = requestAnimationFrame(loop);
    }
    loop();

    wrapper.addEventListener('mouseenter', () => { vel = 0; });
    wrapper.addEventListener('mouseleave', () => { if (!isDrag && autoEnabled) vel = -1.2; });

    wrapper.addEventListener('mousedown', e => {
        isDrag = true; dragMoved = false; vel = 0;
        startX = e.pageX; scrollL = cur;
        wrapper.style.cursor = 'grabbing';
        cancelAnimationFrame(raf);
    });
    wrapper.addEventListener('mousemove', e => {
        if (!isDrag) return;
        e.preventDefault();
        const walk = (e.pageX - startX) * 2;
        if (Math.abs(walk) > 5) dragMoved = true;
        cur = scrollL + walk;
        track.style.transform = `translateX(${cur}px)`;
    });
    function endDrag() {
        if (!isDrag) return;
        isDrag = false;
        wrapper.style.cursor = 'grab';
        if (autoEnabled) vel = -1.2;
        loop();
    }
    wrapper.addEventListener('mouseup', endDrag);
    wrapper.addEventListener('mouseleave', endDrag);

    wrapper.addEventListener('touchstart', e => {
        isDrag = true; dragMoved = false; vel = 0;
        startX = e.touches[0].pageX; scrollL = cur;
        cancelAnimationFrame(raf);
    }, { passive: true });
    wrapper.addEventListener('touchmove', e => {
        if (!isDrag) return;
        const walk = (e.touches[0].pageX - startX) * 2;
        if (Math.abs(walk) > 5) dragMoved = true;
        cur = scrollL + walk;
        track.style.transform = `translateX(${cur}px)`;
    }, { passive: true });
    wrapper.addEventListener('touchend', () => { isDrag = false; if (autoEnabled) vel = -1.2; loop(); });

    // Hover preview
    track.querySelectorAll('.video-card video.video-thumbnail').forEach(v => {
        const card = v.closest('.video-card');
        card.addEventListener('mouseenter', () => { if (v.readyState === 0) v.load(); v.play().catch(() => {}); });
        card.addEventListener('mouseleave', () => { v.pause(); });
    });

    // Toggle btn
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            autoEnabled = !autoEnabled;
            const span = toggleBtn.querySelector('span');
            const svg = toggleBtn.querySelector('svg');
            if (autoEnabled) {
                vel = -1.2;
                if (svg) svg.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';
                if (span) span.textContent = 'Pausar Auto-Scroll';
            } else {
                vel = 0;
                if (svg) svg.innerHTML = '<path d="M8 5v14l11-7z"/>';
                if (span) span.textContent = 'Retomar Auto-Scroll';
            }
        });
    }

    // Expor dragMoved
    wrapper._isDragMoved = () => dragMoved;
})();

/* ============================================================
   RECENT WORK MODAL
============================================================ */
(function () {
    const modal = document.getElementById('recentModal');
    const closeBtn = document.getElementById('recentModalClose');
    const content = document.getElementById('recentModalContent');
    const iframe = document.getElementById('recentModalIframe');
    const videoEl = document.getElementById('recentModalVideo');
    const catEl = document.getElementById('recentModalCategory');
    const titleEl = document.getElementById('recentModalTitle');
    const descEl = document.getElementById('recentModalDescription');
    if (!modal || !closeBtn) return;

    let scrollPos = 0;
    const wrapper = document.getElementById('recentCarouselWrapper');

    document.querySelectorAll('#recentCarouselTrack .video-card').forEach(card => {
        card.addEventListener('click', () => {
            if (wrapper && wrapper._isDragMoved && wrapper._isDragMoved()) return;
            const type = card.dataset.type;
            const src  = card.dataset.video;
            const aspect = card.dataset.aspect;

            if (catEl)   catEl.textContent  = card.dataset.category || '';
            if (titleEl) titleEl.textContent = card.dataset.title    || '';
            if (descEl)  descEl.textContent  = card.dataset.description || '';

            content.classList.remove('landscape', 'portrait');
            content.classList.add(aspect || 'landscape');

            // Reset
            if (iframe)  { iframe.src = ''; iframe.style.display = 'none'; }
            if (videoEl) { videoEl.pause(); videoEl.style.display = 'none'; }

            if (type === 'youtube') {
                if (iframe) {
                    iframe.src = src + '?autoplay=1&rel=0&modestbranding=1';
                    iframe.style.display = 'block';
                }
            } else {
                if (videoEl) {
                    const source = videoEl.querySelector('source');
                    if (source) source.src = src;
                    videoEl.load();
                    videoEl.style.display = 'block';
                    videoEl.play().catch(() => {});
                }
            }

            scrollPos = window.pageYOffset;
            document.body.style.top = `-${scrollPos}px`;
            document.body.classList.add('modal-open');
            modal.classList.add('active');
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollPos);
        if (iframe)  { iframe.src = ''; iframe.style.display = 'none'; }
        if (videoEl) { videoEl.pause(); videoEl.style.display = 'none'; }
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    modal.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
})();

/* ============================================================
   SMOOTH SCROLL para links âncora
============================================================ */
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerH = (document.getElementById('site-header') || {}).offsetHeight || 70;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
        });
    });
})();
