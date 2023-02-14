var stir = stir || {};

(function () {
  // if we are in preview, dynamically load the preview tools
  // otherwise just skip this
  switch (window.location.hostname) {
    case "localhost":
      stir.addScript("/src/js-other/t4-preview-tools.js");
      break;
    case "t4cms.stir.ac.uk":
      stir.addScript("/webcomponents/dist/js/other/t4-preview-tools.js");
      break;
  }
})();
