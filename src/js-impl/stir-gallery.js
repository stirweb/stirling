var stir = stir || {};
(function () {
  const scriptSrc = UoS_env.name.includes("preview") ? '<t4 type="media" id="185628" formatter="path/*" />' : UoS_env.wc_path + "js/other/micro-gallery.js";
  //stir.addScript(scriptSrc);
  stir.lazyJS([".stir-microgallery"], scriptSrc);
})();
