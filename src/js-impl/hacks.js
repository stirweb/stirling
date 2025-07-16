/**
 * Hacks for Stirling
 * These are hacks for browsers that do not support certain features or have specific bugs.
 */

/**
 * Hacks for Half and Half component
 * This hack is for browsers that do not support the nth-of-type selector correctly.
 * It adds a class to the second half of the component to ensure correct styling.
 */
(function () {
  document.querySelectorAll(".c-half-n-half:nth-of-type(even)").forEach((elem) => {
    const e = elem.querySelector(".u-hook");
    e.classList.add("u-hook-bl");
    e.classList.remove("u-hook-tr");
  });
})();

/*
 * Object Fit hack
 * For browsers that dont support object fit
 * Will remove the image tag and instead add a inline background image style
 * @author: Ryan Kaye
 *

(function () {
  var els = stir.nodes("[data-objectfit]");

  if (!els) return;

  if (els.length > 0 && "objectFit" in document.documentElement.style === false) {
    for (var i = 0; i < els.length; i++) {
      if (els[i].children[0]) {
        var src = els[i].children[0].getAttribute("src");
        els[i].removeChild(els[i].children[0]);
        els[i].style.backgroundImage = "url(" + src + ")";
      }
    }
  }
})();

/*
 * Pullquote fixes for Old Edge and IE
 * @author: Ryan Kaye
 *

(function () {
  if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
    var el = stir.nodes(".pullquote");

    if (el) {
      for (var i = 0; i < el.length; i++) {
        el[i].style.borderRight = "15px solid #fff";
      }
    }

    var el = stir.nodes(".pullquote-vid>div.responsive-embed");
    if (el) {
      for (var i = 0; i < el.length; i++) {
        el[i].style.minHeight = parseInt(el[i].offsetWidth / 1.78 + 20) + "px";
      }
    }
  }
})();

/*
 * .c-link fix for Safari chevron
 * @author: Ryan Kaye
 */

(function () {
  if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1) {
    var els = stir.nodes(".c-link");
    if (els) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("safariFix");
    }
  }
})();
