/* 
 *
 * Cookie Banner Code
 *
*

(function(){
	if(window.location.hostname.indexOf('stir.ac.uk')>-1) return;
    if(!window.Cookies) return;
    if(Cookies.get("cookiebanner")) return;

    // set up our elements
    var banner = document.createElement('section');
    var action = document.createElement('button');
    var url = 'https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/policy-and-planning/legal-compliance/data-protectiongdpr/privacy-notices/users-of-the-universitys-website/';
    var message = (function() {
        if (window.location.hostname === "www.stir.ac.uk") {
            // Banner message for the main website:
            return '<p>The University of Stirling uses cookies for advertising and analytics. Read our <a href="'+url+'">website privacy notice</a> to find out more.</p>';
        }
        // banner message for the satellite sites:
        return '<p>This site is hosted by The University of Stirling. Read our <a href="'+url+'">website privacy notice</a> to find out more about how we use cookies.</p>';
    })();

    // apply attributes and classes
    banner.setAttribute("id", "cookiebanner");
	banner.setAttribute("aria-label", "cookie-banner");
	banner.setAttribute("class", "u-bg-grey");
    action.setAttribute("class", 'button button--close');
    action.innerText = "Close";

    // build HTML and add to DOM
    banner.insertAdjacentHTML("afterbegin", message);
    banner.appendChild(action);
    document.body.appendChild(banner);

    // listen for click events
    action.addEventListener('click', closeCookieBanner);

    function closeCookieBanner() {
        // Set cookie so banner no longer appears on subsequent page loads
        Cookies.set("cookiebanner", true, { expires: 30 });
        // stop listening for clicks
        action.removeEventListener('click', closeCookieBanner);
        // destroy banner HTML (and references)
        banner.parentNode.removeChild(banner);
        banner = null;
    }
})();
*/