//var stir = stir || {};
//(function () {
//const scriptSrc = UoS_env.name.includes("preview") ? '<t4 type="media" id="176763" formatter="path/*" />' : UoS_env.wc_path + "js/other/favourites.js";
//const scriptSrc2 = UoS_env.name.includes("preview") ? '<t4 type="media" id="174052" formatter="path/*" />' : UoS_env.wc_path + "js/other/course-favs.js";

//stir.lazyJS(["#coursefavsarea", "#coursesharedarea", "#coursefavsbtn"], scriptSrc);
//stir.lazyJS(["#coursefavsarea", "#coursesharedarea", "#coursefavsbtn"], scriptSrc2);

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
//})();
