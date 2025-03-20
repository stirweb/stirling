!function(){if(stir.node("#eventsrevamp")){const c=10;var e=stir.node("[data-tags]")||"",e=e?e.dataset.tags:"";const v={eventsPublic:stir.node("#eventspublic"),eventsStaff:stir.node("#eventsstaff"),eventsArt:stir.node("#eventsart"),eventsWebinars:stir.node("#eventswebinars"),eventsArchive:stir.node("#eventsarchive"),eventsPromo:stir.node("#eventspromo"),eventsPublicFilters:stir.node("#eventspublicfilters"),eventsStaffFilters:stir.node("#eventsstafffilters"),eventsArtFilters:stir.node("#eventsartfilters"),eventsWebinarsFilters:stir.node("#eventswebinarsfilters"),eventsArchiveFilters:stir.node("#eventsarchivefilters"),eventsPublicTab:stir.node("#eventspublictab"),eventsStaffTab:stir.node("#eventsstafftab"),eventsArtTab:stir.node("#eventsarttab"),eventsWebinarsTab:stir.node("#eventswebinarstab"),eventsArchiveTab:stir.node("#eventsarchivetab"),stirTabs:stir.nodes(".stir-tabs__tab")},i=(e,t)=>`<div class="u-mt-1"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,l=e=>`<div class="u-absolute u-top--16">
                <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">${e}</span>
            </div>`,p=e=>`<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">${e}</p></div>`,u=(e,t,s)=>e===t?"":`– <time datetime="${t}">${s}</time>`,o=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",g=e=>e.isSeries?"":`<div class="u-flex u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
        </div>`,m=(t,e)=>{e=e.filter(e=>e.isSeries===t);return`<p class="text-sm">Part of the ${e.length?`<a href="${e[0].url}">${e[0].title}</a>`:t} series.</p>`},f=(e,t,s)=>t.length?stir.favourites.renderRemoveBtn(s,t[0].date,e):stir.favourites.renderAddBtn(s,e),C=stir.curry((e,t)=>{var s,r=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`
            <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event" ${s=t,s.pin<1?'data-label-icon="pin"':"Webinar"===s.type?'data-label-icon="computer"':s.isSeries?'data-label-icon="startdates"':""} data-perf="${t.perfId}" >
                ${s=t,"Webinar"===s.type?l("Webinar"):s.isSeries?l("Event series"):""} 
                <div class="u-grid-medium-up u-gap-24 ${t.image?"u-grid-cols-3_1":""} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1" >
                      <p class="u-text-regular u-m-0">
                        ${o(t.cancelled)} ${o(t.rescheduled)} 
                          <strong>${s=t,s.url?` <a href="${s.url}">${"Webinar"===s.type?"Webinar: ":""}${s.title}</a>`:("Webinar"===s.type?"Webinar: ":"")+s.title} </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${t.start}">${t.stirStart}</time> ${u(t.start,t.end,t.stirEnd)}</span>
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
                ${t.image?i(t.image,t.title):""} 
                 </div>
                  <div class="u-mt-2" id="favbtns${t.sid}">${r&&f("true",r,t.sid)}</div>
            </div>`}),j=stir.curry((e,t)=>`
            <div class="u-border-width-5 u-heritage-line-left  u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event"  >
                ${t.recording?l("Recording available"):""} 
                ${t.isSeries?l("Event series"):""} 
                
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
                  ${t.image?i(t.image,t.title):""}  
                </div>
            </div>`),M=stir.curry((e,t)=>{var s=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${t.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?l("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${o(t.cancelled)} ${o(t.rescheduled)} <strong><a href="${t.url}">${t.title}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span><time datetime="${t.start}">${t.stirStart}</time> ${u(t.start,t.end,t.stirEnd)}</span>
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
        </div>`}),b=(e,t)=>t<=e?"":'<div class="loadmorebtn u-flex align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',h=(e,t,s)=>e<2?"":`<div class="u-flex align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`,y=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),S=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),s=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))};const $=stir.filter(e=>e.audience.includes("Public")&&!e.tags.includes("Art Collection")&&!e.type.includes("Webinar")),x=stir.filter(e=>{return((t=e).audience.includes("Staff")||t.audience.includes("Student"))&&!e.audience.includes("Public")&&!e.tags.includes("Art Collection");var t});const P=stir.filter(e=>e.tags&&e.tags.includes("Art Collection"));const F=stir.filter(e=>e.type&&e.type.includes("Webinar"));const w=stir.filter(e=>Number(e.endInt)<s()&&e.archive.length&&!e.hideFromFeed.length);const T=stir.filter(e=>Number(e.endInt)>=s()&&!e.hideFromFeed.length);const _=stir.filter(e=>e.eventPromo),D=stir.join(""),Y=stir.filter((e,t)=>0===t),H=(e,t)=>Number(e.startInt)-Number(t.startInt),k=(e,t)=>Number(t.startInt)-Number(e.startInt),A=(e,t)=>e.pin!==t.pin?e.pin-t.pin:Number(e.startInt)-Number(t.startInt),B=stir.filter(e=>e.recording),N=stir.filter(e=>e.isSeries.length),I=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t});var r=stir.curry((t,s)=>{var r={},i=[];for(let e=0;e<s.length;e++)r[s[e][t]]||(r[s[e][t]]=!0,i.push(s[e]));return i});const R=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),W=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},Q=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},q=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},E=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},O=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},J=stir.curry((t,e)=>{e=W(e.start,e.end).map(e=>R(t,e));return stir.any(e=>e,e)});var t=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const s=t.tags.split(", ");e=e.map(e=>s.includes(e));return stir.all(e=>e,e)?t:void 0});const L=stir.filter(t(e)),U=r("perfId");y(v.eventsPublic,""),y(v.eventsStaff,""),y(v.eventsArt,""),y(v.eventsWebinars,""),v.eventsPublicFilters.querySelector("input[type=radio]").checked=!0,v.eventsStaffFilters.querySelector("input[type=radio]").checked=!0,v.eventsArchiveFilters.querySelector("input[type=radio]").checked=!0,v.eventsArtFilters.querySelector("input[type=radio]").checked=!0,v.eventsWebinarsFilters.querySelector("input[type=radio]").checked=!0;e="dev"===(t=UoS_env.name)?"../index.json":"preview"===t||"appdev-preview"===t?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";function a(e,t,s,r){e="thisweek"===(e=e)?W(Q().start,Q().end):"nextweek"===e?W(q().start,q().end):"thismonth"===e?W(E().start,E().end):"nextmonth"===e?W(O().start,O().end):null;const i=Number(QueryParams.get("page"))||1;var a=c*(i-1),n=a+c,l=stir.compose(N)(r),l=stir.map(C(l)),t=(1===i?y:S)(t),u=stir.filter((e,t)=>{if(I(i,c,t))return e});if(e){var e=J(e),e=stir.filter(e,r),e=stir.compose(stir.sort(A),s,L,U,T)(e),d=stir.compose(D,l,u)(e);const o=e.length;e.length?t(h(a,n,o)+d+b(n,o)):t(p("No events found. Try the staff and student events tab."))}else{console.log("sorting");e=stir.compose(stir.sort(A),s,L,U,T)(r),d=stir.compose(D,l,u)(e);const o=e.length;void(e.length?t(h(a,n,o)+d+b(n,o)):t(p("No events found. Try the staff and student events tab.")))}}function n(e,t){const s=Number(QueryParams.get("page"))||1;var r,i,a,n=c*(s-1),l=n+c,u=stir.compose(N)(t),u=stir.map(j(u)),d=(1===s?y:S)(v.eventsArchive),o=stir.filter((e,t)=>{if(I(s,c,t))return e});"all"===e&&(r=stir.compose(stir.sort(k),L,w)(t),i=stir.compose(D,u,o)(r),a=r.length,r.length?d(h(n,l,a)+i+b(l,a)):d(p("No events found."))),"recordings"===e&&(r=stir.compose(stir.sort(k),B,L,w)(t),i=stir.compose(D,u,o)(r),a=r.length,r.length?d(h(n,l,a)+i+b(l,a)):d(p("No events found."))),"public"===e&&(r=stir.compose(stir.sort(k),$,L,w)(t),i=stir.compose(D,u,o)(r),a=r.length,r.length?d(h(n,l,a)+i+b(l,a)):d(p("No events found."))),"staffstudent"===e&&(r=stir.compose(stir.sort(k),x,L,w)(t),i=stir.compose(D,u,o)(r),a=r.length,r.length?d(h(n,l,a)+i+b(l,a)):d(p("No events found.")))}stir.getJSON(e,e=>{if(!e.error){const r=e.filter(e=>e.id);var t,s;QueryParams.set("page",1),a("all",v.eventsStaff,x,r),a("all",v.eventsPublic,$,r),a("all",v.eventsArt,P,r),a("all",v.eventsWebinars,F,r),n("all",r),e=r,t=stir.filter(N,e),t=M(t),s=y(v.eventsPromo),stir.compose(s,D,stir.map(t),Y,_,stir.sort(H),L,T)(e);const i=e=>{var t=stir.favourites.getFav(e,"event"),s=stir.node("#favbtns"+e);s&&y(s)(f("true",t,e))};stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},v.stirTabs),v.eventsPublicTab.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),a(v.eventsPublicFilters.querySelector("input:checked").value,v.eventsPublic,$,r)),"submit"===e.target.type&&(y(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),a(v.eventsPublicFilters.querySelector("input:checked").value,v.eventsPublic,$,r))}),v.eventsArtTab.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),a(v.eventsArtFilters.querySelector("input:checked").value,v.eventsArt,P,r)),"submit"===e.target.type&&(y(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),a(v.eventsArtFilters.querySelector("input:checked").value,v.eventsArt,P,r))}),v.eventsWebinarsTab.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),a(v.eventsWebinarsFilters.querySelector("input:checked").value,v.eventsWebinars,F,r)),"submit"===e.target.type&&(y(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),a(v.eventsWebinarsFilters.querySelector("input:checked").value,v.eventsWebinars,F,r))}),v.eventsStaffTab.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),a(v.eventsStaffFilters.querySelector("input:checked").value,v.eventsStaff,x,r)),"submit"===e.target.type&&(y(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),a(v.eventsStaffFilters.querySelector("input:checked").value,v.eventsStaff,x,r))}),v.eventsArchiveTab.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),n(v.eventsArchiveFilters.querySelector("input:checked").value,r)),"submit"===e.target.type&&(y(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),n(v.eventsArchiveFilters.querySelector("input:checked").value,r))}),stir.node("main").addEventListener("click",e=>{var e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,"event"),i(e.dataset.id)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),i(e.dataset.id),"managefavs"===consts.activity)&&(e=stir.node("#fav-"+e.dataset.id))&&y(e)("")})}})}}();