var stir = stir || {};
stir.funnelback = stir.funnelback || function () {
  var debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  var hostname = debug || UoS_env.name === "preview" ? "stage-shared-15-24-search.clients.uk.funnelback.com" : "search.stir.ac.uk";
  var url = "https://".concat(hostname, "/s/");
  var getJsonEndpoint = function getJsonEndpoint() {
    return new URL("search.json", url);
  };
  var getScaleEndpoint = function getScaleEndpoint() {
    return new URL("scale", url);
  };
  var getHostname = function getHostname() {
    return hostname;
  };
  return {
    getHostname: getHostname,
    getJsonEndpoint: getJsonEndpoint,
    getScaleEndpoint: getScaleEndpoint
  };
}();
(function () {
  var debug = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  var el = document.querySelector('[data-funnelback-inject]');
  if (!el) return;
  var subject = el.getAttribute('data-subject');
  if (!subject) return;
  var url = stir.funnelback.getJsonEndpoint().toString() + "?collection=stir-courses&query=!padre&SF=[award]&meta_subject_orsand=%22".concat(subject, "%22&sort=title");
  var callback = function callback(data) {
    var _data$response, _data$response$result, _data$response$result2;
    if (!data) return;
    el.innerHTML = (data === null || data === void 0 ? void 0 : (_data$response = data.response) === null || _data$response === void 0 ? void 0 : (_data$response$result = _data$response.resultPacket) === null || _data$response$result === void 0 ? void 0 : (_data$response$result2 = _data$response$result.results) === null || _data$response$result2 === void 0 ? void 0 : _data$response$result2.map(function (result) {
      return "<li><a href=\"".concat(result.liveUrl, "\">").concat(result.metaData.award, " ").concat(result.title, "</a></li>");
    }).join('')) || '';
  };
  debug ? stir.getJSONAuthenticated(url, callback) : stir.getJSON(url, callback);
})();