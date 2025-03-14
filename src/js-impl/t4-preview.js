var stir = stir || {};

(function () {
  // if we are in preview, dynamically load the preview tools
  // otherwise just skip this

  if("www.stir.ac.uk"===window.location.hostname) return;

  switch (window.location.hostname) {
    case "localhost":
      stir.addScript("/src/js-other/t4-preview-tools.js");
      break;
    case "stirweb.github.io":
      stir.addScript("/stirling/src/js-other/qa-protect.js");
      break;
    case "stiracuk-cms01-production.terminalfour.net":
    case "stiracuk-cms01-test.terminalfour.net":
      stir.addScript('<t4 type="media" id="158095" formatter="path/*" />');
      break;
  }
})();
