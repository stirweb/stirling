/*
 * @author: Ryan Kaye
 * @version: 3
 */

(function (scope) {
  if (!scope) return;

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

  /* renderAccom */
  const renderAccom = stir.curry((item) => {
    return `<div class="cell u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">

                <div class="cell u-pt-2">
                    <p class="u-text-regular u-mb-2 "><strong><a href="">${item.name}</a></strong></p>
                  </div>

                  <div class="cell large-5 text-sm">
                    <p><strong>Price</strong></p> 
                    ${renderPrice(item.rooms)}
                  </div>

                  <div  class="cell large-4 text-sm">
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

                  <div class="cell text-sm u-pt-2">
                    ${stir.favourites.renderAddBtn}
                    
                  </div>
              </div>
            </div>`;
  });

  /*

<div class="flex-container u-gap u-mb-1 flex-dir-column medium-flex-dir-row">

                    <div data-nodeid="accomfavsbtn" class="flex-container u-gap" data-id="${item.id}"> 
                      <button class="u-heritage-green u-cursor-pointer u-line-height-default flex-container u-gap-8 align-middle" data-action="addtofavs" aria-label="Add to your favourites" data-id="${item.id}" id="addfavbtn-${item.id}">
                          <svg version="1.1" data-stiricon="heart-active" fill="currentColor" viewBox="0 0 50 50" style="width:22px;height:22px;">
                          <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2c0,0-0.1,0-0.1,0c-3,0-5.8,1.2-7.9,3.4
                          c-4.3,4.5-4.2,11.7,0.2,16l18.1,18.1c0.5,0.5,1.6,0.5,2.1,0l17.9-17.9c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
                          C47.5,15,46.3,12.2,44.1,10.1z M42,24.2l-17,17l-17-17c-3.3-3.3-3.3-8.6,0-11.8c1.6-1.6,3.7-2.4,5.9-2.4c2.2-0.1,4.4,0.8,6,2.5
                          l4.1,4.1c0.6,0.6,1.5,0.6,2.1,0l4.2-4.2c3.4-3.2,8.5-3.2,11.8,0C45.3,15.6,45.3,20.9,42,24.2z"></path>
                        </svg>
                          <span class="u-heritage-green u-underline u-inline-block u-pb-1">Add to your favourites</span>
                      </button>
                    </div>
                    <span><a href="" class="u-underline">View favourites</a></span>
</div>



  */

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
    const renderer = stir.map(renderAccom);
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

  resultsArea.addEventListener("click", (event) => {
    const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

    if (!target || !target.dataset || !target.dataset.action) return;

    console.log(target);
  });
})(stir.node("#search-results"));
