/*
 * Sticky menu show/hide
 * @author: Ryan Kaye / Robert Morrison
 */

(function () {


	const el = document.querySelector(".u-sticky")
	const observer = new IntersectionObserver(
		([e]) => {
			e.target.classList.toggle("stuck", !e.isIntersecting);
			document.body.style.overflowAnchor = e.isIntersecting ? "auto":"none";
		},
		{ threshold: [1] }
	);

	observer.observe(el);


	return;

	/*
	 * DOM elements
	 */

	var stickyMenu = stir.node(".c-course-title-sticky-menu");
	var stickyCloseBtn = stir.node("#course-sticky-close-btn");
	var buttonBox = stir.node(".c-course-title__buttons"); // Once off screen the sticky kicks in

	/*
	 * Vars
	 */

	var enableSticky = true; // (MUTATIONS!!)

	/*
	 * ON LOAD
	 */

	if (!stickyMenu) return;

	var showPosition = buttonBox ? buttonBox.offsetTop + buttonBox.offsetHeight : 0;

	//  if (stir.MediaQuery.current !== "small") {
	stickyMenu.classList.add("stir__slideup");
	stickyMenu.style.display = "block";

	if (buttonBox) {
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
