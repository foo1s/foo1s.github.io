/* Client for soxft/busuanzi; API used by the provider's official script. */
(function () {
    'use strict';
    var script = document.currentScript;
    var site = script && script.getAttribute('data-site');
    var fields = ['site_pv', 'site_uv', 'page_pv'];
    var identityKey = 'bsz-id';

    function display(data, error) {
        fields.forEach(function (field) {
            var el = document.getElementById('busuanzi_value_' + field);
            if (!el) return;
            if (data && typeof data[field] === 'number' && isFinite(data[field])) {
                el.textContent = String(data[field]);
                el.removeAttribute('title');
            } else {
                el.textContent = '暂不可用';
                el.title = '统计服务请求失败：' + error;
            }
        });
    }

    function start() {
        var preview = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
        var referer = location.origin + location.pathname;
        // Local previews read the production totals without adding visits.
        if (preview && site) referer = new URL(location.pathname, site).href;
        var request = new XMLHttpRequest();
        request.open(preview ? 'GET' : 'POST', 'https://bsz.iirose.cn/api', true);
        request.timeout = 12000;
        request.setRequestHeader('x-bsz-referer', referer);
        // Storage can be denied in embedded/private browsers; still request totals.
        try {
            var identity = localStorage.getItem(identityKey);
            if (identity) request.setRequestHeader('Authorization', 'Bearer ' + identity);
        } catch (e) { /* Continue without a persistent identity. */ }

        function failed(message) {
            display(null, message);
            console.warn('[site-statistics] ' + message);
        }
        request.onload = function () {
            if (request.status !== 200) return failed('HTTP ' + request.status);
            try {
                var result = JSON.parse(request.responseText);
                if (!result.success || !result.data ||
                    !fields.every(function (field) {
                        return typeof result.data[field] === 'number' && isFinite(result.data[field]);
                    })) return failed('返回的数据无效');
                display(result.data);
                var identity = request.getResponseHeader('Set-Bsz-Identity');
                if (identity) {
                    try { localStorage.setItem(identityKey, identity); } catch (e) { /* Optional. */ }
                }
            } catch (e) { failed('无法解析统计数据'); }
        };
        request.onerror = function () { failed('网络连接失败或请求被浏览器拦截'); };
        request.ontimeout = function () { failed('请求超时'); };
        request.send();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
