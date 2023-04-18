/*
 * @author Ryan Kaye
 * Basically a stripped back version of the main site search
 * 
 * TODO
 * Filter out research hub from internal?
 */

(function () {

	/*
	 * Config vars 
	 */
	var page = 1;
	var query = '';
	var postsPerPage = 3;
	var jsonUrl = "https://www.stir.ac.uk/s/search.json?";
	var collection = 'external';
	var showCurator = true; // BestBets

	var resultsArea = document.getElementById("site-search__results");
	var searchLoading = document.getElementById('header-search__loading');
	var searchInput = document.querySelector('.c-site-search__search-input');

	var extIconHtml = '<span  class="c-site-search__external-icon-wrapper"><span class="c-site-search__external-icon uos-study-abroad"></span> <span class="show-for-sr">Public</span></span>';
	var intIconHtml = '<span class="c-site-search__external-icon-wrapper"><span class="c-site-search__external-icon uos-group"></span> <span class="show-for-sr">Internal</span></span>';
	var mediaIconHtml = '<span class="c-site-search__external-icon-wrapper"><span class="c-site-search__external-icon uos-document"></span> <span class="show-for-sr">Media</span></span>';


	// object to hold the config data with default values
	var searchFacets = {
		query: query,
		start_rank: 1,
		num_ranks: postsPerPage,
		collection: collection,
		meta_group: '',
		meta_group_not: 'internal',
		meta_subgroup_not: ''
		//callback:"?"
	};

	/*
	 * Function: Configure the search depending on certain params
	 */
	var configSearch = function () {
		if (searchFacets.collection === 'stirling') {
			searchFacets.meta_group_not = 'www';
		}
		doSearch();
	};

	/*
	 * Function: Query Funnelback 
	 */
	var doSearch = function () {
		var jsonUrl1 = jsonUrl;

		for (var key in searchFacets) {
			if (searchFacets.hasOwnProperty(key)) {
				jsonUrl1 += key + '=' + searchFacets[key] + '&';
			}
		}
		stir.getJSON(jsonUrl1, parseJSON);
	};

	/*
	 * Function: Work with the data returned
	 */
	var parseJSON = function (data) {
		if (!data.error) {
			resultsArea.innerHTML = formResultHTML(data);
			searchLoading.style.display = "none";
		}
	};

	/* 
	 * Function: Form the html for results
	 */
	var formResultHTML = function (myData) {
		var rstHtml = "";

		rstHtml += '<div class="c-search-result">';
		rstHtml += '	<div class="grid-x">';

		// Curator (BestBet)
		if (showCurator && page == 1) {
			// Loop the curators and form the html
			var curs = myData.response.curator.exhibits;
			for (var key in curs) {
				var val = curs[key];

				if (val.titleHtml) {

					// Internal Only checked
					if (searchFacets.meta_group == 'internal') {

						// Internal Student (and Staff by Assoc)
						if (getSiteArea(val.displayUrl) === 'STUDENT' && getAuthUserType() !== 'EXTERNAL') {
							rstHtml += '    	<div class="cell small-12 c-search-result">';
							rstHtml += '        	<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + '</a> ' + intIconHtml + '</p>';
							rstHtml += '			<p class="c-search-result__summary">' + val.descriptionHtml + '</p>';
							rstHtml += '    	</div>';
						}
						// Internal Staff Only
						if (getSiteArea(val.displayUrl) === 'STAFF' && getAuthUserType() === 'STAFF') {
							rstHtml += '    	<div class="cell small-12 c-search-result">';
							rstHtml += '        	<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + '</a> ' + intIconHtml + '</p>';
							rstHtml += '			<p class="c-search-result__summary">' + val.descriptionHtml + '</p>';
							rstHtml += '    	</div>';
						}
					}

					// External Checked and Possibly Internal Checked
					if (searchFacets.meta_group == '') {
						// External Only BB
						if (getSiteArea(val.displayUrl) === 'EXTERNAL') {
							rstHtml += '    	<div class="cell small-12 c-search-result">';
							rstHtml += '        	<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + '</a> ' + extIconHtml + '</p>';
							rstHtml += '			<p class="c-search-result__summary">' + val.descriptionHtml + '</p>';
							rstHtml += '    	</div>';
						}

						if (document.getElementById("c-site-search-internal__checkbox")) {
							// Internal Checked with External 
							if (document.getElementById("c-site-search-internal__checkbox").checked) {

								// Internal Student (or Staff by Assoc) BB
								if (getSiteArea(val.displayUrl) === 'STUDENT' && getAuthUserType() !== 'EXTERNAL') {
									rstHtml += '    	<div class="cell small-12 c-search-result">';
									rstHtml += '        	<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + '</a> ' + intIconHtml + '</p>';
									rstHtml += '			<p class="c-search-result__summary">' + val.descriptionHtml + '</p>';
									rstHtml += '    	</div>';
								}

								// Internal Staff Only BB
								if (getSiteArea(val.displayUrl) === 'STAFF' && getAuthUserType() === 'STAFF') {

									rstHtml += '    	<div class="cell small-12 c-search-result">';
									rstHtml += '        	<p class="c-search-result__link"><a href="' + val.linkUrl + '">' + val.titleHtml + '</a> ' + intIconHtml + '</p>';
									rstHtml += '			<p class="c-search-result__summary">' + val.descriptionHtml + '</p>';
									rstHtml += '    	</div>';
								}
							}
						}
					}
				}
			} // end of for loop
		}

		// Loop the search results and form the html
		var rst = myData.response.resultPacket.results;
		for (var key in rst) {
			var val = rst[key];
			var iconHtml = '';

			if (val.displayUrl) {
				var urlType = getSiteArea(val.displayUrl);

				if (urlType === 'EXTERNAL')
					iconHtml = extIconHtml;

				if (urlType === 'MEDIA')
					iconHtml = mediaIconHtml;

				if (urlType === 'STAFF' || urlType === 'STUDENT')
					iconHtml = intIconHtml;

				if (getAuthUserType() === 'EXTERNAL')
					iconHtml = '';

				rstHtml += '    	<div class="cell small-12 c-search-result">';
				rstHtml += '        	<p class="c-search-result__link"><a href="' + val.clickTrackingUrl + '">' + stir.String.getFirstFromSplit.call(val.title,("|")) + '</a>' + iconHtml + '</p>';
				rstHtml += '			<p class="c-search-result__breadcrumb">' + (val.metaData["bc"] || val.displayUrl) + '</p>';
				rstHtml += '			<p class="c-search-result__summary">' + val.summary + '</p>';
				rstHtml += '    	</div>';

			}
		}

		rstHtml += '    </div>';
		rstHtml += '</div>';

		return rstHtml;
	};

	/*
	 * Function: Lets us know if the eg a Best Bet is internal or external 
	 */
	var getSiteArea = function (myUrl) {
		var arrUrl = myUrl.split('/');

		if (arrUrl[3] === 'internal-students' || arrUrl[2] === 'portal.stir.ac.uk')
			return 'STUDENT';

		if (arrUrl[3] === 'internal-staff')
			return 'STAFF';

		if (arrUrl[3] === 'media')
			return 'MEDIA';

		return 'EXTERNAL';
	};

	/*
	 * Function: Is this a logged in user - if so whats the user type (STAFF || STUDENT || EXTERNAL)
	 */
	var getAuthUserType = function () {

		if (Cookies.get('psessv0'))
			return Cookies.get('psessv0').split("|")[0];

		return 'EXTERNAL';
	};

	/*
	 * Function: Form the html for results
	 */
	var resetHTML = function () {
		resultsArea.innerHTML = '';
		searchLoading.style.display = "block";
	};

	/*
	 * On Load
	 */
	var query = "" || window.location.pathname.split("/").join(" ").trim().replace(/index\.html|xml|json/, "");

	if (query) {
		resetHTML();
		searchFacets.query = query;
		configSearch();
		searchInput.value = query;
	}

})();