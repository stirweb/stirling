!function(t){if(!t)return;var e=stir.node("#welcomeeventfilters");const l=t,d=t=>`<div class="grid-x u-bg-white u-mb-2 u-energy-line-left u-border-width-5">
                  <div class="cell u-p-2 small-12  ">
                      
                      <p class="u-text-regular u-mb-2">
                      <strong>${t.title}</strong>
                      </p>
                      <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time>${t.stirStart}</time></span>
                          </div>
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="uos-clock u-icon h5"></span>
                              <span><time>${t.startTime}</time> – <time>${t.endTime}</time></span>
                          </div>
                          <div class="flex-container u-gap-16 align-middle">
                              <span class="u-icon h5 uos-location"></span>
                              <span>${t.location}</span>
                          </div>

                          <div class="flex-container u-gap-16 align-middle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height: 20px; color: #006938 ">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                <a href="${t.link}">More information</a>
                            </div>

                      </div>

                      <p class="text-sm">${t.description}</p>
                      <p class="u-m-0 text-sm"><strong>Theme:</strong> ${t.theme} <br /><strong>Attendance:</strong> ${t.attendance}</p>


                  </div>
              </div>`;t=(t,e)=>`<select id="${e.toLowerCase().replaceAll(" ","-")}"><option value="">${e}</option>${t}</select>`;const c=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),u=stir.curry((t,e)=>(t.insertAdjacentHTML("beforeend",e),t));var r=c(e);const m=stir.join(""),p=(t,e)=>t.startInt-e.startInt;var s=stir.curry((e,r)=>{var s={},i=[];for(let t=0;t<r.length;t++)s[r[t][e]]||(s[r[t][e]]=!0,i.push(r[t]));return i});const v=stir.curry((t,e)=>!t||e.startInt===Number(t)),g=stir.curry((t,e)=>!t||e.theme===t);const h=stir.filter(t=>t.endInt>=i()),f=stir.curry((t,e,r)=>{t=e*(t-1);return t<=r&&r<t+e}),i=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))},n=(t,e,r)=>{const s=Number(QueryParams.get("page"))||1;var i=5*(s-1),n=5+i,a=(1===s?c:u)(l),o=stir.filter((t,e)=>{if(f(s,5,e))return t}),t=v(t),e=g(e),e=stir.compose(stir.filter(e),stir.filter(t),stir.sort(p),h)(r),t=stir.compose(m,stir.map(d),o)(e),r=e.length;t.length?a((o=n,e=r,((i=i)<2?"":`<div class="flex-container align-center u-mb-2">Showing ${i+1}-${e<o?e:o} of ${e} results</div>`)+t+(i=n,o=r,console.log(i,o),o<=i?"":'<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>'))):a(`<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
                  <div class="cell u-p-2 small-12  ">
                      <p>No events have been found for the criteria selected</p>
                  </div>
              </div>`)},a=stir.feeds.events.filter(t=>t.id);QueryParams.set("page",1);var o=s("startInt"),o=stir.compose(m,stir.map(t=>`<option value="${t.startInt}">${t.stirStart}</option>`),o,stir.map(t=>({startInt:t.startInt,stirStart:t.stirStart})),stir.sort(p),h)(a),s=s("theme"),s=stir.compose(m,stir.map(t=>`<option value="${t.theme}">${t.theme}</option>`),s,stir.filter(t=>t.theme),stir.map(t=>({theme:t.theme})))(a);r(t(o,"Filter by date")+t(s,"Filter by theme")),n("","",a),l.addEventListener("click",t=>{var e,r,s;"submit"===t.target.type&&(e=stir.node("#filter-by-date"),r=stir.node("#filter-by-theme"),s=Number(QueryParams.get("page")),c(t.target.closest(".loadmorebtn"),""),QueryParams.set("page",s+1),n(e.options[e.selectedIndex].value,r.options[r.selectedIndex].value,a))}),e.addEventListener("click",t=>{var e;"OPTION"===t.target.nodeName&&(QueryParams.set("page",1),t=stir.node("#filter-by-date"),e=stir.node("#filter-by-theme"),n(t.options[t.selectedIndex].value,e.options[e.selectedIndex].value,a))})}(stir.node("#welcomeevents"));