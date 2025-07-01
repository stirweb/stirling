/**
 * Support functions for course page and modules
 * Mainly HTML DOM stuff and hard-coded text.
 */

var stir = stir || {};
stir.templates = stir.templates || {};

stir.templates.course = {
	colours: {
		UG: ["heritage-green","energy-turq","energy-purple"],
		PGT: ["heritage-purple","heritage-purple","heritage-green"]
	},
	link: (text,href) => `<a href="${href}">${text}</a>`,
	para: content => `<p>${content}</p>`,
	option: option => `Starting ${option[3]}, ${option[1].toLowerCase()} (${option[4]})`,
	div: id => {
		const div = document.createElement('div');
		div.id = id; return div;
	},
	dialogue: id => {
		const d = document.createElement('dialog');
		const x = document.createElement('button');
		const p = document.createElement('button');
		const n = document.createElement('button');
		const w = document.createElement('nav');

		const prev = stir.dpt.show.previous;
		const next = stir.dpt.show.next;

		id && (d.id = id);
		d.setAttribute('data-module-modal','');
		w.setAttribute('aria-label','module navigation');
		w.append(p,n);
		d.append(x);
		d.append(w);

		x.addEventListener("click",e=>d.close());
		p.addEventListener("click",prev.bind(p));
		n.addEventListener("click",next.bind(n));

		x.textContent = "Close";
		p.innerHTML = '<span class="uos-arrows-up"></span> Previous';
		n.innerHTML = '<span class="uos-arrows-down"></span> Next';
		return d;
	},

	paths: (paths, year) => `<p class="c-callout info"><strong><span class="uos-shuffle"></span> There are ${paths} alternative paths in year ${year}.  Please review all options carefully.</strong></p>`,

	offline: `<p class="text-center c-callout">Module information is temporarily unavailable.</p>`,

	disclaimer: `<p><strong>The module information below provides an example of the types of course module you may study. The details listed are for the academic year that starts in September 2025. Modules and start dates are regularly reviewed and may be subject to change in future years.</strong></p>`
};

stir.templates.course.barcharts = (barcharts) => {
	
	function onIntersection(entries, opts) {
		
		entries.forEach((entry) => {
		  if (entry.isIntersecting) {
			const value = Number(entry.target.dataset.value);
			const unit = entry.target.dataset.unit;
			const max = Number(entry.target.dataset.max);
			const colour = entry.target.dataset.colour || "energy-turq";
	
			const perc = (value / max) * 100;
			const percInverted = 100 - perc;
			const percInvertedFixed = percInverted > 98 ? 98 : percInverted;
	
			const textPositionInit = perc / 2 - 0.5;
			const textPosition = textPositionInit === 0 ? 1 : textPositionInit;
	
			const frag = stir.createDOMFragment(`<div>
													<div class="barchart-value u-top-0 u-bottom-0 u-bg-${colour} u-absolute" style="right:${percInvertedFixed}%"></div>
													<div class="barchart-text u-relative u-white u-font-bold text-md u-z-50" style="left:${Math.abs(textPosition)}%"></div>
												</div>`);
			entry.target.append(frag);
		  } else {
			entry.target.innerHTML = ``;
		  }
		});
	  }
	
	  // define observer instances
	  const observerBarcharts = new IntersectionObserver(onIntersection, {
		root: null,
		threshold: 0.5,
	  });
	
	  barcharts.forEach((el) => {
		observerBarcharts.observe(el);
	  });

};

stir.templates.course.module = (boilerplates, count, data) => {
	if (!boilerplates) return 'no data';
	if (!data || !data.moduleTitle || !data.moduleCode || !data.moduleLevel || !data.moduleCredits || !data.moduleOverview || !data.learningOutcomes) {
		console.error('[stir.templates.course.module] data error',data);
		return 'data error';
	}

	var otherInfo,additionalCosts;

	const colour = stir.templates.course.colours[data.moduleLevelDescription];

	const studyAbroad = (()=>{
		if (data.studyAbroad !== "Yes") return;
		return `<h3 class="header-stripped u-bg-${colour[0]}--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
		${boilerplates["studyAbroad"]?boilerplates["studyAbroad"]:''}
		${boilerplates["studyAbroadLink"]?`<p><a href="${boilerplates["studyAbroadLink"]}">Find out more about our study abroad opportunities.</a></p>`:''}`;
	})();

	const furtherDetails = (()=>{
		if(!otherInfo && !studyAbroad && !additionalCosts) return '';
		return `<div class="cell u-mt-2">
				<h2 id="further">Further details</h2>
				${otherInfo?otherInfo:''}
				${studyAbroad?studyAbroad:''}
				${additionalCosts?additionalCosts:''}
			</div>`;
	})();

	const onlyUnique = (value, index, self)  => self.indexOf(value) === index;
	const reducer = (accumulator, currentValue) => accumulator + currentValue;
	const mapper  = (item) => Number(item.percent);
	const assessmentPercentTotal = data => data.map(mapper).reduce(reducer, 0);
	const assessment = item => 
			`<div>
				<span class="u-inline-block u-p-tiny u-px-1">${item.category}</span>
				<div class="u-flex">
					<div class="barchart u-relative u-flex u-flex1 align-middle u-overflow-hidden u-bg-light-medium-grey" data-value="${item.value}" data-max="100" data-unit="%" data-colour="${colour[1]}"></div>
					<div class="u-pl-2 text-xlg u-font-primary u-line-height-1 u-${colour[1]} u-top--16 u-relative">${item.value}%</div>
				</div>
			</div>`;

	function assessments(data) {
		const categories = data.map((item) => item.category).filter(onlyUnique);
		const width = 12; //categories.length<2?12:6;
		const AssessmentCategorySummaries = categories.map((category) => {
				return {
					category: category,
					value: data.filter(item => category===item.category).map(mapper).reduce(reducer, 0)
				};
			});
	  
		return 100===assessmentPercentTotal(data)?`<div class="cell large-${width} u-mb-1">${AssessmentCategorySummaries.map(assessment).join('')}</div>`:'';
	}

	const discoverLink = "UG"===data.moduleLevelDescription?boilerplates.awardsCtaUG:boilerplates.awardsCtaPG;
	const discoverLevel = "UG"===data.moduleLevelDescription?'undergraduates':'postgraduates';

	return `    <style>
     .barchart {
            height: 18px;
        }

     .barchart-value {
            width: 2400px;
            right: 100%;
            animation: 1s u-horz-slide-in-out forwards;
	}
	nav[data-mc="0"] button:first-child,
	nav[data-mc="${count}"] button:last-child {
		background-color: #666;
		cursor: not-allowed;
	}
	
	</style>
<main class="wrapper-content u-padding-bottom" aria-label="Main content" id="content">
	<div class="grid-container" data-api="PROD">
		<div class="grid-x grid-padding-x u-my-2 align-middle">
			<div class="cell large-6 c-course-title u-padding-y">
				<h1 class="u-header-smaller">${data.moduleTitle}</h1>
			</div>
			<div class="cell large-6">
				<div class="u-border u-border-width-5 flex-container u-px-3 u-py-2">
					<div class="grid-x grid-padding-x">
						<div class="cell medium-6 flex-container u-gap u-p-1">
							<span class="u-heritage-green u-inline-block u-width-48"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="svg-icon"><path d="M.75,0V15M7.417,0V15M9.639,0V15M11.861,0V15M15.194,0V15M16.306,0V15M19.639,0V15M20.75,0V15M4.083,0V15M5.194,0V15" transform="translate(1.25 4.5)" stroke-miterlimit="10"></path></svg></span>
							<span><strong>Module code:</strong><br>${data.moduleCode}</span>
						</div>
						<div class="cell medium-6 flex-container u-gap u-p-1">
							<span class="u-heritage-green u-inline-block u-width-48"><svg
									xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
									viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"
									class="svg-icon">
									<path d="M1.1,11.99,9.422,3.942l4.57,4.57L21.659.845M17.756.75h3.99V4.88"
										transform="translate(0.579 5.573)" stroke-linecap="round"
										stroke-linejoin="round"></path>
								</svg></span>
							<span><strong>SCQF level:</strong><br>${data.moduleLevel}</span>
						</div>
						<div class="cell medium-6 flex-container u-gap u-p-1">
							<span class="u-heritage-green u-inline-block u-width-48"><svg
									xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
									viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"
									class="svg-icon">
									<path
										d="M6.58.52,8.452,4.314l4.187.608L9.609,7.875l.715,4.171L6.58,10.077,2.835,12.045,3.55,7.875.521,4.922l4.187-.608Zm8.889,8.547-2.574.374,1.863,1.816-.44,2.565,2.3-1.211,2.3,1.211-.44-2.565,1.863-1.816-2.574-.374L16.621,6.734Zm-5.076,7.371-2.21.321,1.6,1.56L9.4,20.52l1.977-1.04,1.977,1.04-.378-2.2,1.6-1.56-2.212-.321-.989-2Z"
										transform="translate(1.566 1.48)" fill="rgba(255,255,255,0)"
										stroke-linecap="round" stroke-linejoin="round"></path>
								</svg></span>
							<span><strong>SCQF credits:</strong><br>${data.moduleCredits}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="grid-container">
		<div class="grid-x grid-padding-x start">
			<div class="cell medium-9 bg-grey u-bleed u-p-2">
				<p>The module information below is for the 2025/6 intake and may be subject to change, including in
					response to student feedback and continuous innovation development. See our 
					<a href="/study/important-information-for-applicants/terms-conditions/2023-24-student-terms-and-conditions/">
					terms and conditions</a> for more information.</p>
			</div>
			<div class="cell u-p-2">
				<h2 id="contentandaims">Content and aims</h2>
				<h3 class="header-stripped u-bg-${colour[0]}--10 u-${colour[0]}-line-left u-p-1 u-border-width-5 u-text-regular">
					Module overview
				</h3>
				${data.moduleOverview}

				<h3 class="header-stripped u-bg-${colour[0]}--10 u-${colour[0]}-line-left u-p-1 u-border-width-5 u-text-regular u-mt-2">Learning outcomes</h3>
				<p><strong>${boilerplates["outcomesIntro"]}</strong></p>
				<ul>${data.learningOutcomes.map(item=>`<li>${item}</li>`).join('')}</ul>
			</div>
			<div class="cell u-p-2">
				<h2 id="teaching">Teaching and assessment</h2>
				${boilerplates["teachingIntro"]||"<kbd>NO DATA</kbd>"}

				<h3 class="header-stripped u-bg-${colour[1]}--10 u-p-1 u-${colour[1]}-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
				<div class="grid-x grid-padding-x" id="deliveries">
					<div class="cell">
						<p>Engagement and teaching information isn't currently available, but it will be made clear to you when you make your module selections.</p>
					</div>
				</div>

				<h3 class="header-stripped u-bg-${colour[1]}--10 u-p-1 u-${colour[1]}-line-left u-border-width-5 u-text-regular u-mt-3">Assessment overview</h3>

				<div class="grid-x grid-padding-x" id="assessments"> ${assessments(data.assessments[0]["tabAssessments"])} </div>

				${boilerplates["teachingTimetableInfo"]||""}

			</div>

			<div class="cell u-mt-2">
				<h2 id="awards">Awards</h2>
				<h3 class="header-stripped u-bg-${colour[2]}--10 u-p-1 u-${colour[2]}-line-left u-border-width-5 u-text-regular">Credits</h3>
				<p class="flex-container u-gap align-middle"><img src="https://www.stir.ac.uk/media/dist/images/modules/scotland-flag.png" width="65" height="44" alt="Scotland flag"> This module is worth ${data.moduleCredits} SCQF (Scottish Credit and Qualifications Framework) credits.</p>
				<p class="flex-container u-gap align-middle"><img src="https://www.stir.ac.uk/media/dist/images/modules/EU-flag.png" width="65" height="44" alt="EU flag"> This equates to ${data.ectsModuleCredits} ECTS (The European Credit Transfer and Accumulation System) credits.</p>
				<div class="u-mb-2 u-bg-${colour[2]}--10 flex-container align-stretch">
					<span class="u-bg-${colour[2]} u-white flex-container align-middle u-width-64 u-px-1">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="svg-icon">
							<path d="M14.667,4.5,23,12.833m0,0-8.333,8.333M23,12.833H3" transform="translate(-1 -0.833)" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</span>
					<p class="u-p-1 u-m-0 u-black"><strong>Discover more:</strong> <a href="${discoverLink}" class="u-${colour[2]}">Assessment and award of credit for ${discoverLevel}</a></p>
				</div>
			</div>
			${furtherDetails}
		</div>
	</div>
</main>`;};

