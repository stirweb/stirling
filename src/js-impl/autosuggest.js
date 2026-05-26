/**
* SEARCH AUTO-SUGGEST
* @author: Robert Morrison <r.w.morrison@stir.ac.uk>
* 2026-03-16
* see: https://uxmastery.com/anatomy-of-an-accessible-auto-suggest/
* see: https://stackoverflow.com/questions/39439115/how-to-execute-click-function-before-the-blur-function
* see: https://www.w3.org/TR/wai-aria-1.1/#combobox
*/

// we will add some new modules to the stir library
var stir = stir || {};

/**
* Concierge
* Instantiated elsewhere with `new stir.Suggester(input, output, announcer);`
*/
stir.Suggester = function Suggester(combobox,output,announcer) {
	if(!combobox || !output || !announcer) return;
	if (!stir.addSearch) return;

	const input = combobox.querySelector('input');
	let prevQuery = "";
	let suggestions = [];
	let spointer = 0;
	let isSuggesting = false;
	
	const keyUpTime = 255; // milliseconds; keystroke idle time, i.e. stopped typing
	const minQueryLength = 3; // min query length for activating the suggest box
	
	//input.addEventListener("focus", focusing);
	input.addEventListener("input", stir.debounce(handleInput, keyUpTime));
	input.addEventListener("keydown", actions);
	input.addEventListener("blur", unfocus); // will also handle mouse clicks
	
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
			combobox.setAttribute("aria-expanded","true");
			announcer.textContent = `${suggestions.length} suggestions found, use up and down arrows to review.`;
		} else {
			output.setAttribute("aria-hidden","true");
			combobox.setAttribute("aria-expanded","false");
		}
	}
	
	function suggestion(item, index) {
		const el = document.createElement('li');
		el.id=`suggestion_${index}`;
		el.href="#";
		el.textContent = item.value;
		el.setAttribute("tabindex","-1"); // receive focus but not tabbable
		el.setAttribute("role","option"); // a11y
		return el;
	}


// E V E N T   H A N D L E R   F U N C T I O N S

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
		if(combobox.getAttribute("aria-expanded")!=="true") return;
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
	
	function unfocus(event) {
		if(event.relatedTarget && event.relatedTarget.role) {
			input.value = event.relatedTarget.textContent;
			input.focus();
			close();
		} else close();
	}
	
	function close() {
		if(!output.hasAttribute("aria-hidden")) {
			isSuggesting = false;
			spointer = 0;
			combobox.setAttribute("aria-expanded","false");
			output.setAttribute("aria-hidden","true");
			output.innerHTML = '';
			announcer.textContent = '';
		}
	}

};
