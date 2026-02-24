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

	let search, results, spinner; // dynamic view managers
	let prevQuery = "";
	let suggestions = [];
	let spointer = 0;
	let isSuggesting = false;
	
	const keyUpTime = 400; // milliseconds; keystroke idle time, i.e. stopped typing
	const minQueryLength = 3; // min query length for activating the suggest box
	
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


	//const renderSuggestions = parseSuggestions.bind(nodes.suggestions);
	
	const clamp = (num,min,max) => Math.min(Math.max(num, min), max);

//  H E L P E R   F U N C T I O N S

	function doSearches(query) {
		stir.addSearch.getSuggestions(query, renderSuggestions);
	}

// R E N D E R E R S

	function renderSuggestions(data) {
		output.innerHTML = '';
		suggestions = [];
		spointer = 0;
		if(data.suggestions && data.suggestions.length && data.suggestions.length > 0) {
			suggestions = [...data.suggestions.map(suggestion)];
			output.append(...suggestions);
			output.removeAttribute("aria-hidden");
		}
	}
	
	function suggestion(item) {
		const el = document.createElement('li');
		el.href="#";
		el.textContent = item.value;
		return el;
	}

// P A R S I N G


// E V E N T   H A N D L E R   F U N C T I O N S
	function handleInput(event) {
		console.info('[Suggester] input',event)
		if (this.value != prevQuery) {

			if (this.value.length >= minQueryLength || this.value === "*") {
				prevQuery = this.value;
				doSearches(this.value);
			}
//			else {
//				spinner.hide();
//				results.hide();
//				prevQuery = "";
//			}
		}
	}

	

	function escaping(event) {
		console.info('[Escaping]',event.key);
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
		//if ("Escape" === event.code) closing(event);
	}
	
	function halt(event) {
		event.stopPropagation();
		event.preventDefault();
	}
	
	function highlight() {
		console.info('[Suggest]',spointer,suggestions[spointer].textContent )
		if(suggestions[spointer]) {
			isSuggesting = true;
			suggestions.forEach(i=>i.removeAttribute("data-hilit"));
			suggestions[spointer].setAttribute("data-hilit","true");
		}
	}
	
	function close() {
		isSuggesting = false;
		spointer = 0;
		output.setAttribute("aria-hidden","true");
	}

};
