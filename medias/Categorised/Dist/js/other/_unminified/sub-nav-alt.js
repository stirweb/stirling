(function () {
  var menu = document.getElementById('sub-nav-alt__menu');
  var header = document.querySelector('.c-sub-nav-alt');
  var windowSize = stir.MediaQuery.current;
  if (!menu) return;
  if (windowSize === 'medium' || windowSize === 'small' || windowSize === 'large') menu.classList.add("stir__slideup");

  /*
   * Event: Chevron clicks
   */
  header.addEventListener('click', function (e) {
    if (e.target.matches('#c-sub-nav-alt-toggle-link .uos-chevron-down')) {
      if (!menu.classList.contains("stir__slidedown")) {
        menu.classList.add('stir__slidedown');
        e.preventDefault();
      } else {
        menu.classList.remove('stir__slidedown');
        e.preventDefault();
      }
    }
  }, false);

  /*
   * Window size changed on the fly - make the menu work
   */
  window.addEventListener('MediaQueryChange', function (e) {
    var newSize = stir.MediaQuery.current;
    if (newSize !== windowSize) {
      if (newSize === 'xlarge' || newSize === 'xxlarge') {
        menu.classList.remove('stir__slidedown');
        menu.classList.remove('stir__slideup');
      }
      if (newSize === 'medium' || newSize === 'small' || newSize === 'large') menu.classList.add("stir__slideup");
      windowSize = newSize;
    }
  }, false);
})();