var stir = stir||{};

stir.akari = (() => {

    const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	const domain = 'www.stir.ac.uk';
	const path = '/data/pd-akari-qa/?module=';
	const url = `https://${domain}${path}`;

    const get = {
		rel: id => path + id,
		module: (id, callback) => stir.getJSON(url + id, callback)
	};


    return {
		get: get    // stir.akari.get.module(id,callback)
	};

})();
/*
 * Country specific entry requirements select box processes
 * @author: Ryan Kaye
 * @date: October 2020 (version 1). October 2021 (version 2)
 * @version: 2
 */

/*
var stir = stir || {};

stir.t4Globals = stir.t4Globals || {};

(function (scope) {
  if (!scope) return;

  /*
      Constants
   *
  const select = scope;

  /*
     Fetch the data
   *
  const initCountryData = stir.t4Globals.countries || [];
  const metaTags = document.getElementsByTagName("meta");

  /*
      Define required constants
   *

  const constants = {
    // DOM elements UG 
    ugYear1Node: stir.node("[data-panel=entryYear1]"),
    ugYear2Node: stir.node("[data-panel=entryYear2]"),
    scotQualsNode: stir.node("[data-panel=otherScotQuals]"),
    otherQualsNode: stir.node("[data-panel=otherQuals]"),
    engReqsNode: stir.node("[data-panel=engReqs]"),
    // DOM elements PG *
    pgReqsNode: stir.node("[data-countryreqs]"),
    // General data items *
    level: select.dataset.level || "",
    faculty: metaTags["stir.course.faculty"] ? metaTags["stir.course.faculty"].content : "",
    defaultCountry: "United Kingdom",
  };

  /* 
    Extract the content from the correct DOM element
  *
  const getDomContent = (el) => {
    if (el) return el.innerHTML;
    return "";
  };

  /* 
    Keep a copy of the UK data in case its reselected
    Store it in a new country object for ease
  *
  const cacheDefaultData = (consts, data) => {
    const defaultItem = [
      {
        name: consts.defaultCountry,
        ugEntryYearOne: getDomContent(consts.ugYear1Node),
        ugEntryYearTwo: getDomContent(consts.ugYear2Node),
        englishRequirements: getDomContent(consts.engReqsNode),
        pgRequirements: getDomContent(consts.pgReqsNode),
        pgRequirementsSMS: "",
      },
    ];
    return [...defaultItem, ...data];
  };

  /* 
      Remove dodgy characters from the data
   *
  const cleanContent = (data) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = data;
    return textArea.value.trim();
  };

  /* 
      Output UG content to the correct nodes
  *
  const setUGContent = (consts, country) => {
    // UG Year 1
    if (consts.ugYear1Node) {
      consts.ugYear1Node.innerHTML = cleanContent(country.ugEntryYearOne);
    }

    // UG Year 2
    if (consts.ugYear2Node) {
      consts.ugYear2Node.parentElement.classList.add("hide");
      consts.ugYear2Node.innerHTML = cleanContent(country.ugEntryYearTwo);

      if (cleanContent(country.ugEntryYearTwo).length) {
        consts.ugYear2Node.parentElement.classList.remove("hide");
      }
    }
    return true;
  };

  /* 
      Output PG content to the correct nodes
  *
  const setPGContent = (consts, country) => {
    if (consts.pgReqsNode) {
      // Mgt School content override hack for China
      if (country.name === "China" && consts.faculty === "Stirling Management School") {
        consts.pgReqsNode.innerHTML = cleanContent(country.pgRequirementsSMS);
        return true;
      }

      consts.pgReqsNode.innerHTML = cleanContent(country.pgRequirements);
      return true;
    }
  };

  /* 
      EVENT - New country selected
   *
  select.onchange = function (e) {
    const selectedCountry = this.options[this.selectedIndex].value;

    // Hide and show nodes as needed
    if (selectedCountry !== constants.defaultCountry) {
      if (constants.scotQualsNode) constants.scotQualsNode.closest(".stir-accordion").classList.add("hide");
      if (constants.otherQualsNode) constants.otherQualsNode.closest(".stir-accordion").classList.add("hide");
    }

    if (selectedCountry === constants.defaultCountry) {
      if (constants.scotQualsNode) constants.scotQualsNode.closest(".stir-accordion").classList.remove("hide");
      if (constants.otherQualsNode) constants.otherQualsNode.closest(".stir-accordion").classList.remove("hide");
    }

    const country = stir.filter((item) => item.name === selectedCountry, countryData);

    constants.level === "ug" && setUGContent(constants, country[0]);
    constants.level === "pg" && setPGContent(constants, country[0]);

    e.preventDefault();
  };

  /*
    ON LOAD EVENTS
   *

  const countryData = cacheDefaultData(constants, initCountryData);
  select.innerHTML = stir.map((el) => `<option  value="${el.name}">${el.name}</option>`, countryData);

  /* End *
})(stir.node("select[name='course-countries-select']"));

*/

