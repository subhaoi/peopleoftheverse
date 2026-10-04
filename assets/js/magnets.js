/* ==========================================================
   People of the Verse: Word magnets
   One board per view (desktop and mobile), the same algorithm
   as the design. Positions are in "cqw" (percent of board width).
   ========================================================== */
(function () {
  'use strict';
  var POV = window.POV, C = POV.C, store = POV.store;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var TPAL = ['var(--yellow)', 'var(--paper)', 'var(--mist)'];
  var LOOK = [{ rot: -2, dy: 0 }, { rot: 1.5, dy: 14 }, { rot: -1, dy: 6 }];

  /* ----- the wall (shared by both views) ----- */
  function wallItems() {
    var mine = store.get('wall', []);
    var base = POV.data().wall.map(function (p, i) { return { lines: p.lines, by: p.by, rot: LOOK[i % 3].rot, dy: LOOK[i % 3].dy }; });
    return mine.concat(base).slice(0, 9);
  }
  function renderWall() { POV.fill('wall', wallItems()); }

  /* ----- layout maths (as in the design) ----- */
  var estW = function (word, s) { return s * (word.length * 0.72 + 0.8) + 1.0; };
  var estH = function (s) { return s * 1.34 + 1.0; };

  function autoLines(items, gap) {
    var maxW = 94, lines = [], cur = [], curW = 0;
    items.forEach(function (it) {
      var w = estW(it.w, it.s);
      if (cur.length && curW + gap + w > maxW) { lines.push(cur); cur = []; curW = 0; }
      curW += (cur.length ? gap : 0) + w; cur.push(it);
    });
    if (cur.length) lines.push(cur);
    return lines;
  }
  function packLines(lines, startY, gap) {
    var pos = {}, y = startY;
    lines.forEach(function (line, ri) {
      var ws = line.map(function (it) { return estW(it.w, it.s); });
      var tot = ws.reduce(function (a, w, i) { return a + w + (i ? gap : 0); }, 0);
      var x = (100 - tot) / 2;
      var rh = Math.max.apply(null, line.map(function (it) { return estH(it.s); }));
      line.forEach(function (it, i) {
        var jy = (((ri * 7 + i * 3) % 5) - 2) * 0.2;
        pos[it.id] = { x: x, y: y + (rh - estH(it.s)) / 2 + jy };
        x += ws[i] + gap;
      });
      y += rh + gap;
    });
    return { pos: pos, endY: y };
  }
  var byPosition = function (list) { return list.slice().sort(function (a, b) { return (a.y - b.y) || (a.x - b.x); }); };
  var clean = function (s) { return String(s).toLowerCase().replace(/[^a-z'\-]/g, ''); };

  /* ----- one board ----- */
  function Board(root, mobile) {
    var board = $('[data-board]', root);
    if (!board) return;
    var sign = $('[data-sign]', board), band = $('[data-band]', board);
    var hints = $$('[data-if="signEmpty"] > *', board);
    var gap = mobile ? 2 : 1.8, signH = mobile ? 64 : 30, bandH = mobile ? 7 : 3.4;
    var sizes = mobile ? [5.4, 6, 6.6] : [2.6, 3.0, 3.3];
    var S = { magnets: [], boardH: 60, z: 100, nextId: 1, note: '', dragging: null, glide: false };
    var els = {}, drag = null, lastPoem = null;

    var inSign = function (m) { return m.y + estH(m.s) / 2 < signH; };

    function trayLayout(order) {
      var p = packLines(autoLines(order.map(function (m) { return { id: m.id, w: m.w, s: m.s }; }), gap), signH + bandH + 2, gap);
      return { pos: p.pos, boardH: Math.max(signH + bandH + 20, p.endY - gap + 2.5) };
    }
    function applyTray(order, extra) {
      var t = trayLayout(order), ids = {};
      order.forEach(function (m) { ids[m.id] = true; });
      var add = (extra || []).filter(function (m) { return !S.magnets.some(function (x) { return x.id === m.id; }); });
      S.magnets = S.magnets.concat(add).map(function (m) { return ids[m.id] ? Object.assign({}, m, { x: t.pos[m.id].x, y: t.pos[m.id].y }) : m; });
      S.boardH = t.boardH;
    }
    function buildLayout() {
      var tray = C.magnetWords.map(function (w, i) { return { id: 'w' + i, w: w, s: sizes[(i * 5 + 2) % sizes.length], bg: TPAL[i % 3] }; });
      var tp = packLines(autoLines(tray, gap), signH + bandH + 2, gap);
      S.magnets = tray.map(function (it, i) { return { id: it.id, w: it.w, s: it.s, bg: it.bg, x: tp.pos[it.id].x, y: tp.pos[it.id].y, z: i + 1, r: (((i * 37) % 7) - 3) * 0.9 }; });
      S.boardH = tp.endY - gap + 2.5;
    }

    function readLines() {
      var items = S.magnets.map(function (m) { return { w: m.w, x: m.x, yc: m.y + estH(m.s) / 2, h: estH(m.s) }; })
        .filter(function (m) { return m.yc < signH; }).sort(function (a, b) { return a.yc - b.yc; });
      var rows = [];
      items.forEach(function (m) {
        var last = rows[rows.length - 1];
        if (last && Math.abs(m.yc - last.yc) < m.h * 0.55) last.items.push(m); else rows.push({ yc: m.yc, items: [m] });
      });
      return rows.map(function (r) { return r.items.sort(function (a, b) { return a.x - b.x; }).map(function (m) { return m.w; }).join(' '); });
    }

    /* ----- drawing ----- */
    function styleOf(m) {
      var on = S.dragging === m.id;
      return 'position:absolute;left:' + m.x.toFixed(2) + 'cqw;top:' + m.y.toFixed(2) + 'cqw;z-index:' + (on ? 9999 : m.z) +
        ';margin:0;padding:.12em .4em;font-size:' + m.s + 'cqw;line-height:1.1;white-space:nowrap;text-transform:uppercase;letter-spacing:.02em;background:' + m.bg +
        ';color:var(--deep);border:2px solid var(--deep);border-radius:.28em;box-shadow:' + (on ? '5px 8px 0 var(--deep)' : '2px 3px 0 var(--deep)') +
        ';transform:rotate(' + m.r.toFixed(1) + 'deg) scale(' + (on ? 1.06 : 1) + ');transition:' + (S.glide && !on ? 'left .55s ease, top .55s ease' : 'none') +
        ';cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none';
    }
    function makeEl(m) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mg y'; b.dataset.id = m.id;
      b.setAttribute('aria-label', 'Word magnet: ' + m.w + '. Drag it, or use the arrow keys to move it.');
      b.textContent = m.w;
      b.addEventListener('pointerdown', function (e) { onDown(e, m.id); });
      b.addEventListener('pointermove', function (e) { onMove(e, m.id); });
      b.addEventListener('pointerup', function (e) { onUp(e, m.id); });
      b.addEventListener('pointercancel', function (e) { onUp(e, m.id); });
      b.addEventListener('keydown', function (e) { onKey(e, m.id); });
      board.appendChild(b);
      return b;
    }
    function drawMagnets() {
      var live = {};
      S.magnets.forEach(function (m) { live[m.id] = true; });
      Object.keys(els).forEach(function (id) { if (!live[id]) { els[id].remove(); delete els[id]; } });
      S.magnets.forEach(function (m) {
        var el = els[m.id] || (els[m.id] = makeEl(m));
        el.style.cssText = styleOf(m);
      });
    }
    function drawFrame() {
      board.style.aspectRatio = '100 / ' + S.boardH.toFixed(2);
      sign.style.height = signH + 'cqw';
      band.style.top = signH + 'cqw'; band.style.height = bandH + 'cqw';
      hints.forEach(function (h) { h.style.height = signH + 'cqw'; });
    }
    function drawPoem() {
      var lines = readLines(), key = JSON.stringify(lines);
      if (key !== lastPoem) {
        lastPoem = key;
        POV.fill('poemLines', lines.map(function (t) { return { text: t }; }), root);
        POV.setIf('hasPoem', lines.length > 0, root);
        POV.setIf('signEmpty', lines.length === 0, root);
      }
      POV.setIf('hasNote', !!S.note, root);
      POV.bind('note', S.note, root);
    }
    function draw() { drawFrame(); drawMagnets(); drawPoem(); }

    /* ----- pointer + keyboard ----- */
    function info(el) {
      var r = board.getBoundingClientRect();
      return r.width ? { r: r, k: 100 / r.width } : null;
    }
    function find(id) { return S.magnets.filter(function (x) { return x.id === id; })[0]; }
    function onDown(e, id) {
      if (e.button !== undefined && e.button > 0) return;
      var el = e.currentTarget, bi = info(el), m = find(id);
      if (!bi || !m) return;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ }
      drag = { id: id, ox: (e.clientX - bi.r.left) * bi.k - m.x, oy: (e.clientY - bi.r.top) * bi.k - m.y };
      S.z += 1; m.z = S.z; S.dragging = id; S.glide = false; S.note = '';
      draw();
    }
    function onMove(e, id) {
      if (!drag || drag.id !== id) return;
      var el = e.currentTarget, bi = info(el), m = find(id);
      if (!bi || !m) return;
      var w = el.offsetWidth * bi.k, h = el.offsetHeight * bi.k, H = bi.r.height * bi.k;
      m.x = Math.max(0, Math.min(100 - w, (e.clientX - bi.r.left) * bi.k - drag.ox));
      m.y = Math.max(0, Math.min(H - h, (e.clientY - bi.r.top) * bi.k - drag.oy));
      el.style.left = m.x.toFixed(2) + 'cqw'; el.style.top = m.y.toFixed(2) + 'cqw';
      drawPoem();
    }
    function onUp(e, id) {
      if (!drag || drag.id !== id) return;
      drag = null; S.dragging = null;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
      draw();
    }
    function onKey(e, id) {
      var dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }, d = dirs[e.key];
      if (!d) return;
      e.preventDefault();
      var el = e.currentTarget, bi = info(el), m = find(id);
      if (!bi || !m) return;
      var step = e.shiftKey ? 4 : 1, w = el.offsetWidth * bi.k, h = el.offsetHeight * bi.k, H = bi.r.height * bi.k;
      S.glide = false;
      m.x = Math.max(0, Math.min(100 - w, m.x + d[0] * step));
      m.y = Math.max(0, Math.min(H - h, m.y + d[1] * step));
      draw();
    }

    /* ----- actions ----- */
    function shuffle() {
      var arr = S.magnets.filter(function (m) { return !inSign(m); });
      for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
      applyTray(arr); S.glide = true; S.note = ''; draw();
    }
    function sweep() { // sign words first, then the tray, all back into the tray layout
      applyTray(byPosition(S.magnets.filter(inSign)).concat(byPosition(S.magnets.filter(function (m) { return !inSign(m); }))));
    }
    function clearSign() { sweep(); S.glide = true; S.note = ''; draw(); }
    function tidy() { buildLayout(); S.glide = true; S.dragging = null; S.note = ''; S.nextId = 1; draw(); }
    function addWord(raw) {
      var word = clean(raw).slice(0, 14);
      if (!word || S.magnets.length >= 70) return false;
      var fresh = { id: 'c' + S.nextId, w: word, s: sizes[1], bg: 'var(--teal)', x: 3, y: signH + bandH + 2, z: S.z + 1, r: -1.5 };
      var tray = byPosition(S.magnets.filter(function (m) { return !inSign(m); }));
      applyTray([fresh].concat(tray), [fresh]);
      S.glide = true; S.note = 'Magnet added at the start of the tray.'; S.nextId += 1; S.z += 1; draw();
      return true;
    }
    function pin(signer) {
      var lines = readLines();
      if (!lines.length) { S.note = 'Put some words on the sign first.'; draw(); return false; }
      var mine = store.get('wall', []);
      var id = Date.now();
      store.set('wall', [{ lines: lines, by: String(signer || '').trim() || 'a visitor', rot: id % 2 ? -1.5 : 1.8, dy: (id % 3) * 6 }].concat(mine).slice(0, 9));
      sweep(); S.glide = true; S.note = 'Pinned to the wall. Thank you.'; draw();
      document.dispatchEvent(new CustomEvent('pov:wall'));
      return true;
    }
    function remix(poem) {
      var pool = S.magnets.slice(), used = {}, rows = [], nextId = S.nextId;
      poem.lines.slice(0, 5).forEach(function (line) {
        var row = [];
        line.split(' ').filter(Boolean).slice(0, 6).forEach(function (word) {
          var lw = clean(word);
          if (!lw) return;
          var m = pool.filter(function (x) { return x.w === lw && !used[x.id]; })[0];
          if (!m) {
            m = { id: 'c' + nextId, w: lw, s: sizes[nextId % sizes.length], bg: 'var(--teal)', x: 0, y: 0, z: S.z + 1, r: 0 };
            nextId += 1; pool.push(m);
          }
          used[m.id] = true; row.push(m);
        });
        if (row.length) rows.push(row);
      });
      var sp = packLines(rows.map(function (r) { return r.map(function (m) { return { id: m.id, w: m.w, s: m.s }; }); }), 3, gap);
      var t = trayLayout(byPosition(pool.filter(function (m) { return !used[m.id]; })));
      S.magnets = pool.map(function (m) {
        return used[m.id] ? Object.assign({}, m, { x: sp.pos[m.id].x, y: sp.pos[m.id].y, r: ((m.w.length % 3) - 1) * 0.8 }) : Object.assign({}, m, { x: t.pos[m.id].x, y: t.pos[m.id].y });
      });
      S.boardH = t.boardH; S.nextId = nextId; S.glide = true;
      S.note = 'Poem loaded onto the sign. Move the words around to make it yours.';
      draw();
    }

    /* ----- wiring ----- */
    root.addEventListener('click', function (e) {
      var g = e.target.closest('[data-mg]');
      if (g) { ({ shuffle: shuffle, clear: clearSign, reset: tidy })[g.dataset.mg](); return; }
      var r = e.target.closest('[data-remix]');
      if (r) { var p = wallItems()[+r.dataset.remix]; if (p) { remix(p); board.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
    });
    root.addEventListener('submit', function (e) {
      var f = e.target.closest('[data-form]');
      if (!f || (f.dataset.form !== 'addword' && f.dataset.form !== 'pin')) return;
      e.preventDefault();
      var fd = new FormData(f);
      if (f.dataset.form === 'addword') { if (addWord(fd.get('word'))) f.reset(); else { S.note = 'Type a word first (letters only).'; draw(); } }
      else if (pin(fd.get('signer'))) f.reset();
    });

    buildLayout(); draw();
  }

  /* start both boards, then keep the wall in step */
  Board($('.view-d'), false);
  Board($('.view-m'), true);
  renderWall();
  document.addEventListener('pov:wall', renderWall);
  document.addEventListener('pov:rerender', renderWall);
})();
