const AccommodationFinder=e=>{if(e){var t={cookieType:"accom",urlToFavs:"/favourites/",activity:e.dataset.activity||"",view:stir.templates?.view||""},e={resultsArea:e,searchForm:stir.node("#search-form"),searchPrice:stir.node("#search-price"),searchLocation:stir.node("#search-location"),searchStudentType:stir.node("#search-student-type"),searchBathroom:stir.node("#search-bathroom"),searchPriceNode:stir.node("#search-price-value")};const v=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),u=s=>e=>{var t,a,r;return e?(t=stir.favourites.getFav(e.id,s.cookieType),`
      <div class="cell" id="fav-${e.id}">
        <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
          <div class="grid-x grid-padding-x u-p-2 ">
            <div class="cell u-pt-2">
              <p class="u-text-regular u-mb-2 "><strong><a href="${e.url}">${e.title}</a></strong></p>
            </div>
            <div class="cell large-5 text-sm">
              <p><strong>Price</strong></p> 
              ${a=e.rooms,a?(r=a.map(e=>parseFloat(e.cost)).sort((e,t)=>e-t),a=stir.removeDuplicates(a.map(e=>e.type)),r[0].toFixed(2)===r[r.length-1].toFixed(2)?`<p>£${r[0].toFixed(2)} per week</p>
         <ul>${a.map(e=>`<li>${e}</li>`).join("")}</ul>`:`<p>From £${r[0].toFixed(2)} to £${r[r.length-1].toFixed(2)} per week</p>
         <ul>${a.map(e=>`<li>${e}</li>`).join("")}</ul>`):""}
            </div>
            <div class="cell large-4 text-sm">
              <p><strong>Location</strong></p> 
              <p>${e.location}</p>
              <p><strong>Student type</strong></p>
              <p>${r=e.rooms,r?stir.removeDuplicates(r.flatMap(e=>e.studType.split(",")).map(e=>e.trim())).join("<br />"):""}</p>
            </div>
            <div class="cell large-3 ">
              <div><img src="${e.img}" width="760" height="470" alt="Image of ${e.title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>
            <div class="cell text-sm u-pt-2" id="favbtns${e.id}">
              ${v(s.urlToFavs,t,e.id)}
            </div>
          </div>
        </div>
      </div>
    `):""},p=e=>`<div class="cell u-mb-3">Results based on filters - <strong>${e} ${1===e?"property":"properties"}</strong></div>`,m=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),h=e=>"string"!=typeof e?"":e.replace(/[^a-zA-Z0-9-_]/g,""),g={get:e=>h(QueryParams.get(e)),set:(e,t)=>QueryParams.set(e,h(t)),remove:QueryParams.remove},f=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>e.bathroom.toLowerCase().includes(a.toLowerCase()))).length?{...e,rooms:t}:{}:e},y=t=>e=>""!==t&&e.location&&t!==e.location?null:e,F=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>e.studType.includes(a))).length?{...e,rooms:t}:{}:e},b=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>parseFloat(a)>parseFloat(e.cost))).length?{...e,rooms:t}:{}:e},$=e=>e&&e.title,T=(e,t)=>{var a=stir.favourites.getFav(e,t.cookieType),r=stir.node("#favbtns"+e);r&&m(r)(v(t.urlToFavs,a,e))};var a,r,s,o,i,c,l,d=accommodationData?.filter(e=>e.id&&e.id.length)||[];function n(e,t,a,r){a=a.map(b(t.price)).map(F(t.studentType)).map(f(t.bathroom)).filter(y(t.location)).filter($),t=a.map(u(e)).join("");m(r.resultsArea)(p(a.length)+t)}d=d,e=e,"search"===(t=t).activity&&(r=d.flatMap(e=>e.rooms).map(e=>Number(e.cost)).sort((e,t)=>e-t),a=Math.ceil(r[0]),r=Math.ceil(r[r.length-1]),e.searchPrice.min=10*Math.ceil(a/10),e.searchPrice.max=10*Math.ceil(r/10),e.searchPrice.value=g.get("price")||10*Math.ceil(r/10),e.searchLocation.value=g.get("location")||"",e.searchStudentType.value=g.get("student")||"",e.searchBathroom.value=g.get("bathroom")||"",m(e.searchPriceNode)(e.searchPrice.value),n(t,{price:e.searchPrice.value,location:e.searchLocation.value,studentType:e.searchStudentType.value,bathroom:e.searchBathroom.value},d,e),e.searchForm?.addEventListener("input",(c=e,e=>{var t={price:c.searchPrice.value};m(c.searchPriceNode)(t.price)})),e.searchForm?.addEventListener("change",(s=t,o=d,i=e,e=>{var t={price:i.searchPrice.value,location:i.searchLocation.value,studentType:i.searchStudentType.value,bathroom:i.searchBathroom.value};Object.entries(t).forEach(([e,t])=>g.set(e,t)),n(s,t,o,i)}))),e.resultsArea.addEventListener("click",(l=t,e=>{var e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,l.cookieType),T(e.dataset.id,l)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),T(e.dataset.id,l),"managefavs"===l.activity)&&(e=stir.node("#fav-"+e.dataset.id))&&m(e)("")}))}};AccommodationFinder(stir.node("#acccomfinder"));