var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};

stir.components = stir.components || {};
stir.components.html = stir.components.html || {};
stir.components.unistats = stir.components.unistats || {};
stir.components.discoveruni = stir.components.discoveruni || {};

stir.components.unistats.widget = function (options) {
  var widget = document.createElement("iframe");
  widget.src = "https://widget.unistats.ac.uk/Widget/10007804/" + kiscode + "/responsive/small/en-GB/" + kismode;
  widget.setAttribute("title", "Unistats widget for " + kiscode + " (" + kismode + ")");
  widget.classList.add("c-course-unistats-widget");
  return widget;
};

stir.components.id = (function () {
  var _universalId = 0;

  function _getNewId() {
    return ++_universalId;
  }
  return {
    getNewId: _getNewId,
  };
})();

stir.components.discoveruni.widget = function (options) {
  var widget = document.createElement("div");
  //add this class if we want DiscoverUniWidget to trigger automatically:
  //widget.classList.add('kis-widget');
  widget.setAttribute("data-institution", 10007804);
  widget.setAttribute("data-course", options.kiscode);
  widget.setAttribute("data-kismode", options.kismode);
  widget.setAttribute("data-orientation", "responsive");
  widget.setAttribute("data-language", "en-GB");
  return widget;
};
stir.components.html.details = function (options) {
    var widget = document.createElement('details');
    options.summary && (widget.innerHTML = '<summary>' + options.summary + '</summary>');
    return widget;
};

stir.components.accordion = function (options) {
  var id = stir.components.id.getNewId();
  var widget = document.createElement("div");
  var label = document.createElement("h2");
  var anchor = document.createElement("a");
  var content = document.createElement("div");

  if (options.id) widget.setAttribute("id", options.id);

  widget.classList.add("stir-accordion");

  anchor.innerText = options.title || "Show more";
  anchor.id = "accordion-js-" + id;
  anchor.setAttribute("class", "stir-accordion--btn");
  anchor.setAttribute("aria-controls", "panel-js-" + id);

  content.id = "panel-js-" + id;
  content.setAttribute("data-tab-content", "");
  content.setAttribute("role", "region");
  content.setAttribute("aria-labelledby", "accordion-js-" + id);
  content.setAttribute("class", "stir__slideup stir__slidedown");

  label.appendChild(anchor);
  widget.appendChild(label);
  widget.appendChild(content);

  return widget;
};

stir.renderKISWidgets = function (kiscodes, kiswidget) {
  var debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  var kiswidget = kiswidget || document.querySelector("#kis-widget");
  var frag = document.createDocumentFragment();
  var useUnistats = false;
  var pattern = /^U\d{2}-[A-Z]{2,3}([A-Z]{3})?$/;
  var widgets = [];

  if (debug) {
    console.info("[Discover Uni] kiscodes:", kiscodes, kiscodes.length);
    console.info("[Discover Uni] kiswidget:", kiswidget);
  }

  if (kiswidget && kiscodes) {
    kiswidget.setAttribute("data-initialised", true);
    kiswidget.innerHTML = ""; // remove loading spinner
    kiswidget.classList.remove("grid-x");

    useUnistats = kiswidget.hasAttribute("data-unistats");

    for (var i = 0; i < kiscodes.length; i++) {
      var kiscode = kiscodes[i].split(":")[0].trim();
      var kismode = kiscodes[i].split(":")[1] ? "parttime" : "fulltime";
      if (kiscode === "") {
        debug && console.info("[Discover Uni] Empty kiscode", i);
      } else if (!pattern.test(kiscode)) {
        console.error("Invalid KIS code: " + kiscode);
      } else {
        var widget;
        if (useUnistats) {
          widget = stir.components.unistats.widget({
            kiscode: kiscode,
            kismode: kismode,
          });
        } else {
          widget = stir.components.discoveruni.widget({
            kiscode: kiscode,
            kismode: kismode,
          });
        }
        widgets.push(widget);
      }

      widget && frag.appendChild(widget);
    }

    kiswidget.appendChild(frag);

    (function (d) {
      if (useUnistats || d.getElementById("unistats-widget-script")) {
        return;
      }
      var widgetScript = d.createElement("script");

      widgetScript.id = "unistats-widget-script";
      widgetScript.src = "https://widget.discoveruni.gov.uk/widget/embed-script/";
      widgetScript.addEventListener("load", function (event) {
        if (widgets.length > 1 && window.DiscoverUniWidget) {
          var widgetStylesAdded = false;
          var widgetsReady = 0;
          var contentInsertionNode = new stir.components.html.details({
            id: "morewidgets",
            summary: "View more Discover Uni information",
          });

		  contentInsertionNode.classList.add("u-my-2","u-cursor-pointer","u-header--secondary-font","text-larger");
          kiswidget.insertAdjacentElement("afterend", contentInsertionNode);
          //new stir.accord(contentInsertionNode);
          //contentInsertionNode = contentInsertionNode.querySelector("[data-tab-content]");

          // patch DiscoverUniWidget's addCss() function so it only runs once per page (not once per widget!)
          DiscoverUniWidget.prototype._addCss = DiscoverUniWidget.prototype.addCss;
          DiscoverUniWidget.prototype.addCss = function () {
            widgetStylesAdded || this._addCss(), (widgetStylesAdded = true);
          };

          // patch DiscoverUniWidget's renderWidget() function so that we can manipulate
          // widgets *after* they've been initialised
          DiscoverUniWidget.prototype._renderWidget = DiscoverUniWidget.prototype.renderWidget;
          DiscoverUniWidget.prototype.renderWidget = function () {
            // pass-through call to the original renderWidget function
            this._renderWidget.apply(this, arguments);

            // if the widget has no data we'll do nothing further
            if (this.targetDiv.classList.contains("no-data")) return;

            // skip the first widget but put the rest into a <details> accordion
            if (++widgetsReady > 1) {
              contentInsertionNode.appendChild(this.targetDiv);
            }
          };

          // this replaces (rather than patches) DiscoverUniWidget's init()
          // which is called as soon as the script is loaded. But since
          // we've interrupted that, we need to manually initialise the widgets:
        }

        for (var i = 0; i < widgets.length; i++) {
          widgets[i].classList.add("kis-widget");
          widgets[i].id = "kis-widget_" + (i + 1);
          new DiscoverUniWidget(widgets[i]);
        }
      });

      document.head.appendChild(widgetScript);
    })(document);
  }
};

var KISWidgetCaller = function () {
  return false;
};

/*
 * Clearing
 */
