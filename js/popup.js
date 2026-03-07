// ==========================================
// SMGM Frontend Popup - Firestore 기반
// ==========================================

(function() {
    'use strict';

    if (typeof firebase === 'undefined' || !firebase.firestore) return;

    var db = firebase.firestore();

    function getTodayStr() {
        var d = new Date();
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    }

    function isInDateRange(popup) {
        var today = getTodayStr();
        if (popup.startDate && today < popup.startDate) return false;
        if (popup.endDate && today > popup.endDate) return false;
        return true;
    }

    function isDismissedToday(popupId) {
        try {
            return localStorage.getItem('smgm_popup_' + popupId) === getTodayStr();
        } catch (e) { return false; }
    }

    function dismissToday(popupId) {
        try { localStorage.setItem('smgm_popup_' + popupId, getTodayStr()); }
        catch (e) {}
    }

    function injectStyles() {
        if (document.getElementById('smgm-popup-styles')) return;
        var s = document.createElement('style');
        s.id = 'smgm-popup-styles';
        s.textContent =
            '.site-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;animation:spFadeIn .3s ease}' +
            '@keyframes spFadeIn{from{opacity:0}to{opacity:1}}' +
            '.site-popup-box{background:#fff;border-radius:16px;max-width:480px;width:100%;max-height:85vh;overflow-y:auto;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:spSlideUp .3s ease}' +
            '@keyframes spSlideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}' +
            '.site-popup-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border:none;background:rgba(0,0,0,.06);border-radius:50%;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#666;z-index:1;transition:background .2s}' +
            '.site-popup-close:hover{background:rgba(0,0,0,.12)}' +
            '.site-popup-img{width:100%;display:block;border-radius:16px 16px 0 0}' +
            '.site-popup-title{font-size:18px;font-weight:700;padding:20px 24px 0;color:#1a1a1a}' +
            '.site-popup-body{font-size:14px;line-height:1.7;padding:12px 24px 20px;color:#444}' +
            '.site-popup-footer{padding:0 24px 16px;display:flex;justify-content:center}' +
            '.site-popup-dismiss{background:none;border:none;color:#999;font-size:13px;cursor:pointer;padding:8px 16px;font-family:inherit;transition:color .2s}' +
            '.site-popup-dismiss:hover{color:#555}';
        document.head.appendChild(s);
    }

    function createPopup(id, data) {
        var overlay = document.createElement('div');
        overlay.className = 'site-popup-overlay';

        var box = document.createElement('div');
        box.className = 'site-popup-box';

        // Close button
        var closeBtn = document.createElement('button');
        closeBtn.className = 'site-popup-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() { overlay.remove(); });
        box.appendChild(closeBtn);

        // Wrapper for clickable content
        var wrap = document.createElement('div');

        if (data.imageUrl) {
            var img = document.createElement('img');
            img.className = 'site-popup-img';
            img.src = data.imageUrl;
            img.alt = data.title || '';
            wrap.appendChild(img);
        }

        if (data.title) {
            var t = document.createElement('h3');
            t.className = 'site-popup-title';
            t.textContent = data.title;
            wrap.appendChild(t);
        }

        if (data.body) {
            var b = document.createElement('div');
            b.className = 'site-popup-body';
            b.innerHTML = data.body;
            wrap.appendChild(b);
        }

        if (data.linkUrl) {
            wrap.style.cursor = 'pointer';
            wrap.addEventListener('click', function() {
                window.open(data.linkUrl, '_blank');
            });
        }

        box.appendChild(wrap);

        // Footer
        var footer = document.createElement('div');
        footer.className = 'site-popup-footer';
        var dismissBtn = document.createElement('button');
        dismissBtn.className = 'site-popup-dismiss';
        dismissBtn.textContent = '오늘 하루 보지 않기';
        dismissBtn.addEventListener('click', function() {
            dismissToday(id);
            overlay.remove();
        });
        footer.appendChild(dismissBtn);
        box.appendChild(footer);

        overlay.appendChild(box);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.remove();
        });

        return overlay;
    }

    // Load active popups from Firestore
    db.collection('popups').where('isActive', '==', true).get()
        .then(function(snapshot) {
            if (snapshot.empty) return;

            var toShow = [];
            snapshot.forEach(function(doc) {
                var d = doc.data();
                if (isInDateRange(d) && !isDismissedToday(doc.id)) {
                    toShow.push({ id: doc.id, data: d });
                }
            });

            if (!toShow.length) return;

            injectStyles();
            toShow.forEach(function(p) {
                document.body.appendChild(createPopup(p.id, p.data));
            });
        })
        .catch(function(err) {
            console.warn('[SMGM Popup] 로드 실패:', err.code || err.message || err);
        });
})();
