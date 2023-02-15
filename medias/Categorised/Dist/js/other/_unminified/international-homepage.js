var stir = stir || {};
(function () {
  var intlObserver = stir.createIntersectionObserver({
    element: document.querySelector('[data-animation="bounceIn"]'),
    threshold: 0.7,
    once: true,
    callback: function callback(entry) {
      if (0 > entry.intersectionRatio || entry.intersectionRatio >= 0.7) {
        this.classList.add("bounceIn");
        intlObserver.observer.unobserve(this);
      }
    }
  });
})();