(function () {
  function swapCourseNavForClearingBannerSticky() {
    var clearingBannerTemplate = document.getElementById("clearing-banner-template");
    var courseStickyNav = document.querySelector(".c-course-title-sticky-menu");
    var promoAnchorElement = document.querySelector(".c-course-datasheet");
    if (promoAnchorElement && clearingBannerTemplate && clearingBannerTemplate.innerHTML) {
      promoAnchorElement.insertAdjacentHTML("afterend", clearingBannerTemplate.innerHTML);
      courseStickyNav && courseStickyNav.parentElement.removeChild(courseStickyNav);
    }
  }

  function addCoursePageAdvert(template) {
    var promoAnchorElement = document.querySelector(".c-course-datasheet");
    if (promoAnchorElement && template && template.innerHTML) {
      promoAnchorElement.insertAdjacentHTML("afterend", template.innerHTML);
    }
  }

  function relocateCTA() {
    var callstoact = document.getElementById("course-ctas");
    var whatnext = document.querySelector(".c-whats-next");
    if (callstoact && whatnext) {
      whatnext.insertAdjacentElement("beforebegin", callstoact);
      whatnext.classList.remove("u-margin-top");
      callstoact.classList.add("u-margin-top");
    }
  }

  function unshiftStirTabsOverlap() {
    var tabs = document.getElementById("c-course-tabs");
    if (tabs) {
      tabs.style.top = "-1px";
    }
  }

  if (self.stir && stir.t4Globals && stir.t4Globals.clearing) {
    // If we are in Clearing AND promos may be shown, then swap-out sticky nav:
    if (stir.t4Globals.clearing.open && stir.t4Globals.clearing.showPromos) {
      swapCourseNavForClearingBannerSticky();
      addCoursePageAdvert(document.getElementById("clearing-advert-template"));
      new UoS_StickyWidget(document.querySelector(".u-sticky"));
      relocateCTA(); // During Clearing, shunt normal CTAs to the bottom of the page so they are out of the way.
      unshiftStirTabsOverlap(); // stylistic tab ovelap not compatible with sticky/z-index etc. disable it during clearing.
    }
  }
})();

/*
 * DiscoverUni (Formerly Unistats (formerly KIS))
 */
(function () {
  if (!stir.t4Globals.unistats) return;
  var kisccordion = document.querySelector(".ug-overview-accordion__kis-widget");
  var kiscodes = stir.t4Globals.unistats.split("|").pop().split(",");
  if (kiscodes.length > 0) {
    stir.renderKISWidgets(kiscodes);
    kisccordion && (kisccordion.style.display = "block");
  }
})();

/**
 * Favourites buttons
 * 2023-05-10
 */
if (stir.favourites && stir.coursefavs) {
  stir.coursefavs.attachEventHandlers();
  document.querySelectorAll("[data-nodeid=coursefavsbtn]").forEach(stir.coursefavs.doCourseBtn);
}

/**
 * API wrapper for the Degree Programme Tables
 */

var stir = stir || {};

