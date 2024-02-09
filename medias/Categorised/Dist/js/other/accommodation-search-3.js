!function(t){if(t){const a={cookieType:"accom",urlToFavs:t.dataset.favsurl||"",activity:t.dataset.activity||""},o=t;t=stir.node("#search-form");const d=stir.node("#search-price"),c=stir.node("#search-location"),l=stir.node("#search-student-type"),n=stir.node("#search-bathroom"),v=stir.node("#search-price-value"),p=(t,e,r)=>e.length?stir.favourites.renderRemoveBtn(r,e[0].date,t):stir.favourites.renderAddBtn(r,t),u=stir.curry((t,e)=>{var r,s,i=stir.favourites.getFav(e.id,t.cookieType);return`<div class="cell" id="fav-${e.id}">
              <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
                <div class="grid-x grid-padding-x u-p-2 ">
                  <div class="cell u-pt-2">
                      <p class="u-text-regular u-mb-2 "><strong><a href="">${e.title}</a></strong></p>
                    </div>
                    <div class="cell large-5 text-sm">
                      <p><strong>Price</strong></p> 
                      ${r=e.rooms,r?(s=r.map(t=>parseFloat(t.cost)).sort((t,e)=>t-e),r=stir.removeDuplicates(r.map(t=>t.title)),`<p>From £${s[0].toFixed(2)} to £${s[s.length-1].toFixed(2)} per week</p>
            <ul>${r.map(t=>`<li>${t}</li>`).join("")}</ul>`):""}
                    </div>
                    <div class="cell large-4 text-sm">
                        <p><strong>Facilities</strong></p>
                        <p>${e.facilities}</p>
                        <p><strong>Location</strong></p> 
                        <p>${e.location}</p>
                        <p><strong>Student type</strong></p>
                        <p>${s=e.rooms,s?(s=s.map(t=>t.studType).join(",").split(","),stir.removeDuplicates(s).join("<br />")):""}</p>
                    </div>
                    <div class="cell large-3 ">
                        <div style="border:1px solid #ccc;">Image</div>
                    </div>
                    <div class="cell text-sm u-pt-2" id="favbtns${e.id}">
                      ${p(t.urlToFavs,i,e.id)}
                    </div>
                  </div>
              </div>
            </div>`}),m=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>t.bathroom===e,t.rooms)).length?(t.rooms=r,t):{}:t}),g=stir.curry((t,e)=>""===t||!e.location||t===e.location?e:void 0),f=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>t.studType.includes(e),t.rooms)).length?(t.rooms=r,t):{}:t}),y=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>parseFloat(e)>parseFloat(t.cost),t.rooms)).length?(t.rooms=r,t):{}:t}),h=stir.filter(t=>{if(t.title)return t}),b=stir.join(""),T=stir.curry((t,e)=>t.filter(t=>Number(t.id)===Number(e.id))[0]),F=stir.curry((t,e)=>(stir.setHTML(t,e),!0));var e,r,s,i;const $=(t,e,r)=>{var t=stir.map(u(t)),s=stir.map(y(e.price)),i=stir.map(f(e.studentType)),a=stir.map(m(e.bathroom)),e=stir.filter(g(e.location)),a=stir.compose(h,a,e,i,s,stir.clone)(r),e=stir.compose(b,t)(a);return F(o,`<div class="cell u-mb-3">Results based on filters - <strong>${a.length} properties</strong></div>`+e)},x=accommodationData;x.length&&("managefavs"===a.activity&&(e=a,r=x,s=stir.favourites.getFavsList(e.cookieType),r=stir.map(T(r)),e=stir.map(u(e)),i=F(o),stir.compose(i,b,e,r)(s)),"search"===a.activity&&($(a,{price:"",location:"",bathroom:"",studentType:""},x),d.value=300,c.value="",l.value="",n.value="",t)&&t.addEventListener("change",t=>{var e={price:d.value,location:c.value,bathroom:n.value,studentType:l.value};F(v,e.price),$(a,e,x)}),o.addEventListener("click",t=>{var e,r,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");t&&t.dataset&&t.dataset.action&&("addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,a.cookieType),r=stir.favourites.getFav(t.dataset.id,a.cookieType),e=stir.node("#favbtns"+t.dataset.id))&&F(e,p(a.urlToFavs,r,t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e=stir.favourites.getFav(t.dataset.id,a.cookieType),"searchfavs"===a.activity&&(r=stir.node("#favbtns"+t.dataset.id))&&F(r,p(a.urlToFavs,e,t.dataset.id)),"managefavs"===a.activity)&&(r=stir.node("#fav-"+t.dataset.id))&&F(r,"")}))}}(stir.node("#search-results"));