/**
 * 
 * Research Hub Profile Page Links
 * 
 * 2018-08-01 4.22pm rwm2 r.w.morrison@stir.ac.uk
 * 2021-10-06 4.42pm rwm2 r.w.morrison@stir.ac.uk
 * 
 * Simple Ajax call to a Research Hub endpoint. If the user is logged in to
 * the Portal, they will have the `paokv0` cookie set. The cookie contains
 * their username, which can be used to cross-reference their Worktribe ID.
 * 
 * Research Hub URLs are based on Worktribe ID so it's trivial to get the
 * profile page link if you know the person's ID.
 * 
 * Rewritten 2021 to remove jQuery.
 */

console.info(stir);
console.info("[Hubbub] 1")

var stir = stir||{};
console.info("[Hubbub] 2");

(function() {
	console.info("[Hubbub] 3")

	console.info("[Hubbub] init")
    
    function hubbub(hub,worktribe) {
        
        var settings = {
            url: "https://www.stir.ac.uk/research/hub/me?format=json",
            dataType: "jsonp",
            hub: {
                target: ".research-hub-profile-link",
                class: "button hollow",
                text: "View your profile"
            },
            worktribe: {
              target: ".research-hub-edit-link",
              class: "button hollow",
              text: "Edit your profile"
            },
            action: action
        };

		function action(data) {
			console.info(data)
			if (!data) return;
			var hubEl = document.querySelector(settings.hub.target);
			if (data.public && data.url && hubEl) {
				hubEl.insertAdjacentHTML("beforeend",'<a href="https://www.stir.ac.uk' + data.url + '" class="'+settings.hub.class+'">'+settings.hub.text+'</a>');
			}
			if(data.worktribeID && workEl) {
				workEl.insertAdjacentHTML("beforeend", '<a href="https://stirling-research.worktribe.com/record.jx?recordid=' + data.worktribeID + '" class="'+settings.worktribe.class+'">'+settings.worktribe.text+'</a>')
			}
		}

		if(hub) settings.hub.target = hub;
		if(worktribe) settings.worktribe.target = hub;

		console.info(settings.url)
		stir.load(settings.url, function(data) {console.info({data:data})});

		stir.getJSON(settings.url, settings.action);

        /* var that = this;
        $.ajax(settings.url, {
            dataType: settings.dataType
        }).done( function(data) {
               settings.action.call(that, data);

        }); */

    }

	hubbub('[id="d.en.41071"] .c-promo-box__content > div','[id="d.en.41069"] .c-promo-box__content > div');


})();