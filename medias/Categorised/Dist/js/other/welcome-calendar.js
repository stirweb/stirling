!function(e){if(!e)return;var t=stir.node("#welcomeeventfilters");const o=e,d=e=>`<div class="grid-x u-bg-white u-mb-2 u-energy-line-left u-border-width-5">
                  <div class="cell u-p-2 small-12  ">
                      
                      <p class="u-text-regular u-mb-2">
                      <strong>${e.title}</strong>
                      </p>
                      <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time>${e.stirStart}</time></span>
                          </div>
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="uos-clock u-icon h5"></span>
                              <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
                          </div>
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="u-icon h5 uos-location"></span>
                              <span>${e.location}</span>
                          </div>

                          <div class="flex-container u-gap-16 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height: 20px; color: #006938 ">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                <a href="${e.link}">More information</a>
                            </div>

                      </div>

                      <p class="text-sm">${e.description}</p>
                      <p class="u-m-0 text-sm"><strong>Theme:</strong> ${e.theme} <br /><strong>Attendance:</strong> ${e.attendance}</p>


                  </div>
              </div>`;e=(e,t)=>`<select id="${t.toLowerCase().replaceAll(" ","-")}"><option value="">${t}</option>${e}</select>`;const c=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),u=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e));var r=c(t);const p=stir.join(""),m=(e,t)=>e.startInt-t.startInt;var s=stir.curry((t,r)=>{var s={},i=[];for(let e=0;e<r.length;e++)s[r[e][t]]||(s[r[e][t]]=!0,i.push(r[e]));return i});const v=stir.curry((e,t)=>!e||t.startInt===Number(e)),g=stir.curry((e,t)=>!e||t.theme===e);const f=stir.filter(e=>e.endInt>=i()),h=stir.curry((e,t,r)=>{e=t*(e-1);return e<=r&&r<e+t}),i=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join(""))},n=(e,t,r)=>{const s=Number(QueryParams.get("page"))||1;var i=5*(s-1),n=5+i,a=(1===s?c:u)(o),l=stir.filter((e,t)=>{if(h(s,5,t))return e}),e=v(e),t=g(t),t=stir.compose(stir.filter(t),stir.filter(e),stir.sort(m),f)(r),e=stir.compose(p,stir.map(d),l)(t),r=t.length;e.length?a((l=n,t=r,((i=i)<2?"":`<div class="flex-container align-center u-mb-2">Showing ${i+1}-${t<l?t:l} of ${t} results</div>`)+e+(r<=n?"":'<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>'))):a(`<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
                  <div class="cell u-p-2 small-12  ">
                      <p>No events have been found for the criteria selected</p>
                  </div>
              </div>`)},a=stir.feeds.events.filter(e=>e.id);QueryParams.set("page",1),n("","",a);var l=s("startInt"),l=stir.compose(p,stir.map(e=>`<option value="${e.startInt}">${e.stirStart}</option>`),l,stir.map(e=>({startInt:e.startInt,stirStart:e.stirStart})),stir.sort(m),f)(a),s=s("theme"),s=stir.compose(p,stir.map(e=>`<option value="${e.theme}">${e.theme}</option>`),s,stir.filter(e=>e.theme),stir.map(e=>({theme:e.theme})))(a);r(e(l,"Filter by date")+e(s,"Filter by theme")+'<button id="clearfilters" class="button no-arrow tiny hollow expanded u-font-bold">Clear all filters</button>'),o.addEventListener("click",e=>{var t,r,s;"submit"===e.target.type&&(t=stir.node("#filter-by-date"),r=stir.node("#filter-by-theme"),s=Number(QueryParams.get("page")),c(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",s+1),n(t.options[t.selectedIndex].value,r.options[r.selectedIndex].value,a))}),t.addEventListener("click",e=>{e.preventDefault();var t=stir.node("#filter-by-date"),r=stir.node("#filter-by-theme");"BUTTON"===e.target.nodeName&&(QueryParams.set("page",1),t.value="",r.value="",n(t.options[t.selectedIndex].value,r.options[r.selectedIndex].value,a)),"OPTION"===e.target.nodeName&&(QueryParams.set("page",1),n(t.options[t.selectedIndex].value,r.options[r.selectedIndex].value,a))})}(stir.node("#welcomeevents"));