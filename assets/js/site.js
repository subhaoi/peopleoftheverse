/* ==========================================================
   People of the Verse: site runtime (vanilla JS, no build)

   The pages are generated from the design, so every page holds
   both the desktop layout (.view-d) and the mobile layout
   (.view-m). This script makes them work:
   - fills placeholders from content.js (data-p, data-ph, data-href)
   - draws the repeated rows (lineup, notes, FAQ, wall)
   - runs the demo forms (saved in this browser only)
   - the Playground panel for the team
   ========================================================== */
(function () {
  'use strict';

  var C = window.POV_CONTENT;
  var page = document.body.dataset.page || 'home';

  /* ---------- helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  var get = function (obj, path) { return String(path).split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('pov.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('pov.' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
    del: function (k) { try { localStorage.removeItem('pov.' + k); } catch (e) { /* storage blocked */ } }
  };

  var theme = Object.assign({ mode: 'live', colors: {}, grid: true, still: false }, store.get('theme', {}));
  var D = function () { return C[theme.mode] || C.live; };

  /* ---------- mini template engine (for the repeated rows) ---------- */
  function balanced(str, tag, from) {
    var open = '<' + tag, close = '</' + tag + '>', depth = 1, pos = from;
    while (depth > 0) {
      var o = str.indexOf(open, pos), c = str.indexOf(close, pos);
      if (c < 0) return [str.slice(from), str.length];
      if (o >= 0 && o < c && /[\s>]/.test(str.charAt(o + open.length))) { depth++; pos = o + open.length; }
      else { depth--; pos = c + close.length; if (!depth) return [str.slice(from, c), pos]; }
    }
  }
  var attr = function (tag, name) { var m = new RegExp('\\b' + name + '="([^"]*)"').exec(tag); return m ? m[1] : ''; };
  var holeName = function (v) { var m = /\{\{\s*([\w.]+)\s*\}\}/.exec(v || ''); return m ? m[1] : ''; };
  function renderTpl(str, ctx) {
    var re = /<sc-(for|if)\b/g, out = '', pos = 0, m;
    var sub = function (s) { return s.replace(/\{\{\s*([\w.]+)\s*\}\}/g, function (_, p) { return esc(get(ctx, p)); }); };
    while ((m = re.exec(str))) {
      var gt = str.indexOf('>', m.index), tag = str.slice(m.index, gt + 1);
      var b = balanced(str, 'sc-' + m[1], gt + 1);
      out += sub(str.slice(pos, m.index));
      if (m[1] === 'for') {
        var list = get(ctx, holeName(attr(tag, 'list'))) || [], as = attr(tag, 'as');
        for (var i = 0; i < list.length; i++) {
          var c2 = Object.assign({}, ctx); c2[as] = list[i];
          out += renderTpl(b[0], c2);
        }
      } else if (get(ctx, holeName(attr(tag, 'value')))) {
        out += renderTpl(b[0], ctx);
      }
      pos = b[1]; re.lastIndex = pos;
    }
    return out + sub(str.slice(pos));
  }

  /* fill every [data-list=name] (inside root) with one copy of its template per item */
  function fill(name, items, root) {
    $$('[data-list="' + name + '"]', root).forEach(function (list) {
      var tpl = list.previousElementSibling;
      if (!tpl || tpl.tagName !== 'TEMPLATE') return;
      var as = tpl.dataset.as, html = tpl.innerHTML;
      list.innerHTML = items.map(function (it, i) {
        var ctx = {}; ctx[as] = Object.assign({ i: i }, it); return renderTpl(html, ctx);
      }).join('');
    });
  }
  function setIf(name, on, root) {
    $$('[data-if="' + name + '"]', root).forEach(function (el) { el.hidden = !on; });
  }
  function bind(name, text, root) {
    $$('[data-bind="' + name + '"]', root).forEach(function (el) { el.textContent = text; });
  }

  /* ---------- theme ---------- */
  function applyTheme() {
    var root = document.documentElement.style;
    ['teal', 'yellow', 'deep', 'paper', 'mist'].forEach(function (k) {
      if (theme.colors[k]) root.setProperty('--' + k, theme.colors[k]); else root.removeProperty('--' + k);
    });
    if (theme.colors.teal || theme.colors.deep) root.setProperty('--dark', 'color-mix(in srgb, var(--teal) 60%, var(--deep))');
    else root.removeProperty('--dark');
    document.body.classList.toggle('no-grid', !theme.grid);
    document.body.classList.toggle('still', !!theme.still);
  }

  /* ---------- content binding ---------- */
  function bindContent() {
    var d = D();
    $$('[data-p]').forEach(function (el) {
      if (el.dataset.orig == null) el.dataset.orig = el.textContent;
      var v = get(d, el.dataset.p);
      el.textContent = v == null || v === '' ? el.dataset.orig : v;
      if (el.dataset.p === 'links.email') {
        var a = el.closest('a');
        if (a && /@/.test(el.textContent)) a.setAttribute('href', 'mailto:' + el.textContent);
      }
    });
    $$('[data-ph]').forEach(function (el) {
      if (el.dataset.orig == null) el.dataset.orig = el.textContent;
      var v = get(d, el.dataset.ph), parent = el.parentElement;
      if (v) {
        if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        el.style.cssText = 'position:absolute;inset:0;display:block';
        el.innerHTML = '<img src="' + esc(v) + '" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">';
      } else {
        el.style.cssText = ''; el.textContent = el.dataset.orig;
      }
    });
    $$('[data-href]').forEach(function (el) {
      var v = get(d, el.dataset.href);
      if (v != null) el.setAttribute('href', v);
    });
    $$('[data-yt]').forEach(function (el) { el.textContent = d.links.youtube === '#' ? '[link soon]' : '↗'; });
  }

  /* ---------- lists ---------- */
  var LINEUP = function () {
    var d = D();
    var rows = [{ title: 'Feature poet', sub: d.next.featureLong, mins: '12 MIN', bg: 'var(--yellow)', row: 'var(--yellow)', border: '3px solid var(--deep)' }];
    d.poets.forEach(function (p) { rows.push({ title: 'Poet', sub: p, mins: '5 MIN', bg: 'var(--paper)', row: 'transparent', border: '3px solid transparent' }); });
    for (var i = 0; i < 2; i++) rows.push({ title: 'Spot Slot', sub: 'A poet from the audience', mins: '', bg: 'var(--mist)', row: 'var(--paper)', border: '3px dashed var(--deep)' });
    return rows;
  };
  var NOTE_BG = ['var(--paper)', 'var(--mist)', '#ffffff'];
  var NOTE_LOOK = [{ rot: -3, dy: 0 }, { rot: 2, dy: 14 }, { rot: -1.5, dy: 4 }];
  var NOTES = function () {
    var mine = store.get('notes', []).map(function (n) { return { text: n.text, rot: n.rot, dy: n.dy, bg: NOTE_BG[n.id % 3] }; });
    var base = D().notes.map(function (t, i) { return { text: t, rot: NOTE_LOOK[i % 3].rot, dy: NOTE_LOOK[i % 3].dy, bg: NOTE_BG[(i * 2) % 3] }; });
    return mine.concat(base).slice(0, 12);
  };
  var openFaq = 0;
  var FAQS = function () {
    return C.faq.map(function (f, i) {
      var open = i === openFaq;
      return { q: f.q, a: f.a, open: open, expanded: open ? 'true' : 'false', mark: open ? '−' : '+', i: i };
    });
  };
  var LISTS = { lineup: LINEUP, notes: NOTES, faqs: FAQS };

  function renderLists() { Object.keys(LISTS).forEach(function (k) { fill(k, LISTS[k]()); }); }

  /* ---------- slip (Spot Slot sign-up) ---------- */
  function renderSlip() {
    var mine = store.get('myslip', null);
    setIf('slipOpen', !mine); setIf('slipIn', !!mine); setIf('slipErr', false);
    bind('slipNameShow', mine ? mine.name : '');
    refreshPlayground();
  }

  /* ---------- PoV Mag form ---------- */
  function renderMag() {
    var done = store.get('magdone', null);
    setIf('formOpen', !done); setIf('sent', !!done); setIf('err', false);
    bind('nameShow', done ? done.name : '');
    refreshPlayground();
  }

  /* ---------- render everything ---------- */
  function renderAll() {
    bindContent(); renderLists(); renderSlip(); renderMag();
    document.dispatchEvent(new CustomEvent('pov:rerender'));
  }

  /* ---------- events (delegated) ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var act = b.dataset.act;
    if (act === 'menu') {
      var root = b.closest('.view-m') || document;
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'CLOSE' : 'MENU';
      setIf('menuOpen', open, root);
    } else if (act === 'faq') {
      var i = +b.dataset.i; openFaq = openFaq === i ? -1 : i;
      renderLists();
      var again = $('[data-act="faq"][data-i="' + i + '"]', b.closest('.view-d, .view-m'));
      if (again) again.focus();
    } else if (act === 'slip-back') {
      var mine = store.get('myslip', null);
      if (mine) { store.set('slips', store.get('slips', []).filter(function (s) { return s.id !== mine.id; })); store.del('myslip'); }
      renderSlip();
    } else if (act === 'mag-again') {
      store.del('magdone');
      $$('[data-form="mag"]').forEach(function (f) { f.reset(); });
      renderMag();
    }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-form]');
    if (!f) return;
    var kind = f.dataset.form;
    if (kind !== 'slip' && kind !== 'mag' && kind !== 'note') return; // magnets.js handles its own forms
    e.preventDefault();
    var fd = new FormData(f), root = f.closest('.view-d, .view-m');
    var val = function (k) { return String(fd.get(k) || '').trim(); };
    if (kind === 'slip') {
      if (!val('name')) { setIf('slipErr', true, root); return; }
      var slip = { id: Date.now(), name: val('name'), contact: val('contact'), at: new Date().toISOString() };
      store.set('slips', store.get('slips', []).concat(slip)); store.set('myslip', slip);
      $$('[data-form="slip"]').forEach(function (x) { x.reset(); });
      renderSlip();
    } else if (kind === 'note') {
      if (!val('text')) return;
      var id = Date.now(), seed = (id % 97) / 97;
      var note = { id: id, text: val('text'), rot: Math.round((seed - 0.5) * 70) / 10, dy: Math.round(((id % 13) / 13) * 16) };
      store.set('notes', [note].concat(store.get('notes', [])).slice(0, 12));
      $$('[data-form="note"]').forEach(function (x) { x.reset(); });
      fill('notes', NOTES());
    } else if (kind === 'mag') {
      if (!val('name') || !val('email') || !val('poem')) { setIf('err', true, root); return; }
      store.set('magsub', store.get('magsub', []).concat({ name: val('name'), email: val('email'), title: val('title'), poem: val('poem'), at: new Date().toISOString() }));
      store.set('magdone', { name: val('name') });
      renderMag();
    }
  });

  document.addEventListener('input', function (e) {
    var f = e.target.closest('[data-form]');
    if (!f) return;
    var root = f.closest('.view-d, .view-m');
    setIf('slipErr', false, root); setIf('err', false, root);
  });

  /* ---------- Playground panel ---------- */
  var pg;
  function refreshPlayground() {
    if (!pg) return;
    var s = store.get('slips', []);
    $('[data-pg-slips]', pg).textContent = s.length + (s.length === 1 ? ' slip' : ' slips') + ' in the box · ' + store.get('magsub', []).length + ' mag submission(s)';
  }
  function buildPlayground() {
    if (C.config.playground === false) return;
    var btn = document.createElement('button');
    btn.className = 'pg-btn'; btn.type = 'button'; btn.textContent = 'PLAYGROUND'; btn.setAttribute('aria-expanded', 'false');
    pg = document.createElement('aside');
    pg.className = 'pg'; pg.setAttribute('aria-label', 'Design playground');
    var cv = function (k, lab, fallback) { return '<label>' + lab + '<input type="color" data-color="' + k + '" value="' + (theme.colors[k] || fallback) + '" aria-label="' + lab + ' colour"></label>'; };
    pg.innerHTML =
      '<h2>Playground</h2><small>For the team. Changes stay in your browser only.</small>' +
      '<h3>CONTENT</h3><div class="seg" role="group" aria-label="Content">' +
      '<button type="button" data-mode="live" class="' + (theme.mode === 'live' ? 'on' : '') + '">Placeholders</button>' +
      '<button type="button" data-mode="sample" class="' + (theme.mode === 'sample' ? 'on' : '') + '">Sample content</button></div>' +
      '<small>Sample content is made up, only to see the layout filled.</small>' +
      '<h3>COLOURS</h3><div class="cols">' + cv('teal', 'Teal', '#289F88') + cv('yellow', 'Yellow', '#FEDD59') + cv('deep', 'Deep', '#0E4A3C') + cv('paper', 'Paper', '#FFF9E6') + cv('mist', 'Mist', '#D3EDE3') + '</div>' +
      '<button type="button" class="mini" data-pg="colours">Reset colours</button>' +
      '<h3>LOOK</h3>' +
      '<label class="chk"><input type="checkbox" data-opt="grid" ' + (theme.grid ? 'checked' : '') + '> Graph-paper background</label>' +
      '<label class="chk"><input type="checkbox" data-opt="still" ' + (theme.still ? 'checked' : '') + '> Pause the ticker</label>' +
      '<h3>THE AUDIENCE BOX</h3><div data-pg-slips></div>' +
      '<button type="button" class="mini" data-pg="draw">Draw two slips</button><div data-pg-drawn></div>' +
      '<h3>DEMO DATA</h3><button type="button" class="mini" data-pg="export">Export JSON</button>' +
      '<button type="button" class="mini" data-pg="reset">Reset everything</button>';
    document.body.appendChild(btn); document.body.appendChild(pg);
    btn.addEventListener('click', function () { var o = pg.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pg.classList.contains('open')) { pg.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
    pg.addEventListener('click', function (e) {
      var m = e.target.closest('[data-mode]');
      if (m) { theme.mode = m.dataset.mode; store.set('theme', theme); $$('[data-mode]', pg).forEach(function (b) { b.classList.toggle('on', b === m); }); renderAll(); return; }
      var a = e.target.closest('[data-pg]'); if (!a) return;
      if (a.dataset.pg === 'draw') {
        var s = store.get('slips', []).slice(), out = [];
        while (out.length < 2 && s.length) out.push(s.splice(Math.floor(Math.random() * s.length), 1)[0]);
        $('[data-pg-drawn]', pg).innerHTML = out.length ? '<div class="drawn">Drawn: ' + out.map(function (o) { return esc(o.name); }).join(' and ') + '</div>' : '<div class="drawn">The box is empty. Put a slip in first.</div>';
      } else if (a.dataset.pg === 'colours') {
        theme.colors = {}; store.set('theme', theme); applyTheme();
        var defaults = { teal: '#289F88', yellow: '#FEDD59', deep: '#0E4A3C', paper: '#FFF9E6', mist: '#D3EDE3' };
        $$('[data-color]', pg).forEach(function (i) { i.value = defaults[i.dataset.color]; });
      } else if (a.dataset.pg === 'export') {
        var blob = new Blob([JSON.stringify({ slips: store.get('slips', []), notes: store.get('notes', []), magSubmissions: store.get('magsub', []), wall: store.get('wall', []) }, null, 2)], { type: 'application/json' });
        var link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'pov-demo-data.json'; link.click(); setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
      } else if (a.dataset.pg === 'reset') {
        if (confirm('Clear all demo data, colours and settings in this browser?')) { ['theme', 'slips', 'myslip', 'notes', 'magsub', 'magdone', 'wall'].forEach(store.del); location.reload(); }
      }
    });
    pg.addEventListener('input', function (e) {
      var c = e.target.closest('[data-color]');
      if (c) { theme.colors[c.dataset.color] = c.value; store.set('theme', theme); applyTheme(); return; }
      var o = e.target.closest('[data-opt]');
      if (o) { theme[o.dataset.opt] = o.checked; store.set('theme', theme); applyTheme(); }
    });
    refreshPlayground();
  }

  /* ---------- shared with magnets.js ---------- */
  window.POV = { store: store, esc: esc, C: C, data: D, fill: fill, setIf: setIf, bind: bind, renderTpl: renderTpl };

  /* ---------- go ---------- */
  applyTheme();
  renderAll();
  buildPlayground();
  refreshPlayground();
  document.dispatchEvent(new CustomEvent('pov:ready'));
})();
