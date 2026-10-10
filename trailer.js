/* Trailer section for case-study and project pages.
   The section stays hidden until a page gives it a video:
     data-src="assets/trailers/<slug>.mp4"   (optional: data-poster, data-captions)
     data-embed="https://www.youtube-nocookie.com/embed/..."  (YouTube, Vimeo, Loom, Drive)
   Add ?trailer=preview to any page URL to see the empty frame.
   No autoplay. No analytics events. The frame reads colors and radius from the page,
   so each page keeps its own skin. */
(function () {
  'use strict';
  var sec = document.getElementById('showcase');
  if (!sec) return;
  var src = sec.getAttribute('data-src') || '';
  var embed = sec.getAttribute('data-embed') || '';
  var poster = sec.getAttribute('data-poster') || '';
  var captions = sec.getAttribute('data-captions') || '';
  var title = sec.getAttribute('data-title') || 'Trailer';
  var preview = /[?&]trailer=preview(&|$)/.test(location.search);
  var EMBED_HOSTS = ['www.youtube-nocookie.com', 'www.youtube.com', 'player.vimeo.com', 'www.loom.com', 'drive.google.com'];
  function okEmbed(u) {
    try { var x = new URL(u); return x.protocol === 'https:' && EMBED_HOSTS.indexOf(x.hostname) > -1; } catch (e) { return false; }
  }
  if (!src && !(embed && okEmbed(embed)) && !preview) return;
  function css(sel, prop) {
    var el = document.querySelector(sel);
    return el ? getComputedStyle(el)[prop] : '';
  }
  function solid(c) { return c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)' ? c : ''; }

  var bodyCS = getComputedStyle(document.body);
  var ink = bodyCS.color;
  var paper = solid(bodyCS.backgroundColor) || '#fff';
  var edge = solid(css('.stat', 'borderTopColor')) || solid(css('.card', 'borderTopColor')) || solid(css('.callout', 'borderTopColor')) || ink;
  var surface = solid(css('.callout', 'backgroundColor')) || solid(css('.card', 'backgroundColor')) || paper;
  var accent = solid(css('.lnk', 'color')) || solid(css('.label-strong', 'color')) || ink;
  var radius = css('.card', 'borderRadius') || '0px';

  var frame = sec.querySelector('.trailer-frame');
  if (!frame) return;
  frame.style.cssText = 'position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;display:flex;align-items:center;justify-content:center;' +
    'background:' + surface + ';border:1px solid ' + edge + ';border-radius:' + radius + ';color:' + ink + ';';

  if (src) {
    var v = document.createElement('video');
    v.controls = true; v.preload = 'metadata'; v.setAttribute('playsinline', '');
    if (poster) v.poster = poster;
    v.setAttribute('aria-label', title);
    v.style.cssText = 'width:100%;height:100%;background:#000;object-fit:contain;display:block;';
    var s = document.createElement('source');
    s.src = src; s.type = /\.webm$/i.test(src) ? 'video/webm' : 'video/mp4';
    v.appendChild(s);
    if (captions) {
      var t = document.createElement('track');
      t.kind = 'captions'; t.src = captions; t.srclang = 'en'; t.label = 'English'; t.default = true;
      v.appendChild(t);
    }
    frame.appendChild(v);
  } else if (embed && okEmbed(embed)) {
    var f = document.createElement('iframe');
    f.src = embed; f.title = title; f.loading = 'lazy'; f.allowFullscreen = true;
    f.setAttribute('allow', 'fullscreen; picture-in-picture');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
    f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
    frame.appendChild(f);
  } else {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'text-align:center;padding:24px;';
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '56'); svg.setAttribute('height', '56'); svg.setAttribute('viewBox', '0 0 56 56');
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', accent); svg.setAttribute('stroke-width', '2');
    svg.setAttribute('aria-hidden', 'true');
    var box = document.createElementNS(NS, 'rect');
    ['x', 'y'].forEach(function (k) { box.setAttribute(k, '1'); });
    box.setAttribute('width', '54'); box.setAttribute('height', '54');
    var tri = document.createElementNS(NS, 'path');
    tri.setAttribute('d', 'M22 17 L40 28 L22 39 Z');
    svg.appendChild(box); svg.appendChild(tri);
    var msg = document.createElement('p');
    msg.style.cssText = 'margin:16px 0 0;font-size:15px;opacity:.75;';
    msg.textContent = 'Trailer preview. The 60-second video will play here.';
    wrap.appendChild(svg); wrap.appendChild(msg);
    frame.appendChild(wrap);
    frame.setAttribute('role', 'img');
    frame.setAttribute('aria-label', 'Trailer preview frame');
  }

  var note = sec.querySelector('.trailer-note');
  if (note) note.style.cssText = 'margin:16px 0 0;font-size:15px;line-height:1.55;opacity:.78;max-width:60ch;';

  sec.style.display = '';
  sec.style.scrollMarginTop = '80px';
  var navRight = document.querySelector('nav .nav-right');
  var first = navRight && navRight.querySelector('.nav-link');
  if (navRight && first) {
    var a = document.createElement('a');
    a.href = '#showcase'; a.className = first.className.replace(/\bnav-link--active\b/, '').trim(); a.textContent = 'Trailer';
    navRight.insertBefore(a, first);
  }
})();
