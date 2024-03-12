!function(t){if(t){const l="accom",d={cookieType:"accom",urlToFavs:t.dataset.favsurl||"",activity:t.dataset.activity||""},n=t;t=stir.node("#search-form");const c=stir.node("#search-price"),v=stir.node("#search-location"),u=stir.node("#search-student-type"),m=stir.node("#search-bathroom"),p=stir.node("#search-price-value");var e=stir.node("#accomfavbtns"),a=stir.node("[data-activity=shared]"),r=stir.node("#accomsharedfavsarea");const g=(t,e,a)=>e.length?stir.favourites.renderRemoveBtn(a,e[0].date,t):stir.favourites.renderAddBtn(a,t),h=stir.curry((t,e)=>{var a,r,s;return e?(a=stir.favourites.getFav(e.id,t.cookieType),`<div class="cell" id="fav-${e.id}">
              <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
                <div class="grid-x grid-padding-x u-p-2 ">
                  <div class="cell u-pt-2">
                      <p class="u-text-regular u-mb-2 "><strong><a href="${e.url}">${e.title}</a></strong></p>
                    </div>
                    <div class="cell large-5 text-sm">
                      <p><strong>Price</strong></p> 
                      ${r=e.rooms,r?(s=r.map(t=>parseFloat(t.cost)).sort((t,e)=>t-e),r=stir.removeDuplicates(r.map(t=>t.title)),`<p>From £${s[0].toFixed(2)} to £${s[s.length-1].toFixed(2)} per week</p>
            <ul>${r.map(t=>`<li>${t}</li>`).join("")}</ul>`):""}
                    </div>
                    <div class="cell large-4 text-sm">
 
                        <p><strong>Location</strong></p> 
                        <p>${e.location}</p>
                        <p><strong>Student type</strong></p>
                        <p>${s=e.rooms,s?(s=s.map(t=>t.studType).join(",").split(",").map(t=>t.trim()),stir.removeDuplicates(s).sort().join("<br />")):""}</p>
                    </div>
                    <div class="cell large-3 ">
                        <div ><img src="${e.img}" width="760" height="470" alt="Image of ${e.title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
                    </div>
                    <div class="cell text-sm u-pt-2" id="favbtns${e.id}">
                      ${g(t.urlToFavs,a,e.id)}
                    </div>
                  </div>
              </div>
            </div>`):""}),f=t=>t.id?`<p class="text-sm">
              <strong><a href="${t.url}" >${t.title} </a></strong>
          </p>`:"",y=t=>(console.log(t),t.id?`<div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
              <p class="u-text-regular u-py-1">
                <strong><a href="${t.url}" >${t.title}</a></strong>
              </p>
              <div class="u-mb-1">${t.location} accommodation.</div>
              <div>${stir.favourites.isFavourite(t.id)?'<p class="text-sm u-heritage-green">Already in my favourites</p>':stir.favourites.renderAddBtn(t.id,"")}</div>
            </div>
          </div>`:"");var s,i;const b=()=>stir.favourites.getFavsList(l),T=stir.curry((e,t)=>{var a;return""!==e&&t.rooms?(a=stir.filter(t=>t.bathroom===e,t.rooms)).length?(t.rooms=a,t):{}:t}),$=stir.curry((t,e)=>""===t||!e.location||t===e.location?e:void 0),F=stir.curry((e,t)=>{var a;return""!==e&&t.rooms?(a=stir.filter(t=>t.studType.includes(e),t.rooms)).length?(t.rooms=a,t):{}:t}),x=stir.curry((e,t)=>{var a;return""!==e&&t.rooms?(a=stir.filter(t=>parseFloat(e)>parseFloat(t.cost),t.rooms)).length?(t.rooms=a,t):{}:t}),k=stir.filter(t=>{if(t&&t.title)return t}),P=stir.join(""),Q=stir.curry((t,e)=>e?t.filter(t=>Number(t.id)===Number(e.id))[0]:[]),N=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),w=(t,e)=>{var a=stir.favourites.getFavsList(t.cookieType),e=stir.map(Q(e)),t=stir.map(h(t)),r=N(n),e=stir.compose(k,e)(a),a=stir.compose(P,t)(e);return r(a||stir.templates.renderNoFavs)},L=(t,e,a)=>{var t=stir.map(h(t)),r=stir.map(x(e.price)),s=stir.map(F(e.studentType)),i=stir.map(T(e.bathroom)),e=stir.filter($(e.location)),i=stir.compose(k,i,e,s,r,stir.clone)(a),e=stir.compose(P,t)(i);return N(n,`<div class="cell u-mb-3">Results based on filters - <strong>${s=i.length} ${1===s?"property":"properties"}</strong></div>`+e)},j=accommodationData?accommodationData.filter(t=>t.id&&t.id.length):[];if("managefavs"===d.activity&&w(d,j),"shared"===d.activity){var o=j;a&&(i=(t=>{var e=QueryParams.get("a")||"";if(!e)return null;try{var a=atob(e);return console.log(a),a.split(",").map(e=>({...t.filter(t=>{if(e===t.id)return t})[0],id:e}))}catch(t){}})(o),console.log(i),i?N(a,i.map(y).join("")):N(a,stir.templates.renderNoShared)),r&&(s=o,(a=!(i=b()).length||i.length<1?null:i.sort((t,e)=>e.date-t.date).map(e=>({...s.filter(t=>{if(e.id===t.id)return t})[0],id:e.id,dateSaved:e.date})))?N(r,a.map(f).join("")+stir.templates.renderLinkToFavs):N(r,stir.templates.renderNoFavs))}"search"===d.activity&&(o=stir.flatten(j.map(t=>t.rooms)).map(t=>Number(t.cost)).sort((t,e)=>t-e),i=Math.ceil(o[0]),a=10*Math.ceil(i/10),r=Math.ceil(o[o.length-1]),r=10*Math.ceil(r/10),c.min=a,c.max=r,c.value=QueryParams.get("price")?QueryParams.get("price"):r,v.value=QueryParams.get("location")?QueryParams.get("location"):"",u.value=QueryParams.get("student")?QueryParams.get("student"):"",m.value=QueryParams.get("bathroom")?QueryParams.get("bathroom"):"",N(p,c.value),a={price:c.value,location:v.value,studentType:u.value,bathroom:m.value},L(d,a,j),t&&t.addEventListener("input",t=>{var e={price:c.value};N(p,e.price)}),t)&&t.addEventListener("change",t=>{QueryParams.set("price",c.value),QueryParams.set("location",v.value),QueryParams.set("student",u.value),QueryParams.set("bathroom",m.value);var e={price:c.value,location:v.value,studentType:u.value,bathroom:m.value};L(d,e,j)}),e&&(stir.node("main").addEventListener("click",t=>{var e,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");"clearallfavs"===t.dataset.action&&(stir.favourites.removeType(l),w(d,j)),"copysharelink"===t.dataset.action&&(console.log("click"),t=b(),t="https://www.stir.ac.uk/share/"+btoa(t.map(t=>t.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(t),(e=stir.t4Globals.dialogs.filter(t=>"shareDialog"===t.getId())).length)&&(e[0].open(),e[0].setContent((e=t)?` <p><strong>Share link</strong></p>  
          ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
          <p class="text-xsm">${e}</p>`:""))}),N(e,stir.templates.renderFavActionBtns)),n.addEventListener("click",t=>{var e,a,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");t&&t.dataset&&t.dataset.action&&("addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,d.cookieType),a=stir.favourites.getFav(t.dataset.id,d.cookieType),e=stir.node("#favbtns"+t.dataset.id))&&N(e,g(d.urlToFavs,a,t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e=stir.favourites.getFav(t.dataset.id,d.cookieType),"searchfavs"===d.activity&&(a=stir.node("#favbtns"+t.dataset.id))&&N(a,g(d.urlToFavs,e,t.dataset.id)),"managefavs"===d.activity)&&(a=stir.node("#fav-"+t.dataset.id))&&N(a,"")})}}(stir.node("#acccomfinder"));