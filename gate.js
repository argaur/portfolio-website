(function () {
    'use strict';

    var STORAGE_KEY = 'portfolio_gate_passed';
    var SUPABASE_URL = 'https://nvwjekhguijinfuylytl.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52d2pla2hndWlqaW5mdXlseXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDAxOTksImV4cCI6MjA4OTY3NjE5OX0.N8qpVCRECnk3NFFdvrLZyL8A8be2HR7j3Esj-0djOEk';

    var gate = document.getElementById('gate');
    var form = document.getElementById('gate-form');
    var emailInput = document.getElementById('gate-email');
    var errorEl = document.getElementById('gate-error');
    var btn = document.getElementById('gate-btn');

    // Returning visitor — skip the gate
    if (localStorage.getItem(STORAGE_KEY)) {
        gate.remove();
        return;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearError() {
        emailInput.classList.remove('gate-input-error');
    }

    function showError(msg) {
        errorEl.textContent = msg || 'Please enter a valid email';
        emailInput.classList.add('gate-input-error');
    }

    function dismissGate() {
        localStorage.setItem(STORAGE_KEY, '1');

        // Show welcome message
        var content = document.querySelector('.gate-content');
        content.innerHTML =
            '<div class="gate-welcome">' +
                '<h2>Welcome!</h2>' +
                '<p>Loading your experience...</p>' +
            '</div>';

        // Fade out the gate after a brief pause
        setTimeout(function () {
            gate.classList.add('gate-hidden');
        }, 800);

        // Remove from DOM after transition
        gate.addEventListener('transitionend', function () {
            gate.remove();
        });
    }

    async function saveEmail(email) {
        try {
            var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            await supabase.from('subscribers').insert({ email: email });
        } catch (e) {
            // Supabase unreachable — let visitor through anyway
        }
    }

    emailInput.addEventListener('input', clearError);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var email = emailInput.value.trim();

        if (!email || !isValidEmail(email)) {
            showError();
            return;
        }

        btn.disabled = true;
        btn.textContent = 'One moment...';

        // Fire-and-forget: save email, then dismiss regardless of outcome
        saveEmail(email).finally(function () {
            dismissGate();
        });
    });
})();
