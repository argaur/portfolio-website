/* Mobile section-nav hint for case-study and project pages.
   Under 580px the nav links scroll sideways. This fades the right edge while more
   links are off-screen, so a clipped label reads as "scroll for more". */
(function () {
  'use strict';
  var nav = document.querySelector('nav .nav-right');
  if (!nav) return;
  var css = document.createElement('style');
  css.textContent = '@media (max-width: 580px){nav .nav-right.has-more{' +
    '-webkit-mask-image:linear-gradient(to right,#000 80%,transparent);' +
    'mask-image:linear-gradient(to right,#000 80%,transparent);}}';
  document.head.appendChild(css);
  function update() {
    nav.classList.toggle('has-more', nav.scrollWidth - nav.clientWidth - nav.scrollLeft > 4);
  }
  nav.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
