
// this will swap the native action for js-action. Useful for search
// forms where we want non-js situations to be able to submit
// to the Funnelback page, but js situations (i.e. using the search api) to submit to
// the js action page
(function(forms) {
    for(var i=0; i<forms.length; i++) {
        forms[i].action = forms[i].getAttribute('data-js-action') || forms[i].action;
    }
})(Array.prototype.slice.call(document.querySelectorAll("form[data-js-action]")));

/**
 *  T4 Form submit - outputs this message on all submits - but is only seen if the form fails to submit
 
 NOW IN THE T4 FORM CONTENT TYPE TEXT/FOOT

(function() {
    document.addEventListener('click', function (e) {
        if (e.target.matches('.js-submit')) {
    		// remove any earlier error messages
    		var el = document.getElementsByClassName("form-message")[0];
    		if(el)
    		    el.parentNode.removeChild(el);
            
            setTimeout(function() {
                // output the message after a slight delay
                var html = '<div class="clearfix"></div><p class="has-error form-message">You have missed some required fields in the form. Please complete these then click submit again.</p>';
                document.querySelectorAll('.c-form .js-submit')[0].insertAdjacentHTML('afterend', html);
            }, 500);
    	}
    }, false);
})();
 */