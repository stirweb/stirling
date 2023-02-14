var stir = stir || {};
stir.eventbrite = stir.eventbrite || {};

(function () {
  const DELAY = 5000;
  /* 
    Callback  
  */
  const orderCompleteCallback = () => {
    //console.log("Order complete!");
  };

  /* 
    Get the GA Client ID from the tracker
  */
  const getClientId = () => {
    try {
      const tracker = ga.getAll().filter((item) => {
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
  const outputWidget = (node, clientID) => {
    window.EBWidgets.createWidget({
      // Required
      widgetType: "checkout",
      eventId: node.dataset.eventbriteid,
      iframeContainerId: "eventbrite-widget-container-" + node.dataset.eventbriteid,

      // Optional
      googleAnalyticsClientId: clientID,
      iframeContainerHeight: 425,
      onOrderComplete: orderCompleteCallback,
    });
  };

  /*
    Helpers 
  */
  const isWidget = (elem) => (elem.getAttribute("src") && elem.getAttribute("src").includes("eventbrite") ? true : false);

  const renderLoader = () => {
    return `
        <div>
          <div class="c-search-loading__spinner" ></div>
          <p class="text-center u-mt-sm">Loading Eventbrite widget</p>
        </div>`;
  };

  /*
    Controller 
    Slight delay to make sure the tracker has loaded
  */
  const loadEventbriteWidgets = (nodes, delay) => {
    if (!nodes) return;

    nodes.forEach((node) => stir.setHTML(node, renderLoader()));

    setTimeout(() => {
      nodes.forEach((node) => {
        stir.setHTML(node);
        outputWidget(node, getClientId());
      });

      stir.nodes("iframe").forEach((element) => {
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
