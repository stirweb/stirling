var stir = stir || {};
stir.eventbrite = stir.eventbrite || {};
(function () {
  var DELAY = 5000;
  /* 
    Callback  
  */
  var orderCompleteCallback = function orderCompleteCallback() {
    //console.log("Order complete!");
  };

  /* 
    Get the GA Client ID from the tracker
  */
  var getClientId = function getClientId() {
    try {
      var tracker = ga.getAll().filter(function (item) {
        if (item.get("trackingId") === "UA-340900-19") return item;
      });
      return tracker[0] ? tracker[0].get("clientId") : "";
    } catch (e) {}
    return "false";
  };

  /* 
    Create the eventbrite widget and output
    Widget height in pixels. Defaults to a minimum of 425px if not provided
  */
  var outputWidget = function outputWidget(node, clientID) {
    window.EBWidgets.createWidget({
      // Required
      widgetType: "checkout",
      eventId: node.dataset.eventbriteid,
      iframeContainerId: "eventbrite-widget-container-" + node.dataset.eventbriteid,
      // Optional
      googleAnalyticsClientId: clientID,
      iframeContainerHeight: 425,
      onOrderComplete: orderCompleteCallback
    });
  };

  /*
    Helpers 
  */
  var isWidget = function isWidget(elem) {
    return elem.getAttribute("src") && elem.getAttribute("src").includes("eventbrite") ? true : false;
  };
  var renderLoader = function renderLoader() {
    return "\n        <div>\n          <div class=\"c-search-loading__spinner\" ></div>\n          <p class=\"text-center u-mt-sm\">Loading Eventbrite widget</p>\n        </div>";
  };

  /*
    Controller 
    Slight delay to make sure the tracker has loaded
  */
  var loadEventbriteWidgets = function loadEventbriteWidgets(nodes, delay) {
    if (!nodes) return;
    nodes.forEach(function (node) {
      return stir.setHTML(node, renderLoader());
    });
    setTimeout(function () {
      nodes.forEach(function (node) {
        stir.setHTML(node);
        outputWidget(node, getClientId());
      });
      stir.nodes("iframe").forEach(function (element) {
        isWidget(element) && element.setAttribute("title", "Eventbrite widget");
      });
    }, delay);
  };

  /* 
    On Load  
    Check if the script has already fired using our global namespace var
  */
  if (stir.eventbrite !== "true") {
    stir.eventbrite = "true";
    loadEventbriteWidgets(stir.nodes('div[id^="eventbrite-widget-container-"]'), DELAY);
  }
})();