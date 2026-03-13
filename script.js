/* ============================================================
   AHLEC LAIA — PREMIUM VIDEO EDITOR
   Main JavaScript — All Interactive Functionality
   ============================================================ */

'use strict';

/* ============================================================
   1. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgressBar() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    function updateBar() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
}

/* ============================================================
   2. SECTION INDICATOR DOTS + POPUP LABEL
   ============================================================ */
function initSectionIndicator() {
    const dots = document.querySelectorAll('.section-dot');
    const popup = document.getElementById('section-popup');
    const popupText = document.getElementById('section-popup-text');
    if (!dots.length) return;

    const sectionNames = {
        'hero': 'Início',
        'portfolio': 'Portfólio',
        'problema': 'O Problema',
        'solucao': 'A Solução',
        'metodologia': 'Metodologia',
        'diferenciacao': 'Diferenciação',
        'precos': 'Preços',
        'chamada': 'Chamada Gratuita',
        'sobre': 'Sobre Mim',
        'trabalhos-recentes': 'Trabalhos Recentes'
    };

    const sections = Array.from(dots).map(dot => {
        const id = dot.getAttribute('data-section');
        return document.getElementById(id);
    }).filter(Boolean);

    let popupTimeout;

    function updateActiveDot() {
        const scrollY = window.scrollY + window.innerHeight * 0.4;
        let activeIdx = 0;

        sections.forEach((section, i) => {
            if (section && scrollY >= section.offsetTop) {
                activeIdx = i;
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIdx);
        });

        // Show popup
        const activeDot = dots[activeIdx];
        const sectionId = activeDot ? activeDot.getAttribute('data-section') : '';
        const label = sectionNames[sectionId] || '';
        if (popup && popupText && label) {
            popupText.textContent = label;
            popup.classList.add('visible');
            clearTimeout(popupTimeout);
            popupTimeout = setTimeout(() => popup.classList.remove('visible'), 1500);
        }
    }

    // Smooth scroll on dot click
    dots.forEach(dot => {
        dot.addEventListener('click', e => {
            e.preventDefault();
            const id = dot.getAttribute('data-section');
            const target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    window.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();
}

/* ============================================================
   3. STICKY HEADER
   ============================================================ */
function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    function onScroll() {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================================
   4. HAMBURGER MENU
   ============================================================ */
function initHamburgerMenu() {
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    function closeMenu() {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        const isOpen = menu.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            btn.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
            menu.classList.add('open');
            menu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close on link click
    document.querySelectorAll('[data-close-menu]').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on backdrop click
    menu.addEventListener('click', e => {
        if (e.target === menu) closeMenu();
    });

    // Close on ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
}

/* ============================================================
   5. HERO VIDEO (VSL)
   ============================================================ */
function initHeroVideo() {
    const video = document.getElementById('heroVideo');
    const overlay = document.getElementById('videoOverlay');
    const playBtn = document.getElementById('playButton');
    if (!video || !overlay || !playBtn) return;

    playBtn.addEventListener('click', () => {
        video.play();
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    });

    video.addEventListener('pause', () => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    });

    video.addEventListener('ended', () => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    });
}

/* ============================================================
   6. PORTFOLIO CAROUSEL (infinite auto-scroll + drag + modal)
   ============================================================ */
function initPortfolioCarousel() {
    const wrapper = document.getElementById('carouselWrapper');
    const track = document.getElementById('carouselTrack');
    if (!wrapper || !track) return;

    let autoScrollSpeed = 0.6; // px per frame
    let isAutoScrolling = true;
    let isDragging = false;
    let dragStartX = 0;
    let dragScrollLeft = 0;
    let animFrameId;

    // Hover preview videos
    const videoCards = track.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        const vid = card.querySelector('video');
        if (!vid) return;

        card.addEventListener('mouseenter', () => {
            if (vid.getAttribute('data-loaded') !== 'true') {
                vid.load();
                vid.setAttribute('data-loaded', 'true');
            }
            vid.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
            vid.pause();
            vid.currentTime = 0;
        });
    });

    // Auto-scroll loop
    function autoScroll() {
        if (isAutoScrolling && !isDragging) {
            wrapper.scrollLeft += autoScrollSpeed;

            // Reset when scrolled halfway (we've duplicated content)
            const halfWidth = track.scrollWidth / 2;
            if (wrapper.scrollLeft >= halfWidth) {
                wrapper.scrollLeft -= halfWidth;
            }
        }
        animFrameId = requestAnimationFrame(autoScroll);
    }

    animFrameId = requestAnimationFrame(autoScroll);

    // Pause on hover
    wrapper.addEventListener('mouseenter', () => { isAutoScrolling = false; });
    wrapper.addEventListener('mouseleave', () => { isAutoScrolling = true; });

    // Drag to scroll
    wrapper.addEventListener('mousedown', e => {
        isDragging = true;
        isAutoScrolling = false;
        dragStartX = e.pageX - wrapper.offsetLeft;
        dragScrollLeft = wrapper.scrollLeft;
        wrapper.style.cursor = 'grabbing';
        wrapper.style.userSelect = 'none';
    });

    wrapper.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - dragStartX) * 1.5;
        wrapper.scrollLeft = dragScrollLeft - walk;
    });

    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        wrapper.style.cursor = 'grab';
        wrapper.style.userSelect = '';
        setTimeout(() => { isAutoScrolling = true; }, 500);
    }

    wrapper.addEventListener('mouseup', stopDrag);
    wrapper.addEventListener('mouseleave', stopDrag);

    // Touch support
    wrapper.addEventListener('touchstart', e => {
        isDragging = true;
        isAutoScrolling = false;
        dragStartX = e.touches[0].pageX - wrapper.offsetLeft;
        dragScrollLeft = wrapper.scrollLeft;
    }, { passive: true });

    wrapper.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - wrapper.offsetLeft;
        const walk = (x - dragStartX) * 1.5;
        wrapper.scrollLeft = dragScrollLeft - walk;
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => { isAutoScrolling = true; }, 500);
    });
}

