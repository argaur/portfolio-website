/* Mobile section-nav hint for case-study and project pages.
   Under 580px the nav links scroll sideways. This fades whichever edge has more links
   off-screen, so a clipped label reads as "scroll for more", and keeps the section the
   scrollspy marks active in view. Also holds the touch-target rules every one of these
   pages shares, so they live in one place. */
(function () {
  'use strict';
  var nav = document.querySelector('nav .nav-right');
  if (!nav) return;
  var css = document.createElement('style');
  css.textContent = '@media (max-width: 580px){' +
    'nav .nav-right.more-right{-webkit-mask-image:linear-gradient(to right,#000 72%,transparent);mask-image:linear-gradient(to right,#000 72%,transparent);}' +
    'nav .nav-right.more-left{-webkit-mask-image:linear-gradient(to left,#000 72%,transparent);mask-image:linear-gradient(to left,#000 72%,transparent);}' +
    'nav .nav-right.more-left.more-right{-webkit-mask-image:linear-gradient(to right,transparent,#000 18%,#000 72%,transparent);mask-image:linear-gradient(to right,transparent,#000 18%,#000 72%,transparent);}}' +
    /* Touch targets: short labels ("AI", "Eval") and standalone links reach 44px on a phone. */
    '@media (max-width: 767px){nav .nav-link{min-width:44px;text-align:center;}' +
    '.meta-row .lnk,.hero-links .lnk,.hero-gh,.link-btn{display:inline-flex;align-items:center;min-height:44px;}}';
  document.head.appendChild(css);
  function update() {
    nav.classList.toggle('more-right', nav.scrollWidth - nav.clientWidth - nav.scrollLeft > 4);
    nav.classList.toggle('more-left', nav.scrollLeft > 4);
  }
  nav.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // Follow the scrollspy: bring the active link into the strip when it changes.
  if (window.MutationObserver) {
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        var el = r.target;
        if (el.classList && el.classList.contains('nav-link--active') && nav.scrollWidth > nav.clientWidth) {
          var left = el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2;
          nav.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
        }
      });
    }).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }
  update();
})();
