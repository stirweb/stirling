var stir = stir || {};
stir.altmetric = {
  url: function () {
    if (UoS_env.name === "dev") return 'altmetric.json';
    return '<t4 type="media" id="166310" formatter="path/*" />';
  }(),
  max: 5,
  donut: function donut(doi) {
    return '<div class=altmetric-embed data-badge-type=donut data-badge-popover=left data-doi="' + doi + '" data-hide-no-mentions=true></div>';
  },
  handle: stir.curry(function (title, handle, index) {
    return "<a href=\"http://hdl.handle.net/".concat(handle, "\">").concat(index === 0 ? title : handle, "</a>");
  }),
  handles: function handles(title, _handles) {
    return _handles.map(stir.altmetric.handle(title)).shift();
  },
  row: function row(element, index) {
    return "<tr><td>".concat(index + 1, "</td><td>").concat(stir.altmetric.handles(element.attributes['title'], element.attributes.identifiers['handles']), "</td><td class=donut>").concat(element.attributes.identifiers['dois'].map(stir.altmetric.donut).join(''), "</td></tr>");
  },
  tbody: function tbody(json) {
    return json.slice(0, stir.altmetric.max).map(stir.altmetric.row).join('');
  },
  table: function table(json) {
    return "<table><caption>University of Stirling research papers ranked by Altmetric</caption><thead><tr><th scope=col>Position</th><th scope=col>Research paper</th><th class=donut scope=col>Altmetric score</th></thead></tr><tbody>".concat(stir.altmetric.tbody(json), "</tbody></table>");
  },
  callback: function callback(json) {
    if (!json) return;
    var container = document.getElementById('top10');
    if (!container) {
      return console.warn('[Altmetric] DOM container not found');
    }
    container.innerHTML = stir.altmetric.table(json);
  }
};

/* Get the feed */
(function () {
  stir.getJSON(stir.altmetric.url, stir.altmetric.callback);
})();