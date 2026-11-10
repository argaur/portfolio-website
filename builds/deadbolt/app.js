// Theme toggle and build tag. The page reads fine without this file.
(function () {
  'use strict';
  var root = document.documentElement;
  var btn = document.getElementById('theme');

  function current() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function label() {
    var next = current() === 'dark' ? 'light' : 'dark';
    btn.textContent = next === 'dark' ? 'Dark' : 'Light';
    btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
  if (btn) {
    label();
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('deadbolt-theme', next); } catch (e) { /* storage blocked: theme lasts this visit only */ }
      label();
    });
  }

  window.addEventListener('load', function () {
    if (window.posthog) window.posthog.register({ build: 'deadbolt' });
  });
})();
