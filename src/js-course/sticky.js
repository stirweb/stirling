/*
 * Sticky menu show/hide
 * @author: Ryan Kaye / Robert Morrison
 */

(function () {
  /*
   * DOM elements
   */

  const stickyMenu = stir.node(".c-course-title-sticky-menu");
  const stickyCloseBtn = stir.node("#course-sticky-close-btn");
  const stickyInitTarget = stir.node("[data-action='activatesticky']"); // Once off screen the sticky kicks in

  /*
   * Vars
   */

  let enableSticky = true;

  /*
   * ON LOAD
   */

  if (!stickyMenu) return;

  const showPosition = stickyInitTarget ? stickyInitTarget.offsetTop + stickyInitTarget.offsetHeight : 0;

  //  if (stir.MediaQuery.current !== "small") {
  stickyMenu.classList.add("stir__slideup");
  stickyMenu.style.display = "block";

  if (stickyInitTarget) {
    window.addEventListener("scroll", scrollPositionChecker); // listen for scrolling
  }

  if (stickyCloseBtn) {
    stickyCloseBtn.onclick = function (e) {
      enableSticky = false;
      window.removeEventListener("scroll", scrollPositionChecker); // stop listening for scrolling
      stickyMenu.parentNode.removeChild(stickyMenu);
      e.preventDefault();
    };
  }
  //  }

  /* -----------------------------------------------
   * Decides whether to how or hide the sticky based on scroll position
   * ---------------------------------------------- */
  function showHideSticky() {
    if (enableSticky) {
      if (window.scrollY > showPosition) stickyMenu.classList.add("stir__slidedown");
      if (window.scrollY < showPosition) stickyMenu.classList.remove("stir__slidedown");
    }
  }

  /* -----------------------------------------------
   * Changed this to a named function so we can easily "removeEventListener" when
   * we no longer need it. (Anonymous functions can be added but not removed). [rwm2]
   * ---------------------------------------------- */
  function scrollPositionChecker() {
    window.requestAnimationFrame(showHideSticky);
  }
})();
