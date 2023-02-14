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
