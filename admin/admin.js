// ==========================================
// SMGM Admin Dashboard - Firebase CRUD
// ==========================================

(function() {
    'use strict';

    // ========== AUTH GUARD ==========
    auth.onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        document.getElementById('userEmail').textContent = user.email;
        init();
    });

    function init() {
        setupTabs();
        setupLogout();
        loadNews();
        loadContacts();
        loadPopups();
        setupNewsForm();
        setupPopupForm();
        loadDensity();
        setupDensityForm();
        loadProjects();
        setupProjectForm();
        loadCerts();
        setupCertForm();
    }

    // ========== TABS ==========
    function setupTabs() {
        var tabs = document.querySelectorAll('.admin-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var target = this.dataset.tab;
                tabs.forEach(function(t) { t.classList.remove('active'); });
                this.classList.add('active');
                document.querySelectorAll('.admin-panel').forEach(function(p) {
                    p.classList.remove('active');
                });
                document.getElementById('panel-' + target).classList.add('active');
            });
        });
    }

    // ========== LOGOUT ==========
    function setupLogout() {
        document.getElementById('logoutBtn').addEventListener('click', function() {
            auth.signOut().then(function() {
                window.location.href = 'login.html';
            });
        });
    }

    // ==========================================
    // NEWS MANAGEMENT
    // ==========================================
    var newsEditId = null;

    function loadNews() {
        var tbody = document.getElementById('newsTableBody');
        tbody.innerHTML = '<tr><td colspan="4" class="admin-loading">불러오는 중...</td></tr>';

        db.collection('news').orderBy('date', 'desc').onSnapshot(function(snapshot) {
            if (snapshot.empty) {
                tbody.innerHTML = '';
                document.getElementById('newsEmpty').style.display = 'block';
                document.querySelector('.news-table-wrap').style.display = 'none';
                return;
            }
            document.getElementById('newsEmpty').style.display = 'none';
            document.querySelector('.news-table-wrap').style.display = 'block';

            tbody.innerHTML = '';
            snapshot.forEach(function(doc) {
                var d = doc.data();
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + escapeHtml(d.title) + '</td>' +
                    '<td>' + escapeHtml(d.date || '') + '</td>' +
                    '<td class="hide-mobile">' + truncate(d.excerpt, 40) + '</td>' +
                    '<td>' +
                        '<div class="admin-table__actions">' +
                            '<button class="btn btn-sm btn-secondary" data-edit-news="' + doc.id + '">수정</button>' +
                            '<button class="btn btn-sm btn-danger" data-delete-news="' + doc.id + '">삭제</button>' +
                        '</div>' +
                    '</td>';
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('[data-edit-news]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    editNews(this.dataset.editNews);
                });
            });
            tbody.querySelectorAll('[data-delete-news]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    deleteNews(this.dataset.deleteNews);
                });
            });
        });
    }

    function setupNewsForm() {
        var modal = document.getElementById('newsModal');
        var form = document.getElementById('newsForm');

        document.getElementById('addNewsBtn').addEventListener('click', function() {
            newsEditId = null;
            form.reset();
            document.getElementById('newsModalTitle').textContent = '뉴스 작성';
            modal.classList.add('active');
        });

        modal.querySelector('.admin-modal__close').addEventListener('click', function() {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('active');
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var data = {
                title: document.getElementById('newsTitle').value,
                date: document.getElementById('newsDate').value,
                excerpt: document.getElementById('newsExcerpt').value,
                linkUrl: document.getElementById('newsLinkUrl').value,
                imageUrl: document.getElementById('newsImageUrl').value,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            var submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            var promise;
            if (newsEditId) {
                promise = db.collection('news').doc(newsEditId).update(data);
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                promise = db.collection('news').add(data);
            }

            promise.then(function() {
                modal.classList.remove('active');
                form.reset();
            }).catch(function(err) {
                alert('저장 실패: ' + err.message);
            }).finally(function() {
                submitBtn.disabled = false;
            });
        });
    }

    function editNews(id) {
        db.collection('news').doc(id).get().then(function(doc) {
            if (!doc.exists) return;
            var d = doc.data();
            newsEditId = id;
            document.getElementById('newsTitle').value = d.title || '';
            document.getElementById('newsDate').value = d.date || '';
            document.getElementById('newsExcerpt').value = d.excerpt || '';
            document.getElementById('newsLinkUrl').value = d.linkUrl || '';
            document.getElementById('newsImageUrl').value = d.imageUrl || '';
            document.getElementById('newsModalTitle').textContent = '뉴스 수정';
            document.getElementById('newsModal').classList.add('active');
        });
    }

    function deleteNews(id) {
        if (!confirm('이 뉴스를 삭제하시겠습니까?')) return;
        db.collection('news').doc(id).delete().catch(function(err) {
            alert('삭제 실패: ' + err.message);
        });
    }

    // ==========================================
    // CONTACT MANAGEMENT
    // ==========================================
    function loadContacts() {
        var tbody = document.getElementById('contactTableBody');
        tbody.innerHTML = '<tr><td colspan="5" class="admin-loading">불러오는 중...</td></tr>';

        db.collection('contacts').orderBy('createdAt', 'desc').onSnapshot(function(snapshot) {
            var unreadCount = 0;

            if (snapshot.empty) {
                tbody.innerHTML = '';
                document.getElementById('contactEmpty').style.display = 'block';
                document.querySelector('.contact-table-wrap').style.display = 'none';
                updateContactBadge(0);
                return;
            }
            document.getElementById('contactEmpty').style.display = 'none';
            document.querySelector('.contact-table-wrap').style.display = 'block';

            tbody.innerHTML = '';
            snapshot.forEach(function(doc) {
                var d = doc.data();
                if (!d.isRead) unreadCount++;

                var dateStr = '';
                if (d.createdAt && d.createdAt.toDate) {
                    var dt = d.createdAt.toDate();
                    dateStr = dt.getFullYear() + '.' +
                        String(dt.getMonth() + 1).padStart(2, '0') + '.' +
                        String(dt.getDate()).padStart(2, '0');
                }

                var statusClass = d.isRead ? 'status-badge--read' : 'status-badge--unread';
                var statusText = d.isRead ? '읽음' : '새 문의';

                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
                    '<td>' + escapeHtml(d.name || '') + '</td>' +
                    '<td class="hide-mobile">' + escapeHtml(d.solution || '') + '</td>' +
                    '<td class="hide-mobile">' + dateStr + '</td>' +
                    '<td>' +
                        '<div class="admin-table__actions">' +
                            '<button class="btn btn-sm btn-secondary" data-view-contact="' + doc.id + '">상세</button>' +
                            '<button class="btn btn-sm btn-danger" data-delete-contact="' + doc.id + '">삭제</button>' +
                        '</div>' +
                    '</td>';
                tbody.appendChild(tr);
            });

            updateContactBadge(unreadCount);

            tbody.querySelectorAll('[data-view-contact]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    viewContact(this.dataset.viewContact);
                });
            });
            tbody.querySelectorAll('[data-delete-contact]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    deleteContact(this.dataset.deleteContact);
                });
            });
        });
    }

    function updateContactBadge(count) {
        var badge = document.getElementById('contactBadge');
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }

    function viewContact(id) {
        db.collection('contacts').doc(id).get().then(function(doc) {
            if (!doc.exists) return;
            var d = doc.data();

            if (!d.isRead) {
                db.collection('contacts').doc(id).update({ isRead: true });
            }

            var dateStr = '';
            if (d.createdAt && d.createdAt.toDate) {
                var dt = d.createdAt.toDate();
                dateStr = dt.getFullYear() + '.' +
                    String(dt.getMonth() + 1).padStart(2, '0') + '.' +
                    String(dt.getDate()).padStart(2, '0') + ' ' +
                    String(dt.getHours()).padStart(2, '0') + ':' +
                    String(dt.getMinutes()).padStart(2, '0');
            }

            var detail = document.getElementById('contactDetail');
            detail.innerHTML =
                '<div class="admin-detail__row"><div class="admin-detail__label">이름</div><div class="admin-detail__value">' + escapeHtml(d.name || '') + '</div></div>' +
                '<div class="admin-detail__row"><div class="admin-detail__label">이메일</div><div class="admin-detail__value">' + escapeHtml(d.email || '') + '</div></div>' +
                '<div class="admin-detail__row"><div class="admin-detail__label">연락처</div><div class="admin-detail__value">' + escapeHtml(d.phone || '') + '</div></div>' +
                '<div class="admin-detail__row"><div class="admin-detail__label">관심 솔루션</div><div class="admin-detail__value">' + escapeHtml(d.solution || '') + '</div></div>' +
                '<div class="admin-detail__row"><div class="admin-detail__label">접수일</div><div class="admin-detail__value">' + dateStr + '</div></div>' +
                '<div class="admin-detail__row"><div class="admin-detail__label">문의 내용</div><div class="admin-detail__value">' + escapeHtml(d.message || '').replace(/\n/g, '<br>') + '</div></div>';

            var modal = document.getElementById('contactModal');
            modal.classList.add('active');
        });
    }

    (function() {
        var modal = document.getElementById('contactModal');
        modal.querySelector('.admin-modal__close').addEventListener('click', function() {
            modal.classList.remove('active');
        });
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('active');
        });
    })();

    function deleteContact(id) {
        if (!confirm('이 문의를 삭제하시겠습니까?')) return;
        db.collection('contacts').doc(id).delete().catch(function(err) {
            alert('삭제 실패: ' + err.message);
        });
    }

    // ==========================================
    // POPUP MANAGEMENT
    // ==========================================
    var popupEditId = null;

    function loadPopups() {
        var tbody = document.getElementById('popupTableBody');
        tbody.innerHTML = '<tr><td colspan="5" class="admin-loading">불러오는 중...</td></tr>';

        db.collection('popups').orderBy('createdAt', 'desc').onSnapshot(function(snapshot) {
            if (snapshot.empty) {
                tbody.innerHTML = '';
                document.getElementById('popupEmpty').style.display = 'block';
                document.querySelector('.popup-table-wrap').style.display = 'none';
                return;
            }
            document.getElementById('popupEmpty').style.display = 'none';
            document.querySelector('.popup-table-wrap').style.display = 'block';

            tbody.innerHTML = '';
            snapshot.forEach(function(doc) {
                var d = doc.data();
                var isActive = d.isActive !== false;
                var statusClass = isActive ? 'status-badge--active' : 'status-badge--inactive';
                var statusText = isActive ? '활성' : '비활성';

                var period = '';
                if (d.startDate || d.endDate) {
                    period = (d.startDate || '') + ' ~ ' + (d.endDate || '');
                }

                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
                    '<td>' + escapeHtml(d.title || '') + '</td>' +
                    '<td class="hide-mobile">' + period + '</td>' +
                    '<td>' +
                        '<div class="admin-table__actions">' +
                            '<button class="btn btn-sm btn-secondary" data-edit-popup="' + doc.id + '">수정</button>' +
                            '<button class="btn btn-sm btn-danger" data-delete-popup="' + doc.id + '">삭제</button>' +
                        '</div>' +
                    '</td>';
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('[data-edit-popup]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    editPopup(this.dataset.editPopup);
                });
            });
            tbody.querySelectorAll('[data-delete-popup]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    deletePopup(this.dataset.deletePopup);
                });
            });
        });
    }

    function setupPopupForm() {
        var modal = document.getElementById('popupModal');
        var form = document.getElementById('popupForm');

        document.getElementById('addPopupBtn').addEventListener('click', function() {
            popupEditId = null;
            form.reset();
            document.getElementById('popupModalTitle').textContent = '팝업 생성';
            modal.classList.add('active');
        });

        modal.querySelector('.admin-modal__close').addEventListener('click', function() {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('active');
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var data = {
                title: document.getElementById('popupTitle').value,
                body: document.getElementById('popupBody').value,
                imageUrl: document.getElementById('popupImageUrl').value,
                linkUrl: document.getElementById('popupLinkUrl').value,
                startDate: document.getElementById('popupStartDate').value,
                endDate: document.getElementById('popupEndDate').value,
                isActive: document.getElementById('popupIsActive').checked,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            var submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            var promise;
            if (popupEditId) {
                promise = db.collection('popups').doc(popupEditId).update(data);
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                promise = db.collection('popups').add(data);
            }

            promise.then(function() {
                modal.classList.remove('active');
                form.reset();
            }).catch(function(err) {
                alert('저장 실패: ' + err.message);
            }).finally(function() {
                submitBtn.disabled = false;
            });
        });
    }

    function editPopup(id) {
        db.collection('popups').doc(id).get().then(function(doc) {
            if (!doc.exists) return;
            var d = doc.data();
            popupEditId = id;
            document.getElementById('popupTitle').value = d.title || '';
            document.getElementById('popupBody').value = d.body || '';
            document.getElementById('popupImageUrl').value = d.imageUrl || '';
            document.getElementById('popupLinkUrl').value = d.linkUrl || '';
            document.getElementById('popupStartDate').value = d.startDate || '';
            document.getElementById('popupEndDate').value = d.endDate || '';
            document.getElementById('popupIsActive').checked = d.isActive !== false;
            document.getElementById('popupModalTitle').textContent = '팝업 수정';
            document.getElementById('popupModal').classList.add('active');
        });
    }

    function deletePopup(id) {
        if (!confirm('이 팝업을 삭제하시겠습니까?')) return;
        db.collection('popups').doc(id).delete().catch(function(err) {
            alert('삭제 실패: ' + err.message);
        });
    }

    // ==========================================
    // DENSITY MANAGEMENT
    // ==========================================
    var DENSITY_MAP = {
        'SoilAroma-G': 'densitySoilAroma',
        'EcoRide-G': 'densityEcoRide',
        'TechLane-G': 'densityTechLane',
        'EcoField-G': 'densityEcoField',
        'GaiaCure-G': 'densityGaiaCure'
    };

    function loadDensity() {
        db.collection('settings').doc('solutionDensity').get()
            .then(function(doc) {
                if (!doc.exists) return;
                var d = doc.data();
                Object.keys(DENSITY_MAP).forEach(function(key) {
                    var inputId = DENSITY_MAP[key];
                    var el = document.getElementById(inputId);
                    if (el && d[key] !== undefined) {
                        el.value = parseFloat(d[key]).toFixed(2);
                    }
                });
            })
            .catch(function() {});
    }

    function setupDensityForm() {
        document.getElementById('saveDensityBtn').addEventListener('click', function() {
            var data = {};
            Object.keys(DENSITY_MAP).forEach(function(key) {
                var el = document.getElementById(DENSITY_MAP[key]);
                data[key] = parseFloat(el.value) || 1.60;
            });

            var btn = this;
            btn.disabled = true;
            btn.textContent = '저장 중...';

            db.collection('settings').doc('solutionDensity').set(data)
                .then(function() {
                    alert('무게비중이 저장되었습니다.');
                })
                .catch(function(err) {
                    alert('저장 실패: ' + err.message);
                })
                .finally(function() {
                    btn.disabled = false;
                    btn.textContent = '저장';
                });
        });
    }

    // ==========================================
    // PROJECT MANAGEMENT
    // ==========================================
    var projectEditId = null;

    function loadProjects() {
        var tbody = document.getElementById('projectTableBody');
        tbody.innerHTML = '<tr><td colspan="4" class="admin-loading">불러오는 중...</td></tr>';

        db.collection('projects').orderBy('order', 'asc').onSnapshot(function(snapshot) {
            if (snapshot.empty) {
                tbody.innerHTML = '';
                document.getElementById('projectEmpty').style.display = 'block';
                document.querySelector('.project-table-wrap').style.display = 'none';
                return;
            }
            document.getElementById('projectEmpty').style.display = 'none';
            document.querySelector('.project-table-wrap').style.display = 'block';

            tbody.innerHTML = '';
            snapshot.forEach(function(doc) {
                var d = doc.data();
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + escapeHtml(d.title || '') + '</td>' +
                    '<td>' + escapeHtml(d.solution || '') + '</td>' +
                    '<td class="hide-mobile">' + escapeHtml(d.location || '') + '</td>' +
                    '<td>' +
                        '<div class="admin-table__actions">' +
                            '<button class="btn btn-sm btn-secondary" data-edit-project="' + doc.id + '">수정</button>' +
                            '<button class="btn btn-sm btn-danger" data-delete-project="' + doc.id + '">삭제</button>' +
                        '</div>' +
                    '</td>';
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('[data-edit-project]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    editProject(this.dataset.editProject);
                });
            });
            tbody.querySelectorAll('[data-delete-project]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    deleteProject(this.dataset.deleteProject);
                });
            });
        });
    }

    function setupProjectForm() {
        var modal = document.getElementById('projectModal');
        var form = document.getElementById('projectForm');

        document.getElementById('addProjectBtn').addEventListener('click', function() {
            projectEditId = null;
            form.reset();
            document.getElementById('projectModalTitle').textContent = '시공 사례 추가';
            modal.classList.add('active');
        });

        setupModalClose(modal);

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var solution = document.getElementById('projectSolution').value;
            var categoryMap = {
                'SoilAroma-G': 'soilaroma',
                'EcoRide-G': 'ecoride',
                'TechLane-G': 'techlane',
                'EcoField-G': 'ecofield',
                'GaiaCure-G': 'gaiacure'
            };

            var data = {
                title: document.getElementById('projectTitle').value,
                location: document.getElementById('projectLocation').value,
                solution: solution,
                category: categoryMap[solution] || 'soilaroma',
                client: document.getElementById('projectClient').value,
                result: document.getElementById('projectResult').value,
                imageUrl: document.getElementById('projectImageUrl').value,
                order: parseInt(document.getElementById('projectOrder').value) || 0,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            var submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            var promise;
            if (projectEditId) {
                promise = db.collection('projects').doc(projectEditId).update(data);
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                promise = db.collection('projects').add(data);
            }

            promise.then(function() {
                modal.classList.remove('active');
                form.reset();
            }).catch(function(err) {
                alert('저장 실패: ' + err.message);
            }).finally(function() {
                submitBtn.disabled = false;
            });
        });
    }

    function editProject(id) {
        db.collection('projects').doc(id).get().then(function(doc) {
            if (!doc.exists) return;
            var d = doc.data();
            projectEditId = id;
            document.getElementById('projectTitle').value = d.title || '';
            document.getElementById('projectLocation').value = d.location || '';
            document.getElementById('projectSolution').value = d.solution || 'SoilAroma-G';
            document.getElementById('projectClient').value = d.client || '';
            document.getElementById('projectResult').value = d.result || '';
            document.getElementById('projectImageUrl').value = d.imageUrl || '';
            document.getElementById('projectOrder').value = d.order || 0;
            document.getElementById('projectModalTitle').textContent = '시공 사례 수정';
            document.getElementById('projectModal').classList.add('active');
        });
    }

    function deleteProject(id) {
        if (!confirm('이 시공 사례를 삭제하시겠습니까?')) return;
        db.collection('projects').doc(id).delete().catch(function(err) {
            alert('삭제 실패: ' + err.message);
        });
    }

    // ==========================================
    // CERTIFICATE MANAGEMENT
    // ==========================================
    var certEditId = null;

    function loadCerts() {
        var tbody = document.getElementById('certTableBody');
        tbody.innerHTML = '<tr><td colspan="4" class="admin-loading">불러오는 중...</td></tr>';

        db.collection('certificates').orderBy('order', 'asc').onSnapshot(function(snapshot) {
            if (snapshot.empty) {
                tbody.innerHTML = '';
                document.getElementById('certEmpty').style.display = 'block';
                document.querySelector('.cert-table-wrap').style.display = 'none';
                return;
            }
            document.getElementById('certEmpty').style.display = 'none';
            document.querySelector('.cert-table-wrap').style.display = 'block';

            tbody.innerHTML = '';
            snapshot.forEach(function(doc) {
                var d = doc.data();
                var tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + escapeHtml(d.title || '') + '</td>' +
                    '<td>' + escapeHtml(d.institute || '') + '</td>' +
                    '<td class="hide-mobile">' + escapeHtml(d.date || '') + '</td>' +
                    '<td>' +
                        '<div class="admin-table__actions">' +
                            '<button class="btn btn-sm btn-secondary" data-edit-cert="' + doc.id + '">수정</button>' +
                            '<button class="btn btn-sm btn-danger" data-delete-cert="' + doc.id + '">삭제</button>' +
                        '</div>' +
                    '</td>';
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('[data-edit-cert]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    editCert(this.dataset.editCert);
                });
            });
            tbody.querySelectorAll('[data-delete-cert]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    deleteCert(this.dataset.deleteCert);
                });
            });
        });
    }

    function setupCertForm() {
        var modal = document.getElementById('certModal');
        var form = document.getElementById('certForm');

        document.getElementById('addCertBtn').addEventListener('click', function() {
            certEditId = null;
            form.reset();
            document.getElementById('certModalTitle').textContent = '성적서 추가';
            modal.classList.add('active');
        });

        setupModalClose(modal);

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var dateInput = document.getElementById('certDate').value;
            var dateFormatted = '';
            if (dateInput) {
                var parts = dateInput.split('-');
                dateFormatted = parts[0] + '.' + parts[1] + '.' + parts[2];
            }

            var data = {
                title: document.getElementById('certTitle').value,
                tag: document.getElementById('certTag').value,
                institute: document.getElementById('certInstitute').value,
                date: dateFormatted,
                dateRaw: dateInput,
                desc: document.getElementById('certDesc').value,
                imageUrl: document.getElementById('certImageUrl').value,
                order: parseInt(document.getElementById('certOrder').value) || 0,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            var submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            var promise;
            if (certEditId) {
                promise = db.collection('certificates').doc(certEditId).update(data);
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                promise = db.collection('certificates').add(data);
            }

            promise.then(function() {
                modal.classList.remove('active');
                form.reset();
            }).catch(function(err) {
                alert('저장 실패: ' + err.message);
            }).finally(function() {
                submitBtn.disabled = false;
            });
        });
    }

    function editCert(id) {
        db.collection('certificates').doc(id).get().then(function(doc) {
            if (!doc.exists) return;
            var d = doc.data();
            certEditId = id;
            document.getElementById('certTitle').value = d.title || '';
            document.getElementById('certTag').value = d.tag || '';
            document.getElementById('certInstitute').value = d.institute || '';
            document.getElementById('certDate').value = d.dateRaw || '';
            document.getElementById('certDesc').value = d.desc || '';
            document.getElementById('certImageUrl').value = d.imageUrl || '';
            document.getElementById('certOrder').value = d.order || 0;
            document.getElementById('certModalTitle').textContent = '성적서 수정';
            document.getElementById('certModal').classList.add('active');
        });
    }

    function deleteCert(id) {
        if (!confirm('이 성적서를 삭제하시겠습니까?')) return;
        db.collection('certificates').doc(id).delete().catch(function(err) {
            alert('삭제 실패: ' + err.message);
        });
    }

    // ========== SHARED HELPERS ==========
    function setupModalClose(modal) {
        modal.querySelectorAll('.admin-modal__close').forEach(function(btn) {
            btn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        });
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function truncate(str, len) {
        if (!str) return '';
        str = escapeHtml(str);
        return str.length > len ? str.substring(0, len) + '...' : str;
    }

})();
