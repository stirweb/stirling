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
    if (e) {
      e.classList.add("u-hook-bl");
      e.classList.remove("u-hook-tr");
    }
  });
})();

/* Hide elements if JavaScript is enabled. Such as some fallback text */
(function () {
  document.querySelectorAll(".hide-if-js").forEach((elem) => {
    elem.classList.add("hide");
  });
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
