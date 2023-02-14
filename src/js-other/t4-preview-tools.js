(function () {
  (function checkPageName() {
    const title = document.querySelector('meta[name="t4name"]');
    const action = createT4EditLink("edit name", "generalInfo");
    if (!title) return;
    if (title.getAttribute("content").slice(-1) === " " || title.getAttribute("content").substring(0, 1) === " ") editorWarning("Spaces at the start and or end of the section name", action);
  })();

  (function checkPageHasDescription() {
    var description = document.querySelector('meta[name="description"]');
    var action = createT4EditLink("edit metadata", "metaData");
    if (!description) {
      editorWarning("meta description is missing", action);
    } else if (null == description.getAttribute("content") || description.getAttribute("content").trim() == "") {
      editorWarning("meta description is empty", action);
    } else if (description.getAttribute("content").length <= 3) {
      editorWarning("meta description is too short", action);
    } else {
      console.info('[HTML styleguide] description: "' + description.getAttribute("content") + '"');
    }
  })();

  /**
   * Create a top edge callout div
   * @param html {string}
   * @param backgroundColor {string}
   */
  function createTopEdgeCallout(html, backgroundColor) {
    var backgroundColor = backgroundColor || "heritage-green";
    var html = '<div class="callout ' + backgroundColor + '" data-closable style="margin:0"><button class="close-button" aria-label="Dismiss alert" type="button" data-close><span aria-hidden="true">&times;</span></button>' + html + "</div>";
    var container = document.getElementById("top-edge-callouts-container") || createTopEdgeCalloutContainer();
    container.innerHTML += html; // this will *not* destroy and replace any previous callouts
    makeSticky(container);
  }

  function createTopEdgeCalloutContainer() {
    var container = document.createElement("div");
    container.classList.add("top-edge-callouts-container");
    document.body.insertAdjacentElement("afterbegin", container);
    return container;
  }

  function makeSticky(container) {
    container.style.position = "sticky";
    container.style.top = 0;
    container.style.zIndex = 10;
  }

  function createT4EditLink(text, panel) {
    var panel = panel || "";
    var text = text || "Edit";
    var relPath,
      sid = document.querySelector('meta[name="sid"][content]');
    if (sid) {
      relPath = "/terminalfour/page/section#edit/" + sid.getAttribute("content") + (panel ? "/" + panel : "");
      console.info("[t4 preview] Section ID: ", sid.getAttribute("content"));
      console.info("[t4 preview] Edit " + panel + ": ", window.location.protocol + "//" + window.location.host + relPath);
      return '<a href="' + relPath + '">' + text + "</a>";
    } else {
      console.warn("[t4 preview] Could not determine section ID");
    }
    return "";
  }

  function editorWarning(message, action) {
    var action = action || "";
    createTopEdgeCallout('<p><span class="uos-pin"></span> Editor warning: ' + message + ". " + action + "</p>", "u-bg-energy-pink u-white--all");
    console.warn("[HTML styleguide] " + message);
  }
})();
