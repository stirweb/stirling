const AccommodationFinder=e=>{if(e){const f={cookieType:"accom",urlToFavs:e.dataset.favsurl||"",activity:e.dataset.activity||"",view:stir.templates?.view||""};e={resultsArea:e,searchForm:stir.node("#search-form"),searchPrice:stir.node("#search-price"),searchLocation:stir.node("#search-location"),searchStudentType:stir.node("#search-student-type"),searchBathroom:stir.node("#search-bathroom"),searchPriceNode:stir.node("#search-price-value"),favBtnsNode:stir.node("#accomfavbtns"),sharedArea:stir.node("[data-activity=shared]"),sharedfavArea:stir.node("#accomsharedfavsarea")};const y=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),b=s=>e=>{var t,a,r;return e?(t=stir.favourites.getFav(e.id,s.cookieType),`
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
              ${y(s.urlToFavs,t,e.id)}
            </div>
          </div>
        </div>
      </div>
    `):""},F=e=>e.id?`
      <div class="cell small-6">
        <div class="u-green-line-top u-margin-bottom">
          <p class="u-text-regular u-py-1"><strong><a href="${e.url}">${e.title}</a></strong></p>
          <div class="u-mb-1">${e.location} accommodation.</div>
          <div>${stir.favourites.isFavourite(e.id)?'<p class="text-sm u-heritage-green">Already in my favourites</p>':stir.favourites.renderAddBtn(e.id,"")}</div>
        </div>
      </div>`:"",T=e=>e?`
      <p><strong>Share link</strong></p>  
      ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
      <p class="text-xsm">${e}</p>`:"",$=e=>e.id?`<p class="text-sm"><strong><a href="${e.url}">${e.title}</a></strong></p>`:"",x=e=>`<div class="cell u-mb-3">Results based on filters - <strong>${e} ${1===e?"property":"properties"}</strong></div>`,k=()=>stir.templates.renderNoFavs,w=()=>stir.templates.renderLinkToFavs,A=()=>stir.templates.renderNoShared,L=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),P=e=>"string"!=typeof e?"":e.replace(/[^a-zA-Z0-9-_]/g,""),N={get:e=>P(QueryParams.get(e)),set:(e,t)=>QueryParams.set(e,P(t)),remove:QueryParams.remove},B=()=>stir.favourites.getFavsList(f.cookieType),j=e=>{var t=N.get("a")||"";if(!t)return null;try{return atob(t).split(",").map(t=>({...e.find(e=>t===e.id),id:t}))}catch(e){return null}},M=e=>{var t=B();return t.length<1?null:t.sort((e,t)=>t.date-e.date).map(t=>({...e.find(e=>t.id===e.id),id:t.id,dateSaved:t.date}))},S=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>e.bathroom.toLowerCase().includes(a.toLowerCase()))).length?{...e,rooms:t}:{}:e},E=t=>e=>""!==t&&e.location&&t!==e.location?null:e,C=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>e.studType.includes(a))).length?{...e,rooms:t}:{}:e},Q=a=>e=>{var t;return""!==a&&e.rooms?(t=e.rooms.filter(e=>parseFloat(a)>parseFloat(e.cost))).length?{...e,rooms:t}:{}:e},D=e=>e&&e.title;var t,a,r,s,i,o,c,d,n,l,v,p,u,m=accommodationData?.filter(e=>e.id&&e.id.length)||[];function h(e,a,t){var r=stir.favourites.getFavsList(e.cookieType).map(t=>a.find(e=>Number(e.id)===Number(t.id))).filter(D),e=("micro"===e.view?renderMicro:b)(e),r=r.map(e).join("");L(t.resultsArea)(r||stir.templates.renderNoFavs)}function g(e,t,a,r){a=a.map(Q(t.price)).map(C(t.studentType)).map(S(t.bathroom)).filter(E(t.location)).filter(D),t=a.map(b(e)).join("");L(r.resultsArea)(x(a.length)+t)}m=m,t=f,e=e,"managefavs"===t.activity&&h(t,m,e),"shared"===t.activity&&(r=e.sharedArea,a=e.sharedfavArea,s=m,r&&((i=j(s))?L(r,i.map(F).join("")):L(r,A())),a)&&((i=M(s))?L(a,i.map($).join("")+w()):L(a,k())),"search"===t.activity&&(r=m.flatMap(e=>e.rooms).map(e=>Number(e.cost)).sort((e,t)=>e-t),s=Math.ceil(r[0]),i=Math.ceil(r[r.length-1]),e.searchPrice.min=10*Math.ceil(s/10),e.searchPrice.max=10*Math.ceil(i/10),e.searchPrice.value=N.get("price")||10*Math.ceil(i/10),e.searchLocation.value=N.get("location")||"",e.searchStudentType.value=N.get("student")||"",e.searchBathroom.value=N.get("bathroom")||"",L(e.searchPriceNode)(e.searchPrice.value),g(t,{price:e.searchPrice.value,location:e.searchLocation.value,studentType:e.searchStudentType.value,bathroom:e.searchBathroom.value},m,e),e.searchForm?.addEventListener("input",(n=e,e=>{var t={price:n.searchPrice.value};L(n.searchPriceNode)(t.price)})),e.searchForm?.addEventListener("change",(o=t,c=m,d=e,e=>{var t={price:d.searchPrice.value,location:d.searchLocation.value,studentType:d.searchStudentType.value,bathroom:d.searchBathroom.value};Object.entries(t).forEach(([e,t])=>N.set(e,t)),g(o,t,c,d)}))),e.favBtnsNode&&(stir.node("main").addEventListener("click",(l=t,v=m,p=e,e=>{var t,e="BUTTON"===e.target.nodeName?e.target:e.target.closest("button");e&&e.dataset&&e.dataset.action&&("clearallfavs"===e.dataset.action&&(stir.favourites.removeType(l.cookieType),h(l,v,p)),"copysharelink"===e.dataset.action)&&(e=B(),e="https://www.stir.ac.uk/shareaccommodation/"+btoa(e.map(e=>e.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(e),t=stir.t4Globals.dialogs.find(e=>"shareDialog"===e.getId()))&&(t.open(),t.setContent(T(e)))})),L(e.favBtnsNode)(stir.templates.renderFavActionBtns)),e.resultsArea.addEventListener("click",(u=t,e=>{var t,e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&(t=e=>{var t=stir.favourites.getFav(e,u.cookieType),a=stir.node("#favbtns"+e);a&&L(a)(y(u.urlToFavs,t,e))},"addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,u.cookieType),t(e.dataset.id)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),t(e.dataset.id),"managefavs"===u.activity)&&(t=stir.node("#fav-"+e.dataset.id))&&L(t)("")}))}};AccommodationFinder(stir.node("#acccomfinder"));