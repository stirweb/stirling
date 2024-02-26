!function(t){if(t){const a={cookieType:"accom",urlToFavs:t.dataset.favsurl||"",activity:t.dataset.activity||""},o=t;t=stir.node("#search-form");const d=stir.node("#search-price"),l=stir.node("#search-location"),c=stir.node("#search-student-type"),n=stir.node("#search-bathroom"),v=stir.node("#search-price-value"),p=(t,e,r)=>e.length?stir.favourites.renderRemoveBtn(r,e[0].date,t):stir.favourites.renderAddBtn(r,t),u=stir.curry((t,e)=>{var r,i,s;return e?(r=stir.favourites.getFav(e.id,t.cookieType),`<div class="cell" id="fav-${e.id}">
              <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
                <div class="grid-x grid-padding-x u-p-2 ">
                  <div class="cell u-pt-2">
                      <p class="u-text-regular u-mb-2 "><strong><a href="${e.url}">${e.title}</a></strong></p>
                    </div>
                    <div class="cell large-5 text-sm">
                      <p><strong>Price</strong></p> 
                      ${i=e.rooms,i?(s=i.map(t=>parseFloat(t.cost)).sort((t,e)=>t-e),i=stir.removeDuplicates(i.map(t=>t.title)),`<p>From £${s[0].toFixed(2)} to £${s[s.length-1].toFixed(2)} per week</p>
            <ul>${i.map(t=>`<li>${t}</li>`).join("")}</ul>`):""}
                    </div>
                    <div class="cell large-4 text-sm">
                        <p><strong>Facilities</strong></p>
                        <p>${e.facilities.split(",").map(t=>t+"<br /> ").join("")}</p>
                        <p><strong>Location</strong></p> 
                        <p>${e.location}</p>
                        <p><strong>Student type</strong></p>
                        <p>${s=e.rooms,s?(s=s.map(t=>t.studType).join(",").split(",").map(t=>t.trim()),stir.removeDuplicates(s).join("<br />")):""}</p>
                    </div>
                    <div class="cell large-3 ">
                        <div ><img src="${e.img}" width="760" height="470" alt="Image of ${e.title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
                    </div>
                    <div class="cell text-sm u-pt-2" id="favbtns${e.id}">
                      ${p(t.urlToFavs,r,e.id)}
                    </div>
                  </div>
              </div>
            </div>`):""}),m=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>t.bathroom===e,t.rooms)).length?(t.rooms=r,t):{}:t}),g=stir.curry((t,e)=>""===t||!e.location||t===e.location?e:void 0),f=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>t.studType.includes(e),t.rooms)).length?(t.rooms=r,t):{}:t}),h=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>parseFloat(e)>parseFloat(t.cost),t.rooms)).length?(t.rooms=r,t):{}:t}),y=stir.filter(t=>{if(t&&t.title)return t}),b=stir.join(""),F=stir.curry((t,e)=>e?t.filter(t=>Number(t.id)===Number(e.id))[0]:[]),T=stir.curry((t,e)=>(stir.setHTML(t,e),!0));var e,r,i,s;const $=(t,e,r)=>{var t=stir.map(u(t)),i=stir.map(h(e.price)),s=stir.map(f(e.studentType)),a=stir.map(m(e.bathroom)),e=stir.filter(g(e.location)),a=stir.compose(y,a,e,s,i,stir.clone)(r),e=stir.compose(b,t)(a);return T(o,`<div class="cell u-mb-3">Results based on filters - <strong>${s=a.length} ${1===s?"property":"properties"}</strong></div>`+e)},k=accommodationData.filter(t=>t.id&&t.id.length);k.length&&("managefavs"===a.activity&&(e=a,r=k,i=stir.favourites.getFavsList(e.cookieType),r=stir.map(F(r)),e=stir.map(u(e)),s=T(o),r=stir.compose(y,r)(i),i=stir.compose(b,e)(r),s(i||stir.templates.renderNoFavs)),"search"===a.activity&&($(a,{price:"",location:"",bathroom:"",studentType:""},k),d.value=300,l.value="",c.value="",n.value="",t)&&t.addEventListener("change",t=>{var e={price:d.value,location:l.value,bathroom:n.value,studentType:c.value};T(v,e.price),$(a,e,k)}),o.addEventListener("click",t=>{var e,r,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");t&&t.dataset&&t.dataset.action&&("addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,a.cookieType),r=stir.favourites.getFav(t.dataset.id,a.cookieType),e=stir.node("#favbtns"+t.dataset.id))&&T(e,p(a.urlToFavs,r,t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e=stir.favourites.getFav(t.dataset.id,a.cookieType),"searchfavs"===a.activity&&(r=stir.node("#favbtns"+t.dataset.id))&&T(r,p(a.urlToFavs,e,t.dataset.id)),"managefavs"===a.activity)&&(r=stir.node("#fav-"+t.dataset.id))&&T(r,"")}))}}(stir.node("#search-results"));