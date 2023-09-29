var stir = stir || {};
(function () {
  stir.lazyJS(["#coursefavsarea", "#coursesharedarea", "#coursefavsbtn"], "course-favs.js", "174052", UoS_env);

  // const scriptSrc = UoS_env.name.includes("preview") ? `<t4 type="media" id="174052" formatter="path/*" />` : UoS_env.wc_path + "js/other/" + "course-favs.js";

  // const nodes = ["#coursefavsarea", "#coursesharedarea", "#coursefavsbtn"];
  // const nodesInUse = nodes.filter((item) => stir.node(item));

  // if (!nodesInUse.length) return;

  // nodesInUse.forEach((item) => {
  //   let observer = stir.createIntersectionObserver({
  //     element: stir.node(item),
  //     threshold: [0.001],
  //     callback: function (entry) {
  //       if (entry.isIntersecting) {
  //         stir.addScript(scriptSrc);
  //         observer && observer.observer.unobserve(this);
  //       }
  //     },
  //   });
  // });
})();
