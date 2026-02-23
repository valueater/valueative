/**
 * SMGM — The Red Sanctum
 * Animation layer (GSAP + ScrollTrigger)
 */

// ─────────────────────────────────────────────
// 1. GSAP 초기화
// ─────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────
// 2. Sunlight Parallax (모든 페이지)
// ─────────────────────────────────────────────
if (!prefersReducedMotion) {
    const overlay = document.querySelector('.sunlight-overlay');
    if (overlay) {
        gsap.to(overlay, {
            yPercent: -25,
            rotate: -8,
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2
            }
        });
    }
}

// ─────────────────────────────────────────────
// 3. Hero Spotlight Text reveal
// ─────────────────────────────────────────────
function revealHero() {
    const lines = document.querySelectorAll('.hero__title-line');
    if (!lines.length) return;
    gsap.timeline()
        .to(lines, {
            opacity: 1,
            filter: 'brightness(1)',
            textShadow: '0 0 48px rgba(255, 190, 90, 0.55)',
            stagger: 0.18,
            duration: 0.75,
            ease: 'power2.out'
        })
        .to(lines, {
            textShadow: '0 0 0px rgba(255,190,90,0)',
            duration: 1.5,
            ease: 'power1.inOut'
        }, '+=0.3');
}

// ─────────────────────────────────────────────
// 4. Preloader (index.html 전용)
// ─────────────────────────────────────────────
const isIndexPage = !!document.querySelector('.hero__title-line');

if (isIndexPage) {
    if (!prefersReducedMotion) {
        // anim-ready → hero title lines 초기화 숨김
        document.body.classList.add('anim-ready');

        // preloader 주입
        const pl = document.createElement('div');
        pl.className = 'preloader';
        pl.id = 'preloader';
        pl.setAttribute('aria-hidden', 'true');
        pl.innerHTML = '<div class="preloader__dot"></div>';
        document.body.prepend(pl);
        document.body.style.overflow = 'hidden';

        const dot = pl.querySelector('.preloader__dot');
        const tl = gsap.timeline({
            onComplete: () => {
                pl.remove();
                document.body.style.overflow = '';
                revealHero();
            }
        });
        tl.from(dot, { scale: 0, duration: 0.3, ease: 'back.out(2)' })
          .to(dot, { scaleX: 80, borderRadius: '2px', duration: 0.55, ease: 'power3.inOut' }, '+=0.15')
          .to(pl, { backgroundColor: '#ffffff', duration: 0.25 }, '-=0.15')
          .to(pl, { opacity: 0, duration: 0.35, ease: 'power2.out' }, '+=0.1');
    } else {
        revealHero();
    }
}

// ─────────────────────────────────────────────
// 5. Performance Counters (performance.html)
// ─────────────────────────────────────────────
const counterEls = document.querySelectorAll('[data-count]');
if (counterEls.length) {
    counterEls.forEach(el => {
        const target   = parseFloat(el.dataset.count);
        const prefix   = el.dataset.prefix  || '';
        const suffix   = el.dataset.suffix  || '';
        const decimals = parseInt(el.dataset.decimals || '2');
        const obj      = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'center 80%',
            once: true,
            onEnter: () => {
                gsap.to(obj, {
                    val: target,
                    duration: 1.8,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
                    }
                });
            }
        });
    });
}

// ─────────────────────────────────────────────
// 6. Floating Molecules (performance.html)
// ─────────────────────────────────────────────
const molContainer = document.querySelector('.molecules-bg');
if (molContainer && !prefersReducedMotion) {
    const symbols = ['SiO₂', 'Al₂O₃', 'K₂O', 'Fe₂O₃', 'MgO', 'CaO', 'TiO₂', 'Na₂O'];
    symbols.forEach((sym, i) => {
        const el = document.createElement('span');
        el.className = 'molecule-symbol';
        el.textContent = sym;
        el.style.cssText = `
            left: ${10 + (i * 11) % 80}%;
            top: ${15 + (i * 17) % 70}%;
            --float-dur: ${7 + (i % 5)}s;
            --float-delay: ${-i * 1.2}s;
            --float-rot: ${(i % 3) * 15}deg;
        `;
        molContainer.appendChild(el);
    });
}
