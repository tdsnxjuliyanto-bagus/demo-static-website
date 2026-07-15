/* Set tema sebelum paint untuk mencegah flash. Dimuat blocking di <head>.
   Eksternal (bukan inline) agar patuh CSP script-src 'self'. */
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  document.documentElement.classList.remove('no-js');
})();
