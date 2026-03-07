/**
 * SMGM Website - Main JavaScript
 * Navigation, Modal, Scroll Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // Navigation Dropdown Toggle (multiple)
    // ==========================================
    const dropdowns = document.querySelectorAll('.nav__dropdown');

    dropdowns.forEach(function(dd) {
        var icon = dd.querySelector('.nav__dropdown-icon');
        var link = dd.querySelector('.nav__link-with-dropdown');

        function toggleDropdown(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdowns.forEach(function(other) {
                if (other !== dd) other.classList.remove('active');
            });
            dd.classList.toggle('active');
        }

        if (icon) icon.addEventListener('click', toggleDropdown);
        if (link) link.addEventListener('click', toggleDropdown);
    });

    // Close all dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        dropdowns.forEach(function(dd) {
            if (!dd.contains(e.target)) {
                dd.classList.remove('active');
            }
        });
    });
    
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

            // Validate before submission
            if (!validateContactForm(contactForm)) {
                return;
            }

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

            // Clear validation states on successful submit
            var clearValidation = function() {
                contactForm.querySelectorAll('.form__group').forEach(function(g) {
                    g.classList.remove('form__group--error', 'form__group--success');
                });
            };

            // Firestore에 저장 (Firebase 로드된 경우)
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                firebase.firestore().collection('contacts').add(formData)
                    .then(function() {
                        showToast('전송 완료', '문의가 성공적으로 전송되었습니다. 담당자가 빠른 시일 내에 연락드리겠습니다.', 'success');
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                        contactForm.reset();
                        clearValidation();
                    })
                    .catch(function(err) {
                        console.error('문의 저장 실패:', err);
                        showToast('전송 실패', '전송에 실패했습니다. 다시 시도해주세요.', 'error');
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
                showToast('전송 완료', '문의가 성공적으로 전송되었습니다. 담당자가 빠른 시일 내에 연락드리겠습니다.', 'success');
                modal.classList.remove('active');
                document.body.style.overflow = '';
                contactForm.reset();
                clearValidation();
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

    // ==========================================
    // Certificates Section Toggle (Performance)
    // ==========================================
    const certToggleBtn = document.getElementById('certToggleBtn');
    const certContent = document.getElementById('certContent');

    if (certToggleBtn && certContent) {
        certToggleBtn.addEventListener('click', function() {
            const isActive = certContent.classList.contains('active');

            if (isActive) {
                certContent.classList.remove('active');
                certToggleBtn.classList.remove('active');
                certToggleBtn.querySelector('.news-toggle-text').textContent = '확인하기';
            } else {
                certContent.classList.add('active');
                certToggleBtn.classList.add('active');
                certToggleBtn.querySelector('.news-toggle-text').textContent = '접기';
            }
        });
    }

    // ==========================================
    // Quantity Calculator (Estimator Page)
    // ==========================================
    var solutionPills = document.getElementById('solutionPills');
    if (solutionPills) {
        var DEFAULT_DENSITY = 1.60;
        var currentSolution = '';
        var densityData = null;

        // Load density from Firestore
        function loadDensity() {
            if (typeof db === 'undefined') return;
            db.collection('settings').doc('solutionDensity').get()
                .then(function(doc) {
                    if (doc.exists) {
                        densityData = doc.data();
                    }
                })
                .catch(function() {
                    densityData = null;
                });
        }
        loadDensity();

        // Solution pill click
        solutionPills.addEventListener('click', function(e) {
            var pill = e.target.closest('.calc-solution-pill');
            if (!pill) return;

            solutionPills.querySelectorAll('.calc-solution-pill').forEach(function(p) {
                p.classList.remove('active');
            });
            pill.classList.add('active');
            currentSolution = pill.dataset.solution;

            // Update density fields
            var density = DEFAULT_DENSITY;
            if (densityData && densityData[currentSolution] !== undefined) {
                density = parseFloat(densityData[currentSolution]) || DEFAULT_DENSITY;
            }
            document.querySelectorAll('[data-param="density"]').forEach(function(input) {
                input.value = density.toFixed(2);
            });
        });

        // Calculate button click
        document.querySelectorAll('.calc-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var area = this.dataset.area;
                var length = parseFloat(document.querySelector('[data-area="' + area + '"][data-param="length"]').value) || 0;
                var width = parseFloat(document.querySelector('[data-area="' + area + '"][data-param="width"]').value) || 0;
                var depth = parseFloat(document.querySelector('[data-area="' + area + '"][data-param="depth"]').value) || 0;
                var density = parseFloat(document.querySelector('[data-area="' + area + '"][data-param="density"]').value) || DEFAULT_DENSITY;

                var ton = length * width * depth * density;
                var cube = density > 0 ? ton / density : 0;

                var resultBlock = document.querySelector('.calc-result[data-area="' + area + '"]');
                var tonEl = resultBlock.querySelector('[data-result="ton"]');
                var cubeEl = resultBlock.querySelector('[data-result="cube"]');

                // Store raw values as data attributes for reliable total calculation
                tonEl.setAttribute('data-raw', ton.toFixed(2));
                cubeEl.setAttribute('data-raw', cube.toFixed(2));

                animateValue(tonEl, ton);
                animateValue(cubeEl, cube);

                updateTotals();
            });
        });

        // Animate number display
        function animateValue(el, target) {
            var start = parseFloat(el.textContent) || 0;
            if (el.textContent === '-') start = 0;
            var duration = 400;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = start + (target - start) * eased;
                el.textContent = current.toFixed(2);
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                el.textContent = target.toFixed(2);
            } else {
                requestAnimationFrame(step);
            }
        }

        // Update totals (read from data-raw to avoid animation timing issues)
        function updateTotals() {
            var totalTon = 0;
            var totalCube = 0;

            ['A', 'B', 'C'].forEach(function(area) {
                var resultBlock = document.querySelector('.calc-result[data-area="' + area + '"]');
                var tonEl = resultBlock.querySelector('[data-result="ton"]');
                var cubeEl = resultBlock.querySelector('[data-result="cube"]');
                var tonVal = parseFloat(tonEl.getAttribute('data-raw'));
                var cubeVal = parseFloat(cubeEl.getAttribute('data-raw'));
                if (!isNaN(tonVal) && tonVal > 0) totalTon += tonVal;
                if (!isNaN(cubeVal) && cubeVal > 0) totalCube += cubeVal;
            });

            var totalTonEl = document.getElementById('totalTon');
            var totalCubeEl = document.getElementById('totalCube');
            if (totalTonEl) totalTonEl.textContent = totalTon.toFixed(2);
            if (totalCubeEl) totalCubeEl.textContent = totalCube.toFixed(2);
        }

        // Quote request — open Contact Modal with pre-filled message
        var quoteBtn = document.getElementById('quoteRequestBtn');
        if (quoteBtn) {
            quoteBtn.addEventListener('click', function() {
                var lines = [];
                if (currentSolution) {
                    lines.push('솔루션: ' + currentSolution);
                }

                ['A', 'B', 'C'].forEach(function(area) {
                    var length = document.querySelector('[data-area="' + area + '"][data-param="length"]').value;
                    var width = document.querySelector('[data-area="' + area + '"][data-param="width"]').value;
                    var depth = document.querySelector('[data-area="' + area + '"][data-param="depth"]').value;
                    var tonEl = document.querySelector('.calc-result[data-area="' + area + '"] [data-result="ton"]');
                    var cubeEl = document.querySelector('.calc-result[data-area="' + area + '"] [data-result="cube"]');
                    var ton = tonEl ? tonEl.textContent : '-';
                    var cube = cubeEl ? cubeEl.textContent : '-';

                    if (length || width || depth) {
                        lines.push('면적' + area + ': ' + (length || 0) + 'm × ' + (width || 0) + 'm × ' + (depth || 0) + 'm = ' + ton + 'ton / ' + cube + 'm³');
                    }
                });

                var totalTon = document.getElementById('totalTon');
                var totalCube = document.getElementById('totalCube');
                if (totalTon && totalCube) {
                    lines.push('총 소요량: ' + totalTon.textContent + 'ton / ' + totalCube.textContent + 'm³');
                }

                // Open contact modal
                var modal = document.getElementById('contactModal');
                if (modal) {
                    modal.classList.add('active');

                    // Set solution select
                    if (currentSolution) {
                        var solutionSelect = document.getElementById('solution');
                        if (solutionSelect) solutionSelect.value = currentSolution;
                    }

                    // Set message
                    var messageField = document.getElementById('message');
                    if (messageField && lines.length > 0) {
                        messageField.value = lines.join('\n');
                    }
                }
            });
        }
    }

});

// ==========================================
// Toast Notification System
// ==========================================
(function() {
    // Create toast container if not present
    if (!document.querySelector('.toast-container')) {
        var container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
})();

/**
 * Show a toast notification
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {'success'|'error'|'warning'} type - Toast type
 * @param {number} duration - Auto-dismiss in ms (default 4000)
 */
