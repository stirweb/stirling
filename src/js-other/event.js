/*

*/
(function () {
  // get a reference to the Section ID meta tag
  var pageSID = document.head.querySelector("[name=sid][content]");

  // only continue if the meta tag exists. if it didn't (and we
  // don't check) a Reference Error would be thrown.
  if (pageSID) {
    // get all links that match our criteria…
    var upcomingEventLinks = document.querySelectorAll('a[data-section-id="' + pageSID.getAttribute("content") + '"][data-type="event"]');

    //…and loop thru to remove them all
    for (var i = 0; i < upcomingEventLinks.length; i++) {
      upcomingEventLinks[i].parentNode.removeChild(upcomingEventLinks[i]);
      //upcomingEventLinks[i].style.display = "none"; // <- or just hide them if you want!
    }
  }
})();

/*
|
|   SHARE BUTTONS
|
*/

(function (scope) {
  if (!scope) return;

  const shareInput = scope;

  if (shareInput) shareInput.value = window.location.href;

  const copyUrlBtn = stir.node("#copyurl");

  const copyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  copyUrlBtn && copyUrlBtn.addEventListener("click", (event) => copyUrl());
})(stir.node("#shareurl"));

/*
|
|   SERIES LISTING
|
*/

(function (scope) {
  if (!scope) return;

  const seriesEventsArea = scope;
  const seriesId = seriesEventsArea.dataset && seriesEventsArea.dataset.seriesid ? seriesEventsArea.dataset.seriesid : null;

  /*
    |
    |   RENDERERS
    |
    */

  const renderHeader = (text, classes) => (text ? `<h3 class="header-stripped ${classes}">${text}</h3>` : ``);

  const renderEvent = (item, index) => {
    return `
        <div class="${index % 2 === 1 ? `` : `u-bg-grey`} ${index === 0 ? `u-heritage-line-top u-border-width-5` : ``} u-p-1 c-event-list u-gap">
          <div class="u-w-500">
            <span class="u-inline-block u-mb-1"><strong>Event</strong><br />
            <a href="${item.url}">${item.title}</a></span><br />
            <strong >Date:</strong> ${item.stirStart} <br />
            <strong>Time:</strong> ${item.startTime} - ${item.endTime}
          </div>
          <div><span class="u-inline-block u-mb-1"><strong>Description</strong><br />${item.summary} </div>
          <div><span class="u-inline-block u-mb-1"><strong>Audience</strong><br />${item.isPublic ? `Public` : `Staff / students`} </div>
          <div>${item.recording ? `<span class="u-inline-block u-mb-1"><strong>Recording</strong><br />Available` : ``} </div>
        </div>`;
  };

  /*
    |
    |   HELPERS
    |
    */

  const renderEventsMapper = stir.map(renderEvent);

  const joiner = stir.join("");

  const getNow = () => {
    let yourDate = new Date();
    return Number(yourDate.toISOString().split("T")[0].split("-").join(""));
  };

  const isUpcoming = (item) => item.endInt >= getNow();

  const isUpcomingFilter = stir.filter(isUpcoming);

  const isPassed = (item) => item.endInt < getNow();

  const isPassedFilter = stir.filter(isPassed);

  const isSeriesChildFilter = stir.filter((item) => item.isSeriesChild === seriesId);

  const getJSONUrl = (env) => {
    if (env === "dev") return "index.json";
    if (env === "preview") return `<t4 type="navigation" id="5213" />`;

    return `/data/events/revamp/json/index.json`;
  };

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /*
    |
    |   ONLOAD
    |
    */

  console.log(UoS_env.name);

  const url = getJSONUrl(UoS_env.name);

  stir.getJSON(url, (initialData) => {
    const seriesUpcomingData = stir.compose(joiner, renderEventsMapper, isUpcomingFilter, isSeriesChildFilter)(initialData);
    const seriesPastData = stir.compose(joiner, renderEventsMapper, isPassedFilter, isSeriesChildFilter)(initialData);

    const upcomingHtml = seriesUpcomingData.length ? renderHeader("Upcoming", "") + seriesUpcomingData : ``;
    const pastHtml = seriesPastData.length ? renderHeader("Passed", "u-mt-2") + seriesPastData : ``;

    setDOMContent(seriesEventsArea, upcomingHtml + pastHtml);
  });
})(stir.node("#seriesevents"));