stir.dpt = (function () {
  const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  const _semestersPerYear = 2;
  const viewMoreModulesThreshold = 5;
  const config = {
    css: {
      truncateModuleCollection: "c-course-modules__accordion-content--hide-rows",
    },
    text: {
      fewer: "View fewer choices",
      more: "View all _X_ choices",
    },
  };
  let user = {}, _year=0, _semesterCache=[];
  let _moduleCache=[],_mcPointer=0;
  let routesCurry;
  
  function resetGlobals() {
    _year = 0;
    _semesterCache = [];
  }
  const modulesEndpointParams = {
    UG: "opt=runcode&ct=UG",
    PG: "opt=runpgcode&ct=PG",
  };
  const currentVersion = {
    UG: 436, //362
    PG: 417  //357
  };

  const PORTAL = "https://portal.stir.ac.uk";

  const urls = {
    // Akari module viewer:
    viewer: window.location.hostname.indexOf("stiracuk-cms01") !== -1 ? `/terminalfour/preview/1/en/33273` : "/courses/module/",
    // Portal web frontend:
    calendar: `${PORTAL}/calendar/calendar`,
    // Portal data endpoints:
    servlet: `${PORTAL}/servlet/CalendarServlet`,
    route: {
      UG: `?opt=menu&ver=${currentVersion["UG"]}&callback=stir.dpt.show.routes`,//+ (ver?ver:'')
      PG: `?opt=pgmenu&ver=${currentVersion["PG"]}&ct=PG&callback=stir.dpt.show.routes`, //+ (ver?ver:'')
    },
    option: (type, roucode) => `?opt=${type.toLowerCase()}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&ver=${currentVersion[type.toUpperCase()]}&callback=stir.dpt.show.options`,
    fees: (type, roucode) => `?opt=${type}-opts&rouCode=${roucode}&ct=${type.toUpperCase()}&ver=${currentVersion[type.toUpperCase()]}&callback=stir.dpt.show.fees`,
    modules: (type, roucode, moa, occ) => `?${modulesEndpointParams[type.toUpperCase()]}&moa=${moa}&occ=${occ}&rouCode=${roucode}&ver=${currentVersion[type.toUpperCase()]}&callback=stir.dpt.show.modules`,
    module: (mod, year, sem) => stir.akari.get.module([mod, year, sem].join("/")),
  };

  urls.version = {
	  UG: UoS_env.t4_tags ? '<t4 type="media" id="178111" formatter="path/*" />': urls.servlet + "?opt=version-menu&callback=stir.dpt.show.version",
	  PG: UoS_env.t4_tags ? '<t4 type="media" id="178112" formatter="path/*" />': urls.servlet + "?opt=version-menu&ct=PG&callback=stir.dpt.show.version"
  }

  //	const getAllRoutes = type => {
  //		stir.getJSONp(`${urls.servlet}${urls.route[type.toUpperCase()]}`);
  //		user.type=type;
  //	};

  const splitCodes = (csv) => csv.replace(/\s/g, "").split(",");

  const getVersion = (type) => stir.getJSONp(`${urls.version[type]}`);

  const getRoutes = (type, routesCSV, auto) => {
    user.type = type;
    user.auto = auto;
    stir.dpt.show.routes = routesCurry(splitCodes(routesCSV));
    stir.getJSONp(`${urls.servlet}${urls.route[type.toUpperCase()]}`);
  };

  const getOptions = (type, roucode, auto) => {
    user.type = type;
    user.rouCode = roucode;
    user.auto = auto;
    stir.getJSONp(`${urls.servlet}${urls.option(type, roucode)}`);
  };

  const getModules = (type, roucode, moa, occ) => stir.getJSONp(`${urls.servlet}${urls.modules(type.toLowerCase(), roucode, moa, occ)}`);

  //////////////////////////////////////////////

  const getCurrentUri = () => {
    const urlBits = document.querySelector("link[rel='canonical']").getAttribute("href") ? document.querySelector("link[rel='canonical']").getAttribute("href").split("/") : [];

    if (!urlBits.length || urlBits.length < 3) return ``;

    if (UoS_env.name === "preview") return urlBits[urlBits.length - 1];
    return urlBits[urlBits.length - 2];
  };

  const moduleUrl = data => `${urls.viewer}?code=${data.modCode}&session=${data.mavSemSession}&semester=${data.mavSemCode}&occurrence=${data.mavOccurrence}&course=${getCurrentUri()}`;
  const moduleIdentifier = data => `${data.modCode}/${data.mavSemSession}/${data.mavSemCode}`;

  const moduleLink = (data,index) => {
    // LINK TO NEW AKARI MODULE PAGES
    const link = `<a href="${moduleUrl(data)}" data-index=${index} data-spa="${moduleIdentifier(data)}">${data.modName}</a>`;
    const fallback = `<span data-dpt-unavailable title="Module details for ${data.modCode} are currently unavailable">${data.modName}</span>`;
	  return availability(data) ? link : fallback;
	
    // LINK TO OLD DEGREE PROGRAM TABLES
    //return `${urls.calendar}${user.type === "PG" ? "-pg" : ""}.jsp?modCode=${data.modCode}`;
  };

  const template = {
    collection: {
      table: (id, data) => `<table class=c-course-modules__table id="collection_${id}">${data}</table>`,
      notes: (text) => `<p class=c-course-modules__collection-notes>${text}</p>`,
      header: (text) => `<p class=c-course-modules__collection-header>${text}</p>`,
      footer: (text) => `<p class=c-course-modules__pdm-note>${text}</p>`,
    },
    module: (data) => {
      // stash a list of modules to facilitate prev/next navigation among them
      _moduleCache.push({
          modName:data.modName,
          modCode:data.modCode,
          mavSemSession:data.mavSemSession,
          mavSemCode:data.mavSemCode,
          mavOccurrence:data.mavOccurrence});

      return `<tr><td>${moduleLink(data,_moduleCache.length)}
			<span class=c-course-modules__module-code>(${data.modCode})</span>
			</td><td>${data.modCredit} credits</td></tr>`;
    },
    nodata: `<tr><td colspan=2> no data </td></tr>`,
    container: (text) => `<div class="c-wysiwyg-content ${config.css.truncateModuleCollection}" data-collection-container>${text}</div>`,
  };

  const moduleView = (data) => (data.modName ? template.module(data) : template.nodata);

  const getYear = (data, group, option, semester) => {
    if (!user || !user.type) return;
    if (user.type === "UG") return stir.cardinal(Math.ceil(data.semesterCode / _semestersPerYear));
    if (user.type === "PG") {
      if (group === 0 && option === 0 && semester === 0) {
        //first group, first option, first semester
        _year++;
        _semesterCache.push(data.semesterName);
      } else if (_semesterCache.indexOf(data.semesterName) === -1 && option === 0) {
        //new semester and option 1
        _semesterCache.push(data.semesterName);
      } else if (option === 0) {
        //else if repeated semester and still option 1 - only increment year on option 1
        _semesterCache = []; //reset array of semesters
        _semesterCache.push(data.semesterName);
        _year++;
      }
      return stir.cardinal(_year);
    }
    return " <!-- year not defined --> ";
  };

  const getSemesterYearIndex = (semesterCode) => (semesterCode % _semestersPerYear === 0 ? _semestersPerYear : semesterCode % _semestersPerYear);

  const getSemester = (semester) => (semester.semesterName ? semester.semesterName + " semester" : "semester " + stir.cardinal(getSemesterYearIndex(semester.semesterCode)));

  const getOption = (option, options) => (options.length > 1 ? `(option ${stir.cardinal(option + 1)})` : "");

  const getCollectionHeader = (code) => {
    // this was taking from how the calendar JS displays titles
    if (code.indexOf("E") > -1) return "Option module";
    if (code === "D") return "Dissertation";
    return "Compulsory module";
  };

  // hide the module if it's unavailable. (This logic was taken from Portal calendar.js).
  const availability = (m) => m.mavSemSemester !== null && m.mavSemSemester.length !== 0 && m.mavSemSemester !== "[n]" && m.mavSemSemester !== "Not Available";

  const collectionView = stir.curry((semesterID, collection, c) => {
    let collectionId = [semesterID, c].join("");
    let header = template.collection.header(getCollectionHeader(collection.collectionStatusCode));
    let notes = collection.collectionType == "LIST" || collection.collectionType == "CHOICE" ? template.collection.notes(collection.collectionNotes) : "";
    let body = template.collection.table(collectionId, collection.mods.map(moduleView).join(""));
    let footer = collection.collectionFootnote ? template.collection.footer(collection.collectionFootnote) : "";
    let more =
      collection.mods.length > viewMoreModulesThreshold
        ? `<p class="text-center c-course-modules__view-more-link">
						<a href="#" data-choices="${collection.mods.length}" aria-expanded="false" aria-controls="collection_${collectionId}">${config.text.more.replace("_X_", collection.mods.length)}</a>
					</p>`
        : "";
    return header + notes + body + footer + more;
  });

  const paragraph = (text) => {
    const p = document.createElement("p");
    p.innerHTML = stir.String.stripHtml(text.replace(/<\/?(br|p)>/g,"__br__")).replaceAll("__br__","<br>");
    return p;
  };

  //view more behaviour
  function viewMore(e) {
    if (!this.classList) return;

    if (this.classList.toggle(config.css.truncateModuleCollection)) {
      stir.scrollToElement(this, 60); // return the user to the top of list
      e.target.innerText = config.text.more.replace("_X_", e.target.getAttribute("data-choices"));
      e.target.setAttribute("aria-expanded", "false");
    } else {
      e.target.innerText = config.text.fewer;
      e.target.setAttribute("aria-expanded", "true");
    }
    e.preventDefault();
  }

  function viewModule(e) {
    e.preventDefault();
    _mcPointer = parseInt(this.getAttribute('data-index'))-1;
    stir.dpt.show.module( this.getAttribute('data-spa'), this.getAttribute('href') );
  }

  const versionToSession = (data) => {
    if(!data || !data.length) return;
	// [2024-03-14] rwm2 -- remove DEBUG test to make it live --
    if(debug) {
      try {
        return data.filter(v=>v.versionActive==="Y").sort(compareVersions).pop().versionName;
      } catch (e) {
        console.warn(e);
      }
    }
    return;
  };

  const compareVersions = (a, b) => {
    		if (a.versionId < b.versionId) return -1;
    		if (a.versionId > b.versionId) return 1;
    		return 0;
  };

  const modulesOverview = (data) => {

    let frag = document.createDocumentFragment();
    data.initialText && frag.append(paragraph(data.initialText));

    if (data.pdttRept) {
      let tempNode = document.createElement("p");
      tempNode.appendChild(stir.createDOMFragment(data.pdttRept));
      data.pdttRept && frag.append(tempNode);
    }
    let paths = [],
      years = [];

    data.semesterGroupBeans.forEach((group, g) => {
      group.groupOptions.forEach((option, o, options) => {
        option.semestersInOption.forEach((semester, s) => {
          let div = document.createElement("div");
          let semesterID = [g, o, s].join("");
          let year = getYear(semester, g, o, s);
          div.classList.add("stir-accordion");
          div.insertAdjacentHTML("beforeend", `<h3>Year ${year}: ${getSemester(semester)} ${getOption(o, options)}</h3>`);
          if (options.length > 1 && years.indexOf(year) === -1) {
            years.push(year);
            paths.push(`${stir.cardinal(options.length)} alternative paths in year ${year}`);
          }
          div.insertAdjacentHTML("beforeend", template.container(semester.collections.map(collectionView(semesterID)).join("")));
          frag.append(div);
        });
      });
    });

    if (paths.length > 0) {
      let paths_p = document.createElement("p");
      paths_p.innerHTML = `<span class="uos-shuffle"></span> <strong>There are ${stir.Array.oxfordComma(paths, true)}. Please review all options carefully.</strong>`;
      paths_p.classList.add("c-callout", "info");
      frag.prepend(paths_p);
    }

    // attach behaviour to `view more` links and bind them to the respective table element
    Array.prototype.forEach.call(frag.querySelectorAll("[data-collection-container]"), function (el) {
      var a = el.querySelector(".c-course-modules__view-more-link a");
      a && a.addEventListener("click", viewMore.bind(el));
    });
    
    Array.prototype.forEach.call(frag.querySelectorAll("a[data-spa]"), el => {
      el.addEventListener("click", viewModule.bind(el));
    });


    return frag;
  };

  ///////////////////////////////////////

  const routeOptionView = (data) => `<option value="${data.join("|")}">Starting ${data[3]}, ${data[1].toLowerCase()} (${data[4]})</option>`;

  const selectView = (data) => {
    if (!data || (data.length && data.length < 2)) {
      return new Comment(data.map(routeOptionView).join(""));
    }
    const wrapper = document.createElement("div");
    wrapper.id = "course-modules-container__options-list";
    wrapper.append(paragraph(`There are ${stir.cardinal(data.length)} options for this course in the current academic year:`));
    const selector = document.createElement("select");
    wrapper.append(selector);
    selector.id = "course-modules-container__routes-select";
    selector.insertAdjacentHTML("afterbegin", data.map(routeOptionView).join(""));
    selector.addEventListener("change", function (e) {
      var value = this.options[this.selectedIndex].value.split("|");
      var moa = value[0];
      var occ = value[2];
      resetGlobals();
      stir.dpt.reset.modules();
      getModules(user.type, user.rouCode, moa, occ);
    });
    return wrapper;
  };

  //	const compare = (a, b) => {
  //		if (a < b) return -1;
  //		if (a > b) return 1;
  //		return 0; // a must be equal to b
  //	};

  //	const routeSort = (a, b) => compare(a.rouName, b.rouName);

  const makeSelector = (data, name) => {
    const label = document.createElement("label");
    const select = document.createElement("select");
    label.append(document.createTextNode("Select a course"));
    label.setAttribute("for", name);
    select.name = name;
    select.id = name;
    label.append(select);

    data.forEach && data.forEach((route) => select.append(makeOption(route)));

    const change = (event) => {
      resetGlobals();
      stir.dpt.reset.options();
      stir.dpt.reset.modules();
      user.rouCode = select[select.selectedIndex].value;
      user.rouName = select[select.selectedIndex].textContent;
      getOptions(user.type, user.rouCode, user.auto);
    };

    select.addEventListener("change", change);
    change(); // auto load first option
    return label;
  };

  const makeOption = (data, index) => {
    const option = document.createElement("option");
    if (data.rouName && data.rouCode) {
      option.textContent = `${data.rouName}`;
      option.value = data.rouCode;
      return option;
    }
    option.textContent = data; // fallback/debug
    return option;
  };

  ///////////////////////////////////////

  const na = new Function();

  return {
    show: {
      fees:     na,
      routes:   na,
      options:  na,
      modules:  na,
      module:   na,
      version:  na,
      next: function(e) {
        if(_mcPointer===_moduleCache.length-1) return;
        stir.dpt.show.module( moduleIdentifier(_moduleCache[++_mcPointer]), moduleUrl(_moduleCache[_mcPointer]));
        this.parentElement && this.parentElement.setAttribute('data-mc',_mcPointer);
      },
      previous: function(e) {
        if(_mcPointer<=0) return;
        stir.dpt.show.module( moduleIdentifier(_moduleCache[--_mcPointer]), moduleUrl(_moduleCache[_mcPointer]));
        this.parentElement && this.parentElement.setAttribute('data-mc',_mcPointer);
      }
    },
    get: {
      options: getOptions,
      routes: getRoutes,
      viewer: () => urls.viewer,
      version: getVersion
    },
    reset: {
      module:  na,
      modules: na,
      options: na
    },
    set: {
      viewer: (path) => (urls.viewer = path),
      show: {
        routes: (callback) =>
          (routesCurry = stir.curry((routes, data) =>
            callback(
              makeSelector(
                data.filter((route) => routes.includes(route.rouCode)),
                "rouCode"
              )
            )
          )),
        options: (callback) =>
          (stir.dpt.show.options = (data) => {
            callback(selectView(data));
            if (user.auto && user.type && user.rouCode) {
              getModules(user.type, user.rouCode, data[0][0], data[0][2]);
            }
          }),
        modules: (callback) => (stir.dpt.show.modules = (data) => callback(modulesOverview(data),_moduleCache.length-1)),
        module:  (callback) => (stir.dpt.show.module  =  (a,b) => callback(a,b)),
        version: (callback) => (stir.dpt.show.version = (data) => callback(versionToSession(data)))
      },
      reset: {
        module:  (callback) => (stir.dpt.reset.module = callback),
        modules: (callback) => (stir.dpt.reset.modules = callback),
        options: (callback) => (stir.dpt.reset.options = callback),
      },
    },
    debug: {
      version: (data) => {
        console.info(data);
      }
    }
  };
})();