/* ============================================================
   7. PORTFOLIO VIDEO MODAL
   ============================================================ */
function initPortfolioModal() {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('modalClose');
    const player = document.getElementById('modalPlayer');
    if (!modal || !closeBtn || !player) return;

    document.querySelectorAll('#carouselTrack .video-card').forEach(card => {
        card.addEventListener('click', () => {
            const src = card.getAttribute('data-video-src');
            const type = card.getAttribute('data-video-type');
            if (!src) return;

            player.innerHTML = '';

            if (type === 'vimeo') {
                const iframe = document.createElement('iframe');
                iframe.src = src + '&autoplay=1';
                iframe.allow = 'autoplay; fullscreen; picture-in-picture';
                iframe.setAttribute('allowfullscreen', '');
                iframe.style.cssText = 'width:100%;height:100%;border:none;';
                player.appendChild(iframe);
            } else {
                const video = document.createElement('video');
                video.src = src;
                video.controls = true;
                video.autoplay = true;
                video.style.cssText = 'width:100%;height:100%;object-fit:contain;';
                player.appendChild(video);
            }

            modal.classList.add('open');
            document.body.classList.add('modal-open');
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        player.innerHTML = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ============================================================
   8. STICKY CTA CLOSE BUTTON
   ============================================================ */
function initStickyCTA() {
    const strip = document.getElementById('ahlecCapacityStrip');
    const closeBtn = document.getElementById('ahlecCloseBtn');
    if (!strip || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        strip.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
        strip.style.transform = 'translateY(120%)';
        strip.style.opacity = '0';
        setTimeout(() => { strip.style.display = 'none'; }, 400);
    });
}

/* ============================================================
   9. SOLUTION ACCORDION
   ============================================================ */
function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    if (!items.length) return;

    // Open first by default
    if (items[0]) {
        items[0].classList.add('active');
        const content = items[0].querySelector('.accordion-content');
        if (content) {
            const inner = content.querySelector('.accordion-content-inner');
            if (inner) content.style.maxHeight = inner.scrollHeight + 'px';
        }
    }

    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            items.forEach(i => {
                i.classList.remove('active');
                const c = i.querySelector('.accordion-content');
                if (c) c.style.maxHeight = '0';
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const inner = content.querySelector('.accordion-content-inner');
                content.style.maxHeight = (inner ? inner.scrollHeight : 300) + 'px';
            }
        });
    });
}

