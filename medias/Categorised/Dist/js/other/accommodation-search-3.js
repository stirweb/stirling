const AccommodationFinder=e=>{if(e){const y={cookieType:"accom",urlToFavs:e.dataset.favsurl||"",activity:e.dataset.activity||"",view:stir.templates?.view||""};e={resultsArea:e,searchForm:stir.node("#search-form"),searchPrice:stir.node("#search-price"),searchLocation:stir.node("#search-location"),searchStudentType:stir.node("#search-student-type"),searchBathroom:stir.node("#search-bathroom"),searchPriceNode:stir.node("#search-price-value"),favBtnsNode:stir.node("#accomfavbtns"),sharedArea:stir.node("[data-activity=shared]"),sharedfavArea:stir.node("#accomsharedfavsarea")};const b=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),F=a=>e=>{var t;return e?(t=stir.favourites.getFav(e.id,a.cookieType),`<div class="cell medium-4">
              <p><strong><a href="${e.url}">${e.title}</a></strong></p>
              
               <div class=" text-sm u-pt-2" id="favbtns${e.id}">
                ${b(a.urlToFavs,t,e.id)}
              </div>
            </div>`):""},$=s=>e=>{var t,a,r;return e?(t=stir.favourites.getFav(e.id,s.cookieType),`
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
              ${b(s.urlToFavs,t,e.id)}
            </div>
          </div>
        </div>
      </div>
    `):""},T=e=>e.id?`
      <div class="cell small-6">
        <div class="u-green-line-top u-margin-bottom">
          <p class="u-text-regular u-py-1"><strong><a href="${e.url}">${e.title}</a></strong></p>
          <div class="u-mb-1">${e.location} accommodation.</div>
          <div>${stir.favourites.isFavourite(e.id)?'<p class="text-sm u-heritage-green">Already in my favourites</p>':stir.favourites.renderAddBtn(e.id,"")}</div>
        </div>
      </div>`:"",x=e=>e?`
      <p><strong>Share link</strong></p>  
      ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
      <p class="text-xsm">${e}</p>`:"",A=e=>e.id?`<p class="text-sm"><strong><a href="${e.url}">${e.title}</a></strong></p>`:"",k=e=>`<div class="cell u-mb-3">Results based on filters - <strong>${e} ${1===e?"property":"properties"}</strong></div>`,w=()=>stir.templates.renderNoFavs,L=()=>stir.templates.renderLinkToFavs,P=()=>stir.templates.renderNoShared,N=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),B=e=>"string"!=typeof e?"":e.replace(/[^a-zA-Z0-9-_]/g,""),j={get:e=>B(QueryParams.get(e)),set:(e,t)=>QueryParams.set(e,B(t)),remove:QueryParams.remove},M=()=>stir.favourites.getFavsList(y.cookieType),S=e=>{var t=j.get("a")||"";if(!t)return null;try{return atob(t).split(",").map(t=>({...e.find(e=>t===e.id),id:t}))}catch(e){return null}},E=e=>{var t=M();return t.length<1?null:t.sort((e,t)=>t.date-e.date).map(t=>({...e.find(e=>t.id===e.id),id:t.id,dateSaved:t.date}))},C=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>e.bathroom.toLowerCase().includes(a.toLowerCase()))).length?{...e,rooms:t}:{}:e},Q=t=>e=>""!==t&&e.location&&t!==e.location?null:e,I=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>e.studType.includes(a))).length?{...e,rooms:t}:{}:e},O=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>parseFloat(a)>parseFloat(e.cost))).length?{...e,rooms:t}:{}:e},D=e=>e&&e.title;var t,a,r,s,i,o,d,c,n,l,v,p,u,m=accommodationData?.filter(e=>e.id&&e.id.length)||[];function h(e,a,t){var r=stir.favourites.getFavsList(e.cookieType).map(t=>a.find(e=>Number(e.id)===Number(t.id))).filter(D),e=(console.log(r),("micro"===e.view?F:$)(e)),r=r.map(e).join("");N(t.resultsArea)(r||stir.templates.renderNoFavs)}function g(e,t,a,r){a=a.map(O(t.price)).map(I(t.studentType)).map(C(t.bathroom)).filter(Q(t.location)).filter(D),t=a.map($(e)).join("");N(r.resultsArea)(k(a.length)+t)}function f(e,t,a){var r;e&&((r=S(a))?N(e,r.map(T).join("")):N(e,P())),t&&((r=E(a))?N(t,r.map(A).join("")+L()):N(t,w()))}m=m,t=y,e=e,"managefavs"===t.activity&&h(t,m,e),"shared"===t.activity&&f(e.sharedArea,e.sharedfavArea,m),"search"===t.activity&&(r=m.flatMap(e=>e.rooms).map(e=>Number(e.cost)).sort((e,t)=>e-t),a=Math.ceil(r[0]),r=Math.ceil(r[r.length-1]),e.searchPrice.min=10*Math.ceil(a/10),e.searchPrice.max=10*Math.ceil(r/10),e.searchPrice.value=j.get("price")||10*Math.ceil(r/10),e.searchLocation.value=j.get("location")||"",e.searchStudentType.value=j.get("student")||"",e.searchBathroom.value=j.get("bathroom")||"",N(e.searchPriceNode)(e.searchPrice.value),g(t,{price:e.searchPrice.value,location:e.searchLocation.value,studentType:e.searchStudentType.value,bathroom:e.searchBathroom.value},m,e),e.searchForm?.addEventListener("input",(d=e,e=>{var t={price:d.searchPrice.value};N(d.searchPriceNode)(t.price)})),e.searchForm?.addEventListener("change",(s=t,i=m,o=e,e=>{var t={price:o.searchPrice.value,location:o.searchLocation.value,studentType:o.searchStudentType.value,bathroom:o.searchBathroom.value};Object.entries(t).forEach(([e,t])=>j.set(e,t)),g(s,t,i,o)}))),e.favBtnsNode&&(stir.node("main").addEventListener("click",(c=t,n=m,l=e,e=>{var t,e="BUTTON"===e.target.nodeName?e.target:e.target.closest("button");e&&e.dataset&&e.dataset.action&&("clearallfavs"===e.dataset.action&&(stir.favourites.removeType(c.cookieType),h(c,n,l)),"copysharelink"===e.dataset.action)&&(e=M(),e="https://www.stir.ac.uk/shareaccommodation/"+btoa(e.map(e=>e.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(e),t=stir.t4Globals.dialogs.find(e=>"shareDialog"===e.getId()))&&(t.open(),t.setContent(x(e)))})),N(e.favBtnsNode)(stir.templates.renderFavActionBtns)),e.resultsArea.addEventListener("click",(v=t,p=e,u=m,e=>{var t,e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&(t=e=>{var t=stir.favourites.getFav(e,v.cookieType),a=stir.node("#favbtns"+e);a&&N(a)(b(v.urlToFavs,t,e)),p.sharedArea&&f(p.sharedArea,p.sharedfavArea,u)},"addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,v.cookieType),t(e.dataset.id)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),t(e.dataset.id),"managefavs"===v.activity)&&(t=stir.node("#fav-"+e.dataset.id))&&N(t)("")}))}};AccommodationFinder(stir.node("#acccomfinder"));