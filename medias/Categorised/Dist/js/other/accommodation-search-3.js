!function(t){if(t){const d={cookieType:"accom",urlToFavs:t.dataset.favsurl||"",activity:t.dataset.activity||""},c=t;t=stir.node("#search-form");const l=stir.node("#search-price"),n=stir.node("#search-location"),v=stir.node("#search-student-type"),p=stir.node("#search-bathroom"),u=stir.node("#search-price-value"),m=(t,e,r)=>e.length?stir.favourites.renderRemoveBtn(r,e[0].date,t):stir.favourites.renderAddBtn(r,t),g=stir.curry((t,e)=>{var r,s,a=stir.favourites.getFav(e.id,t.cookieType);return`<div class="cell" id="fav-${e.id}">
              <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
                <div class="grid-x grid-padding-x u-p-2 ">
                  <div class="cell u-pt-2">
                      <p class="u-text-regular u-mb-2 "><strong><a href="">${e.name}</a></strong></p>
                    </div>
                    <div class="cell large-5 text-sm">
                      <p><strong>Price</strong></p> 
                      ${r=e.rooms,r?(s=r.map(t=>parseFloat(t.cost)).sort((t,e)=>t-e),r=stir.removeDuplicates(r.map(t=>t.room)),`<p>From £${s[0].toFixed(2)} to £${s[s.length-1].toFixed(2)} per week</p>
            <ul>${r.map(t=>`<li>${t}</li>`).join("")}</ul>`):""}
                    </div>
                    <div class="cell large-4 text-sm">
                        <p><strong>Facilities</strong></p>
                        <p>${e.facilities}</p>
                        <p><strong>Location</strong></p> 
                        <p>${e.name}</p>
                        <p><strong>Student type</strong></p>
                        <p>${s=e.rooms,s?(s=s.map(t=>t.studType).join(",").split(","),stir.removeDuplicates(s).join("<br />")):""}</p>
                    </div>
                    <div class="cell large-3 ">
                        <div style="border:1px solid #ccc;">Image</div>
                    </div>
                    <div class="cell text-sm u-pt-2" id="favbtns${e.id}">
                      ${m(t.urlToFavs,a,e.id)}
                    </div>
                  </div>
              </div>
            </div>`}),f=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>t.bathroom===e,t.rooms)).length?(t.rooms=r,t):{}:t}),y=stir.curry((t,e)=>""===t||!e.location||t===e.location?e:void 0),h=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>t.studType.includes(e),t.rooms)).length?(t.rooms=r,t):{}:t}),b=stir.curry((e,t)=>{var r;return""!==e&&t.rooms?(r=stir.filter(t=>parseFloat(e)>parseFloat(t.cost),t.rooms)).length?(t.rooms=r,t):{}:t}),T=stir.filter(t=>{if(t.name)return t}),F=stir.join(""),$=stir.curry((t,e)=>t.filter(t=>Number(t.id)===Number(e.id))[0]),x=stir.curry((t,e)=>(stir.setHTML(t,e),!0));var e,r,s,a,i,o;const k=accommodationData;k.length&&("managefavs"===d.activity&&(r=d,s=k,a=stir.favourites.getFavsList(r.cookieType),s=stir.map($(s)),r=stir.map(g(r)),e=x(c),stir.compose(e,F,r,s)(a)),"search"===d.activity&&(e=d,r={price:"",location:"",bathroom:"",studentType:""},s=k,e=stir.map(g(e)),a=stir.map(b(r.price)),i=stir.map(h(r.studentType)),o=stir.map(f(r.bathroom)),r=stir.filter(y(r.location)),o=stir.compose(T,o,r,i,a,stir.clone)(s),r=stir.compose(F,e)(o),x(c,`<div class="cell u-mb-3">Results based on filters - <strong>${o.length} properties</strong></div>`+r),l.value=300,n.value="",v.value="",p.value="",t)&&t.addEventListener("change",t=>{var e={price:l.value,location:n.value,bathroom:p.value,studentType:v.value};x(u,e.price),main(d,e,k)}),c.addEventListener("click",t=>{var e,r,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");t&&t.dataset&&t.dataset.action&&("addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,d.cookieType),r=stir.favourites.getFav(t.dataset.id,d.cookieType),e=stir.node("#favbtns"+t.dataset.id))&&x(e,m(d.urlToFavs,r,t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e=stir.favourites.getFav(t.dataset.id,d.cookieType),"searchfavs"===d.activity&&(r=stir.node("#favbtns"+t.dataset.id))&&x(r,m(d.urlToFavs,e,t.dataset.id)),"managefavs"===d.activity)&&(r=stir.node("#fav-"+t.dataset.id))&&x(r,"")}))}}(stir.node("#search-results"));