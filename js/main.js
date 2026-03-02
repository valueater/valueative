/**
 * SMGM Website - Main JavaScript
 * Navigation, Modal, Scroll Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // Navigation Dropdown Toggle
    // ==========================================
    const dropdownIcon = document.querySelector('.nav__dropdown-icon');
    const dropdown = document.querySelector('.nav__dropdown');
    
    if (dropdownIcon && dropdown) {
        dropdownIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const mobileToggle = document.querySelector('.nav__mobile-toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // ==========================================
    // Header Scroll Effect
    // ==========================================
    const header = document.querySelector('.header');
    
    let _scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!_scrollTicking) {
            requestAnimationFrame(function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                _scrollTicking = false;
            });
            _scrollTicking = true;
        }
    }, { passive: true });
    
    // ==========================================
    // Contact Modal
    // ==========================================
    const modal = document.getElementById('contactModal');
    const contactBtns = document.querySelectorAll('.open-contact-modal');
    const closeBtn = document.querySelector('.modal__close');
    
    // Open modal
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    });
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ==========================================
    // Contact Form Submission
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var submitBtn = contactForm.querySelector('button[type="submit"], .form__submit');
            var originalText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '전송 중...';
            }

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                solution: document.getElementById('solution').value,
                message: document.getElementById('message').value,
                isRead: false,
                createdAt: typeof firebase !== 'undefined' && firebase.firestore
                    ? firebase.firestore.FieldValue.serverTimestamp()
                    : new Date()
            };

            // Firestore에 저장 (Firebase 로드된 경우)
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                firebase.firestore().collection('contacts').add(formData)
                    .then(function() {
                        alert('문의가 성공적으로 전송되었습니다.\n담당자가 빠른 시일 내에 연락드리겠습니다.');
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                        contactForm.reset();
                    })
                    .catch(function(err) {
                        console.error('문의 저장 실패:', err);
                        alert('전송에 실패했습니다. 다시 시도해주세요.');
                    })
                    .finally(function() {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = originalText;
                        }
                    });
            } else {
                // Firebase 미설정 시 기존 동작
                console.log('Form submitted:', formData);
                alert('문의가 성공적으로 전송되었습니다.\n담당자가 빠른 시일 내에 연락드리겠습니다.');
                modal.classList.remove('active');
                document.body.style.overflow = '';
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }
        });
    }
    
    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });
    
    // ==========================================
    // Scroll Animation (Fade In on Scroll)
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // ==========================================
    // Solution Box/Card Click Navigation
    // ==========================================
    document.querySelectorAll('.solution-box, .solution-card, .data-card').forEach(box => {
        box.addEventListener('click', function() {
            const solutionPage = this.getAttribute('data-solution');
            if (solutionPage) {
                window.location.href = solutionPage;
            }
        });
    });
    
    // ==========================================
    // News Section Toggle
    // ==========================================
    const newsToggleBtn = document.getElementById('newsToggleBtn');
    const newsContent = document.getElementById('newsContent');
    
    if (newsToggleBtn && newsContent) {
        newsToggleBtn.addEventListener('click', function() {
            const isActive = newsContent.classList.contains('active');
            
            if (isActive) {
                // Close
                newsContent.classList.remove('active');
                newsToggleBtn.classList.remove('active');
                newsToggleBtn.querySelector('.news-toggle-text').textContent = '펼치기';
            } else {
                // Open
                newsContent.classList.add('active');
                newsToggleBtn.classList.add('active');
                newsToggleBtn.querySelector('.news-toggle-text').textContent = '접기';
            }
        });
    }
    
});

// ==========================================
// Utility Functions
// ==========================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==========================================
// Company — Material Guide Subnav Active State
// ==========================================
(function () {
    const subnav = document.querySelector('.material-subnav');
    if (!subnav) return;

    const links = Array.from(subnav.querySelectorAll('a[href^="#"]'));
    const targets = links
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if (!targets.length) return;

    const setActive = (id) => {
        links.forEach(a => {
            a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
        });
    };

    const io = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target.id) setActive(visible.target.id);
    }, { root: null, threshold: [0.2, 0.35, 0.5] });

    targets.forEach(t => io.observe(t));

    if (targets[0] && targets[0].id) setActive(targets[0].id);
})();
