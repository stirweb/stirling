/* 
  FAVS 
*/

(function (scope) {
  if (!scope) return;

  const CONSTS = {
    cookieType: "accom",
    urlToFavs: scope.dataset.favsurl ? scope.dataset.favsurl : ``,
    activity: scope.dataset.activity ? scope.dataset.activity : ``,
  };

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  const sid = Number(scope.dataset.sid);

  if (!sid) return;

  const isFav = stir.favourites.isFavourite(sid);

  if (isFav) {
    const cookie = stir.favourites.getFav(sid, CONSTS.cookieType);
    const html = stir.favourites.renderRemoveBtn(sid, cookie[0].date, CONSTS.urlToFavs);
    setDOMContent(scope, html);
  }

  if (!isFav) {
    const html = stir.favourites.renderAddBtn(sid, CONSTS.urlToFavs);
    setDOMContent(scope, html);
  }

  /* Actions: Cookie btn clicks  */
  scope.addEventListener("click", (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    /* Add */
    if (target.dataset.action === "addtofavs") {
      stir.favourites.addToFavs(target.dataset.id, CONSTS.cookieType);
      const cookie = stir.favourites.getFav(target.dataset.id, CONSTS.cookieType);
      setDOMContent(scope, stir.favourites.renderRemoveBtn(sid, cookie[0].date, CONSTS.urlToFavs));
    }

    /* Remove */
    if (target.dataset.action === "removefav") {
      stir.favourites.removeFromFavs(target.dataset.id);
      setDOMContent(scope, stir.favourites.renderAddBtn(sid, CONSTS.urlToFavs));
    }
  });
})(stir.node("#favsBtn"));

/* 
  MAP 
*/

let map;

async function initMap() {
  const renderDistance = (obj) => `<p>Time to campus: ${obj?.duration} <br />Distance to campus: ${obj?.distance}</p>`;

  /* Calculate the route */
  function calcRoute(mode, start, end, distances) {
    const request = {
      origin: start,
      destination: end,
      travelMode: mode.toUpperCase(),
    };

    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(result);
      }
    });

    if (distances.length) {
      stir.node("#traveldurations").innerHTML = renderDistance(distances[0].distances[mode]);
    }

    // const outputDistance = (response, status) => {
    //   if (status === "OK") {
    //     const html = renderDistance(response.rows[0].elements[0].duration.text, response.rows[0].elements[0].distance.text);
    //     stir.node("#traveldurations").innerHTML = html;
    //   }
    // };

    // var service = new google.maps.DistanceMatrixService();
    // service.getDistanceMatrix(
    //   {
    //     origins: [start],
    //     destinations: [end],
    //     travelMode: mode,
    //     unitSystem: google.maps.UnitSystem.METRIC,
    //   },
    //   outputDistance
    // );
  }

  /* On load */
  const elMap = document.getElementById("map");
  const elMode = document.getElementById("travelmode");
  const start = elMap.dataset.start;
  const campusCentralEnd = "56.14680729752698,-3.919866552957819";
  const intoEnd = "56.14463111249244,-3.9212629038270252";

  const endCoords = campusCentralEnd.split(",");
  const startCoords = start.split(",");

  const startIsSouth = Number(endCoords[0]) > Number(startCoords[0]) ? true : false;

  const end = startIsSouth ? intoEnd : campusCentralEnd;
  const centre = { lat: Number(endCoords[0]), lng: Number(endCoords[1]) }; // Uni Coordinates

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  const mapOptions = {
    zoom: 14,
    center: centre,
  };

  if (!elMap) return;
  if (elMode) elMode.value = "walking";

  const propertyName = stir.node("h1").innerText;
  const distances = stirDistanceMatrix.filter((item) => item.name === propertyName);

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
  directionsRenderer.setMap(map);

  calcRoute("walking", start, end, distances);

  elMode &&
    elMode.addEventListener("click", (e) => {
      calcRoute(e.currentTarget.value, start, end, distances);
    });
}

/* 
  GALLERY 
*/

(function (scope) {
  if (!scope) return;

  const images = Array.prototype.slice.call(scope.querySelectorAll(".c-thumb-gallery-icons > a"));
  const galleryimage = scope.querySelector(".c-thumb-gallery-image");

  images.forEach((img) => {
    img.addEventListener("click", (event) => {
      event.preventDefault();
      const clickedImage = event.currentTarget.querySelector("img");
      galleryimage.classList.remove("u-fadein");
      setTimeout(() => {
        galleryimage.src = clickedImage.src;
        galleryimage.classList.add("u-fadein");
      }, "100");
    });
  });
})(stir.node(".c-thumb-gallery"));
