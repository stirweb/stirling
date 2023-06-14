!function(t){if(t){var e=stir.node("#welcomeeventfilters");const a=t=>(console.log(t),`<div class="grid-x u-bg-white u-mb-2 u-energy-line-left u-border-width-5">
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
                          
                      <!-- div class="flex-container u-gap-16 align-middle">
                              <span class="u-icon h5 uos-discounts"></span><a href="${t.link}">Booking required</a></ -->
                      </div>
                      <p class="text-sm">${t.description}</p>
                      <p class="u-m-0 text-sm">Theme: ${t.theme} <br />Attendance: ${t.attendance}</p>
                  </div>
              </div>`);var s=(t,e)=>`<select id="${e.toLowerCase().replaceAll(" ","-")}"><option value="">${e}</option>${t}</select>`;var i=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const n=i(t);t=i(e);const l=stir.join(""),o=(t,e)=>t.startInt-e.startInt;i=stir.curry((e,s)=>{var i={},r=[];for(let t=0;t<s.length;t++)i[s[t][e]]||(i[s[t][e]]=!0,r.push(s[t]));return r});const c=stir.curry((t,e)=>!t||e.startInt===Number(t)),d=stir.curry((t,e)=>!t||e.theme===t),p=stir.feeds.events.filter(t=>t.id);console.log(p);var r=i("startInt"),r=stir.compose(l,stir.map(t=>`<option value="${t.startInt}">${t.stirStart}</option>`),r,stir.map(t=>({startInt:t.startInt,stirStart:t.stirStart})),stir.sort(o))(p),i=i("theme"),i=stir.compose(l,stir.map(t=>`<option value="${t.theme}">${t.theme}</option>`),i,stir.filter(t=>t.theme),stir.map(t=>({theme:t.theme})))(p);t(s(r,"Filter by date")+s(i,"Filter by theme"));const m=(t,e,s)=>{t=c(t),e=d(e),e=stir.compose(l,stir.map(a),stir.filter(e),stir.filter(t),stir.sort(o))(s);e.length?n(e):n(`<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
                  <div class="cell u-p-2 small-12  ">
                      <p>No events have been found for the criteria selected</p>
                  </div>
              </div>`)};m("","",p),e.addEventListener("click",t=>{var e;"OPTION"===t.target.nodeName&&(t=stir.node("#filter-by-date"),e=stir.node("#filter-by-theme"),m(t.options[t.selectedIndex].value,e.options[e.selectedIndex].value,p))})}}(stir.node("#welcomeevents"));