var stir = stir || {};
stir.t4Globals = stir.t4Globals || {};
stir.fees = stir.fees || {};

stir.fees.template = {
	chooser: `<h4>Select your fee status to see the tuition fee for this course:</h4>`,
	default: `<option value disabled selected>Select fee status</option>`
};

stir.fees.doFeesTable = function doFeesTable (scope) {    
	if (!scope) return;
	const label  = document.createElement('label');
	const select  = document.createElement('select');
	const table   = document.createElement('table');
	var remotes = Array.prototype.slice.call(scope.querySelectorAll('[data-action="change-region"]'));
	var region;

    label.innerHTML = stir.fees.template.chooser;
    select.innerHTML = stir.fees.template.default;
    label.append(select);
	scope.prepend(table);
	scope.prepend(label);

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
			showTheStuff(region);
		}
	}

	function showTheStuff(region) {
		show(table);
		getRegionals(region).forEach(show);
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
};

/**
 * Fees region (e.g. home/eu) selector
 * @param {*} scope DOM element that wraps the fees information (selector and table, etc).
 */
((scope)=>{

	const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	
	if(!scope) {
		debug && console.error("[Fee API] no scope");
		return;
	}
	
	if(scope.hasAttribute('data-local')) {
		debug && console.info('[Fee API] API override is in place');
		return; // t4 editor has indicated that API data for this route is to be ignored
	}
	
	let initialised = false;
	const stuff = {};
	stuff.feestab = document.querySelector('[data-tab-callback="stir.fees.auto"] + div [data-behaviour="accordion"] div');
	const info = {};
	const feeapi = "dev"===UoS_env.name?'../fees.json':'<t4 type="media" id="182818" formatter="path/*" />'
	// Media #182818 is "fees.json" which contains a T4 Web Object that fetches live data via the live site.
	// (in preview it will make an API call, in staging it will be "t4-cached").

	const labels = {
		UG: {
			"H": "Scotland",
			"R": "England, Wales, NI, Republic of Ireland",
			"O": "International (including EU)",
		},
		PG: {
			"H": "UK and Republic of Ireland",
			"O": "International (including EU)",
		}
	};

	const statuses = {
		UG: {
			"H": "Scottish students",
			"R": "Students from England, Wales, Northern Ireland and Republic of Ireland",
			"O": "International students (including EU)",
		},
		PG: {
			"H": "Students from the UK and Republic of Ireland",
			"O": "International (including EU) students",
		}
	};
	const regions = {
		UG: {
			"H": "home",
			"R": "ruk",
			"O": "int-eu",
		},
		PG: {
			"H": "home",
			"O": "overseas",
		}
	};
	const modes = {
		"FT":"full time",
		"PTO":"part time",
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

	const feetables = data => {
		
		return feetable(
			info.stata.map(status=>
				info.moda.map(mode => 
					feetablerow(status,mode,
						data.feeData.filter(
							a=>a.feeStatus===status&&a.modeOfAttendance===mode
						)
					)
				).join('')
			).join(''),"Annual fees");
	};

	const onlyUnique = (value, index, self)  => self.indexOf(value) === index;

	const feetable = (data, caption) => 
		//`<table>`+
		(caption?`<caption>${caption}</caption>`:'')+
		`<thead><td></td>`+
		info.theyears.map(th_year).join('')+
		`</thead><tbody>`+
		`${data}</tbody>`;
		//`</table>`;

	const th_year = year => `<th scope="col" style="width:20%;">${(year)}</th>`;
	const td_amount = data => `<td>${formatter.format(data.amount)}</td>`;

	function feetablerow (status,mode,data) {
		return `<tr class=hide data-region=${regions[level][status]}>`+
		`<th scope=row>${statuses[level][status]}`+
		`${info.moda.length>1?`<br>(${modes[mode]})`:''}`+
		`</th>`+
		info.theyears.map(year => data.filter(a=>a.academicYear===year).map(td_amount).join('')).join('')+
		`</tr>`;
	}

	const el = document.querySelector('[data-modules-route-code]');
	const routes = (()=>{

		if(!el) return false;
		if(!el.hasAttribute('data-modules-route-code')) {
			debug && console.error('[Fee API] No routecode');
			return false;
		}
		if(el.getAttribute('data-modules-route-code').indexOf(',')!==-1) {
			debug && console.info('[Fee API] Multiple route codes');
		}
		return el.getAttribute('data-modules-route-code').split(',').map(item=>item.trim());

	})();

	const updateOldTable = html => {
		const oldtable = scope.querySelector('table');
		oldtable && (oldtable.innerHTML = html);
	};

	const updateOldSelect = data => {
		info.stata.forEach(status => {
			const option = document.createElement('option');
			option.value = regions[level][status];
			option.textContent = labels[level][status];
			stuff.select.append(option);
		});
	};

	const level = el && el.getAttribute('data-modules-course-type');
	
	stir.fees.auto = () => {
		if(!initialised) {
			initialised = true;

			stir.fees.doFeesTable(scope);
			stuff.select  = scope.querySelector('select');

			routes && stir.getJSON(feeapi, data=>{
				if(data.feeData) {
					const route = routes.shift();
					routedata = data.feeData.filter(item=>item.rouCode===route);
					feedata = routedata.length && routedata[0].feeData

					info.theyears = feedata && feedata.map(data=>data.academicYear).filter(onlyUnique);
					info.stata = feedata && feedata.map(data=>data.feeStatus).filter(onlyUnique);
					info.moda = feedata && feedata.map(data=>data.modeOfAttendance).filter(onlyUnique);

					if(!routedata.length) {
						debug && console.error(`[Fee API] ${route}: no match for this route code found in the fees data`);
						stuff.select && stuff.select.remove();
					} else {
						debug && console.info(`${route}: API fee data ${feedata.length>0?'available':'not available'}`);
						if(feedata.length) {
							updateOldTable(routedata.map(feetables).join(''));
							stuff.select && updateOldSelect();
						} else {
							stuff.select && stuff.select.remove();
						}
					}
				}
			});
		}
	}

	if(stir.callback && stir.callback.queue && stir.callback.queue.indexOf("stir.fees.auto")>-1) stir.fees.auto();

})(document.getElementById("course-fees-information"));
/**
 * 
 * 
 */

var stir = stir || {};

stir.course = (function() {

	const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	const na = {auto: new Function()};

	if(!stir.dpt) return na;
	if(!stir.akari) return na;
	if(!stir.templates.course) return na;

	const container = document.getElementById('course-modules-container');
	const el = document.querySelector("[data-modules-route-code][data-modules-course-type]");
	if(!container || !el) return na;
	
	const routeChooser  = stir.templates.course.div('routeBrowser');
	const optionChooser = stir.templates.course.div('optionBrowser');
	const moduleBrowser = stir.templates.course.div('moduleBrowser');
	const moduleViewer  = stir.templates.course.dialogue('moduleViewer');
	const moduleInfo    = stir.templates.course.div('moduleInfo');
	const version = document.querySelector('time[data-sits]');
	const spinner = new stir.Spinner(moduleViewer);
	
	// used to track modal/url changes
	const status = { 
		uid: 0,
		total: 0
	};

	let initialised = false;

	const parameter = {
		route: el.getAttribute('data-modules-route-code'), // i.e. "UHX11-ACCFIN";
		level: el.getAttribute('data-modules-course-type'), // i.e. "UG";
		auto: true
	};

	// initialise any accordions newly added to the DOM
	const reflow = () => {
		Array.prototype.forEach.call(container.querySelectorAll(".stir-accordion"), function (accordion) {
			new stir.accord(accordion, true);
		});
	};

	const render = data => {
		// Boilerplate text neccessary for module "page" popup
		if(!boilerplates) return console.error('Boilerplate text not loaded!');

		spinner.hide();
		
		// Render module information HTML:
		moduleInfo.innerHTML = stir.templates.course.module(boilerplates, status.total, data);
		
		// Find and activate any animated bar graphs:
		stir.templates.course.barcharts( moduleInfo.querySelectorAll(".barchart") )
	};

	/**
	 * External "handler" functions that will be called by
	 * the API wrapper (i.e. DPT, Akari).
	 */

	// DOM Reset functions
	const reset = {
		modules: ()=>moduleBrowser.innerHTML='',
		module: ()=>moduleInfo.innerHTML='',
		options: ()=>optionChooser.innerHTML=''
	};

	// DOM disaplay/callback functions
	const handle = {
		routes: frag => routeChooser.append(frag),
		options: frag => optionChooser.append(frag),
		modules: (frag,count) => {
			status.total = count;
			moduleBrowser.append(frag);
			reflow();
		},
		module: (id,url) => {
			reset.module();
			spinner.show();
			stir.akari.get.module( id, render );
			moduleViewer.showModal();
			if(url) {
				history.pushState({uid:++status.uid},"",url);
			}
		},
		version: frag => version && frag && (version.textContent = frag)
	};
	/** **/	
	
	// Set up the DOM:
	container.insertAdjacentHTML("beforeend",stir.templates.course.disclaimer);
	container.append( routeChooser, optionChooser, moduleBrowser );
	document.body.append(moduleViewer);
	moduleViewer.append(moduleInfo);
	
	// Hook up the data callback handlers:
	stir.dpt.set.show.routes  ( handle.routes  );
	stir.dpt.set.show.options ( handle.options );
	stir.dpt.set.show.modules ( handle.modules );
	stir.dpt.set.show.module  ( handle.module  );
	stir.dpt.set.show.version ( handle.version );
	stir.dpt.set.reset.modules( reset.modules  );
	stir.dpt.set.reset.module ( reset.module   );
	stir.dpt.set.reset.options( reset.options  );

	window.addEventListener("popstate",e=>{
		if(e.state && e.state.uid){
			status.uid = e.state.uid;
		}

		let params = new URLSearchParams(document.location.search);
		let modurl = params.has("code") && params.has("session") && params.has("semester") && params.has("occurrence");

		if(modurl) {
			handle.module(`${params.get("code")}/${params.get("session")}/${params.get("semester")}`,null);
		} else {
			if (moduleViewer.open) {
				status.uid = 0; // reset counter
				moduleViewer.close();
			}
		}
	});
	
	moduleViewer.addEventListener("close", e=>{
		if(status.uid>0) {
			history.go(0-status.uid);
			status.uid = 0; // reset prev/next counter
		}
	});

	function _auto() {
		if(!initialised) {
			initialised = true;
			version && stir.dpt.get.version(parameter.level);
			if(parameter.route.indexOf(',')>=0) {
				stir.dpt.get.routes(parameter.level, parameter.route, parameter.auto);
			} else {
				stir.dpt.get.options(parameter.level, parameter.route, parameter.auto);
			}
		}
	}

	function _init(data) {
		boilerplates = data;
	}

	// STIR TABS AWARE
	//const panel = container.closest && container.closest('[role=tabpanel]');
	//if(panel && window.location.hash.indexOf(panel.id)===1) _auto();

	// STIR ACCORDION
	//const accordion = container.closest && container.closest('[role=dave]');
	//if(accordion && !accordion.hidden) _auto();

	// CALLBACK QUEUE - replaces the DOM checking above
	if(stir.callback && stir.callback.queue && stir.callback.queue.indexOf("stir.course.auto")>-1) _auto();
	// todo: empty the queue?

	return {
		init: _init,	// get module boilerplate text
		auto: _auto,	// initialise and begin
	};

})();

// Get boilerplate text first, then initialise the course page scripts:
stir.getJSON('https://www.stir.ac.uk/data/modules/boilerplate/', data=>stir.course.init(data));

// TEMPORARY ONLY UNTIL T4 REPUBLISHES THE COURSE PAGES
// 2024-02-07 r.w.morrison@stir.ac.uk
 
var StirUniModules = StirUniModules || {};
StirUniModules.initialisationRoutine = stir.course.auto;
/*
 * Personalisation for course pages
 */

//(function () {

//    UoS_locationService.do(function (data) {
//        var objSchols = stir.t4Globals.scholarships;
//
//        for (var index in objSchols) {
//
//            if (data.country_code === objSchols[index].country && objSchols[index].show) {
//                var el = document.querySelectorAll("#ug-course-tabs__overview div.c-wysiwyg-content p")[0];
//                var newNode = document.createElement("p");
//
//                newNode.innerHTML = 'Test';
//                el.parentNode.insertBefore(newNode, el);
//
//            }
//        }
//    });

//})();
/*
 * Data parsing and listing moved to T4. Now just the button hack remaining.
 * @author: Ryan Kaye
 * @version: 3
 * @date: March 2022
 */

(function (scope) {
  if (!scope) return;

  /* EVENT Listener for and handle click events */
  const addCourseItemListener = (el) => {
    if (el.children[0] && el.children[0].hasAttribute("href"))
      el.onclick = () => (window.location = el.children[0].attributes.href.value);
  };

  /* Make the related courses <li />s fully clickable */
  stir.each((el) => addCourseItemListener(el), stir.nodes(".c-course-related__buttons ul li"));

  /* End */
})(stir.node(".c-course-related__buttons"));

/*
   Find a content item then animate scroll to it opening any tabs / accords along the way
   @author: Ryan Kaye
   @version: 2
   @date: Oct 2021
 */

(function () {
  /*
    DOM elements
  */

  const applySlideBtns = stir.nodes("[data-applyslidelink]");
  const skipLinks = stir.nodes(".skip-link");
  const buttonsNode = stir.node(".c-course-title__buttons");

  /*
    Vars
  */

  const offsets = { small: 50, medium: 150 };
  const errorMsg = ["WARNING!! Missing content: Entry Requirements > Application Procedure"];

  if (!applySlideBtns && !skipLinks) return;

  /* 
    Returns a node that outputs an error message
  */
  const renderErrorNode = (contentId, errorMsg) => `<p class="alert callout">` + errorMsg[0] + ` ` + contentId + ` ` + errorMsg[1] + `</p>`;

  /* 
    Return the node id part from a url (#nodeid)
  */
  const getLinkId = (href) => {
    const contentUris = href.split("#");
    return contentUris.length > 1 ? contentUris[1] : "";
  };

  /*
    Find the content item then smooth scroll to it
   */
  const slideToContent = (node, offset) => {
    if (!node) return;

    const panel = node.closest('[role="tabpanel"],[role="region"]');

    // Open the tab if found and not already open
    if (panel) {
      const tab = panel.hasAttribute("aria-labelledby") && document.getElementById(panel.getAttribute("aria-labelledby"));
      if (tab) {
        if (tab.hasAttribute("aria-selected") && tab.getAttribute("aria-selected") !== "true") {
          tab.click();
        } else if (tab.hasAttribute("aria-expanded") && tab.getAttribute("aria-expanded") !== "true") {
          tab.click();
        }
      }
    }

    if (node.getAttribute("data-behaviour") === "accordion") {
      const accordion = node.querySelector('button[aria-expanded="false"]');
      accordion && accordion.click();
    }

    node && stir.scrollToElement(node, offset);
    return;
  };

  /*
    Handle click events
   */
  const handleClick = (e) => {
    const contentId = getLinkId(e.target.href);
    if (contentId) {
      const offset = offsets[stir.MediaQuery.current] ? offsets[stir.MediaQuery.current] : 100;
      slideToContent(document.getElementById(contentId), offset);
      e.preventDefault();
      return;
    }
  };

  /*
    Listen for click events
   */
  const addClickListener = (btn) => {
    btn.addEventListener("click", handleClick);
    return;
  };

  /* 
    Error handling 
  */
  const handleError = (btn, buttonsNode, errorMsg) => {
    const contentId = getLinkId(btn.getAttribute("href"));
    if (!document.getElementById(contentId)) {
      // No target node so output a message for the content team
      if (UoS_env.name !== "prod") {
        if (buttonsNode) {
          buttonsNode.insertAdjacentHTML("beforeend", renderErrorNode(contentId, errorMsg));
        }
      }
      // Hide the button for live
      if (UoS_env.name === "prod") btn.classList.add("hide");
      return "Error";
    }
    return "No Error";
  };

  /*
    ON LOAD: Apply button actions
   */

  if (applySlideBtns) {
    stir.each((btn) => {
      handleError(btn, buttonsNode, errorMsg);
      addClickListener(btn);
    }, applySlideBtns);
  }

  /*
    ON LOAD: Skiplink actions
   */

  skipLinks && stir.each(addClickListener, skipLinks);

  /* END */
})();

/*
 * Sticky menu show/hide
 * @author: Ryan Kaye / Robert Morrison
 */

(function () {
  /*
   * DOM elements
   */

  var stickyMenu = stir.node(".c-course-title-sticky-menu");
  var stickyCloseBtn = stir.node("#course-sticky-close-btn");
  var buttonBox = stir.node(".c-course-title__buttons"); // Once off screen the sticky kicks in

  /*
   * Vars
   */

  var enableSticky = true; // (MUTATIONS!!)

  /*
   * ON LOAD
   */

  if (!stickyMenu) return;

  var showPosition = buttonBox ? buttonBox.offsetTop + buttonBox.offsetHeight : 0;

  if (stir.MediaQuery.current !== "small") {
    stickyMenu.classList.add("stir__slideup");
    stickyMenu.style.display = "block";

    if (buttonBox) {
      window.addEventListener("scroll", scrollPositionChecker); // listen for scrolling
    }

    if (stickyCloseBtn) {
      stickyCloseBtn.onclick = function (e) {
        enableSticky = false;
        window.removeEventListener("scroll", scrollPositionChecker); // stop listening for scrolling
        stickyMenu.parentNode.removeChild(stickyMenu);
        e.preventDefault();
      };
    }
  }

  /* -----------------------------------------------
   * Decides whether to how or hide the sticky based on scroll position
   * ---------------------------------------------- */
  function showHideSticky() {
    if (enableSticky) {
      if (window.scrollY > showPosition) stickyMenu.classList.add("stir__slidedown");
      if (window.scrollY < showPosition) stickyMenu.classList.remove("stir__slidedown");
    }
  }

  /* -----------------------------------------------
   * Changed this to a named function so we can easily "removeEventListener" when
   * we no longer need it. (Anonymous functions can be added but not removed). [rwm2]
   * ---------------------------------------------- */
  function scrollPositionChecker() {
    window.requestAnimationFrame(showHideSticky);
  }
})();

/*
 * Dynamically insert testimonials based of "Name" id
 * @author: Ryan Kaye
 * @date: Dec 2022 Ho Ho Ho
 * @version: 1
 */

(function (scope) {
  if (!scope) return;

  /*
      VARS
   */

  const DATANODE = scope;

  //const server = 'stir-search.clients.uk.funnelback.com';
  const server = "search.stir.ac.uk";
  const urlBase = `https://${server}`; // ClickTracking
  const JSON_BASE = `${urlBase}/s/search.json?`;

  const scaleImage = stir.curry((server, image) => `https://${server}/s/scale?url=${encodeURIComponent(image)}&width=800&height=800&format=jpeg&type=crop_center`);
  const scaleImageWithFunnelback = scaleImage(server);

  const CONSTS = {
    SF: "[profileDegreeTitle,profileCountry,profileCourse,profileCourse1,profileCourse1Url,profileCourse1Modes,profilecourse1Delivery,profileCourse2,profileCourse2Url,profilecourse2Delivery,profileCourse2Modes,profileFaculty,profileSubject,profileYearGraduated,profileLevel,profileTags,profileSnippet,profileImage,profileMedia]",
    collection: "stir-www",
    sortBy: "metaprofileImage",
    tags: "[student alum]",
    postsPerPage: 9,
    noOfPageLinks: 9,
    urlBase: urlBase,
  };

  /*
      formatName() : @returns String (html)
   */
  const formatName = (name) => name.replace("| Student Stories | University of Stirling", "").trim();

  /*
      renderQuote() : @returns String (html)
   */
  const renderQuote = (item) => {
    return `
      <div id="pullquote-77513" class="pullquote pullquote-pic ">
            <img src="${scaleImageWithFunnelback("https://stir.ac.uk" + item.metaData.profileImage)}" alt="${formatName(item.title)}" loading="lazy"  width="700" height="600">
            <div class="pullquote--text">
              <cite>
                <span class="author">${formatName(item.title)}</span><br>
                <span class="info">${item.metaData.profileCountry}</span><br>
                <span class="info">${item.metaData.profileDegreeTitle}</span>
              </cite>
              <blockquote cite="#">
                <q>${item.metaData.profileSnippet}</q>
              </blockquote>
              <a href="${item.displayUrl}" aria-label="Read ${formatName(item.title)}'s story (${formatName(item.title)})" class="c-link">Read ${formatName(item.title).split(" ")[0]}'s story</a>
            </div>
        </div>
    `;
  };

  /*
      setDOMContent() : @returns boolean
   */
  const setDOMContent = (resultsArea, html) => {
    stir.setHTML(resultsArea, html);

    return true;
  };

  /*
      getTestimonial() : @returns string 
   */
  const getTestimonial = (testimonial, results) => {
    const filtered = results.filter((item) => {
      if (formatName(item.title) === testimonial) return item;
    });

    if (!filtered.length) return "";

    return renderQuote(filtered[0]);
  };

  /*
      main() : @returns boolean
   */
  const main = (dataNode, consts, jsonBase) => {
    const testimonials = dataNode
      .getAttribute("data-testimonials")
      .split("|")
      .filter((el) => el);

    if (!testimonials.length) return false;

    const params = Object.entries(consts)
      .map((item) => item[0] + "=" + item[1])
      .join("&");

    const query = `&query=[${testimonials.map((el) => el).join(" ")}]`;
    const jsonUrl = jsonBase + params + query;

    // Get the data from FunnelBack
    stir.getJSON(jsonUrl, (initialData) => {
      const results = initialData.response.resultPacket.results;
      const html = testimonials.map((item) => getTestimonial(item, results)).join(" ");
      const resultsArea = dataNode.querySelector(".pullquotesbox");

      resultsArea && setDOMContent(resultsArea, html);
    });

    return true;
  };

  /*
      On Load
   */

  const run = DATANODE.map((element) => main(element, CONSTS, JSON_BASE));

  /*
      End
   */
})(stir.nodes("[data-testimonials]"));
