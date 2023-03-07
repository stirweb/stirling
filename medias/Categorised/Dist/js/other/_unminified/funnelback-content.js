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
  var templates = {
    relatedCourses: function relatedCourses(result) {
      return "<li><a href=\"".concat(result.liveUrl, "\">").concat(result.metaData.award, " ").concat(result.title, "</a></li>");
    },
    relatedNews: function relatedNews(result) {
      return "<article class=\"cell large-4 medium-6 small-12\" aria-label=\"".concat(result.title.split("|").shift().trim(), "\">\n\t\t<a href=\"").concat(result.liveUrl, "\"><img class=\"show-for-medium\" src=\"").concat(result.metaData.image.split("|").slice(1).shift(), "\" alt=\"").concat(result.metaData.imagealt, "\"></a>\n\t\t<time class=\"u-block u-my-1 u-grey--dark\">").concat(stir.Date.newsDate(new Date(result.date)), "</time>\n\t\t<h3 class=\"header-stripped u-header--margin-stripped u-mt-1 u-font-normal u-compress-line-height\"><a href=\"").concat(result.liveUrl, "\" class=\"c-link u-inline\">").concat(result.title.split("|").shift().trim(), "</a></h3>\n\t\t<p class=\"text-sm\">").concat(result.summary, "</p>\n\t</article>");
    }
  };
  var parameters = {
    relatedCourses: '&sort=title&SF=[award]',
    relatedNews: '&sort=date&SF=[c,d,h1,image,imagealt,tags]&num_ranks=3'
  };
  document.querySelectorAll('[data-funnelback-inject]').forEach(function (el) {
    if (!el) return;
    var type = el.getAttribute('data-type');
    var metaName = el.getAttribute('data-meta-name');
    var metaValue = el.getAttribute('data-meta-value');
    var collection = el.getAttribute('data-collection');
    if (!type || !metaName || !metaValue) return;
    var url = stir.funnelback.getJsonEndpoint().toString() + "?collection=".concat(collection, "&query=!padre&meta_").concat(metaName, "_orsand=%22").concat(metaValue, "%22").concat(parameters[type]);
    var callback = function callback(data) {
      var _data$response, _data$response$result, _data$response$result2;
      if (!data) return;
      el.innerHTML = (data === null || data === void 0 ? void 0 : (_data$response = data.response) === null || _data$response === void 0 ? void 0 : (_data$response$result = _data$response.resultPacket) === null || _data$response$result === void 0 ? void 0 : (_data$response$result2 = _data$response$result.results) === null || _data$response$result2 === void 0 ? void 0 : _data$response$result2.map(function (result) {
        return templates[type](result);
      }).join('')) || '';
    };
    debug ? stir.getJSONAuthenticated(url, callback) : stir.getJSON(url, callback);
  });
})();