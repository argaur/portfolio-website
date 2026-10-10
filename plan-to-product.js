/* Plan to Product: a slow canvas loop that takes an idea to a prototype.
   Home: ambient loop. Contact: move or drag across the frame to scrub.
   Pauses off-screen and in background tabs. Reduced motion shows the final frame. */
(function () {
  'use strict';
  var LOOP = 13, T_DRAW = 3.6, T_MORPH0 = 4.2, T_MORPH1 = 7.0, T_BUILD1 = 11.2, T_FADE = 12.4;
  var W = 100, H = 70, BOX_H = 62;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sp(p, a, d) { return clamp((p - a) / d, 0, 1); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Rooms in the plan and the UI blocks they become. [x, y, w, h]
  var PLAN = [[4,4,92,10],[4,14,30,44],[34,14,32,20],[66,14,30,20],[34,34,62,24]];
  var UI   = [[4,4,92,9],[4,15,22,43],[29,15,32,18],[64,15,32,18],[29,35,67,23]];
  var PLAN_LABEL = ['ENTRY','LIVING','STUDY','BEDROOM','HALL'];
  var UI_LABEL   = ['NAV','MENU','KPI','TASKS','TREND'];
  var CHART = [.12,.2,.17,.3,.28,.42,.4,.55,.5,.68,.74,.9];

  var PALETTE = {
    dark:  { accent: '#c9a84c', border: '#2a2a38', surface: '#16161e', text: '#ece8e2', muted: '#9896a0' },
    light: { accent: '#6e5824', border: '#cfc7b5', surface: '#ebe5d8', text: '#1a1a22', muted: '#5a5668' }
  };
  function colors() { return PALETTE[document.body.classList.contains('theme-light') ? 'light' : 'dark']; }

  function PlanToProduct(canvas, opts) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.mode = opts.mode; this.clock = 0; this.running = false; this.visible = true; this.reduced = false;
    this.pointerIn = false; this.target = 0; this.last = 0; this.raf = 0;
    var self = this;
    this.mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = this.mq.matches;
    this.mq.addEventListener && this.mq.addEventListener('change', function (e) { self.reduced = e.matches; self.render(); self.sync(); });
    this.ro = new ResizeObserver(function () { self.resize(); });
    this.ro.observe(canvas);
    this.io = new IntersectionObserver(function (e) { self.visible = e[0].isIntersecting; self.sync(); }, { threshold: .05 });
    this.io.observe(canvas);
    document.addEventListener('visibilitychange', function () { self.sync(); });
    if (this.mode === 'contact') {
      var move = function (ev) {
        var r = canvas.getBoundingClientRect();
        self.pointerIn = true;
        self.target = clamp((ev.clientX - r.left) / r.width, 0, 1) * T_BUILD1;
        self.sync();
      };
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerdown', move);
      canvas.addEventListener('pointerleave', function () { self.pointerIn = false; });
      canvas.addEventListener('pointercancel', function () { self.pointerIn = false; });
    }
    this.resize();
    this.sync();
  }

  PlanToProduct.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = this.c.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.c.width = Math.max(1, Math.round(r.width * dpr));
    this.c.height = Math.max(1, Math.round(r.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var pad = Math.max(10, this.w * .04);
    this.s = Math.max(0, Math.min((this.w - pad * 2) / W, (this.h - pad * 2) / H));
    this.ox = (this.w - W * this.s) / 2; this.oy = (this.h - H * this.s) / 2;
    this.render();
  };

  PlanToProduct.prototype.sync = function () {
    var should = this.visible && !document.hidden && !this.reduced && true;
    if (should && !this.running) { this.running = true; this.last = performance.now(); var self = this; this.raf = requestAnimationFrame(function f(n) { self.tick(n); }); }
    if (!should && this.running) { this.running = false; cancelAnimationFrame(this.raf); }
    if (!should) this.render();
  };

  PlanToProduct.prototype.tick = function (now) {
    if (!this.running) return;
    var dt = Math.min(.05, (now - this.last) / 1000); this.last = now;
    if (this.mode === 'contact' && this.pointerIn) {
      this.clock += (this.target - this.clock) * Math.min(1, dt * 7);
    } else {
      this.clock += dt;
      if (this.clock > LOOP) this.clock -= LOOP;
    }
    this.render();
    var self = this;
    this.raf = requestAnimationFrame(function (n) { self.tick(n); });
  };

  PlanToProduct.prototype.X = function (u) { return this.ox + u * this.s; };
  PlanToProduct.prototype.Y = function (u) { return this.oy + u * this.s; };

  PlanToProduct.prototype.render = function () {
    if (!(this.s > 1)) return;
    var ctx = this.ctx, col = colors(), s = this.s;
    ctx.clearRect(0, 0, this.w, this.h);
    var t = this.reduced ? T_BUILD1 : this.clock;
    // global alpha: fade in at loop start, out at the end (ambient only)
    var alpha = 1;
    if (!(this.mode === 'contact' && this.pointerIn) && !this.reduced) {
      alpha = Math.min(sp(t, 0, .5), 1 - sp(t, T_FADE, LOOP - T_FADE));
    }
    ctx.globalAlpha = alpha;

    var draw = sp(t, 0, T_DRAW);
    var m = ease(sp(t, T_MORPH0, T_MORPH1 - T_MORPH0));
    var b = sp(t, T_MORPH1, T_BUILD1 - T_MORPH1);
    var lw = Math.max(1, s * .22);
    ctx.lineWidth = lw; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';

    // plan extras fade out as the morph starts
    var planA = 1 - m;
    if (planA > 0.01) this.drawPlanExtras(ctx, col, draw, planA);

    // rooms -> blocks
    var edgeTotal = PLAN.length * 4, drawnEdges = draw * edgeTotal;
    for (var i = 0; i < PLAN.length; i++) {
      var p = PLAN[i], u = UI[i];
      var x = lerp(p[0], u[0], m), y = lerp(p[1], u[1], m), w = lerp(p[2], u[2], m), h = lerp(p[3], u[3], m);
      var px = this.X(x), py = this.Y(y), pw = w * s, ph = h * s;
      if (m > 0.001) { ctx.fillStyle = col.surface; ctx.globalAlpha = alpha * m; ctx.fillRect(px, py, pw, ph); ctx.globalAlpha = alpha; }
      ctx.strokeStyle = col.accent; ctx.globalAlpha = alpha * lerp(1, .6, m);
      var done = clamp(drawnEdges - i * 4, 0, 4);
      this.strokeRectProgress(ctx, px + .5, py + .5, pw, ph, done / 4);
      ctx.globalAlpha = alpha;
      // label
      var fs = clamp(s * 1.7, 8, 12);
      ctx.font = '400 ' + fs + 'px "Space Mono", monospace';
      ctx.textBaseline = 'top';
      var la = sp(draw, .7, .3) * (1 - sp(m, 0, .4));
      if (la > 0.01) { ctx.fillStyle = col.muted; ctx.globalAlpha = alpha * la; ctx.fillText(PLAN_LABEL[i], px + s * 1.2, py + s * 1.2); }
      var ua = sp(m, .6, .4);
      if (ua > 0.01) { ctx.fillStyle = col.muted; ctx.globalAlpha = alpha * ua; ctx.fillText(UI_LABEL[i], px + s * 1.2, py + s * 1.0); }
      ctx.globalAlpha = alpha;
    }

    if (b > 0) this.drawContent(ctx, col, b, alpha);
    this.drawCaption(ctx, col, t, alpha);
    ctx.globalAlpha = 1;
  };

  PlanToProduct.prototype.strokeRectProgress = function (ctx, x, y, w, h, f) {
    if (f <= 0) return;
    var per = 2 * (w + h), len = per * f, pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    var left = len;
    for (var i = 1; i < pts.length && left > 0; i++) {
      var ax = pts[i - 1][0], ay = pts[i - 1][1], bx = pts[i][0], by = pts[i][1];
      var sl = Math.hypot(bx - ax, by - ay), k = Math.min(1, left / sl);
      ctx.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k); left -= sl;
    }
    ctx.stroke();
  };

  PlanToProduct.prototype.drawPlanExtras = function (ctx, col, draw, a) {
    var s = this.s, X = this.X.bind(this), Y = this.Y.bind(this);
    var k = sp(draw, .75, .25) * a;
    if (k <= 0.01) return;
    ctx.save(); ctx.globalAlpha = ctx.globalAlpha * k;
    ctx.strokeStyle = col.muted; ctx.fillStyle = col.muted; ctx.lineWidth = Math.max(1, s * .14);
    // door arcs
    var doors = [[34, 20, 0], [66, 28, 1], [50, 34, 2]];
    doors.forEach(function (d) {
      ctx.beginPath(); ctx.arc(X(d[0]), Y(d[1]), s * 4, d[2] * Math.PI / 2, d[2] * Math.PI / 2 + Math.PI / 2); ctx.stroke();
    });
    // dimension line below the plan
    var yy = Y(61.5);
    ctx.beginPath(); ctx.moveTo(X(4), yy); ctx.lineTo(X(96), yy);
    ctx.moveTo(X(4), yy - s); ctx.lineTo(X(4), yy + s); ctx.moveTo(X(96), yy - s); ctx.lineTo(X(96), yy + s);
    ctx.stroke();
    var fs = clamp(s * 1.5, 8, 11); ctx.font = '400 ' + fs + 'px "Space Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('IDEA  9.2 m', X(50), yy - s * .6); ctx.textAlign = 'left';
    ctx.restore();
  };

  PlanToProduct.prototype.drawContent = function (ctx, col, b, alpha) {
    var s = this.s, X = this.X.bind(this), Y = this.Y.bind(this), u = UI;
    ctx.save();
    // nav: logo square, three links, gold button
    var nav = u[0], a1 = sp(b, 0, .15);
    ctx.globalAlpha = alpha * a1; ctx.fillStyle = col.accent; ctx.fillRect(X(nav[0] + 2.2), Y(nav[1] + 2.8), s * 3.4, s * 3.4);
    ctx.fillStyle = col.border;
    for (var i = 0; i < 3; i++) ctx.fillRect(X(nav[0] + 9 + i * 10), Y(nav[1] + 4), s * 7, s * 1.1);
    var btn = { x: X(nav[0] + nav[2] - 17), y: Y(nav[1] + 2.2), w: s * 14, h: s * 4.6 };
    ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1, s * .2); ctx.strokeRect(btn.x + .5, btn.y + .5, btn.w, btn.h);
    var click = sp(b, .78, .12), fillA = ease(click);
    ctx.globalAlpha = alpha * a1 * fillA; ctx.fillStyle = col.accent; ctx.fillRect(btn.x + .5, btn.y + .5, btn.w, btn.h);
    // menu bars
    var side = u[1];
    for (var j = 0; j < 5; j++) {
      var aj = sp(b, .05 + j * .05, .15);
      ctx.globalAlpha = alpha * aj; ctx.fillStyle = j === 0 ? col.accent : col.border;
      ctx.fillRect(X(side[0] + 2.5), Y(side[1] + 4 + j * 6.4), s * lerp(4, j === 0 ? 17 : 13 + (j % 2) * 3, aj), s * 1.5);
    }
    // KPI bars
    var kp = u[2];
    for (var q = 0; q < 6; q++) {
      var aq = ease(sp(b, .12 + q * .04, .2)), hh = [.4, .65, .5, .8, .6, .95][q] * 11 * aq;
      ctx.globalAlpha = alpha; ctx.fillStyle = q === 5 ? col.accent : col.border;
      ctx.fillRect(X(kp[0] + 3 + q * 4.7), Y(kp[1] + kp[3] - 2.5 - hh), s * 3, s * hh);
    }
    // task rows
    var tk = u[3];
    for (var r = 0; r < 4; r++) {
      var ar = sp(b, .2 + r * .1, .15);
      ctx.globalAlpha = alpha * Math.min(1, ar * 2);
      ctx.strokeStyle = col.muted; ctx.lineWidth = Math.max(1, s * .16);
      ctx.strokeRect(X(tk[0] + 2.5) + .5, Y(tk[1] + 5.5 + r * 3.1) + .5, s * 1.9, s * 1.9);
      if (ar > .6) { ctx.fillStyle = col.accent; ctx.fillRect(X(tk[0] + 2.5) + s * .45, Y(tk[1] + 5.5 + r * 3.1) + s * .45, s * 1, s * 1); }
      ctx.fillStyle = col.border; ctx.fillRect(X(tk[0] + 6.5), Y(tk[1] + 6 + r * 3.1), s * lerp(0, 14 + (r % 2) * 5, ar), s * 1);
    }
    // trend chart: grid, line, pulse
    var ch = u[4], cx0 = ch[0] + 3, cx1 = ch[0] + ch[2] - 3, cy0 = ch[1] + 5, cy1 = ch[1] + ch[3] - 3;
    ctx.globalAlpha = alpha * sp(b, .3, .15); ctx.strokeStyle = col.border; ctx.lineWidth = 1;
    for (var g = 0; g < 4; g++) { ctx.beginPath(); ctx.moveTo(X(cx0), Y(lerp(cy0, cy1, g / 3)) + .5); ctx.lineTo(X(cx1), Y(lerp(cy0, cy1, g / 3)) + .5); ctx.stroke(); }
    var lp = ease(sp(b, .35, .45)); ctx.globalAlpha = alpha; ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1.5, s * .3);
    var n = CHART.length, upto = lp * (n - 1), pts = [];
    ctx.beginPath();
    for (var k = 0; k <= Math.floor(upto); k++) pts.push([X(lerp(cx0, cx1, k / (n - 1))), Y(lerp(cy1, cy0, CHART[k]))]);
    if (upto < n - 1) { var kk = Math.floor(upto), f = upto - kk; pts.push([lerp(pts[kk][0], X(lerp(cx0, cx1, (kk + 1) / (n - 1))), f), lerp(pts[kk][1], Y(lerp(cy1, cy0, CHART[kk + 1])), f)]); }
    pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
    ctx.stroke();
    if (lp >= 1) { // data pulse travels along the finished line
      var tt = (((this.reduced ? 1600 : performance.now()) / 2600) % 1) * (n - 1), i0 = Math.floor(tt), i1 = Math.min(n - 1, i0 + 1), ff = tt - i0;
      var px = lerp(X(lerp(cx0, cx1, i0 / (n - 1))), X(lerp(cx0, cx1, i1 / (n - 1))), ff);
      var py = lerp(Y(lerp(cy1, cy0, CHART[i0])), Y(lerp(cy1, cy0, CHART[i1])), ff);
      ctx.fillStyle = col.accent; ctx.fillRect(px - s * .7, py - s * .7, s * 1.4, s * 1.4);
      ctx.strokeStyle = col.accent; ctx.globalAlpha = alpha * .35; ctx.strokeRect(px - s * 1.5, py - s * 1.5, s * 3, s * 3);
    }
    // cursor and click ripple
    var cm = ease(sp(b, .55, .25)), cxp = lerp(X(66), btn.x + btn.w * .55, cm), cyp = lerp(Y(50), btn.y + btn.h * .6, cm);
    if (b > .5 && b < .98) {
      ctx.globalAlpha = alpha * (1 - sp(b, .93, .05)); ctx.fillStyle = col.text;
      ctx.beginPath(); ctx.moveTo(cxp, cyp); ctx.lineTo(cxp + s * 1.4, cyp + s * 3.4); ctx.lineTo(cxp + s * .5, cyp + s * 2.8); ctx.lineTo(cxp - s * .3, cyp + s * 4); ctx.lineTo(cxp - s * .7, cyp + s * 3.5); ctx.closePath(); ctx.fill();
    }
    if (click > 0 && click < 1) {
      ctx.globalAlpha = alpha * (1 - click); ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1, s * .2);
      var rr = s * (2 + click * 8); ctx.strokeRect(btn.x + btn.w / 2 - rr, btn.y + btn.h / 2 - rr * .6, rr * 2, rr * 1.2);
    }
    ctx.restore();
  };

  PlanToProduct.prototype.drawCaption = function (ctx, col, t, alpha) {
    var s = this.s, X = this.X.bind(this), Y = this.Y.bind(this);
    var stage = t < T_MORPH0 ? 0 : (t < T_MORPH1 ? 1 : 2);
    var names = ['IDEA', 'PRD', 'PROTOTYPE'];
    var fs = clamp(s * 1.6, 8, 11); ctx.font = '400 ' + fs + 'px "Space Mono", monospace'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    var y = Y(67.2), x = X(4);
    // base track
    ctx.globalAlpha = alpha; ctx.fillStyle = col.border; ctx.fillRect(x, y - s * 1.8, s * 92, 1);
    var prog = clamp(t / T_BUILD1, 0, 1);
    ctx.fillStyle = col.accent; ctx.fillRect(x, y - s * 1.8, s * 92 * prog, Math.max(1, s * .2));
    var pos = [4, 4 + 92 * (T_MORPH0 / T_BUILD1), 4 + 92 * (T_MORPH1 / T_BUILD1)];
    for (var i = 0; i < 3; i++) {
      ctx.fillStyle = i === stage ? col.accent : col.muted; ctx.globalAlpha = alpha * (i === stage ? 1 : .55);
      ctx.fillText((i + 1) + '. ' + names[i], X(pos[i]), y + s * .8);
    }
    ctx.textAlign = 'left';
  };

  window.PlanToProduct = PlanToProduct;
  function boot() {
    var h = document.getElementById('p2p-home'), c = document.getElementById('p2p-contact');
    var list = [];
    if (h) list.push(new PlanToProduct(h, { mode: 'home' }));
    if (c) list.push(new PlanToProduct(c, { mode: 'contact' }));
    new MutationObserver(function () { list.forEach(function (p) { p.render(); }); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
