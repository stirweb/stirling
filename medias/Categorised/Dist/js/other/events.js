!function(l){if(!l)return;const g=10,s="Art Collection",i="Webinar",c="Public",C="Staff",M="Student";var e=stir.node("[data-tags]")||"",e=(e?e.dataset.tags:"").split(",")[0];const p={eventsPublic:stir.node("#eventspublic"),eventsStaff:stir.node("#eventsstaff"),eventsArt:stir.node("#eventsart"),eventsWebinars:stir.node("#eventswebinars"),eventsArchive:stir.node("#eventsarchive"),eventsPromo:stir.node("#eventspromo"),eventsPublicFilters:stir.node("#eventspublicfilters"),eventsStaffFilters:stir.node("#eventsstafffilters"),eventsArtFilters:stir.node("#eventsartfilters"),eventsWebinarsFilters:stir.node("#eventswebinarsfilters"),eventsArchiveFilters:stir.node("#eventsarchivefilters"),eventsPublicTab:stir.node("#eventspublictab"),eventsStaffTab:stir.node("#eventsstafftab"),eventsArtTab:stir.node("#eventsarttab"),eventsWebinarsTab:stir.node("#eventswebinarstab"),eventsArchiveTab:stir.node("#eventsarchivetab"),stirTabs:stir.nodes(".stir-tabs__tab")},a=(e,t)=>`<div class="u-mt-1"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,n=e=>`<div class="u-absolute u-top--16">
                <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">${e}</span>
            </div>`,u=(e,t,s)=>e===t?"":`– <time datetime="${t}">${s}</time>`,v=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",o=e=>e.isSeries?"":`<div class="u-flex u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
        </div>`,m=(t,e)=>{e=e.filter(e=>e.isSeries===t);return`<p class="text-sm">Part of the ${e.length?`<a href="${e[0].url}">${e[0].title}</a>`:t} series.</p>`},f=(e,t,s)=>t.length?stir.favourites.renderRemoveBtn(s,t[0].date,e):stir.favourites.renderAddBtn(s,e),L=stir.curry((e,t)=>{var s,r=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event" ${s=t,s.pin<1?'data-label-icon="pin"':s.type===i?'data-label-icon="computer"':s.isSeries?'data-label-icon="startdates"':""} data-perf="${t.perfId}" >
                ${s=t,s.type===i?n(i):s.isSeries?n("Event series"):""} 
                <div class="u-grid-medium-up u-gap-24 ${t.image?"u-grid-cols-3_1":""} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1" >
                      <p class="u-text-regular u-m-0">
                        ${v(t.cancelled)} ${v(t.rescheduled)} 
                          <strong>${s=t,s.url?` <a href="${s.url}">${s.type===i?"Webinar: ":""}${s.title}</a>`:(s.type===i?"Webinar: ":"")+s.title} </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${t.start}">${t.stirStart}</time> ${u(t.start,t.end,t.stirEnd)}</span>
                          </div>
                          ${o(t)}
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"} "></span>
                              <span>${t.location}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${t.summary}</p>
                      ${t.isSeriesChild?m(t.isSeriesChild,e):""}
                  </div>
                ${t.image?a(t.image,t.title):""} 
                 </div>
                  <div class="u-mt-2" id="favbtns${t.sid}">${r&&f("true",r,t.sid)}</div>
            </div>`}),_=stir.curry((e,t)=>`<div class="u-border-width-5 u-heritage-line-left  u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event"  >
                ${t.recording?n("Recording available"):""} 
                ${t.isSeries?n("Event series"):""} 
                
                <div class="u-grid-medium-up u-gap-24 ${t.image?"u-grid-cols-3_1":""} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                      <p class="u-text-regular u-m-0">
                          <strong><a href="${t.url}">${t.title}</a></strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${t.start}">${t.stirStart}</time> ${u(t.start,t.end,t.stirEnd)}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${t.summary}</p>
                      ${t.isSeriesChild?m(t.isSeriesChild,e):""}
                  </div>
                  ${t.image?a(t.image,t.title):""}  
                </div>
            </div>`),Y=stir.curry((e,t)=>{var s=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${t.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?n("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${v(t.cancelled)} ${v(t.rescheduled)} <strong><a href="${t.url}">${t.title}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span><time datetime="${t.start}">${t.stirStart}</time> ${u(t.start,t.end,t.stirEnd)}</span>
                      </div>
                      ${o(t)}
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
        </div>`}),b=(e,t)=>t<=e?"":'<div class="loadmorebtn u-flex align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',h=(e,t,s)=>e<2?"":`<div class="u-flex align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`;const S=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),$=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e));var H=stir.curry((t,s)=>{var r={},i=[];for(let e=0;e<s.length;e++)r[s[e][t]]||(r[s[e][t]]=!0,i.push(s[e]));return i});const r=e=>"string"!=typeof e?"":e.replace(/[^a-zA-Z0-9-_]/g,""),y={get:e=>r(QueryParams.get(e)),set:(e,t)=>QueryParams.set(e,r(t)),remove:QueryParams.remove};const x=stir.filter(e=>e.audience.includes(c)&&!e.tags.includes(s)&&!e.type.includes(i)),F=stir.filter(e=>{return((t=e).audience.includes(C)||t.audience.includes(M))&&!e.audience.includes(c)&&!e.tags.includes(s);var t});const w=stir.filter(e=>e.tags&&e.tags.includes(s));const T=stir.filter(e=>e.type&&e.type.includes(i));const Q=stir.filter(e=>Number(e.endInt)<q()&&e.archive.length&&!e.hideFromFeed.length);const D=stir.filter(e=>Number(e.endInt)>=q()&&!e.hideFromFeed.length);const B=stir.filter(e=>e.eventPromo),A=stir.join(""),R=stir.filter((e,t)=>0===t),z=stir.filter(e=>e.recording),J=e=>e,P=stir.filter(e=>e.isSeries.length),I=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t});var t=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const s=t.tags.split(", ");e=e.map(e=>s.includes(e));return stir.all(e=>e,e)?t:void 0});const W=stir.filter(t(e)),U=H("perfId"),Z=(e,t)=>Number(e.startInt)-Number(t.startInt),G=(e,t)=>Number(t.startInt)-Number(e.startInt),K=(e,t)=>Number(e.pin)-Number(t.pin),q=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))},V=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),k=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},N=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},O=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},E=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},X=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},ee=stir.curry((t,e)=>{e=k(e.start,e.end).map(e=>V(t,e));return stir.any(e=>e,e)});function j(e,t,s,r){e="thisweek"===(e=e)?k(N().start,N().end):"nextweek"===e?k(O().start,O().end):"thismonth"===e?k(E().start,E().end):"nextmonth"===e?k(X().start,X().end):null;const i=Number(y.get("page"))||1;var a=g*(i-1),n=a+g,l=stir.compose(P)(r);const u=stir.map(L(l));l=(1===i?S:$)(t);const d=stir.sort(K),v=stir.filter((e,t)=>{if(I(i,g,t))return e});var o=e=>{var e=stir.pipe(D,U,W,s,d)(e),t=stir.pipe(v,u,A)(e);return[e.length,t]};let c,p;e||([c,p]=o(r)),e&&(e=ee(e),e=stir.filter(e,r),[c,p]=o(e)),c||(r=t.closest("[role=tabpanel]"))&&(o=r.id,e=document.querySelector(`[aria-controls=${o}]`),r.remove(),e)&&e.remove(),c&&l(h(a,n,c)+p+b(n,c))}function te(e,t){const s=Number(y.get("page"))||1;var r=g*(s-1),i=r+g,a=stir.compose(P)(t);const n=stir.map(_(a)),l=stir.sort(G);a=(1===s?S:$)(p.eventsArchive);const u=stir.filter((e,t)=>{if(I(s,g,t))return e});var d=(e,t)=>{e=stir.pipe(Q,W,e,l)(t),t=stir.pipe(u,n,A)(e);return[e.length,t]};let v,o;"all"===e&&([v,o]=d(J,t)),"recordings"===e&&([v,o]=d(z,t)),e===c&&([v,o]=d(x,t)),"staffstudent"===e&&([v,o]=d(F,t)),v?a(h(r,i,v)+o+b(i,v)):a('<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No events found.</p></div>')}p.eventsPublic&&S(p.eventsPublic,""),p.eventsStaff&&S(p.eventsStaff,""),p.eventsArt&&S(p.eventsArt,""),p.eventsWebinars&&S(p.eventsWebinars,""),p.eventsPublicFilters&&p.eventsPublicFilters.querySelector("input[type=radio]")&&(p.eventsPublicFilters.querySelector("input[type=radio]").checked=!0),p.eventsStaffFilters&&p.eventsStaffFilters.querySelector("input[type=radio]")&&(p.eventsStaffFilters.querySelector("input[type=radio]").checked=!0),p.eventsArchiveFilters&&p.eventsArchiveFilters.querySelector("input[type=radio]")&&(p.eventsArchiveFilters.querySelector("input[type=radio]").checked=!0),p.eventsArtFilters&&p.eventsArtFilters.querySelector("input[type=radio]")&&(p.eventsArtFilters.querySelector("input[type=radio]").checked=!0),p.eventsWebinarsFilters&&p.eventsWebinarsFilters.querySelector("input[type=radio]")&&(p.eventsWebinarsFilters.querySelector("input[type=radio]").checked=!0);e="dev"===(t=UoS_env.name)?"../index.json":"preview"===t||"appdev-preview"===t?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";stir.getJSON(e,e=>{if(!e.error){var t,s,r,i,e=e.filter(e=>e.id);y.set("page","1"),p.eventsStaff&&j("all",p.eventsStaff,F,e),p.eventsPublic&&j("all",p.eventsPublic,x,e),p.eventsArt&&j("all",p.eventsArt,w,e),p.eventsWebinars&&j("all",p.eventsWebinars,T,e),te("all",e),t=e,s=stir.filter(P,t),s=stir.map(Y(s)),r=stir.sort(Z),i=S(p.eventsPromo),stir.pipe(D,W,r,B,R,s,A,i)(t),l.querySelector("[role=tab]")&&l.querySelector("[role=tab]").click(),window.scrollTo(0,0),stir.each(e=>{e.addEventListener("click",e=>{y.set("page","1")})},p.stirTabs),p.eventsPublicTab&&a(p.eventsPublicTab,p.eventsPublicFilters,p.eventsPublic,x,j,e),p.eventsArtTab&&a(p.eventsArtTab,p.eventsArtFilters,p.eventsArt,w,j,e),p.eventsWebinarsTab&&a(p.eventsWebinarsTab,p.eventsWebinarsFilters,p.eventsWebinars,T,j,e),p.eventsStaffTab&&a(p.eventsStaffTab,p.eventsStaffFilters,p.eventsStaff,F,j,e),a(p.eventsArchiveTab,p.eventsArchiveFilters,null,null,(e,t,s,r)=>te(e,r),e);const n=e=>{var t=stir.favourites.getFav(e,"event"),s=stir.node("#favbtns"+e);s&&S(s)(f("true",t,e))};function a(e,s,r,i,a,n){e.addEventListener("click",e=>{var t=Number(y.get("page"))||1;"radio"===e.target.type&&(y.set("page","1"),a(s.querySelector("input:checked").value,r,i,n)),"submit"===e.target.type&&(S(e.target.closest(".loadmorebtn"),""),y.set("page",String(t+1)),a(s.querySelector("input:checked").value,r,i,n))})}stir.node("main").addEventListener("click",e=>{e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,"event"),n(e.dataset.id)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),n(e.dataset.id))})}})}(stir.node("#eventsrevamp"));