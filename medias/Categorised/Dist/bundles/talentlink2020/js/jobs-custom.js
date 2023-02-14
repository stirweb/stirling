var faculties = [117, 120, 119, 116, 122];
var professionalServices = [153, 165, 3, 10, 6, 7, 11, 148, 9, 157, 5, 160, 167];

var stir = stir||{};

stir.talentlink = (function(){

	var listUrl = '/about/work-at-stirling/list/';		// we could get this dynamically but hard-coded is fine

	function error(message) {
		//console.info('[Talentlink] ' + message);
		var element = document.getElementById('lumesseJobDetailWidget');
		if(element) {
			if(message=="Error when getting the job details!") {
				element.innerHTML = '<p>The vacancy details you requested could not be found, or the vacancy has closed.</p><p>View our <a href="'+this.listUrl+'">current vacancies</a>.</p>';
			} else if(message=="jobsDetails will be not registered - jobId is missing") {
				element.innerHTML = '<p>View our <a href="'+this.listUrl+'">current vacancies</a>.</p>';
			}
		}
	}

	return {
		error: error,
		listUrl: listUrl
	};

})();

requirejs.undef('text!/webcomponents/dist/bundles/talentlink2020/templates/_SearchCriteriaItemsTemplate.html');
define('text!/webcomponents/dist/bundles/talentlink2020/templates/_SearchCriteriaItemsTemplate.html', ['text!/webcomponents/dist/bundles/talentlink2020/templates/_SearchCriteriaItemsTemplate.html'], function (template) {
    return template;
});

require([
        "jquery",
        "TalentPortalEventBus",
        "ComponentConfigurationApiFacade",
		"ApiUtilities"
    ],
    function ($, talentPortalEventBus, configuration, Utilities) {
        "use strict";

		// We will override Lumesse's `consoleLog` function to do additional error handling:
		Utilities._consoleLog = Utilities.consoleLog;	// handle to original `consoleLog` fn

		Utilities.consoleLog = function(error){
			stir.talentlink.error(error);			// custom error handling
			this._consoleLog(error);				// pass through for default behaviour
		};

        //talentPortalEventBus.subscribe("job-detail", "rendered", function () { });
        //talentPortalEventBus.subscribe("job-detail", "loaded", function () { });

        talentPortalEventBus.subscribe("search-criteria", "rendered", function () {
            setTimeout(function(){
                $('#SiteSubDept2').append('<optgroup id="faculties_group" label="Faculties"></optgroup>');
                $('#SiteSubDept2').append('<optgroup id="professionalServices_group" label="Professional services"></optgroup>');

                $('#SiteSubDept2 option').each(function(){
                    if(faculties.indexOf(parseInt(this.value)) != -1){
                        $('#faculties_group').append(this);
                    }
                });

                $('#SiteSubDept2 option').each(function(){
                    if(professionalServices.indexOf(parseInt(this.value)) != -1){
                        $('#professionalServices_group').append(this);
                    }
                });
            }, 500);

            $('#talentSearchForm').submit(function () {
                var jobsListUrl = configuration.getNavigationPage('jobListURL', 'list.html'),
                    anchorSelector = "#lumesseSearchCriteriaWidget",
                    data = $(anchorSelector).find('form').serialize(),
                    criteria = {
                        searchCriteria: []
                    };

                $.each($.deparam(data), function (i, criterium) {
                    if (i == "LOV1" && criterium == 6717) {
                        criterium = [6717, 6709];
                    }
                    if (criterium && typeof(criterium) === 'object') {
                        criteria.searchCriteria.push({key: i, values: criterium});
                    } else if (criterium) {
                        criteria.searchCriteria.push({key: i, values: [encodeURI(criterium).replace(/(%20)+/g, ' ')]});
                    }
                });

                window.location.href = jobsListUrl + '?' + decodeURIComponent($.param(criteria));
                return false;
            });
        })


        talentPortalEventBus.subscribe("jobs-list", "rendered", function () {
            var label = document.createElement('label');
            $(label).addClass('sr-only pagination-label').text('Pagination').append($('.job-list-pagination select.form-control'))
            $('.job-list-pagination').append(label);

            var children = $('.selected-criteria-list').children().clone()
            $('.selected-criteria-list').replaceWith('<p class="selected-criteria-list"></p>').append(children)
        })
    }
);