/* ============================================================
   10. TIMELINE — INTERSECTION OBSERVER ANIMATIONS
   ============================================================ */
function initTimelineAnimations() {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
}

/* ============================================================
   11. GENERAL SCROLL ANIMATIONS (fade-in on scroll)
   ============================================================ */
function initScrollAnimations() {
    const els = document.querySelectorAll(
        '.problem-card, .comparison-column, .pricing-card, .about-profile, .about-text, .about-helped, .timeline-item, .framework-pillar, .cred-badge'
    );
    if (!els.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Override animate-in via class
    const style = document.createElement('style');
    style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
}

/* ============================================================
   12. RECENT WORK CAROUSEL (auto-scroll + modal)
   ============================================================ */
function initRecentWorkCarousel() {
    const wrapper = document.getElementById('recentCarouselWrapper');
    const track = document.getElementById('recentCarouselTrack');
    const toggleBtn = document.getElementById('toggleAutoScroll');
    if (!wrapper || !track) return;

    let isAutoScrolling = true;
    let isDragging = false;
    let dragStartX = 0;
    let dragScrollLeft = 0;
    let scrollSpeed = 0.5;

    // Hover preview for video elements
    track.querySelectorAll('.video-card video.video-thumbnail').forEach(vid => {
        const card = vid.closest('.video-card');
        card.addEventListener('mouseenter', () => {
            vid.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
            vid.pause();
        });
    });

    function autoScrollLoop() {
        if (isAutoScrolling && !isDragging) {
            wrapper.scrollLeft += scrollSpeed;
            const halfWidth = track.scrollWidth / 2;
            if (wrapper.scrollLeft >= halfWidth) {
                wrapper.scrollLeft -= halfWidth;
            }
        }
        requestAnimationFrame(autoScrollLoop);
    }

    requestAnimationFrame(autoScrollLoop);

    wrapper.addEventListener('mouseenter', () => { isAutoScrolling = false; });
    wrapper.addEventListener('mouseleave', () => { isAutoScrolling = true; });

    // Drag
    wrapper.addEventListener('mousedown', e => {
        isDragging = true;
        isAutoScrolling = false;
        dragStartX = e.pageX - wrapper.offsetLeft;
        dragScrollLeft = wrapper.scrollLeft;
        wrapper.style.cursor = 'grabbing';
    });

    wrapper.addEventListener('mousemove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - dragStartX) * 1.2;
        wrapper.scrollLeft = dragScrollLeft - walk;
    });

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        wrapper.style.cursor = '';
        setTimeout(() => { isAutoScrolling = true; }, 600);
    }

    wrapper.addEventListener('mouseup', endDrag);
    wrapper.addEventListener('mouseleave', endDrag);

    // Touch
    wrapper.addEventListener('touchstart', e => {
        isDragging = true;
        isAutoScrolling = false;
        dragStartX = e.touches[0].pageX - wrapper.offsetLeft;
        dragScrollLeft = wrapper.scrollLeft;
    }, { passive: true });

    wrapper.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - wrapper.offsetLeft;
        wrapper.scrollLeft = dragScrollLeft - (x - dragStartX) * 1.2;
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => { isAutoScrolling = true; }, 600);
    });

    // Toggle button
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isAutoScrolling = !isAutoScrolling;
            const span = toggleBtn.querySelector('span');
            const svg = toggleBtn.querySelector('svg');
            if (isAutoScrolling) {
                if (span) span.textContent = 'Pausar Auto-Scroll';
                if (svg) svg.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';
            } else {
                if (span) span.textContent = 'Retomar Auto-Scroll';
                if (svg) svg.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
        });
    }
}

/* ============================================================
   13. RECENT WORK MODAL
   ============================================================ */
