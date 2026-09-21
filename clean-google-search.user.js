// ==UserScript==
// @name         Google Pure Search
// @name:tr      Google Pure Search — Sade Arama
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hides AI features in Google Search and restores available original titles and snippets of automatically translated results.
// @description:tr Google aramasında AI alanlarını gizler; otomatik çevrilen başlık ve özetlerin mevcut orijinallerini gösterir.
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIxNSIgZmlsbD0iIzE2MzI0ZiIvPjxjaXJjbGUgY3g9IjI3IiBjeT0iMjciIHI9IjE1IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIvPjxwYXRoIGQ9Ik0zOCAzOEw1MSA1MSIgc3Ryb2tlPSIjNWVlYWQ0IiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMCAyMWgxNE0yMCAyN2gxMU0yMCAzM2g4IiBzdHJva2U9IiM1ZWVhZDQiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+
// @include      /^https?:\/\/(?:www[.])?google[.](?:com|cat|[a-z]{2}|(?:com|co)[.][a-z]{2})\/search(?:[?#].*)?$/
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  if (location.pathname !== '/search') return;
  const STYLE_ID = 'gcs-style-v8';
  const MARK = 'data-gcs-display';
  const BAR = '[jscontroller="Vxh2ib"]';
  const CARD = '.tF2Cxc, .MjjYud';
  const CANDIDATES = 'a[href*="udm=50"], #eKIzJc, h3.MheKwc, ' + BAR;
  const pending = new Set();
  let scheduled = 0;

  function mark(element, display) {
    if (element.getAttribute(MARK) !== display) element.setAttribute(MARK, display);
  }

  function pair(elements) {
    if (elements.length !== 2) return null;
    const original = elements.filter(el => el.getAttribute('lang')?.trim());
    const translated = elements.filter(el => !el.getAttribute('lang')?.trim());
    if (original.length !== 1 || translated.length !== 1) return null;
    if (!original[0].textContent.trim() || !translated[0].textContent.trim()) return null;
    return { original: original[0], translated: translated[0] };
  }

  function restore(bar) {
    const card = bar.closest(CARD);
    if (!card || !card.closest('#rso, #search')) return;
    const owned = selector => [...card.querySelectorAll(selector)]
      .filter(el => el.closest(CARD) === card);
    const titles = pair(owned('a[data-tli]').filter(a => a.querySelector('h3')));
    const snippets = pair(owned('.Pa9Ggf'));
    if (owned(BAR).length !== 1 || !titles || !snippets ||
        titles.original.lang !== snippets.original.lang ||
        snippets.original.parentElement !== snippets.translated.parentElement) {
      for (const el of owned('[' + MARK + ']')) el.removeAttribute(MARK);
      return;
    }
    for (const item of [titles, snippets]) {
      mark(item.translated, 'none');
      mark(item.original, 'inline');
    }
    mark(bar, 'none');
  }

  function cleanCandidate(el) {
    if (el.matches(BAR)) { restore(el); return; }
    if (el.matches('a[href]')) {
      const card = el.closest(CARD);
      if (card && card.querySelector(BAR)) { restore(card.querySelector(BAR)); return; }
      let isAI = false;
      try {
        const url = new URL(el.getAttribute('href'), location.href);
        isAI = url.origin === location.origin && url.pathname === '/search' &&
          url.searchParams.get('udm') === '50';
      } catch {}
      if (isAI) mark(el, 'none');
      else el.removeAttribute(MARK);
      return;
    }
    if (el.id === 'eKIzJc') { mark(el, 'none'); return; }
    if (el.matches('h3.MheKwc') &&
        /AI Modu|AI Mode|AI Overview|AI Bakışı/.test(el.textContent)) {
      const response = el.closest('.FkX2oe');
      if (response && el.closest('#eKIzJc, .related-question-pair')) mark(response, 'none');
    }
  }

  function scan(root) {
    if (!root.isConnected) return;
    if (root.matches?.(CANDIDATES)) cleanCandidate(root);
    for (const el of root.querySelectorAll(CANDIDATES)) cleanCandidate(el);
  }

  function flush() {
    scheduled = 0;
    const start = performance.now();
    for (const root of pending) {
      pending.delete(root);
      scan(root);
      if (performance.now() - start >= 6) break;
    }
    if (pending.size) scheduled = requestAnimationFrame(flush);
  }

  function enqueue(root) {
    if (!root || root.nodeType !== 1 || !root.isConnected ||
        root.matches('script, style, link, meta')) return;
    for (const existing of pending) {
      if (existing.contains(root)) return;
      if (root.contains(existing)) pending.delete(existing);
    }
    pending.add(root);
    if (!scheduled) scheduled = requestAnimationFrame(flush);
  }

  function start() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = 
      '#eKIzJc, [data-gcs-display="none"] { display: none !important; }' +
      'a[data-gcs-display="inline"], span[data-gcs-display="inline"] { display: inline !important; }';
    (document.head || document.documentElement).append(style);
    scan(document.documentElement);

    const observer = new MutationObserver(records => {
      for (const record of records) {
        const target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
        if (!target || target.closest('script, style')) continue;
        if (record.type === 'attributes') {
          const card = target.closest(CARD);
          if (card && card.querySelector(BAR)) { enqueue(card); continue; }
          if (record.attributeName === 'href' && target.matches('a')) {
            if (target.hasAttribute(MARK) || target.getAttribute('href')?.includes('udm=50')) cleanCandidate(target);
          } else {
            enqueue(target);
          }
          continue;
        }
        const card = target.closest(CARD);
        if (card && card.querySelector(BAR)) { enqueue(card); continue; }
        if (target.matches('h3.MheKwc')) enqueue(target);
        for (const node of record.addedNodes) enqueue(node);
      }
    });
    observer.observe(document.documentElement, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['href', 'lang', 'data-tli', 'jscontroller']
    });
  }

  if (document.documentElement) start();
  else {
    const bootstrap = new MutationObserver(() => {
      if (!document.documentElement) return;
      bootstrap.disconnect();
      start();
    });
    bootstrap.observe(document, { childList: true });
  }
})();



