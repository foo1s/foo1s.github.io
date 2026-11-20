(function () {
    document.querySelectorAll('.moment-comment-toggle').forEach(function (button) {
        button.addEventListener('click', function () {
            var panel = document.getElementById(button.getAttribute('aria-controls'));
            var opening = panel.hidden;
            panel.hidden = !opening;
            button.setAttribute('aria-expanded', String(opening));
            if (opening && !panel.querySelector('iframe')) {
                var frame = document.createElement('iframe');
                frame.title = '这条动态的评论';
                frame.src = panel.getAttribute('data-url');
                panel.appendChild(frame);
            }
        });
    });
})();
