/**
* SEARCH AUTO-SUGGEST
* @author: Robert Morrison <r.w.morrison@stir.ac.uk>
* 2026-03-16
*/

// we will add some new modules to the stir library
var stir = stir || {};

/**
* Concierge
* Instantiated elsewhere with `new stir.Suggester(input, output, announcer);`
*/
stir.Suggester = function Suggester(input,output,announcer) {
	if(!input || !output || !announcer) return;
	if (!stir.addSearch) return;

	let prevQuery = "";
	let suggestions = [];
	let spointer = 0;
	let isSuggesting = false;
	
	const keyUpTime = 255; // milliseconds; keystroke idle time, i.e. stopped typing
	const minQueryLength = 3; // min query length for activating the suggest box
	
	//input.addEventListener("focus", focusing);
	input.addEventListener("input", stir.debounce(handleInput, keyUpTime));
	input.addEventListener("keydown", actions);
	input.addEventListener("blur", close);
	output.addEventListener("click", clicks);
	
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
			input.setAttribute("data-suggesting","true")
			announcer.textContent = `${suggestions.length} suggestions found, use up and down arrows to review.`;
		} else {
			output.setAttribute("aria-hidden","true");
			input.removeAttribute("data-suggesting");
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

	function clicks(event) {
		if("LI"===event.target.tagName) {
			input.value = event.target.textContent;
			close();
			isSuggesting = false;
			input.focus();
		}
	}

	function handleInput(event) {
		if ("" === this.value) stopSuggesting(event);
		if (this.value != prevQuery) {
			if (this.value.length >= minQueryLength) {
				prevQuery = this.value;
				isSuggesting = false;
				stir.addSearch.getSuggestions(this.value, renderSuggestions);
			}
		}
	}

	function actions(event) {
		switch (event.key) {
			case 'Escape':
				if(!output.hasAttribute("aria-hidden")) {
					stopSuggesting(event);
					break;
				}
				break;
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
					stopSuggesting(event);
					break;
				}
				close();
		}
	}
	
	function stopSuggesting(event) {
		close();
		halt(event);
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
		input.removeAttribute('data-suggesting');
		output.setAttribute("aria-hidden","true");
		output.innerHTML = '';
		announcer.textContent = '';
	}

};
