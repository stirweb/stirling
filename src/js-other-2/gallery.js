(function (scope) {
  if (!scope) return;

  const thumbnails = document.querySelectorAll(".gallery-thumbnail");

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", (e) => {
      const rect = thumbnail.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      const fullSrc = thumbnail.getAttribute("data-full");

      const overlay = thumbnail.parentElement.querySelector(".gallery-overlay");
      const fullImage = overlay.querySelector(".gallery-full-image");

      fullImage.style.transform = `translate(${startX - window.innerWidth / 2}px, ${startY - window.innerHeight / 2}px) scale(0.2)`;
      fullImage.src = fullSrc;
      fullImage.alt = thumbnail.alt;

      overlay.style.display = "flex";
      setTimeout(() => {
        overlay.classList.add("active");
        fullImage.style.transform = "translate(0, 0) scale(1)";
      }, 150);

      overlay.addEventListener("click", () => {
        overlay.classList.remove("active");
        fullImage.style.transform = fullImage.style.transform.replace("scale(1)", "scale(0.2)");

        setTimeout(() => {
          overlay.style.display = "none";
          fullImage.style.transform = "";
        }, 300);
      });
    });
  });
})(stir.node(".gallery-overlay"));
