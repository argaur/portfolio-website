/* Hero motion: Plan to Product.
   A pen scribbles a rough idea full of questions. A ruling beam straightens it into a plan.
   The plan is built room by room, bottom up, like floors. The app goes live and gets used.
   16s loop on Home (#p2p-home) and Contact (#p2p-contact). Every frame is a pure function of t.
   Always plays, including under prefers-reduced-motion: Windows "Animation effects: off" sets it,
   and this motion is gentle (no flashing, no parallax, no scale). See past-mistakes 2026-06-04.
   Pauses off-screen and in background tabs. Re-renders on theme change. */
(function () {
  'use strict';

  // ---- math --------------------------------------------------------------
  // Cubic bezier solver (same math the browser uses for CSS timing functions).
  function bezier(x1, y1, x2, y2) {
    function a(p1, p2) { return 1 - 3 * p2 + 3 * p1; }
    function b(p1, p2) { return 3 * p2 - 6 * p1; }
    function c(p1) { return 3 * p1; }
    function calc(t, p1, p2) { return ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t; }
    function slope(t, p1, p2) { return 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1); }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var t = x;
      for (var i = 0; i < 8; i++) {
        var s = slope(t, x1, x2); if (Math.abs(s) < 1e-6) break;
        t -= (calc(t, x1, x2) - x) / s;
      }
      t = Math.max(0, Math.min(1, t));
      if (Math.abs(calc(t, x1, x2) - x) > 1e-4) { // bisection fallback
        var lo = 0, hi = 1; t = x;
        for (var j = 0; j < 30; j++) { if (calc(t, x1, x2) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      }
      return calc(t, y1, y2);
    };
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sp(t, a, d) { return clamp((t - a) / d, 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var out = bezier(0.23, 1, 0.32, 1);      // entering
  var io = bezier(0.77, 0, 0.175, 1);      // moving on screen
  function typed(str, t, t0, cps) { var n = Math.floor((t - t0) * cps); return n <= 0 ? '' : str.slice(0, n); }
  function caretOn(t) { return Math.floor(t / 0.45) % 2 === 0; }
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  // ---- tokens (Kinetic Precision; light values are the ones the site already uses) ----
  var PALETTE = {
    dark: { stage: '#0c0d11', s1: '#16161e', border: '#2a2a38',
            text: '#ece8e2', muted: '#9896a0', faint: '#56546e', accent: '#c9a84c', green: '#4caf74' },
    light: { stage: '#f7f3ea', s1: '#ebe5d8', border: '#cfc7b5',
             text: '#1a1a22', muted: '#5a5668', faint: '#7a768a', accent: '#6e5824', green: '#4caf74' }
  };
  function colors() { return PALETTE[document.body.classList.contains('theme-light') ? 'light' : 'dark']; }

  // ---- storyboard (units: a 100 x 70 frame) ------------------------------
  var LOOP = 16, T_SYS = 3.2, T_BUILD = 7.0, T_LIVE = 11.4, T_RESET = 15.35;
  var R = [[6, 11, 88, 9], [6, 20, 24, 43], [30, 20, 32, 20], [62, 20, 32, 20], [30, 40, 64, 23]];
  var PLAN_LABEL = ['ENTRY', 'FLOW', 'DATA', 'RULES', 'OUTPUT'];
  var UI_LABEL = ['', 'STEPS', 'USAGE', 'TASKS', 'TREND'];
  var ORDER = [4, 1, 2, 3, 0];               // build bottom up, like floors
  var QUESTIONS = [['who is it for?', 9, 31, -0.05, 0.6], ['too many steps?', 40, 30, 0.04, 1.2], ['what ships first?', 44, 53, -0.03, 1.8]];
  var LOGS = [[0.15, '> brief: rough. asking questions'], [3.25, '> plan: 5 parts, 1 flow'], [T_BUILD, 'BUILD'],
              [T_LIVE + 0.9, '> ship: live. watching usage'], [T_RESET, '> next brief']];
  var CLICKS = [12.2, 12.95, 13.55, 14.15, 14.75];   // button, then 4 task rows
  var STEPS = ['01 PROBLEM', '02 SYSTEM', '03 PRODUCT'], MARKS = [0, T_SYS, T_BUILD, LOOP];
  var JOINTS = [[6, 11], [94, 11], [6, 20], [30, 20], [62, 20], [94, 20], [30, 40], [94, 40], [6, 63], [30, 63], [94, 63], [62, 40]];
  var FLOW = [[[50, 17], [18, 17], [18, 30]], [[22, 30], [42, 30]], [[52, 30], [72, 30]], [[78, 34], [78, 50], [72, 50]]];
  var BARS = [0.35, 0.55, 0.45, 0.7, 0.6, 0.8, 0.9];
  var WALLS = []; // 20 walls: [x0,y0,x1,y1,roomIndex]
  R.forEach(function (r, i) {
    var x = r[0], y = r[1], w = r[2], h = r[3];
    WALLS.push([x, y, x + w, y, i], [x + w, y, x + w, y + h, i], [x + w, y + h, x, y + h, i], [x, y + h, x, y, i]);
  });
  var CURSOR = [[T_LIVE - 0.2, 92, 72], [CLICKS[0], 85, 15.5]];
  for (var ci = 1; ci < 5; ci++) CURSOR.push([CLICKS[ci], 65.5, 26.2 + (ci - 1) * 3.6]);
  CURSOR.push([15.4, 88, 70]);

  function beamY(t) { return lerp(8, 67, io(sp(t, T_SYS, 1.5))); }
  function roomBuild(i, t) { return sp(t, T_BUILD + ORDER.indexOf(i) * 0.8, 0.95); }

  // ---- stage -------------------------------------------------------------
  function HeroMotion(canvas) {
    var self = this;
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.clock = 0; this.running = false; this.visible = false; this.w = 0; this.h = 0; this.raf = 0;
    new ResizeObserver(function () { self.resize(); }).observe(canvas);
    new IntersectionObserver(function (e) { self.visible = e[0].isIntersecting; self.sync(); }, { threshold: 0.05 }).observe(canvas);
    document.addEventListener('visibilitychange', function () { self.sync(); });
    this.resize();
  }

  HeroMotion.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), r = this.c.getBoundingClientRect();
    // A canvas in a hidden panel has no size. When its panel opens, start the story from the top.
    if (!(this.w > 0) && r.width > 0) this.clock = 0;
    this.w = r.width; this.h = r.height; this.dpr = dpr;
    this.c.width = Math.max(1, Math.round(r.width * dpr)); this.c.height = Math.max(1, Math.round(r.height * dpr));
    var pad = Math.max(8, this.w * 0.035);
    this.s = Math.max(0, Math.min((this.w - pad * 2) / 100, (this.h - pad * 2) / 70));
    this.ox = (this.w - 100 * this.s) / 2; this.oy = (this.h - 70 * this.s) / 2;
    this.render();
  };

  HeroMotion.prototype.sync = function () {
    var go = this.visible && !document.hidden && !this.paused, self = this;
    if (go && !this.running) {
      this.running = true; this.last = performance.now();
      this.raf = requestAnimationFrame(function tick(now) {
        if (!self.running) return;
        var d = now - self.last; self.last = now;
        self.clock = (self.clock + Math.min(0.05, d / 1000)) % LOOP;
        self.render();
        self.raf = requestAnimationFrame(tick);
      });
    }
    if (!go && this.running) { this.running = false; cancelAnimationFrame(this.raf); }
  };

  HeroMotion.prototype.render = function () {
    if (!(this.s > 0.5)) return;
    var ctx = this.ctx, s = this.s, ox = this.ox, oy = this.oy;
    var e = {
      s: s, w: this.w, h: this.h, col: colors(),
      X: function (u) { return ox + u * s; }, Y: function (u) { return oy + u * s; },
      font: function (px, weight) { return (weight || 400) + ' ' + px + 'px "Space Mono", monospace'; },
      fs: function (k, lo, hi) { return clamp(s * k, lo, hi); }
    };
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalAlpha = 1; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    drawScene(ctx, this.clock, e);
  };

  // ---- scene -------------------------------------------------------------
  function drawScene(ctx, t, e) {
    var col = e.col, X = e.X, Y = e.Y, s = e.s, lw = Math.max(1, s * 0.24);
    var resetY = t > T_RESET ? lerp(67, 8, io(sp(t, T_RESET, LOOP - T_RESET))) : 99;
    ctx.save();
    if (resetY < 99) { ctx.beginPath(); ctx.rect(0, 0, e.w, Y(resetY)); ctx.clip(); }

    // faint blueprint grid, always there
    ctx.strokeStyle = col.border; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; ctx.beginPath();
    for (var gx = 6; gx <= 94; gx += 4) { ctx.moveTo(Math.round(X(gx)) + 0.5, Y(9)); ctx.lineTo(Math.round(X(gx)) + 0.5, Y(64)); }
    for (var gy = 11; gy <= 63; gy += 4) { ctx.moveTo(X(4), Math.round(Y(gy)) + 0.5); ctx.lineTo(X(96), Math.round(Y(gy)) + 0.5); }
    ctx.stroke(); ctx.globalAlpha = 1;

    // room fills: floor-by-floor sweep with a marching dashed leading edge
    R.forEach(function (r, i) {
      var b = roomBuild(i, t); if (b <= 0) return;
      var h = r[3] * out(b), top = r[1] + r[3] - h;
      ctx.fillStyle = col.s1; ctx.fillRect(X(r[0]), Y(top), r[2] * s, h * s);
      if (b < 1) {
        var band = Math.min(4, h), g = ctx.createLinearGradient(0, Y(top), 0, Y(top + band));
        g.addColorStop(0, hexA(col.accent, 0.35)); g.addColorStop(1, hexA(col.accent, 0));
        ctx.fillStyle = g; ctx.fillRect(X(r[0]), Y(top), r[2] * s, band * s);
        ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1.5, s * 0.35);
        ctx.setLineDash([s * 1.2, s * 1.2]); ctx.lineDashOffset = -t * s * 8;
        ctx.globalAlpha = 1 - sp(b, 0.85, 0.15);
        ctx.beginPath(); ctx.moveTo(X(r[0] + 1), Y(top)); ctx.lineTo(X(r[0] + r[2] - 1), Y(top)); ctx.stroke();
        ctx.setLineDash([]); ctx.lineDashOffset = 0; ctx.globalAlpha = 1;
      }
    });

    // walls: scribble, then ruled plan
    var drawn = sp(t, 0.1, 2.7) * WALLS.length, by = beamY(t), wob = t < T_SYS + 2 ? 1 : 0, pen = null;
    ctx.lineWidth = lw; ctx.lineCap = 'round';
    for (var wi = 0; wi < WALLS.length; wi++) {
      var f = clamp(drawn - wi, 0, 1); if (f <= 0) break;
      var wl = WALLS[wi], N = 12, st;
      ctx.beginPath();
      for (var k = 0; k <= N * f; k++) {
        var u = k / N, px = lerp(wl[0], wl[2], u), py = lerp(wl[1], wl[3], u);
        st = out(clamp((by - py) / 7, 0, 1));
        var amp = (1 - st) * wob, ph = wi * 2.3 + k * 1.1;
        var dx = amp * Math.sin(ph + t * 2.1) + amp * 0.3 * Math.sin(ph * 1.7 - t * 3.3);
        var dy = amp * Math.cos(ph * 0.8 + t * 1.9) + amp * 0.3 * Math.sin(ph * 2.1 + t * 2.7);
        if (k === 0) { px -= (wl[2] - wl[0]) * 0.03 * (1 - st); py -= (wl[3] - wl[1]) * 0.03 * (1 - st); } // sketchy overshoot
        if (k) ctx.lineTo(X(px + dx), Y(py + dy)); else ctx.moveTo(X(px + dx), Y(py + dy));
        pen = [px + dx, py + dy];
      }
      var mid = out(clamp((by - (wl[1] + wl[3]) / 2) / 7, 0, 1));
      ctx.strokeStyle = mid > 0.5 ? col.accent : col.muted;
      ctx.globalAlpha = mid > 0.5 ? lerp(1, 0.55, roomBuild(wl[4], t)) : 0.85;
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.lineCap = 'butt';

    // the pen: crosshair and coordinate readout while scribbling
    if (pen && t < 2.9) {
      var cx = X(pen[0]), cy = Y(pen[1]), pr = s * 1.6;
      ctx.globalAlpha = 1 - sp(t, 2.7, 0.2); ctx.strokeStyle = col.accent; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - pr * 1.8, cy); ctx.lineTo(cx + pr * 1.8, cy); ctx.moveTo(cx, cy - pr * 1.8); ctx.lineTo(cx, cy + pr * 1.8); ctx.stroke();
      ctx.strokeRect(cx - pr / 2, cy - pr / 2, pr, pr);
      ctx.font = e.font(e.fs(1.25, 8, 10)); ctx.fillStyle = col.accent;
      ctx.fillText('x' + Math.round(pen[0]) + ' y' + Math.round(pen[1]), cx + pr * 1.2, cy - pr * 1.1);
      ctx.globalAlpha = 1;
    }

    // questions: the fuzzy part of the brief, swept away by the beam
    if (t < T_BUILD) QUESTIONS.forEach(function (q) {
      var a = out(sp(t, q[4], 0.35)) * (1 - sp(by, q[2] - 3, 3)); if (a <= 0.01) return;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(X(q[1]), Y(q[2]) + (1 - a) * s * 1.5);
      ctx.rotate(q[3] + 0.03 * Math.sin(t * 1.6 + q[4]));
      ctx.font = e.font(e.fs(1.5, 9, 12)); ctx.fillStyle = col.text;
      ctx.fillText(typed(q[0], t, q[4], 24), 0, 0);
      ctx.restore();
    });

    // ruling beam
    if (t > T_SYS && t < T_SYS + 1.6) {
      ctx.strokeStyle = col.accent; ctx.globalAlpha = 0.9; ctx.lineWidth = Math.max(1, s * 0.3);
      ctx.beginPath(); ctx.moveTo(X(3), Y(by)); ctx.lineTo(X(97), Y(by)); ctx.stroke();
      ctx.font = e.font(e.fs(1.2, 8, 10), 700); ctx.fillStyle = col.accent; ctx.textAlign = 'right';
      ctx.fillText('RULE', X(97), Y(by) - s * 0.6); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
    }

    // dimension line and joint markers once ruled
    var dim = out(sp(t, 4.6, 0.9));
    if (dim > 0 && t < T_LIVE) {
      var dy0 = Y(9.3), dx1 = lerp(6, 94, dim);
      ctx.globalAlpha = 1 - sp(t, T_BUILD + 2.5, 0.6); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(X(6), dy0); ctx.lineTo(X(dx1), dy0);
      [6, 30, 62, 94].forEach(function (x) { if (x <= dx1) { ctx.moveTo(X(x), dy0 - s * 0.6); ctx.lineTo(X(x), dy0 + s * 0.6); } });
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    JOINTS.forEach(function (j, i) {
      var a = out(sp(t, 6.0 + i * 0.06, 0.3)) * (1 - sp(t, T_BUILD + 3.6, 0.5)); if (a <= 0) return;
      var sz = s * lerp(2.2, 1.3, a);
      ctx.globalAlpha = a; ctx.fillStyle = col.accent; ctx.fillRect(X(j[0]) - sz / 2, Y(j[1]) - sz / 2, sz, sz);
    });
    ctx.globalAlpha = 1;

    // flow: marching connectors show how the parts talk to each other
    var fa = 1 - sp(t, T_BUILD + 1.2, 0.5);
    if (t > 5.0 && fa > 0) {
      ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1, s * 0.28);
      ctx.setLineDash([s * 1.4, s * 1.1]); ctx.lineDashOffset = -t * s * 6;
      FLOW.forEach(function (seg, i) {
        var fp = out(sp(t, 5.0 + i * 0.3, 0.45)); if (fp <= 0) return;
        var L = 0, ls = [];
        for (var k1 = 1; k1 < seg.length; k1++) { var l = Math.hypot(seg[k1][0] - seg[k1 - 1][0], seg[k1][1] - seg[k1 - 1][1]); ls.push(l); L += l; }
        var left = L * fp, end = seg[0];
        ctx.globalAlpha = fa * 0.9; ctx.beginPath(); ctx.moveTo(X(seg[0][0]), Y(seg[0][1]));
        for (var k2 = 1; k2 < seg.length && left > 0; k2++) {
          var q = Math.min(1, left / ls[k2 - 1]);
          end = [lerp(seg[k2 - 1][0], seg[k2][0], q), lerp(seg[k2 - 1][1], seg[k2][1], q)];
          ctx.lineTo(X(end[0]), Y(end[1])); left -= ls[k2 - 1];
        }
        ctx.stroke();
        var hd = s * 1.3; ctx.fillStyle = col.accent; ctx.fillRect(X(end[0]) - hd / 2, Y(end[1]) - hd / 2, hd, hd);
      });
      ctx.setLineDash([]); ctx.lineDashOffset = 0; ctx.globalAlpha = 1;
    }

    // labels: plan names type in, then swap to product names as each room is built
    R.forEach(function (r, i) {
      var b = roomBuild(i, t);
      ctx.font = e.font(e.fs(1.3, 8, 10), 700); ctx.textBaseline = 'top';
      var pl = typed(PLAN_LABEL[i], t, 4.7 + i * 0.18, 18), pa = 1 - out(sp(b, 0.45, 0.2));
      if (pl && pa > 0.01) { ctx.globalAlpha = pa; ctx.fillStyle = col.accent; ctx.fillText(pl, X(r[0] + 1.4), Y(r[1] + 1.3) - (1 - pa) * s); }
      var ua = out(sp(b, 0.6, 0.3));
      if (UI_LABEL[i] && ua > 0.01) { ctx.globalAlpha = ua; ctx.fillStyle = col.muted; ctx.fillText(UI_LABEL[i], X(r[0] + 1.4), Y(r[1] + 1.3) + (1 - ua) * s); }
      ctx.globalAlpha = 1; ctx.textBaseline = 'alphabetic';
    });

    drawProduct(ctx, t, e);
    ctx.restore();

    // reset beam wipes the frame clean for the next brief
    if (resetY < 99) {
      ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1, s * 0.3);
      ctx.beginPath(); ctx.moveTo(X(3), Y(resetY)); ctx.lineTo(X(97), Y(resetY)); ctx.stroke();
    }

    drawLog(ctx, t, e);
    drawSteps(ctx, t, e, t < T_SYS ? 0 : (t < T_BUILD ? 1 : 2));
  }

  function drawProduct(ctx, t, e) {
    var col = e.col, X = e.X, Y = e.Y, s = e.s, live = t >= T_LIVE, lt = t - T_LIVE;

    // NAV (room 0): logo, links, a SHIP button that gets pressed, then a LIVE signal
    var b0 = roomBuild(0, t), n = R[0];
    if (b0 > 0.5) {
      var a = out(sp(b0, 0.5, 0.4));
      ctx.globalAlpha = a; ctx.fillStyle = col.accent; ctx.fillRect(X(n[0] + 2), Y(n[1] + 2.8), s * 3.4, s * 3.4);
      ctx.fillStyle = col.border;
      for (var i = 0; i < 3; i++) ctx.fillRect(X(n[0] + 8 + i * 9), Y(n[1] + 4), s * 6 * out(sp(b0, 0.55 + i * 0.08, 0.3)), s * 1.2);
      var bx = X(78), byy = Y(13), bw = s * 14, bh = s * 5, fillA = out(sp(t, CLICKS[0], 0.12));
      ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1, s * 0.22); ctx.strokeRect(bx + 0.5, byy + 0.5, bw, bh);
      if (fillA > 0) { ctx.fillStyle = col.accent; ctx.globalAlpha = a * fillA; ctx.fillRect(bx + 0.5, byy + 0.5, bw, bh); }
      ctx.globalAlpha = a; ctx.font = e.font(e.fs(1.2, 8, 10), 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = fillA > 0.5 ? col.stage : col.accent;
      ctx.fillText(fillA > 0.5 ? 'SHIPPED' : 'SHIP', bx + bw / 2, byy + bh / 2 + 1);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      var la = out(sp(t, CLICKS[0] + 0.15, 0.3));
      if (la > 0) {
        var ldx = X(68.5), ldy = Y(15.5), d = s * 1.3, ph = ((t - CLICKS[0]) % 1.2) / 1.2, rr = d * (0.6 + ph * 1.8);
        ctx.globalAlpha = la; ctx.fillStyle = col.green; ctx.fillRect(ldx - d / 2, ldy - d / 2, d, d);
        ctx.globalAlpha = la * (1 - ph) * 0.8; ctx.strokeStyle = col.green; ctx.lineWidth = 1; ctx.strokeRect(ldx - rr, ldy - rr, rr * 2, rr * 2);
        ctx.globalAlpha = la; ctx.fillStyle = col.text; ctx.font = e.font(e.fs(1.2, 8, 10), 700); ctx.textBaseline = 'middle';
        ctx.fillText('LIVE', ldx + d * 1.4, ldy + 1); ctx.textBaseline = 'alphabetic';
      }
      ctx.globalAlpha = 1;
    }

    // STEPS sidebar (room 1): rows stagger in; the active row walks the flow when live
    var b1 = roomBuild(1, t), sb = R[1];
    if (b1 > 0.45) {
      var act = live ? Math.floor(lt / 0.7) % 5 : 0;
      ctx.font = e.font(e.fs(1.2, 8, 10)); ctx.textBaseline = 'middle';
      for (var j = 0; j < 5; j++) {
        var aj = out(sp(b1, 0.5 + j * 0.07, 0.3)); if (aj <= 0) continue;
        var yy = Y(sb[1] + 6 + j * 6.5);
        ctx.globalAlpha = aj; ctx.fillStyle = col.faint; ctx.fillText('0' + (j + 1), X(sb[0] + 2), yy + s * 0.6);
        ctx.fillStyle = j === act ? col.accent : col.border;
        ctx.fillRect(X(sb[0] + 7) - (1 - aj) * s * 3, yy, s * (j === act ? 14 : 10 + (j % 2) * 3), s * 1.3);
        if (j < 4) { ctx.fillStyle = col.border; ctx.fillRect(X(sb[0] + 3.2), yy + s * 2.2, 1, s * 3); }
      }
      ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 1;
    }

    // USAGE bars (room 2): grow in, then breathe with live data
    var b2 = roomBuild(2, t), kp = R[2];
    if (b2 > 0.4) {
      for (var q = 0; q < 7; q++) {
        var g = out(sp(b2, 0.45 + q * 0.05, 0.35));
        var v = live ? BARS[q] + 0.12 * Math.sin(lt * 2.4 + q * 1.3) : BARS[q], hh = v * 12 * g;
        ctx.fillStyle = q === 6 ? col.accent : col.border;
        ctx.fillRect(X(kp[0] + 3 + q * 4), Y(kp[1] + kp[3] - 2) - hh * s, s * 2.6, hh * s);
      }
    }

    // TASKS (room 3): rows, ticked by the cursor's clicks
    var b3 = roomBuild(3, t), tk = R[3];
    if (b3 > 0.45) {
      for (var r = 0; r < 4; r++) {
        var ar = out(sp(b3, 0.5 + r * 0.07, 0.3)); if (ar <= 0) continue;
        var ry = Y(tk[1] + 5.2 + r * 3.6), cb = s * 2, done = out(sp(t, CLICKS[r + 1] + 0.05, 0.18));
        ctx.globalAlpha = ar; ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
        ctx.strokeRect(X(tk[0] + 2.5) + 0.5, ry + 0.5, cb, cb);
        if (done > 0) {
          var m = cb * 0.55 * lerp(0.9, 1, done);
          ctx.globalAlpha = ar * done; ctx.fillStyle = col.accent;
          ctx.fillRect(X(tk[0] + 2.5) + (cb - m) / 2 + 0.5, ry + (cb - m) / 2 + 0.5, m, m);
        }
        ctx.globalAlpha = ar * (done > 0.5 ? 0.5 : 1); ctx.fillStyle = col.border;
        ctx.fillRect(X(tk[0] + 6.5), ry + s * 0.5, s * (16 + (r % 2) * 6) * ar, s);
      }
      ctx.globalAlpha = 1;
    }

    // TREND chart (room 4): line draws in, then streams to the left while live
    var b4 = roomBuild(4, t), ch = R[4];
    if (b4 > 0.35) {
      var x0 = ch[0] + 3, x1 = ch[0] + ch[2] - 4, y0 = ch[1] + 6, y1 = ch[1] + ch[3] - 3;
      ctx.globalAlpha = out(sp(b4, 0.35, 0.3)); ctx.strokeStyle = col.border; ctx.lineWidth = 1; ctx.beginPath();
      for (var gi = 0; gi < 4; gi++) { var gyy = Math.round(Y(lerp(y0, y1, gi / 3))) + 0.5; ctx.moveTo(X(x0), gyy); ctx.lineTo(X(x1), gyy); }
      ctx.stroke(); ctx.globalAlpha = 1;
      var draw = out(sp(b4, 0.45, 0.55)), shift = live ? lt * 1.4 : 0, NP = 14, end = NP * draw, lastP = null;
      var fn = function (u) { return clamp(0.48 + 0.2 * Math.sin(u * 0.85) + 0.12 * Math.sin(u * 2.1 + 1) + 0.08 * Math.sin(u * 0.31), 0.05, 0.95); };
      ctx.strokeStyle = col.accent; ctx.lineWidth = Math.max(1.5, s * 0.32); ctx.beginPath();
      for (var k = 0; k <= end + 1e-6; k += 0.25) {
        var px = X(lerp(x0, x1, k / NP)), py = Y(lerp(y1, y0, fn(k + shift)));
        if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        lastP = [px, py];
      }
      ctx.stroke();
      if (lastP && draw > 0.05) {
        var dd = s * 1.4; ctx.fillStyle = col.accent; ctx.fillRect(lastP[0] - dd / 2, lastP[1] - dd / 2, dd, dd);
        if (live) {
          var ph2 = (lt % 0.9) / 0.9, rr2 = dd * (0.7 + ph2 * 1.6);
          ctx.globalAlpha = (1 - ph2) * 0.6; ctx.strokeStyle = col.accent; ctx.lineWidth = 1;
          ctx.strokeRect(lastP[0] - rr2, lastP[1] - rr2, rr2 * 2, rr2 * 2); ctx.globalAlpha = 1;
        }
      }
    }

    // window chrome squares settle onto the nav once everything is built
    for (var c = 0; c < 3; c++) {
      var ca = out(sp(t, 10.75 + c * 0.06, 0.25)); if (ca <= 0) continue;
      var sz = s * 1.1 * lerp(0.9, 1, ca);
      ctx.globalAlpha = ca; ctx.fillStyle = c === 0 ? col.accent : col.faint;
      ctx.fillRect(X(6 + c * 2) + s * 0.3, Y(9.4) - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
    drawCursor(ctx, t, e);
  }

  function cursorAt(t) {
    if (t <= CURSOR[0][0]) return null;
    for (var j = 1; j < CURSOR.length; j++) {
      var a = CURSOR[j - 1], b = CURSOR[j], mv = Math.min(0.45, b[0] - a[0]);
      if (t <= b[0]) { var f = io(sp(t, b[0] - mv, mv)); return [lerp(a[1], b[1], f), lerp(a[2], b[2], f)]; }
    }
    return null;
  }

  function drawCursor(ctx, t, e) {
    var p = cursorAt(t); if (!p) return;
    var col = e.col, s = e.s, x = e.X(p[0]), y = e.Y(p[1]), press = 1;
    CLICKS.forEach(function (c) {
      var d = t - c;
      if (d > 0 && d < 0.16) press = 0.95; // a light press, not a squash
      var k = d / 0.45; if (k <= 0 || k >= 1) return;
      var rr = s * (1 + out(k) * 4); // click ripple, square to match the 0px radius rule
      ctx.globalAlpha = 1 - k; ctx.strokeStyle = col.accent; ctx.lineWidth = 1;
      ctx.strokeRect(x - rr, y - rr, rr * 2, rr * 2);
    });
    ctx.globalAlpha = 1; ctx.save(); ctx.translate(x, y); ctx.scale(press, press);
    var u = s * 0.95;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, u * 4.4); ctx.lineTo(u * 1.2, u * 3.3); ctx.lineTo(u * 2.1, u * 5.1);
    ctx.lineTo(u * 2.8, u * 4.7); ctx.lineTo(u * 1.9, u * 3); ctx.lineTo(u * 3.3, u * 3); ctx.closePath();
    ctx.fillStyle = col.text; ctx.fill(); ctx.strokeStyle = col.stage; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
  }

  function drawLog(ctx, t, e) {
    var col = e.col, X = e.X, Y = e.Y, cur = LOGS[0];
    LOGS.forEach(function (l) { if (t >= l[0]) cur = l; });
    var text = cur[1], t0 = cur[0];
    if (text === 'BUILD') {
      var doneN = 0; for (var i = 0; i < 5; i++) if (roomBuild(i, t) >= 1) doneN++;
      text = doneN < 5 ? '> build: part ' + (doneN + 1) + ' of 5' : '> build: 5 of 5. checks pass';
    }
    var str = typed(text, t, t0, 40);
    if (text.indexOf('> build') === 0 && t - t0 > 0.5) str = text; // count updates are instant
    ctx.font = e.font(e.fs(1.35, 8, 11)); ctx.textBaseline = 'middle'; ctx.fillStyle = col.muted;
    ctx.fillText(str, X(3), Y(67.3));
    if (caretOn(t)) { ctx.fillStyle = col.accent; ctx.fillRect(X(3) + ctx.measureText(str).width + 2, Y(67.3) - e.s * 0.9, e.s * 0.9, e.s * 1.8); }
    ctx.textBaseline = 'alphabetic';
  }

  // top strip: three steps with progress underlines, and a running timecode
  function drawSteps(ctx, t, e, active) {
    var col = e.col, X = e.X, Y = e.Y, s = e.s, fs = e.fs(1.45, 8, 11), x = X(3), gap = s * 3.2;
    var sec = Math.floor(t), ds = Math.floor((t - sec) * 10), tc = 'T+' + (sec < 10 ? '0' : '') + sec + '.' + ds;
    ctx.font = e.font(fs, 400); var tcw = ctx.measureText(tc).width;
    ctx.font = e.font(fs, 700); ctx.textBaseline = 'middle';
    // On narrow frames, steps that are not active collapse to their number so nothing collides with the timecode.
    var full = 0; for (var n = 0; n < 3; n++) full += ctx.measureText(STEPS[n]).width + gap;
    var compact = full + tcw > X(97) - X(3);
    for (var i = 0; i < 3; i++) {
      var on = i === active, done = i < active, label = compact && !on ? STEPS[i].slice(0, 2) : STEPS[i];
      var tw = ctx.measureText(label).width;
      ctx.fillStyle = on ? col.accent : col.faint; ctx.globalAlpha = on ? 1 : (done ? 0.9 : 0.7);
      ctx.fillText(label, x, Y(3.4));
      var p = on ? sp(t, MARKS[i], MARKS[i + 1] - MARKS[i]) : (done ? 1 : 0);
      ctx.fillStyle = col.border; ctx.fillRect(x, Y(5.6), tw, 1);
      ctx.fillStyle = col.accent; ctx.fillRect(x, Y(5.6), tw * p, Math.max(1, s * 0.25));
      x += tw + gap;
    }
    ctx.globalAlpha = 1; ctx.textAlign = 'right'; ctx.fillStyle = col.faint; ctx.font = e.font(fs, 400);
    ctx.fillText(tc, X(97), Y(3.4));
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }

  // ---- boot --------------------------------------------------------------
  function boot() {
    var stages = [];
    ['p2p-home', 'p2p-contact'].forEach(function (id) {
      var c = document.getElementById(id);
      if (!c) return;
      var st = new HeroMotion(c);
      stages.push(st);
      // Pause control (WCAG 2.2.2): the loop never stops on its own, so the visitor can stop it.
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'p2p-pause';
      btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', 'Pause animation');
      btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect class="p2p-i-pause" x="2" y="1" width="3" height="10"/><rect class="p2p-i-pause" x="7" y="1" width="3" height="10"/><path class="p2p-i-play" d="M3 1 L11 6 L3 11 Z"/></svg>';
      btn.addEventListener('click', function () {
        st.paused = !st.paused;
        btn.setAttribute('aria-pressed', st.paused ? 'true' : 'false');
        btn.setAttribute('aria-label', st.paused ? 'Play animation' : 'Pause animation');
        st.sync();
      });
      c.parentNode.appendChild(btn);
    });
    if (!stages.length) return;
    new MutationObserver(function () { stages.forEach(function (st) { st.render(); }); })
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
    // Canvas text uses Space Mono; redraw once the web font is ready so a paused frame is never left in the fallback face.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { stages.forEach(function (st) { st.render(); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
