(function () {
    'use strict';

    var tabs = document.querySelectorAll('.nav-tab');
    var panels = document.querySelectorAll('.panel');
    var validIds = Array.prototype.map.call(panels, function (p) { return p.id; });

    function activate(tabId) {
        // Update tabs
        tabs.forEach(function (t) {
            if (t.getAttribute('data-tab') === tabId) {
                t.classList.add('is-active');
            } else {
                t.classList.remove('is-active');
            }
        });

        // Update panels — remove active, then set new active with fresh animation
        panels.forEach(function (p) {
            if (p.id === tabId) {
                p.classList.add('is-active');
                // Re-trigger fade animation
                p.style.animation = 'none';
                p.offsetHeight; // force reflow
                p.style.animation = '';
            } else {
                p.classList.remove('is-active');
            }
        });

        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Tab clicks
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            var id = tab.getAttribute('data-tab');
            activate(id);
            history.pushState(null, '', '#' + id);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', function () {
        var hash = location.hash.replace('#', '');
        if (validIds.indexOf(hash) !== -1) {
            activate(hash);
        } else {
            activate('home');
        }
    });

    // On load, read hash
    var initial = location.hash.replace('#', '');
    if (validIds.indexOf(initial) !== -1) {
        activate(initial);
    }
})();
