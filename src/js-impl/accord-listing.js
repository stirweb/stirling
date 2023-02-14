/*
 * Alternative accordion component
 * Converts a T4 Link menu nav object with class accordion-listing.
 * @author: Ryan Kaye
 * @date: 2021-06-16
 * @version: 1
 */

(function (accordLists) {

    /*
     * Away we go: Get all accordions on page then loop all accordion components
     */

	if(!accordLists) return;

	Array.prototype.forEach.call(accordLists, function (item, index) {
		buildAccordion(item, index);
	});

    /*
     * Function: Config an accordion on load so its ready to use
     */
    function buildAccordion(item, index) {
        var headingId = "accordlist-control-" + index;
        var contentId = "accordlist-panel-" + index;

        var headings = item.querySelectorAll(".accordion-listing > ul > li > ul > li > a");
        var contents = item.querySelectorAll(".accordion-listing > ul > li > ul > li > ul");

        // Heading buttons - add new attributes / listen for clicks
        Array.prototype.forEach.call(headings, function (heading, index2) {
            heading.setAttribute("id", headingId + index2);
            heading.setAttribute("aria-controls", contentId + index2);
            heading.setAttribute("aria-expanded", "false");
            heading.addEventListener("click", accordionClick);
        });

        // Content Panels - add new attributes
        Array.prototype.forEach.call(contents, function (content, index2) {
            content.setAttribute("id", contentId + index2);
            content.classList.add("hide");
            content.setAttribute("role", "region");
            content.setAttribute("hidden", "true");
            content.setAttribute("aria-labelledby", headingId + index2);
        });
    }

    /*
     * Function: Deal with heading button click events
     * ie open or close the content box
     */
    function accordionClick(e) {
        e.preventDefault();
        var heading = e.target;
        var content = e.target.parentNode.children[1];

        content.classList.toggle("hide");
        if (content.classList.contains("hide")) setCloseAttributes(content, heading);
        if (!content.classList.contains("hide")) setOpenAttributes(content, heading);
    }

    /*
     * Function: Updates accessibilty attributes for close state
     */
    function setCloseAttributes(content, heading) {
        content.setAttribute("hidden", "true");
        heading.setAttribute("aria-expanded", "false");
    }

    /*
     * Function: Updates accessibilty attributes for open state
     */
    function setOpenAttributes(content, heading) {
        content.removeAttribute("hidden");
        heading.setAttribute("aria-expanded", "true");
    }

})(document.querySelectorAll(".accordion-listing"));