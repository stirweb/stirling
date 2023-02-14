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


/*
 * Handle fees info coming from a json feed 
 * rk8 Oct 2020
 * NO LONGER IN USE - NOW HANDLED IN T4
(function (scope) {

    if (!scope) return;

    var dataFees = stir.t4Globals.dataFees;

    // Use the other data if its available
    if(stir.t4Globals.dataFeesOther )
        dataFees = stir.t4Globals.dataFeesOther ;

    var tbl = scope;
    var tblRow = tbl.querySelectorAll('[data-region]');
    var cachData = []; // Cached data for use by the EU Row
    
    // loop through the table rows and output the currect data
    Array.prototype.forEach.call(tblRow, function (item) {
        var region = item.dataset.region;
        var tds = tbl.querySelectorAll('[data-region="' + region + '"] td');
        var band = tbl.getAttribute('data-' + region);

        for (var i = 0; i < dataFees.length; i++) {
            if (dataFees[i].region === region && dataFees[i].band === band) {
                tds[0].innerHTML = checkVal(dataFees[i].thisYear);
                tds[1].innerHTML = checkVal(dataFees[i].nextYear);
                // Update the cache for EU 
                cachData.push(dataFees[i].thisYear);
                cachData.push(dataFees[i].nextYear);
            }
        }
    })

    // EU data: 2020 = home val; 2021 = overseas val
    var tds = tbl.querySelectorAll('[data-region="eu"] td');
    tds[0].innerHTML = checkVal(cachData[0]);
    tds[1].innerHTML = checkVal(cachData[cachData.length - 1]);

    /* 
    * Make sure we have a value. If not return TBC  
    *
    function checkVal(val){
        return val.length > 0 ? val : '<abbr title="to be confirmed">TBC</abbr>';
    }

})(document.getElementById("feesTblPG"));
*/