/**
* SEARCH AUTO-SUGGEST
* @author: Robert Morrison <r.w.morrison@stir.ac.uk>
*/

// we will add some new modules to the stir library
var stir = stir || {};

/**
* Concierge
* Instantiated below with `new stir.Concierge();`
*/
stir.Suggester = function Suggester(input,output) {
	if (!stir.addSearch) return;
	if(!input) return;

	let prevQuery = "";
	let suggestions = [];
	let spointer = 0;
	let isSuggesting = false;
	
	const keyUpTime = 255; // milliseconds; keystroke idle time, i.e. stopped typing
	const minQueryLength = 3; // min query length for activating the suggest box
	
	const announcer = document.createElement('div');
	announcer.classList.add('show-for-sr'); // screen readers only
	announcer.setAttribute('aria-live','assertive'); // announce changes immediately
	input.insertAdjacentElement("afterend",announcer);
	
	//input.addEventListener("focus", focusing);
	input.addEventListener("input", stir.debounce(handleInput, keyUpTime));
	input.addEventListener("keydown", escaping);
	output.addEventListener("click", event => {
		if("LI"===event.target.tagName) {
			input.value = event.target.textContent;
			close();
			isSuggesting = false;
			input.focus();
		}
	});
	
	const clamp = (num,min,max) => Math.min(Math.max(num, min), max);


// R E N D E R E R S

	function renderSuggestions(data) {
		output.innerHTML = '';
		suggestions = [];
		spointer = 0;
		if(data.suggestions && data.suggestions.length && data.suggestions.length > 0) {
			suggestions = [...data.suggestions.map(suggestion)];
			output.append(...suggestions);
			output.removeAttribute("aria-hidden");
			announcer.textContent = `${suggestions.length} suggestions found, use up and down arrows to review.`;
		}
	}
	
	function suggestion(item, index) {
		const el = document.createElement('li');
		el.id=`suggestion_${index}`;
		el.href="#";
		el.textContent = item.value;
		el.setAttribute("role","option");
		return el;
	}


// E V E N T   H A N D L E R   F U N C T I O N S
	function handleInput(event) {
		if (this.value != prevQuery) {
			if (this.value.length >= minQueryLength) {
				prevQuery = this.value;
				stir.addSearch.getSuggestions(this.value, renderSuggestions);
			}
		}
	}

	function escaping(event) {
		switch (event.key) {
			case 'Escape':
				if(!output.hasAttribute("aria-hidden")) {
					isSuggesting = false;
					close();
					halt(event);
					break;
				}
			case 'ArrowUp':
				// highlight prev item
				if(isSuggesting) spointer = clamp(spointer-1, 0, suggestions.length-1);
				highlight();
				halt(event);
				break;
			case 'ArrowDown':
				// highlight next item
				if(isSuggesting) spointer = clamp(spointer+1, 0, suggestions.length-1);;
				highlight();
				halt(event);
				break;
			case 'Enter':
				if(isSuggesting) {
					input.value = suggestions[spointer].textContent;
					isSuggesting = false;
					close();
					halt(event);
					break;
				}
		}
	}
	
	function halt(event) {
		event.stopPropagation();
		event.preventDefault();
	}
	
	function highlight() {
		if(suggestions[spointer]) {
			isSuggesting = true;
			suggestions.forEach(i=>i.removeAttribute("data-hilit"));
			suggestions[spointer].setAttribute("data-hilit","true");
			input.setAttribute("aria-activedescendant", `suggestion_${spointer}`);
		}
	}
	
	function close() {
		isSuggesting = false;
		spointer = 0;
		output.setAttribute("aria-hidden","true");
		output.innerHTML = '';
	}

};
