/*
 * INTERNAL MENUS
 */

/*
 * Main Mobile Burger Menu (Internal)
 * Only used by brandbank and Microsites
 */

(function () {
    var intSideMenu = document.querySelector('.internal-sidebar-menu');

    var intMainMobileBurger = document.getElementById('mobileMenuBurger');
    var intMainMobileNav = document.getElementById('mobilemenulinks');

    var intSubMobileBurger = document.querySelector('.burger--internal-sidebar-menu');
    var intSubMobileNav = document.querySelector(".internal-pages-mobile-menu");

    //var intBurger = document.querySelector('burger--internal-sidebar-menu');
    //var intNav = document.querySelector(".internal-pages-mobile-menu");

    /**
     * Function: show / hide relavent menu (m) 
     * when burger (b) is clicked
     */
    function intMenutoogle(m, b) {
        m.style.display = 'block'; // just in case there is a display none on the el
        if (m.classList.contains("hide")) {
            m.classList.remove("hide");
            b.classList.add("nav-is-open");
        } else {
            m.classList.add("hide");
            b.classList.remove("nav-is-open");
        }
    }

    /**
     * Click events
     */
    if (intMainMobileBurger && intMainMobileNav) {
        intMainMobileBurger.onclick = function (e) {
            intMenutoogle(intMainMobileNav, intMainMobileBurger)
            e.preventDefault();
        };
    }
    if (intSubMobileBurger && intSubMobileNav) {
        intSubMobileBurger.onclick = function (e) {
            intMenutoogle(intSubMobileNav, intSubMobileBurger)
            e.preventDefault();
        };
    }
    /*if (intBurger) {
        intBurger.onclick = function (e) {
            intMenutoogle(intNav, intBurger)
            e.preventDefault();
        }; 
    }*/

    /**
     * On load events
     */
    if (!intSideMenu)
        if (intSubMobileBurger)
            intSubMobileBurger.classList.add('hide'); // remove the sub menu burger if no sub menu

})();


/**
 * INTERNAL SIGNPOST DROPDOWN
 */

var intSignPostBtn = document.getElementById('internal-signpost-dropdown__link');
var intSignPostMenu = document.getElementById('internal-signpost-dropdown__submenu');

if (intSignPostBtn && intSignPostMenu) {
    intSignPostBtn.onclick = function (e) {
        e.stopPropagation();

        if (intSignPostMenu.classList.contains('hide')) {
            intSignPostMenu.classList.remove('hide');
            intSignPostBtn.classList.add('is-active');
        } else {
            intSignPostMenu.classList.add('hide');
            intSignPostBtn.classList.remove('is-active');
        }

        // kill other popups
        UoS_closeAllWidgetsExcept("internalSignpost");

        e.preventDefault();
        return false;
    };

    // Not sure if this is needed
    //intSignPostMenu.onclick = function (e) {
    //e.preventDefault();  
    //};
}

/*
 * Replacement for Foundation dropdown component
 * Used on Brandbank for file picker
 */
(function (scope) {

    if(!scope) return;
    
    var ddPanes = document.querySelectorAll(".dropdown-pane");
    var ddBtns = document.querySelectorAll(".button--dropdown");

    for (var i = 0; i < ddPanes.length; i++) {
        ddPanes[i].classList.add('hide');
    }

    function doClick(el) {
        el.onclick = function (e) {
            e.target.nextElementSibling.classList.toggle('hide');
            e.preventDefault();
        };
    }

    for (var i = 0; i < ddPanes.length; i++) {
        doClick(ddBtns[i]);
    }

})( document.querySelector(".c-download-box") );