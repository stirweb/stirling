// Wrap the code in a function to avoid polluting the global scope
(function () {
  /*
   * Render the appropriate embed code for a given TikTok URL
   */
  const renderTikTokCode = (url) => {
    // remove any "/" at the end of the url
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    const id = url.split("/")[url.split("/").length - 1];
    const src = "https://www.tiktok.com/player/v1/" + id;

    return `<iframe title="TikTok video" loading="lazy" src="${src}" style="width: 100%; height: auto; aspect-ratio: 3/6;" ></iframe>`;
  };

  /*
   * Render the appropriate embed code for a given Instagram URL
   */
  const renderInstagramCode = (url) => {
    return `<blockquote class="instagram-media" title="Instagram post" 
                    data-instgrm-captioned  
                    data-instgrm-permalink="${url}" 
                    data-instgrm-version="14">
                </blockquote>`;
  };

  /*
   * Render the appropriate embed code for a given YouTube URL
   */
  const renderYouTubeCode = (url) => {
    return `<iframe class="vertical-video"  src="${url}" style="width: 100%; height: auto; aspect-ratio: 3/6;" 
          loading="lazy"  title="YouTube video" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
          encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen=""></iframe>`;
  };

  /*
   * Render the appropriate embed code for a given URL
   */
  const render = (url) => {
    const service = url.split("/")[2];

    if (service === "www.youtube.com") {
      return `<div class="u-pb-2">${renderYouTubeCode(url)}</div>`;
    }

    if (service === "www.tiktok.com") {
      return `<div class="u-pb-2">${renderTikTokCode(url)}</div>`;
    }

    if (service === "www.instagram.com") {
      return `<div class="u-pb-2">${renderInstagramCode(url)}</div>`;
    }
  };

  /*
   * Get the number of columns to display based on the screen size
   */
  const getNoOfColumns = (screenWidth) => {
    if (screenWidth <= 640) {
      return { noOfColumns: 2, cellSize: "small-6" };
    }

    if (screenWidth <= 1024) {
      return { noOfColumns: 3, cellSize: "medium-4" };
    }

    return { noOfColumns: 4, cellSize: "large-3" };
  };

  /*
   * On load
   * We are attempting to make fake masonry layout by calculating the number of posts per column
   * and rendering them in that way. Not perfect but it is a simple solution that doesnt require any additional libraries.
   */

  const socialWallContainer = document.getElementById("socialwall");

  const urls = socialMediaUrls.filter((url) => url !== "");
  const noOfPosts = Math.ceil(urls.length);
  const screenWidth = window.innerWidth;
  const { noOfColumns, cellSize } = getNoOfColumns(screenWidth);
  const postPerColumn = Math.ceil(urls.length / noOfColumns);

  // Divide the posts (urls) up by postPerColumn
  const columns = [];
  for (let i = 0; i < noOfColumns; i++) {
    columns.push(urls.slice(i * postPerColumn, (i + 1) * postPerColumn));
  }

  // 5, 6, 9 posts look better with 4 columns, so we will move some posts around to achieve this
  if (noOfPosts === 5 && noOfColumns === 4) {
    columns[3].push(...columns[1].splice(0, 1));
  }

  if (noOfPosts === 6 && noOfColumns === 4) {
    columns[3].push(...columns[2].splice(0, 1));
  }

  if (noOfPosts === 9 && noOfColumns === 4) {
    columns[3].push(...columns[2].splice(0, 1));
    columns[3].push(...columns[1].splice(0, 1));
  }

  if (noOfPosts === 10 && noOfColumns === 4) {
    columns[3].push(...columns[2].splice(0, 1));
  }

  // now we have the posts divided up into columns, we can render them in the appropriate way
  const html = columns.map((column) => {
    return `<div >${column.map(render).join("")}</div>`;
  });

  socialWallContainer.innerHTML = `${html.join("")}`;
})();
