/** 
  * Giving Users a Quick Disguised Exit From a Website
  * https://css-tricks.com/website-escape/
  * 
**/

var stir = {} || stir;

stir.websiteEscape = (function() {
    
    function createButton() {
        var button = document.createElement('button');
        button.id = 'get-away';
        button.innerHTML = "↰ Leave this website quickly <br><small>click this button or press <kbd>Esc</kbd> </small>";
        return button;
    }

    function getAway() {
        // Get away right now
        window.open("https://bbc.co.uk", "_newtab");
        // Replace current site with another benign site
        window.location.replace('https://google.com');
    }

    function escape(event) {
        if (event.keyCode == 27) { // escape key
            getAway();
        }
	}
	
	var main = document.querySelector('main') || document.body;
    var button = main.appendChild(createButton());
    button.addEventListener('click', getAway);
    document.addEventListener('keyup', escape);
    return getAway;
})();
