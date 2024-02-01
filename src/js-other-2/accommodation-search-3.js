/*
 * @author: Ryan Kaye
 * @version: 3
 */

(function (scope) {
  if (!scope) return;

  const cookieType = "accom";

  const resultsArea = scope;

  const searchForm = stir.node("#search-form");
  const searchPrice = stir.node("#search-price");
  const searchLocation = stir.node("#search-location");
  const searchStudentType = stir.node("#search-student-type");
  const searchBathroom = stir.node("#search-bathroom");
  const searchPriceValue = stir.node("#search-price-value");

  /*
     Renderers
   */

  /* renderPrice */
  const renderPrice = (rooms) => {
    if (!rooms) return ``;
    const allPrices = rooms.map((item) => parseFloat(item.cost)).sort((a, b) => a - b);
    const matches = stir.removeDuplicates(rooms.map((item) => item.room));

    return `<p>From £${allPrices[0].toFixed(2)} to £${allPrices[allPrices.length - 1].toFixed(2)}  per week</p>
          <ul >
            ${matches.map((item) => `<li>${item}</li>`).join(``)}
          </ul>
    `;
  };

  /* renderStudentType */
  const renderStudentType = (rooms) => {
    if (!rooms) return ``;
    const allTypes = rooms
      .map((item) => item.studType)
      .join(",")
      .split(",");

    return stir.removeDuplicates(allTypes).join("<br />");
  };

  const renderFavBtns = (cookie, id) => {
    return cookie.length ? stir.favourites.renderRemoveBtn(id, cookie[0].date) : stir.favourites.renderAddBtn(id);
  };

  /* renderAccom */
  const renderAccom = stir.curry((cookies, item) => {
    const cookie = cookies.filter((entry) => Number(entry.id) === Number(item.id));
    return `<div class="cell u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">
                <div class="cell u-pt-2">
                    <p class="u-text-regular u-mb-2 "><strong><a href="">${item.name}</a></strong></p>
                  </div>
                  <div class="cell large-5 text-sm">
                    <p><strong>Price</strong></p> 
                    ${renderPrice(item.rooms)}
                  </div>
                  <div class="cell large-4 text-sm">
                      <p><strong>Facilities</strong></p>
                      <p>${item.facilities}</p>
                      <p><strong>Location</strong></p> 
                      <p>${item.name}</p>
                      <p><strong>Student type</strong></p>
                      <p>${renderStudentType(item.rooms)}</p>
                  </div>
                  <div class="cell large-3 ">
                      <div style="border:1px solid #ccc;">Image</div>
                  </div>
                  <div class="cell text-sm u-pt-2" id="favbtns${item.id}">
                    ${renderFavBtns(cookie, item.id)}
                  </div>
              </div>
            </div>`;
  });

  /* renderNoItems */
  const renderNoItems = (num) => `<div class="cell u-mb-3">Results based on filters - <strong>${num} properties</strong></div>`;

  /*
      Data Processing
    */

  /* filterByBathroom */
  const filterByBathroom = stir.curry((filterValue, item) => {
    if (filterValue === "" || !item.rooms) return item;

    const matches2 = stir.filter((entry) => entry.bathroom === filterValue, item.rooms);

    if (matches2.length) {
      item.rooms = matches2;
      return item;
    }
    return {};
  });

  /* filterByLocation */
  const filterByLocation = stir.curry((filterValue, item) => {
    if (filterValue === "" || !item.location) return item;

    if (filterValue === item.location) return item;
  });

  /* filterByStudType */
  const filterByStudType = stir.curry((filterValue, item) => {
    if (filterValue === "" || !item.rooms) return item;

    const matches2 = stir.filter((entry) => entry.studType.includes(filterValue), item.rooms);

    if (matches2.length) {
      item.rooms = matches2;
      return item;
    }
    return {};
  });

  /* filterByPrice */
  const filterByPrice = stir.curry((filterValue, item) => {
    if (filterValue === "" || !item.rooms) return item;

    const matches2 = stir.filter((entry) => parseFloat(filterValue) > parseFloat(entry.cost), item.rooms);

    if (matches2.length) {
      item.rooms = matches2;
      return item;
    }

    return {};
  });

  /* filterEmpties */
  const filterEmpties = stir.filter((item) => {
    if (item.name) return item;
  });

  /*
      Actions
    */

  const addToFavs = () => {};

  /*
      Helper
    */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /*
     Controller
  */

  const main = (filters, data) => {
    // Curries

    //stir.favourites.setCookieType("accom");
    const cookies = stir.favourites.getFavsList(cookieType);

    // console.log(cookies);

    const renderer = stir.map(renderAccom(cookies));
    //const setContent = setDOMContent(resultsArea);
    const joiner = stir.join(``);

    const filterByPriceCurry = stir.map(filterByPrice(filters.price));
    const filterByStudTypeCurry = stir.map(filterByStudType(filters.studentType));
    const filterByBathroomCurry = stir.map(filterByBathroom(filters.bathroom));
    const filterByLocationCurry = stir.filter(filterByLocation(filters.location));

    const filteredData = stir.compose(filterEmpties, filterByBathroomCurry, filterByLocationCurry, filterByStudTypeCurry, filterByPriceCurry, stir.clone)(data);
    const html = stir.compose(joiner, renderer)(filteredData);

    return setDOMContent(resultsArea, renderNoItems(filteredData.length) + html);
  };

  /*
     On load
   */

  const initialData = accommodationData;
  const params = QueryParams.getAllArray();

  if (!initialData.length) return;

  const filters = {
    price: "",
    location: "",
    bathroom: "",
    studentType: "",
  };

  main(filters, initialData);

  searchPrice.value = 300;
  searchLocation.value = "";
  searchStudentType.value = "";
  searchBathroom.value = "";

  /* Actions: Form changes */
  searchForm &&
    searchForm.addEventListener("change", (event) => {
      const filters = {
        price: searchPrice.value,
        location: searchLocation.value,
        bathroom: searchBathroom.value,
        studentType: searchStudentType.value,
      };

      setDOMContent(searchPriceValue, filters.price);
      main(filters, initialData);
    });

  /* Actions: Cookie btn clicks  */
  resultsArea.addEventListener("click", (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    if (target.dataset.action === "addtofavs") {
      stir.favourites.addToFavs(target.dataset.id, cookieType);
    }

    if (target.dataset.action === "removefav") {
      console.log(target.dataset.id);
      stir.favourites.removeFromFavs(target.dataset.id);
    }
  });
})(stir.node("#search-results"));
