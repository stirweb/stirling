!function(){if(stir.node("#eventsrevamp")){const c=10;var e=stir.node("[data-tags]")||"",e=e?e.dataset.tags:"";const o={eventsPublic:stir.node("#eventspublic"),eventsStaff:stir.node("#eventsstaff"),eventsArt:stir.node("#eventsart"),eventsWebinars:stir.node("#eventswebinars"),eventsArchive:stir.node("#eventsarchive"),eventsPromo:stir.node("#eventspromo"),eventsPublicFilters:stir.node("#eventspublicfilters"),eventsStaffFilters:stir.node("#eventsstafffilters"),eventsArtFilters:stir.node("#eventsartfilters"),eventsWebinarsFilters:stir.node("#eventswebinarsfilters"),eventsArchiveFilters:stir.node("#eventsarchivefilters"),eventsPublicTab:stir.node("#eventspublictab"),eventsStaffTab:stir.node("#eventsstafftab"),eventsArtTab:stir.node("#eventsarttab"),eventsWebinarsTab:stir.node("#eventswebinarstab"),eventsArchiveTab:stir.node("#eventsarchivetab"),stirTabs:stir.nodes(".stir-tabs__tab")},r=(e,t)=>`<div class="u-mt-1"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,a=e=>`<div class="u-absolute u-top--16">
                <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">${e}</span>
            </div>`,p=e=>`<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">${e}</p></div>`,n=(e,t,s)=>e===t?"":`– <time datetime="${t}">${s}</time>`,v=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",g=e=>e.isSeries?"":`<div class="u-flex u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
        </div>`,m=(t,e)=>{e=e.filter(e=>e.isSeries===t);return`<p class="text-sm">Part of the ${e.length?`<a href="${e[0].url}">${e[0].title}</a>`:t} series.</p>`},f=(e,t,s)=>t.length?stir.favourites.renderRemoveBtn(s,t[0].date,e):stir.favourites.renderAddBtn(s,e),M=stir.curry((e,t)=>{var s,i=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event" ${s=t,s.pin<1?'data-label-icon="pin"':"Webinar"===s.type?'data-label-icon="computer"':s.isSeries?'data-label-icon="startdates"':""} data-perf="${t.perfId}" >
                ${s=t,"Webinar"===s.type?a("Webinar"):s.isSeries?a("Event series"):""} 
                <div class="u-grid-medium-up u-gap-24 ${t.image?"u-grid-cols-3_1":""} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1" >
                      <p class="u-text-regular u-m-0">
                        ${v(t.cancelled)} ${v(t.rescheduled)} 
                          <strong>${s=t,s.url?` <a href="${s.url}">${"Webinar"===s.type?"Webinar: ":""}${s.title}</a>`:("Webinar"===s.type?"Webinar: ":"")+s.title} </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${t.start}">${t.stirStart}</time> ${n(t.start,t.end,t.stirEnd)}</span>
                          </div>
                          ${g(t)}
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"} "></span>
                              <span>${t.location}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${t.summary}</p>
                      ${t.isSeriesChild?m(t.isSeriesChild,e):""}
                  </div>
                ${t.image?r(t.image,t.title):""} 
                 </div>
                  <div class="u-mt-2" id="favbtns${t.sid}">${i&&f("true",i,t.sid)}</div>
            </div>`}),L=stir.curry((e,t)=>`<div class="u-border-width-5 u-heritage-line-left  u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event"  >
                ${t.recording?a("Recording available"):""} 
                ${t.isSeries?a("Event series"):""} 
                
                <div class="u-grid-medium-up u-gap-24 ${t.image?"u-grid-cols-3_1":""} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                      <p class="u-text-regular u-m-0">
                          <strong><a href="${t.url}">${t.title}</a></strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${t.start}">${t.stirStart}</time> ${n(t.start,t.end,t.stirEnd)}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${t.summary}</p>
                      ${t.isSeriesChild?m(t.isSeriesChild,e):""}
                  </div>
                  ${t.image?r(t.image,t.title):""}  
                </div>
            </div>`),_=stir.curry((e,t)=>{var s=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${t.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?a("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${v(t.cancelled)} ${v(t.rescheduled)} <strong><a href="${t.url}">${t.title}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span><time datetime="${t.start}">${t.stirStart}</time> ${n(t.start,t.end,t.stirEnd)}</span>
                      </div>
                      ${g(t)}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                          <span>${t.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${t.summary}</p>
                  ${t.isSeriesChild?m(t.isSeriesChild,e):""}
                 </div>
                  <div id="favbtns${t.sid}">${s&&f("true",s,t.sid)}</div>
                </div>
            </div>
            ${t.image?`<div class="cell medium-4"><img src="${t.image}" class="u-object-cover" width="800" height="800" alt="Image: ${t.title}" /></div>`:""}  
        </div>`}),b=(e,t)=>t<=e?"":'<div class="loadmorebtn u-flex align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',h=(e,t,s)=>e<2?"":`<div class="u-flex align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`,$=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),S=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),s=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))};const y=stir.filter(e=>e.audience.includes("Public")&&!e.tags.includes("Art Collection")&&!e.type.includes("Webinar")),x=stir.filter(e=>{return((t=e).audience.includes("Staff")||t.audience.includes("Student"))&&!e.audience.includes("Public")&&!e.tags.includes("Art Collection");var t});const w=stir.filter(e=>e.tags&&e.tags.includes("Art Collection"));const F=stir.filter(e=>e.type&&e.type.includes("Webinar"));const Y=stir.filter(e=>Number(e.endInt)<s()&&e.archive.length&&!e.hideFromFeed.length);const T=stir.filter(e=>Number(e.endInt)>=s()&&!e.hideFromFeed.length);const H=stir.filter(e=>e.eventPromo),D=stir.join(""),Q=stir.filter((e,t)=>0===t),B=(e,t)=>Number(e.startInt)-Number(t.startInt),R=(e,t)=>Number(t.startInt)-Number(e.startInt),z=(e,t)=>e.pin!==t.pin?e.pin-t.pin:Number(e.startInt)-Number(t.startInt),J=stir.filter(e=>e.recording),U=e=>e,A=stir.filter(e=>e.isSeries.length),I=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t});var q=stir.curry((t,s)=>{var i={},r=[];for(let e=0;e<s.length;e++)i[s[e][t]]||(i[s[e][t]]=!0,r.push(s[e]));return r});const Z=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),P=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},W=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},N=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},k=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},O=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},G=stir.curry((t,e)=>{e=P(e.start,e.end).map(e=>Z(t,e));return stir.any(e=>e,e)});var t=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const s=t.tags.split(", ");e=e.map(e=>s.includes(e));return stir.all(e=>e,e)?t:void 0});const C=stir.filter(t(e)),E=q("perfId"),i=e=>"string"!=typeof e?"":e.replace(/[^a-zA-Z0-9-_]/g,""),j={get:e=>i(QueryParams.get(e)),set:(e,t)=>QueryParams.set(e,i(t)),remove:QueryParams.remove};$(o.eventsPublic,""),$(o.eventsStaff,""),$(o.eventsArt,""),$(o.eventsWebinars,""),o.eventsPublicFilters.querySelector("input[type=radio]").checked=!0,o.eventsStaffFilters.querySelector("input[type=radio]").checked=!0,o.eventsArchiveFilters.querySelector("input[type=radio]").checked=!0,o.eventsArtFilters.querySelector("input[type=radio]").checked=!0,o.eventsWebinarsFilters.querySelector("input[type=radio]").checked=!0;e="dev"===(t=UoS_env.name)?"../index.json":"preview"===t||"appdev-preview"===t?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";function l(e,t,s,i){e="thisweek"===(e=e)?P(W().start,W().end):"nextweek"===e?P(N().start,N().end):"thismonth"===e?P(k().start,k().end):"nextmonth"===e?P(O().start,O().end):null;const r=Number(j.get("page"))||1;var a=c*(r-1),n=a+c,l=stir.compose(A)(i),l=stir.map(M(l)),t=(1===r?$:S)(t),u=stir.sort(z),d=stir.filter((e,t)=>{if(I(r,c,t))return e});if(e){var e=G(e),e=stir.filter(e,i),e=stir.pipe(T,E,C,s,u)(e),o=stir.pipe(d,l,D)(e);const v=e.length;e.length?t(h(a,n,v)+o+b(n,v)):t(p("No events found. Try the staff and student events tab."))}else{e=stir.pipe(T,E,C,s,u)(i),o=stir.pipe(d,l,D)(e);const v=e.length;void(e.length?t(h(a,n,v)+o+b(n,v)):t(p("No events found. Try the staff and student events tab.")))}}function u(e,t){const s=Number(j.get("page"))||1,i=c*(s-1),r=i+c;var a=stir.compose(A)(t);const n=stir.map(L(a)),l=stir.sort(R),u=(1===s?$:S)(o.eventsArchive),d=stir.filter((e,t)=>{if(I(s,c,t))return e});a=(e,t)=>{var e=stir.pipe(Y,C,e,l)(t),t=stir.pipe(d,n,D)(e),s=e.length;e.length?u(h(i,r,s)+t+b(r,s)):u(p("No events found."))};"all"===e&&a(U,t),"recordings"===e&&a(J,t),"public"===e&&a(y,t),"staffstudent"===e&&a(x,t)}stir.getJSON(e,e=>{if(!e.error){var t,s,i,r,e=e.filter(e=>e.id);j.set("page","1"),l("all",o.eventsStaff,x,e),l("all",o.eventsPublic,y,e),l("all",o.eventsArt,w,e),l("all",o.eventsWebinars,F,e),u("all",e),t=e,s=stir.filter(A,t),s=stir.map(_(s)),i=stir.sort(B),r=$(o.eventsPromo),stir.pipe(T,C,i,H,Q,s,D,r)(t),stir.each(e=>{e.addEventListener("click",e=>{j.set("page","1")})},o.stirTabs),a(o.eventsPublicTab,o.eventsPublicFilters,o.eventsPublic,y,l,e),a(o.eventsArtTab,o.eventsArtFilters,o.eventsArt,w,l,e),a(o.eventsWebinarsTab,o.eventsWebinarsFilters,o.eventsWebinars,F,l,e),a(o.eventsStaffTab,o.eventsStaffFilters,o.eventsStaff,x,l,e),a(o.eventsArchiveTab,o.eventsArchiveFilters,null,null,(e,t,s,i)=>u(e,i),e);const n=e=>{var t=stir.favourites.getFav(e,"event"),s=stir.node("#favbtns"+e);s&&$(s)(f("true",t,e))};function a(e,s,i,r,a,n){e.addEventListener("click",e=>{var t=Number(j.get("page"))||1;"radio"===e.target.type&&(j.set("page","1"),a(s.querySelector("input:checked").value,i,r,n)),"submit"===e.target.type&&($(e.target.closest(".loadmorebtn"),""),j.set("page",String(t+1)),a(s.querySelector("input:checked").value,i,r,n))})}stir.node("main").addEventListener("click",e=>{e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,"event"),n(e.dataset.id)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),n(e.dataset.id))})}})}}();