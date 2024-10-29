(function () {
  /* 
      Helpers
  */
  const popImage = (thumbnail, overlay, fullImage) => {
    const rect = thumbnail.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const fullSrc = thumbnail.getAttribute("data-full");
    const index = Number(thumbnail.getAttribute("data-index"));

    fullImage.style.transform = `translate(${startX - window.innerWidth / 2}px, ${startY - window.innerHeight / 2}px) scale(0.2)`;
    fullImage.src = fullSrc;
    fullImage.alt = thumbnail.alt;

    overlay.style.display = "flex";
    overlay.setAttribute("data-index", index);

    setTimeout(() => {
      overlay.classList.add("active");
      fullImage.style.transform = "translate(0, 0) scale(1)";
    }, 150);
  };

  /* 
      Thumbnail clicks
  */

  const thumbs = document.querySelectorAll(".gallery-thumbnail");

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      const gallery = e.target.closest(".stir-microgallery");

      if (!gallery) return;

      const overlay = gallery.querySelector(".gallery-overlay");
      const fullImage = gallery.querySelector(".gallery-full-image");

      popImage(thumb, overlay, fullImage);
    });
  });

  /* 
      Overlay clicks
  */

  const overlays = document.querySelectorAll(".gallery-overlay");

  overlays.forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      const gallery = e.target.closest(".stir-microgallery");

      if (!gallery) return;

      const thumbnails = Array.from(gallery.querySelectorAll(".gallery-thumbnail"));
      const overlay = gallery.querySelector(".gallery-overlay");
      const fullImage = gallery.querySelector(".gallery-full-image");

      // Next
      if (e.target.classList.contains("rightBtn") || e.target.parentElement.classList.contains("rightBtn")) {
        const last = thumbnails.length;
        const index = Number(overlay.getAttribute("data-index"));
        const newIndex = index + 1 === last ? 0 : index + 1;

        popImage(thumbnails[newIndex], overlay, fullImage);
        e.stopPropagation();
        return;
      }

      // Prev
      if (e.target.classList.contains("leftBtn") || e.target.parentElement.classList.contains("leftBtn")) {
        const last = thumbnails.length;
        const index = Number(overlay.getAttribute("data-index"));
        const newIndex = index === 0 ? last - 1 : index - 1;
        popImage(thumbnails[newIndex], overlay, fullImage);
        return;
      }

      // Close
      overlay.classList.remove("active");
      fullImage.style.transform = fullImage.style.transform.replace("scale(1)", "scale(0.2)");

      setTimeout(() => {
        overlay.style.display = "none";
        fullImage.style.transform = "";
      }, 300);
    });
  });
})();
