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
  const renderDistance = (time, distance) => {
    return `<p>Time to campus: ${time} <br />
            Distance to campus: ${distance}</p>`;
  };

  const outputDistance = (response, status) => {
    if (status === "OK") {
      const html = renderDistance(response.rows[0].elements[0].duration.text, response.rows[0].elements[0].distance.text);
      stir.node("#traveldurations").innerHTML = html;
    }
  };

  function calcRoute(mode, start, end) {
    const request = {
      origin: start,
      destination: end,
      travelMode: mode,
    };
    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(result);
      }
    });

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [start],
        destinations: [end],
        travelMode: mode,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      outputDistance
    );
  }

  const elMap = document.getElementById("map");
  const elMode = document.getElementById("travelmode");
  const start = elMap.dataset.start;
  const campusCentralEnd = "56.145922,-3.920283";
  const intoEnd = "56.14463111249244,-3.9212629038270252";

  // into 56.14463111249244, -3.9212629038270252
  // riverside = 56.12181976527503, -3.933368031507604
  // Alangrange = 56.150993,-3.929349

  //const end = "56.14463111249244, -3.9212629038270252";
  const endBits = campusCentralEnd.split(",");
  const startBits = start.split(",");

  console.log(Number(endBits[1]));
  console.log(Number(startBits[1]));

  if (Number(endBits[0]) > Number(startBits[0])) {
    console.log("Start is south");
  } else {
    console.log("Start is north");
  }

  const startIsSouth = Number(endBits[0]) > Number(startBits[0]) ? true : false;

  console.log(startIsSouth);

  const end = startIsSouth ? intoEnd : campusCentralEnd;

  const centre = { lat: Number(endBits[0]), lng: Number(endBits[1]) }; // Uni Coordinates

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  const mapOptions = {
    zoom: 14,
    center: centre,
  };

  if (!elMap) return;
  if (elMode) elMode.value = "WALKING";

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
  directionsRenderer.setMap(map);
  calcRoute("WALKING", start, end);

  elMode &&
    elMode.addEventListener("click", (e) => {
      calcRoute(e.currentTarget.value, start, end);
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
