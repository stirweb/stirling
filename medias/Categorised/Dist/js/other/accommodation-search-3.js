!function(t){if(t){const o={cookieType:"accom",urlToFavs:t.dataset.favsurl||"",activity:t.dataset.activity||""},d=t;t=stir.node("#search-form");const l=stir.node("#search-price"),c=stir.node("#search-location"),n=stir.node("#search-student-type"),v=stir.node("#search-bathroom"),p=stir.node("#search-price-value"),u=(t,e,r)=>e.length?stir.favourites.renderRemoveBtn(r,e[0].date,t):stir.favourites.renderAddBtn(r,t),m=stir.curry((t,e)=>{var r,i,s;return e?(r=stir.favourites.getFav(e.id,t.cookieType),`<div class="cell" id="fav-${e.id}">
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
                        <p>${s=e.rooms,s?(s=s.map(t=>t.studType).join(",").split(",").map(t=>t.trim()),stir.removeDuplicates(s).sort().join("<br />")):""}</p>
                    </div>
                    <div class="cell large-3 ">
                        <div ><img src="${e.img}" width="760" height="470" alt="Image of ${e.title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
                    </div>
                    <div class="cell text-sm u-pt-2" id="favbtns${e.id}">
                      ${u(t.urlToFavs,r,e.id)}
                    </div>
                  </div>
              </div>
            </div>`):""}),g=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>t.bathroom===e,t.rooms)).length?(t.rooms=r,t):{}:t}),f=stir.curry((t,e)=>""===t||!e.location||t===e.location?e:void 0),h=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>t.studType.includes(e),t.rooms)).length?(t.rooms=r,t):{}:t}),y=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>parseFloat(e)>parseFloat(t.cost),t.rooms)).length?(t.rooms=r,t):{}:t}),b=stir.filter(t=>{if(t&&t.title)return t}),F=stir.join(""),T=stir.curry((t,e)=>e?t.filter(t=>Number(t.id)===Number(e.id))[0]:[]),$=stir.curry((t,e)=>(stir.setHTML(t,e),!0));var e,r,i,s,a;const x=(t,e,r)=>{var t=stir.map(m(t)),i=stir.map(y(e.price)),s=stir.map(h(e.studentType)),a=stir.map(g(e.bathroom)),e=stir.filter(f(e.location)),a=stir.compose(b,a,e,s,i,stir.clone)(r),e=stir.compose(F,t)(a);return $(d,`<div class="cell u-mb-3">Results based on filters - <strong>${s=a.length} ${1===s?"property":"properties"}</strong></div>`+e)},k=accommodationData.filter(t=>t.id&&t.id.length);k.length&&("managefavs"===o.activity&&(e=o,r=k,s=stir.favourites.getFavsList(e.cookieType),r=stir.map(T(r)),e=stir.map(m(e)),i=$(d),r=stir.compose(b,r)(s),s=stir.compose(F,e)(r),i(s||stir.templates.renderNoFavs)),"search"===o.activity&&(e=stir.flatten(k.map(t=>t.rooms)).map(t=>Number(t.cost)).sort((t,e)=>t-e),r=Math.ceil(e[0]),i=10*Math.ceil(r/10),s=Math.ceil(e[e.length-1]),a=10*Math.ceil(s/10),x(o,{price:"",location:"",bathroom:"",studentType:""},k),l.min=i,l.max=a,l.value=a,$(p,a),c.value="",n.value="",v.value="",t&&t.addEventListener("input",t=>{var e={price:l.value};$(p,e.price)}),t)&&t.addEventListener("change",t=>{var e={price:l.value,location:c.value,bathroom:v.value,studentType:n.value};x(o,e,k)}),d.addEventListener("click",t=>{var e,r,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");t&&t.dataset&&t.dataset.action&&("addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,o.cookieType),r=stir.favourites.getFav(t.dataset.id,o.cookieType),e=stir.node("#favbtns"+t.dataset.id))&&$(e,u(o.urlToFavs,r,t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e=stir.favourites.getFav(t.dataset.id,o.cookieType),"searchfavs"===o.activity&&(r=stir.node("#favbtns"+t.dataset.id))&&$(r,u(o.urlToFavs,e,t.dataset.id)),"managefavs"===o.activity)&&(r=stir.node("#fav-"+t.dataset.id))&&$(r,"")}))}}(stir.node("#search-results"));