function showToast(title, message, type, duration) {
    type = type || 'success';
    duration = duration || 4000;
    var container = document.querySelector('.toast-container');
    if (!container) return;

    var iconMap = { success: '✓', error: '✕', warning: '!' };

    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.innerHTML =
        '<span class="toast__icon">' + (iconMap[type] || '✓') + '</span>' +
        '<div class="toast__body">' +
            '<div class="toast__title">' + title + '</div>' +
            '<p class="toast__message">' + message + '</p>' +
        '</div>' +
        '<button class="toast__close" aria-label="닫기">&times;</button>';

    container.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(function() {
        toast.classList.add('toast--visible');
    });

    var closeBtn = toast.querySelector('.toast__close');
    var dismissed = false;

    function dismiss() {
        if (dismissed) return;
        dismissed = true;
        toast.classList.remove('toast--visible');
        toast.classList.add('toast--exit');
        setTimeout(function() {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 400);
    }

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
}

// ==========================================
// Form Validation
// ==========================================
/**
 * Validate the contact form before submission
 * @param {HTMLFormElement} form
 * @returns {boolean} true if valid
 */
function validateContactForm(form) {
    var valid = true;
    var fields = [
        { id: 'name', msg: '이름을 입력해주세요.' },
        { id: 'email', msg: '이메일을 입력해주세요.' },
        { id: 'phone', msg: '연락처를 입력해주세요.' },
        { id: 'solution', msg: '솔루션을 선택해주세요.' },
        { id: 'message', msg: '문의 내용을 입력해주세요.' }
    ];

    fields.forEach(function(f) {
        var el = form.querySelector('#' + f.id);
        if (!el) return;
        var group = el.closest('.form__group');
        var errorEl = group ? group.querySelector('.form__error-text') : null;

        // Reset state
        if (group) group.classList.remove('form__group--error', 'form__group--success');
        if (errorEl) errorEl.textContent = '';

        var val = el.value.trim();

        if (!val) {
            valid = false;
            if (group) group.classList.add('form__group--error');
            if (errorEl) errorEl.textContent = f.msg;
        } else if (f.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            valid = false;
            if (group) group.classList.add('form__group--error');
            if (errorEl) errorEl.textContent = '올바른 이메일 형식을 입력해주세요.';
        } else {
            if (group) group.classList.add('form__group--success');
        }
    });

    return valid;
}

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
// Accessibility — ARIA & Keyboard Navigation
// ==========================================
(function() {
    // --- Contact Modal: ARIA + Focus Trap ---
    var modal = document.getElementById('contactModal');
    if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        var modalTitle = modal.querySelector('.modal__title');
        if (modalTitle) {
            modalTitle.id = modalTitle.id || 'contactModalTitle';
            modal.setAttribute('aria-labelledby', modalTitle.id);
        }

        // Focus trap
        modal.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            var focusable = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusable.length) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        // Focus first input when modal opens
        var origOpen = modal.classList.add.bind(modal.classList);
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.attributeName === 'class' && modal.classList.contains('active')) {
                    var firstInput = modal.querySelector('input, select, textarea');
                    if (firstInput) setTimeout(function() { firstInput.focus(); }, 100);
                }
            });
        });
        observer.observe(modal, { attributes: true });
    }

    // --- Nav Dropdowns: ARIA ---
    document.querySelectorAll('.nav__dropdown').forEach(function(dropdown) {
        var dropdownMenu = dropdown.querySelector('.nav__dropdown-menu');
        var dropdownIcon = dropdown.querySelector('.nav__dropdown-icon');

        if (dropdownMenu && dropdownIcon) {
            dropdownIcon.setAttribute('aria-expanded', 'false');
            dropdownMenu.setAttribute('role', 'menu');
            dropdownMenu.querySelectorAll('.nav__dropdown-item').forEach(function(item) {
                item.setAttribute('role', 'menuitem');
            });

            // Sync aria-expanded
            var ddObserver = new MutationObserver(function() {
                var isActive = dropdown.classList.contains('active');
                dropdownIcon.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            });
            ddObserver.observe(dropdown, { attributes: true });
        }
    });

    // --- Solution Explorer: Tab semantics + Arrow keys ---
    var explorer = document.querySelector('.solution-explorer');
    if (explorer) {
        var tabList = explorer.querySelector('.solution-explorer__list');
        var tabs = explorer.querySelectorAll('.solution-explorer__item');
        if (tabList && tabs.length) {
            tabList.setAttribute('role', 'tablist');
            tabs.forEach(function(tab, i) {
                tab.setAttribute('role', 'tab');
                tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
                tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
                var key = tab.getAttribute('data-solution-key');
                var pane = explorer.querySelector('.solution-explorer__pane[data-pane="' + key + '"]');
                if (pane) {
                    var paneId = 'explorer-panel-' + key;
                    var tabId = 'explorer-tab-' + key;
                    pane.id = paneId;
                    tab.id = tabId;
                    tab.setAttribute('aria-controls', paneId);
                    pane.setAttribute('role', 'tabpanel');
                    pane.setAttribute('aria-labelledby', tabId);
                }
            });

            // Arrow key navigation
            tabList.addEventListener('keydown', function(e) {
                var tabsArr = Array.from(tabs);
                var idx = tabsArr.indexOf(document.activeElement);
                if (idx === -1) return;

                var next = -1;
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    next = (idx + 1) % tabsArr.length;
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    next = (idx - 1 + tabsArr.length) % tabsArr.length;
                }
                if (next >= 0) {
                    e.preventDefault();
                    tabsArr[next].focus();
                    tabsArr[next].click();
                }
            });

            // Update ARIA on tab click
            tabs.forEach(function(tab) {
                tab.addEventListener('click', function() {
                    tabs.forEach(function(t) {
                        t.setAttribute('aria-selected', 'false');
                        t.setAttribute('tabindex', '-1');
                    });
                    tab.setAttribute('aria-selected', 'true');
                    tab.setAttribute('tabindex', '0');
                });
            });
        }
    }

    // --- Solution Cards: keyboard activation ---
    document.querySelectorAll('.solution-box, .solution-card').forEach(function(el) {
        if (el.getAttribute('data-solution')) {
            el.setAttribute('tabindex', '0');
            el.setAttribute('role', 'link');
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        }
    });
})();

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
