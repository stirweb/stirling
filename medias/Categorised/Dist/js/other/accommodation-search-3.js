!function(t){if(t){const s="accom",o={cookieType:"accom",urlToFavs:t.dataset.favsurl||"",activity:t.dataset.activity||"",view:stir.templates&&stir.templates.view?stir.templates.view:""},l=t;t=stir.node("#search-form");const d=stir.node("#search-price"),n=stir.node("#search-location"),c=stir.node("#search-student-type"),v=stir.node("#search-bathroom"),u=stir.node("#search-price-value");var e=stir.node("#accomfavbtns"),a=stir.node("[data-activity=shared]"),r=stir.node("#accomsharedfavsarea");const m=(t,e,a)=>e.length?stir.favourites.renderRemoveBtn(a,e[0].date,t):stir.favourites.renderAddBtn(a,t),p=stir.curry((t,e)=>{var a,r,i;return e?(a=stir.favourites.getFav(e.id,t.cookieType),`<div class="cell" id="fav-${e.id}">
              <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
                <div class="grid-x grid-padding-x u-p-2 ">
                  <div class="cell u-pt-2">
                      <p class="u-text-regular u-mb-2 "><strong><a href="${e.url}">${e.title}</a></strong></p>
                    </div>
                    <div class="cell large-5 text-sm">
                      <p><strong>Price</strong></p> 
                      ${r=e.rooms,r?(i=r.map(t=>parseFloat(t.cost)).sort((t,e)=>t-e),r=stir.removeDuplicates(r.map(t=>t.type)),i[0].toFixed(2)===i[i.length-1].toFixed(2)?`<p>£${i[0].toFixed(2)} per week</p>
              <ul>${r.map(t=>`<li>${t}</li>`).join("")}</ul>`:`<p>From £${i[0].toFixed(2)} to £${i[i.length-1].toFixed(2)} per week</p>
            <ul>${r.map(t=>`<li>${t}</li>`).join("")}</ul>`):""}
                    </div>
                    <div class="cell large-4 text-sm">
                        <p><strong>Location</strong></p> 
                        <p>${e.location}</p>
                        <p><strong>Student type</strong></p>
                        <p>${i=e.rooms,i?(i=i.map(t=>t.studType).join(",").split(",").map(t=>t.trim()),stir.removeDuplicates(i).join("<br />")):""}</p>
                    </div>
                    <div class="cell large-3 ">
                        <div><img src="${e.img}" width="760" height="470" alt="Image of ${e.title}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
                    </div>
                    <div class="cell text-sm u-pt-2" id="favbtns${e.id}">
                      ${m(t.urlToFavs,a,e.id)}
                    </div>
                  </div>
              </div>
            </div>`):""}),g=t=>t.id?`<p class="text-sm"><strong><a href="${t.url}" >${t.title} </a></strong></p>`:"",h=stir.curry(t=>t.id?`<div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
              <p class="u-text-regular u-py-1"><strong><a href="${t.url}" >${t.title}</a></strong></p>
              <div class="u-mb-1">${t.location} accommodation.</div>
              <div>${stir.favourites.isFavourite(t.id)?'<p class="text-sm u-heritage-green">Already in my favourites</p>':stir.favourites.renderAddBtn(t.id,"")}</div>
            </div>
          </div>`:""),f=stir.curry((t,e)=>{var a;return e&&(a=stir.favourites.getFav(e.id,t.cookieType),e.id)?`<div class="cell small-4">
              <div class="u-green-line-top u-margin-bottom">
                <p class="u-text-regular u-py-1"><strong><a href="${e.url}" >${e.title}</a></strong></p>
                <div class="u-mb-1">${e.location} accommodation.</div>
                <div>${m(t.urlToFavs,a,e.id)}</div>
              </div>
            </div>`:""});const y=()=>stir.favourites.getFavsList(s),b=stir.curry((e,t)=>{var a;return""!==e&&t.rooms?(a=stir.filter(t=>t.bathroom.toLowerCase().includes(e.toLowerCase()),t.rooms)).length?(t.rooms=a,t):{}:t}),$=stir.curry((t,e)=>""===t||!e.location||t===e.location?e:void 0),F=stir.curry((e,t)=>{var a;return""!==e&&t.rooms?(a=stir.filter(t=>t.studType.includes(e),t.rooms)).length?(t.rooms=a,t):{}:t}),T=stir.curry((e,t)=>{var a;return""!==e&&t.rooms?(a=stir.filter(t=>parseFloat(e)>parseFloat(t.cost),t.rooms)).length?(t.rooms=a,t):{}:t}),x=stir.filter(t=>{if(t&&t.title)return t}),k=stir.join(""),w=stir.curry((t,e)=>e?t.filter(t=>Number(t.id)===Number(e.id))[0]:[]),P=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),Q=(t,e)=>{var a=stir.favourites.getFavsList(t.cookieType),e=stir.map(w(e)),t="micro"===t.view?stir.map(f(t)):stir.map(p(t)),r=P(l),e=stir.compose(x,e)(a),a=stir.compose(k,t)(e);return r(a||stir.templates.renderNoFavs)},L=(t,e,a)=>{var t=stir.map(p(t)),r=stir.map(T(e.price)),i=stir.map(F(e.studentType)),s=stir.map(b(e.bathroom)),e=stir.filter($(e.location)),s=stir.compose(x,s,e,i,r,stir.clone)(a),e=stir.compose(k,t)(s);return P(l,`<div class="cell u-mb-3">Results based on filters - <strong>${i=s.length} ${1===i?"property":"properties"}</strong></div>`+e)};var i=(t,e,a)=>{var r,i;t&&((i=(t=>{var e=QueryParams.get("a")||"";if(!e)return null;try{return atob(e).split(",").map(e=>({...t.filter(t=>{if(e===t.id)return t})[0],id:e}))}catch(t){}})(a))?P(t,i.map(h).join("")):P(t,stir.templates.renderNoShared)),e&&(r=a,(t=!(i=y()).length||i.length<1?null:i.sort((t,e)=>e.date-t.date).map(e=>({...r.filter(t=>{if(e.id===t.id)return t})[0],id:e.id,dateSaved:e.date})))?P(e,t.map(g).join("")+stir.templates.renderLinkToFavs):P(e,stir.templates.renderNoFavs))};const N=accommodationData?accommodationData.filter(t=>t.id&&t.id.length):[];"managefavs"===o.activity&&Q(o,N),"shared"===o.activity&&i(a,r,N),"search"===o.activity&&(i=stir.flatten(N.map(t=>t.rooms)).map(t=>Number(t.cost)).sort((t,e)=>t-e),a=Math.ceil(i[0]),r=10*Math.ceil(a/10),a=Math.ceil(i[i.length-1]),i=10*Math.ceil(a/10),d.min=r,d.max=i,d.value=QueryParams.get("price")?QueryParams.get("price"):i,n.value=QueryParams.get("location")?QueryParams.get("location"):"",c.value=QueryParams.get("student")?QueryParams.get("student"):"",v.value=QueryParams.get("bathroom")?QueryParams.get("bathroom"):"",P(u,d.value),a={price:d.value,location:n.value,studentType:c.value,bathroom:v.value},L(o,a,N),t&&t.addEventListener("input",t=>{var e={price:d.value};P(u,e.price)}),t)&&t.addEventListener("change",t=>{QueryParams.set("price",d.value),QueryParams.set("location",n.value),QueryParams.set("student",c.value),QueryParams.set("bathroom",v.value);var e={price:d.value,location:n.value,studentType:c.value,bathroom:v.value};L(o,e,N)}),e&&(stir.node("main").addEventListener("click",t=>{var e,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");"clearallfavs"===t.dataset.action&&(stir.favourites.removeType(s),Q(o,N)),"copysharelink"===t.dataset.action&&(t=y(),t="https://www.stir.ac.uk/shareaccommodation/"+btoa(t.map(t=>t.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(t),(e=stir.t4Globals.dialogs.filter(t=>"shareDialog"===t.getId())).length)&&(e[0].open(),e[0].setContent((e=t)?` <p><strong>Share link</strong></p>  
          ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
          <p class="text-xsm">${e}</p>`:""))}),P(e,stir.templates.renderFavActionBtns)),l.addEventListener("click",t=>{var e,a,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");t&&t.dataset&&t.dataset.action&&("addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,o.cookieType),a=stir.favourites.getFav(t.dataset.id,o.cookieType),e=stir.node("#favbtns"+t.dataset.id))&&P(e,m(o.urlToFavs,a,t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e=stir.favourites.getFav(t.dataset.id,o.cookieType),"search"===o.activity&&(a=stir.node("#favbtns"+t.dataset.id))&&P(a,m(o.urlToFavs,e,t.dataset.id)),"managefavs"===o.activity)&&(a=stir.node("#fav-"+t.dataset.id))&&P(a,"")})}}(stir.node("#acccomfinder"));