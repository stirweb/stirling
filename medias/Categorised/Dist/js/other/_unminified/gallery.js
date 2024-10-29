(function () {
  const main = document.querySelector("main");

  main &&
    main.addEventListener("click", (e) => {
      if (e.target.classList.contains("gallery-thumbnail")) {
        const gallery = e.target.closest(".stir-microgallery");
        const thumb = e.target;

        if (!gallery) return;

        const thumbnails = Array.from(gallery.querySelectorAll(".gallery-thumbnail"));
        const overlay = gallery.querySelector(".gallery-overlay");
        const fullImage = gallery.querySelector(".gallery-full-image");

        console.log(thumbnails);

        const popImage = (thumbnail, overlay) => {
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

        /* thumbnail clicks */
        popImage(thumb, overlay);

        /* overlay clicks */
        overlay.addEventListener("click", (e) => {
          if (e.target.classList.contains("rightBtn") || e.target.parentElement.classList.contains("rightBtn")) {
            const last = thumbnails.length;
            const index = Number(overlay.getAttribute("data-index"));
            const newIndex = index + 1 === last ? 0 : index + 1;

            console.log(last);
            console.log(index);
            console.log(newIndex);

            popImage(thumbnails[newIndex], overlay);
            return;
          }

          if (e.target.classList.contains("leftBtn") || e.target.parentElement.classList.contains("leftBtn")) {
            const last = thumbnails.length;
            const index = Number(overlay.getAttribute("data-index"));
            const newIndex = index === 0 ? last - 1 : index - 1;
            popImage(thumbnails[newIndex], overlay);
            return;
          }

          //if (e.target.classList.contains("closeBtn") || e.target.parentElement.classList.contains("closeBtn")) {
          overlay.classList.remove("active");
          fullImage.style.transform = fullImage.style.transform.replace("scale(1)", "scale(0.2)");

          setTimeout(() => {
            overlay.style.display = "none";
            fullImage.style.transform = "";
          }, 300);
          //}
        });
      }
    });
})();
