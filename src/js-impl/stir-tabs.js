var stir = stir || {};
(function () {
  const scriptSrc = UoS_env.name.includes("preview") ? '<t4 type="media" id="174053" formatter="path/*" />' : UoS_env.wc_path + "js/other/stir-tabs.js";
  stir.lazyJS(['[data-behaviour="tabs"]'], scriptSrc);
})();
