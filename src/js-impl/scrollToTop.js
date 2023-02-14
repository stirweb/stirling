/**
 * Scroll back to the top button
 */
(function(backToTopButton) {

	var element; // the observed element

    if(backToTopButton) {
        backToTopButton.addEventListener("click", function() {
            stir.scrollTo(0,0);
		});

		if(element = document.querySelector('#layout-header')) {
			stir.createIntersectionObserver({
				element: element,
				threshold: [0,1],
				callback: function(entry) {
					if(entry.intersectionRatio>0) {
						backToTopButton.classList.remove("c-scroll-to-top__visible");
					} else {
						backToTopButton.classList.add("c-scroll-to-top__visible");
					}
				}
			});
		}
    }

})(document.querySelector(".c-scroll-to-top"));