// pending -- edit to reference each of the static pages.
// Ensure that this does not break upon adding a new page. If you lose your header or footer, or any include,
// it probably has to do with this file.
// js/include.js
(() => {
  const injectPartials = async () => {
    const targets = Array.from(document.querySelectorAll('[data-include]'));
    if (!targets.length) return;

    const get = async (url) => {
      const r = await fetch(url, { credentials: 'same-origin' });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return r.text();
    };

    // Replace placeholders with fetched HTML
    for (const el of targets) {
      const url = el.getAttribute('data-include');
      try {
        const html = await get(url);
        el.outerHTML = html;
      } catch (e) {
        console.warn('Include failed:', url, e);
      }
    }

    // Wait a bit for nav to load into DOM
    setTimeout(() => {
      const currentPath = window.location.pathname;
      const currentFile = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

      document.querySelectorAll(`nav.site-nav a[href$="${currentFile}"]`).forEach((a) => {
        a.classList.add('is-active');
      });
    }, 50); // slight delay to ensure injected nav is present
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPartials);
  } else {
    injectPartials();
  }
})();
