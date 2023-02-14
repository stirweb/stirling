((sliders) => {
  const renderWrapper = (classes) => `<div class="u-padding-y ${classes}"></div>`;

  sliders.forEach((el) => {
    // Additional wrapper for wrappers now required
    if (el.getAttribute("data-ct") === "wrapper") {
      const div = stir.stringToNode(renderWrapper(el.classList.value));
      el.insertAdjacentElement("beforebegin", div);
      div.insertAdjacentElement("afterbegin", el);
    }

    tns({
      container: el,
      controls: false,
      navPosition: "bottom",
      autoHeight: true,
      lazyload: true,
    });
  });
})(Array.prototype.slice.call(document.querySelectorAll("[data-tns]")).filter((el) => el.id));
