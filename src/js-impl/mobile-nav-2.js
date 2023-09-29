var stir = stir || {};
(function () {
  const scriptSrc = UoS_env.name.includes("preview") ? '<t4 type="media" id="174054" formatter="path/*" />' : UoS_env.wc_path + "js/other/mobile-nav.js";
  stir.lazyJS(["#open_mobile_menu"], scriptSrc);
})();
