var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};

/**
 * Fees region (e.g. home/eu) selector
 * @param {*} scope DOM element that wraps the fees information (selector and table, etc).
 */
(function (scope) {    
    if (!scope) return;
    var select  = scope.querySelector('select');
    var table   = scope.querySelector('table');
	var remotes = Array.prototype.slice.call(scope.querySelectorAll('[data-action="change-region"]'));
    var region;

    function toggle(flag) {
        if (this.nodeType === 1)
            flag ? this.classList.remove('hide') : this.classList.add('hide');
    }

    function show(el) {
        toggle.call(el, true);
    }

    function hide(el) {
        toggle.call(el, false)
    }

    function hideAll() {
        hide(table);
        getRegionals().forEach(hide); // IE Compatible forEach
    }

    function getRegionals(region) {
        // querySelectorAll returns a NodeList, but IE can't use forEach() on
        // a NodeList directly, so this function converts it to a regular
        // Array, which is more compatible.
        return Array.prototype.slice.call(scope.querySelectorAll('[data-region' + (region ? '="' + region + '"' : '') + ']'));
    }

    function handleChanges() {
        // First, hide all region-specific elements:
        hideAll();
        // Then, only reveal the ones that match the selected region.
        if (region = this.options[this.options.selectedIndex].value) {
            show(table);
            getRegionals(region).forEach(show);
        }
    }

    // Initial state: hide the table and all region-specific elements (until
    // the user has selected a region):
    hideAll();

    // Now listen for the user:
	if(!select.id) select.id = 'change-region';
    select.addEventListener('change', handleChanges);

	// Set up any remote controls. Each `remote` should just be
	// a simple <span> with some text:
	remotes.forEach(function(remote, i) {
		var a = document.createElement('a');						// create a new <a> element
		remote.childNodes && a.appendChild(remote.childNodes[0]);	// move the text node (if it exists) into the link
		remote.appendChild(a);										// then move the <a> into the DOM where the text was
		a.setAttribute("tabindex", "0");							//	
		a.setAttribute("href", "#");								//	required attributes for keyboard a11y
		a.setAttribute("aria-controls", select.id);

		a.addEventListener("click", function(event) {
			select.value = this.parentNode.getAttribute('data-value');
			select.dispatchEvent(new Event("change"));
			event.preventDefault();
			select.focus();
		});
	});

})(document.getElementById("course-fees-information"));


((scope)=>{

    if(!scope) return;

    scope.innerHTML = '';

    const statuses = {
        "H": "Scotland",
        "O": "International (including EU)",
        "R": "England, Wales, Northern Ireland and Republic of Ireland",
    };
    const modes = {
        "FT":"Full time",
        "PTO":"Part time",
    }

    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });

    const feetable = data => `<table>${data.feeData.map(feetablerow).join('')}</table>`;

    const feetablerow = data => 
    
    `<tr>
        <td>${statuses[data.feeStatus]}</td>
        <td>${modes[data.modeOfAttendance]}</td>
        <td>${data.academicYear}</td>
        <td>${formatter.format(data.amount)}</td>
    </tr>`;

    console.info('[Fees]');
    const el = document.querySelector('[data-modules-route-code]');
    const route = el && el.getAttribute('data-modules-route-code');
    route && stir.getJSON("../fees.json", data=>{
        if(data.feeData) {
            scope.insertAdjacentHTML("beforeend",
                (data.feeData.filter(item=>item.rouCode===route).map(feetable).join(''))
            );
        }
    })

})(document.getElementById("course-fees-information"));