function initRecentWorkModal() {
    const modal = document.getElementById('recentModal');
    const closeBtn = document.getElementById('recentModalClose');
    const iframe = document.getElementById('recentModalIframe');
    const videoEl = document.getElementById('recentModalVideo');
    const categoryEl = document.getElementById('recentModalCategory');
    const titleEl = document.getElementById('recentModalTitle');
    const descEl = document.getElementById('recentModalDescription');
    if (!modal || !closeBtn) return;

    document.querySelectorAll('#recentCarouselTrack .video-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-type');
            const videoSrc = card.getAttribute('data-video');
            const category = card.getAttribute('data-category') || '';
            const title = card.getAttribute('data-title') || '';
            const desc = card.getAttribute('data-description') || '';

            if (categoryEl) categoryEl.textContent = category;
            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.textContent = desc;

            // Reset
            if (iframe) { iframe.src = ''; iframe.style.display = 'none'; }
            if (videoEl) { videoEl.src = ''; videoEl.style.display = 'none'; }

            if (type === 'youtube') {
                if (iframe) {
                    iframe.src = videoSrc + '?autoplay=1&rel=0';
                    iframe.style.display = 'block';
                }
            } else if (type === 'direct') {
                if (videoEl) {
                    const source = videoEl.querySelector('source');
                    if (source) source.src = videoSrc;
                    videoEl.load();
                    videoEl.style.display = 'block';
                    videoEl.play().catch(() => {});
                }
            }

            modal.classList.add('open');
            document.body.classList.add('modal-open');
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        if (iframe) { iframe.src = ''; iframe.style.display = 'none'; }
        if (videoEl) { videoEl.pause(); videoEl.style.display = 'none'; }
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ============================================================
   14. HEADER NAV ACTIVE LINK (highlight current section)
   ============================================================ */
function initHeaderActiveLinks() {
    const navLinks = document.querySelectorAll('.header-nav-link');
    if (!navLinks.length) return;

    const sectionMap = {
        '#portfolio': 'portfolio',
        '#metodologia': 'metodologia',
        '#precos': 'precos',
        '#sobre': 'sobre',
        '#chamada': 'chamada'
    };

    const sections = Object.values(sectionMap)
        .map(id => document.getElementById(id))
        .filter(Boolean);

    function updateActiveLink() {
        const scrollY = window.scrollY + window.innerHeight * 0.4;
        let activeId = null;

        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop) activeId = sec.id;
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const secId = href ? href.replace('#', '') : '';
            link.classList.toggle('active', secId === activeId);
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
}

/* ============================================================
   15. HERO SECTION ENTRANCE ANIMATION
   ============================================================ */
function initHeroEntrance() {
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('.hero-video-container');
    if (!heroContent) return;

    // Elements already have CSS animations via keyframes
    // Just ensure they start visible after load
    setTimeout(() => {
        if (heroContent) heroContent.style.opacity = '1';
        if (heroVideo) heroVideo.style.opacity = '1';
    }, 100);
}

/* ============================================================
   16. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerH = document.getElementById('site-header')?.offsetHeight || 70;
            const targetY = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
    });
}

/* ============================================================
   17. LAZY LOAD IMAGES
   ============================================================ */
function initLazyLoad() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    lazyImgs.forEach(img => observer.observe(img));
}

/* ============================================================
   18. SOLUTION SECTION — STICKY RIGHT PANEL
   ============================================================ */
function initSolutionSticky() {
    // Handled by CSS position: sticky; complemented here with scroll awareness
    const right = document.querySelector('.solution-right');
    if (!right) return;
    // CSS handles the sticky behavior; nothing extra needed in JS
}

/* ============================================================
   19. PRICING CARDS — HOVER TILT EFFECT (Elite card only)
   ============================================================ */
function initPricingTilt() {
    const featured = document.querySelector('.pricing-card.featured');
    if (!featured) return;

    featured.addEventListener('mousemove', e => {
        const rect = featured.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * 6;
        const tiltY = -(x / rect.width) * 6;
        featured.style.transform = `scale(1.05) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    featured.addEventListener('mouseleave', () => {
        featured.style.transform = 'scale(1.05)';
    });
}

/* ============================================================
   20. INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initScrollProgressBar();
    initSectionIndicator();
    initStickyHeader();
    initHamburgerMenu();
    initHeroVideo();
    initPortfolioCarousel();
    initPortfolioModal();
    initStickyCTA();
    initAccordion();
    initTimelineAnimations();
    initScrollAnimations();
    initRecentWorkCarousel();
    initRecentWorkModal();
    initHeaderActiveLinks();
    initHeroEntrance();
    initSmoothScroll();
    initLazyLoad();
    initSolutionSticky();
    initPricingTilt();
});
