// ==========================================
// SMGM Popup System
// Firestore에서 활성 팝업을 로드하여 표시
// ==========================================

(function() {
    'use strict';

    // Firebase가 로드되지 않았으면 종료
    if (typeof firebase === 'undefined' || !firebase.firestore) return;

    var db = firebase.firestore();

    document.addEventListener('DOMContentLoaded', function() {
        loadPopups();
    });

    function loadPopups() {
        db.collection('popups')
            .where('isActive', '==', true)
            .get()
            .then(function(snapshot) {
                if (snapshot.empty) return;

                var today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

                snapshot.forEach(function(doc) {
                    var popup = doc.data();
                    popup.id = doc.id;

                    // 기간 체크
                    if (popup.startDate && today < popup.startDate) return;
                    if (popup.endDate && today > popup.endDate) return;

                    // "오늘 하루 보지 않기" 체크
                    var dismissKey = 'popup_dismiss_' + doc.id;
                    var dismissDate = localStorage.getItem(dismissKey);
                    if (dismissDate === today) return;

                    showPopup(popup);
                });
            })
            .catch(function(err) {
                console.warn('팝업 로드 실패:', err);
            });
    }

    function showPopup(popup) {
        // 오버레이 생성
        var overlay = document.createElement('div');
        overlay.className = 'site-popup-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', popup.title || '팝업');

        var container = document.createElement('div');
        container.className = 'site-popup';

        // 닫기 버튼
        var closeBtn = document.createElement('button');
        closeBtn.className = 'site-popup__close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', '팝업 닫기');
        container.appendChild(closeBtn);

        // 이미지
        if (popup.imageUrl) {
            var img = document.createElement('img');
            img.className = 'site-popup__image';
            img.src = popup.imageUrl;
            img.alt = popup.title || '';
            if (popup.linkUrl) {
                var link = document.createElement('a');
                link.href = popup.linkUrl;
                link.target = '_blank';
                link.rel = 'noopener';
                link.appendChild(img);
                container.appendChild(link);
            } else {
                container.appendChild(img);
            }
        }

        // 제목
        if (popup.title) {
            var title = document.createElement('h3');
            title.className = 'site-popup__title';
            title.textContent = popup.title;
            container.appendChild(title);
        }

        // 본문
        if (popup.body) {
            var body = document.createElement('div');
            body.className = 'site-popup__body';
            body.innerHTML = popup.body;
            container.appendChild(body);
        }

        // 링크 버튼 (이미지가 없을 때)
        if (popup.linkUrl && !popup.imageUrl) {
            var linkBtn = document.createElement('a');
            linkBtn.className = 'site-popup__link';
            linkBtn.href = popup.linkUrl;
            linkBtn.target = '_blank';
            linkBtn.rel = 'noopener';
            linkBtn.textContent = '자세히 보기';
            container.appendChild(linkBtn);
        }

        // 하단 버튼 영역
        var footer = document.createElement('div');
        footer.className = 'site-popup__footer';

        var dismissBtn = document.createElement('button');
        dismissBtn.className = 'site-popup__dismiss';
        dismissBtn.textContent = '오늘 하루 보지 않기';

        var closeBtn2 = document.createElement('button');
        closeBtn2.className = 'site-popup__close-btn';
        closeBtn2.textContent = '닫기';

        footer.appendChild(dismissBtn);
        footer.appendChild(closeBtn2);
        container.appendChild(footer);

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // 표시 애니메이션
        requestAnimationFrame(function() {
            overlay.classList.add('active');
        });

        // 이벤트 바인딩
        function close() {
            overlay.classList.remove('active');
            setTimeout(function() {
                overlay.remove();
            }, 300);
        }

        closeBtn.addEventListener('click', close);
        closeBtn2.addEventListener('click', close);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) close();
        });

        dismissBtn.addEventListener('click', function() {
            var today = new Date().toISOString().split('T')[0];
            localStorage.setItem('popup_dismiss_' + popup.id, today);
            close();
        });

        // ESC 키
        function onKeydown(e) {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', onKeydown);
            }
        }
        document.addEventListener('keydown', onKeydown);
    }

    // 인라인 스타일 주입 (별도 CSS 파일 로드 불필요)
    var style = document.createElement('style');
    style.textContent = [
        '.site-popup-overlay {',
        '  position: fixed; inset: 0; background: rgba(0,0,0,0.5);',
        '  z-index: 3000; display: flex; align-items: center; justify-content: center;',
        '  padding: 24px; opacity: 0; transition: opacity 0.3s;',
        '}',
        '.site-popup-overlay.active { opacity: 1; }',
        '.site-popup {',
        '  background: #fff; border-radius: 16px; max-width: 480px; width: 100%;',
        '  max-height: 85vh; overflow-y: auto; position: relative;',
        '  transform: translateY(20px); transition: transform 0.3s;',
        '}',
        '.site-popup-overlay.active .site-popup { transform: translateY(0); }',
        '.site-popup__close {',
        '  position: absolute; top: 12px; right: 12px; width: 32px; height: 32px;',
        '  border: none; background: rgba(0,0,0,0.06); border-radius: 50%;',
        '  font-size: 20px; cursor: pointer; display: flex; align-items: center;',
        '  justify-content: center; color: #666; z-index: 1;',
        '}',
        '.site-popup__close:hover { background: rgba(0,0,0,0.1); }',
        '.site-popup__image {',
        '  width: 100%; display: block; border-radius: 16px 16px 0 0;',
        '}',
        '.site-popup__title {',
        '  font-size: 18px; font-weight: 700; padding: 20px 24px 8px; margin: 0;',
        '}',
        '.site-popup__body {',
        '  font-size: 14px; line-height: 1.7; padding: 0 24px 16px; color: #555;',
        '}',
        '.site-popup__link {',
        '  display: inline-block; margin: 0 24px 16px; padding: 8px 20px;',
        '  background: #E07A5F; color: #fff; border-radius: 8px;',
        '  text-decoration: none; font-size: 14px; font-weight: 600;',
        '}',
        '.site-popup__link:hover { background: #c96a52; }',
        '.site-popup__footer {',
        '  display: flex; justify-content: space-between; align-items: center;',
        '  padding: 12px 24px; border-top: 1px solid #f0f0f0;',
        '}',
        '.site-popup__dismiss {',
        '  border: none; background: none; font-size: 13px; color: #999;',
        '  cursor: pointer; font-family: inherit; padding: 4px 0;',
        '}',
        '.site-popup__dismiss:hover { color: #666; }',
        '.site-popup__close-btn {',
        '  border: none; background: #f5f5f5; padding: 8px 20px;',
        '  border-radius: 6px; font-size: 13px; font-weight: 600;',
        '  cursor: pointer; font-family: inherit; color: #333;',
        '}',
        '.site-popup__close-btn:hover { background: #e8e8e8; }',
        '@media (max-width: 480px) {',
        '  .site-popup { max-width: 100%; border-radius: 12px; }',
        '  .site-popup__image { border-radius: 12px 12px 0 0; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

})();
