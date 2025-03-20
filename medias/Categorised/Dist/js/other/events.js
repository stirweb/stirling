!function(){if(stir.node("#eventsrevamp")){const c=10;var e=stir.node("[data-tags]")||"",e=e?e.dataset.tags:"";const v={eventsPublic:stir.node("#eventspublic"),eventsStaff:stir.node("#eventsstaff"),eventsArt:stir.node("#eventsart"),eventsWebinars:stir.node("#eventswebinars"),eventsArchive:stir.node("#eventsarchive"),eventsPromo:stir.node("#eventspromo"),eventsPublicFilters:stir.node("#eventspublicfilters"),eventsStaffFilters:stir.node("#eventsstafffilters"),eventsArtFilters:stir.node("#eventsartfilters"),eventsWebinarsFilters:stir.node("#eventswebinarsfilters"),eventsArchiveFilters:stir.node("#eventsarchivefilters"),eventsPublicTab:stir.node("#eventspublictab"),eventsStaffTab:stir.node("#eventsstafftab"),eventsArtTab:stir.node("#eventsarttab"),eventsWebinarsTab:stir.node("#eventswebinarstab"),eventsArchiveTab:stir.node("#eventsarchivetab"),stirTabs:stir.nodes(".stir-tabs__tab")},r=(e,t)=>`<div class="u-mt-1"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,a=e=>`<div class="u-absolute u-top--16">
                <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">${e}</span>
            </div>`,p=e=>`<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">${e}</p></div>`,n=(e,t,s)=>e===t?"":`– <time datetime="${t}">${s}</time>`,o=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",g=e=>e.isSeries?"":`<div class="u-flex u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
        </div>`,m=(t,e)=>{e=e.filter(e=>e.isSeries===t);return`<p class="text-sm">Part of the ${e.length?`<a href="${e[0].url}">${e[0].title}</a>`:t} series.</p>`},f=(e,t,s)=>t.length?stir.favourites.renderRemoveBtn(s,t[0].date,e):stir.favourites.renderAddBtn(s,e),b=stir.curry((e,t)=>{var s,i=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event" ${s=t,s.pin<1?'data-label-icon="pin"':"Webinar"===s.type?'data-label-icon="computer"':s.isSeries?'data-label-icon="startdates"':""} data-perf="${t.perfId}" >
                ${s=t,"Webinar"===s.type?a("Webinar"):s.isSeries?a("Event series"):""} 
                <div class="u-grid-medium-up u-gap-24 ${t.image?"u-grid-cols-3_1":""} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1" >
                      <p class="u-text-regular u-m-0">
                        ${o(t.cancelled)} ${o(t.rescheduled)} 
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
            </div>`}),h=stir.curry((e,t)=>`<div class="u-border-width-5 u-heritage-line-left  u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event"  >
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
            </div>`),M=stir.curry((e,t)=>{var s=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${t.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?a("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${o(t.cancelled)} ${o(t.rescheduled)} <strong><a href="${t.url}">${t.title}</a></strong>
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
        </div>`}),$=(e,t)=>t<=e?"":'<div class="loadmorebtn u-flex align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',y=(e,t,s)=>e<2?"":`<div class="u-flex align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`,S=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),x=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),s=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))};const w=stir.filter(e=>e.audience.includes("Public")&&!e.tags.includes("Art Collection")&&!e.type.includes("Webinar")),F=stir.filter(e=>{return((t=e).audience.includes("Staff")||t.audience.includes("Student"))&&!e.audience.includes("Public")&&!e.tags.includes("Art Collection");var t});const T=stir.filter(e=>e.tags&&e.tags.includes("Art Collection"));const D=stir.filter(e=>e.type&&e.type.includes("Webinar"));const Q=stir.filter(e=>Number(e.endInt)<s()&&e.archive.length&&!e.hideFromFeed.length);const I=stir.filter(e=>Number(e.endInt)>=s()&&!e.hideFromFeed.length);const L=stir.filter(e=>e.eventPromo),P=stir.join(""),_=stir.filter((e,t)=>0===t),Y=(e,t)=>Number(e.startInt)-Number(t.startInt),H=(e,t)=>Number(t.startInt)-Number(e.startInt),B=(e,t)=>e.pin!==t.pin?e.pin-t.pin:Number(e.startInt)-Number(t.startInt),R=stir.filter(e=>e.recording),J=e=>e,A=stir.filter(e=>e.isSeries.length),W=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t});var i=stir.curry((t,s)=>{var i={},r=[];for(let e=0;e<s.length;e++)i[s[e][t]]||(i[s[e][t]]=!0,r.push(s[e]));return r});const U=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),N=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},k=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},O=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},C=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},E=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},z=stir.curry((t,e)=>{e=N(e.start,e.end).map(e=>U(t,e));return stir.any(e=>e,e)});var t=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const s=t.tags.split(", ");e=e.map(e=>s.includes(e));return stir.all(e=>e,e)?t:void 0});const j=stir.filter(t(e)),q=i("perfId");S(v.eventsPublic,""),S(v.eventsStaff,""),S(v.eventsArt,""),S(v.eventsWebinars,""),v.eventsPublicFilters.querySelector("input[type=radio]").checked=!0,v.eventsStaffFilters.querySelector("input[type=radio]").checked=!0,v.eventsArchiveFilters.querySelector("input[type=radio]").checked=!0,v.eventsArtFilters.querySelector("input[type=radio]").checked=!0,v.eventsWebinarsFilters.querySelector("input[type=radio]").checked=!0;e="dev"===(t=UoS_env.name)?"../index.json":"preview"===t||"appdev-preview"===t?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";function l(e,t,s,i){e="thisweek"===(e=e)?N(k().start,k().end):"nextweek"===e?N(O().start,O().end):"thismonth"===e?N(C().start,C().end):"nextmonth"===e?N(E().start,E().end):null;const r=Number(QueryParams.get("page"))||1;var a=c*(r-1),n=a+c,l=stir.compose(A)(i),l=stir.map(b(l)),t=(1===r?S:x)(t),u=stir.sort(B),d=stir.filter((e,t)=>{if(W(r,c,t))return e});if(e){var e=z(e),e=stir.filter(e,i),e=stir.pipe(I,q,j,s,u)(e),v=stir.pipe(d,l,P)(e);const o=e.length;e.length?t(y(a,n,o)+v+$(n,o)):t(p("No events found. Try the staff and student events tab."))}else{e=stir.pipe(I,q,j,s,u)(i),v=stir.pipe(d,l,P)(e);const o=e.length;void(e.length?t(y(a,n,o)+v+$(n,o)):t(p("No events found. Try the staff and student events tab.")))}}function u(e,t){const s=Number(QueryParams.get("page"))||1,i=c*(s-1),r=i+c;var a=stir.compose(A)(t);const n=stir.map(h(a)),l=stir.sort(H),u=(1===s?S:x)(v.eventsArchive),d=stir.filter((e,t)=>{if(W(s,c,t))return e});a=(e,t)=>{var e=stir.pipe(Q,j,e,l)(t),t=stir.pipe(d,n,P)(e),s=e.length;e.length?u(y(i,r,s)+t+$(r,s)):u(p("No events found."))};"all"===e&&a(J,t),"recordings"===e&&a(R,t),"public"===e&&a(w,t),"staffstudent"===e&&a(F,t)}stir.getJSON(e,e=>{if(!e.error){var t,s,i,r,e=e.filter(e=>e.id);QueryParams.set("page",1),l("all",v.eventsStaff,F,e),l("all",v.eventsPublic,w,e),l("all",v.eventsArt,T,e),l("all",v.eventsWebinars,D,e),u("all",e),t=e,s=stir.filter(A,t),s=stir.map(M(s)),i=stir.sort(Y),r=S(v.eventsPromo),stir.pipe(I,j,i,L,_,s,P,r)(t),stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},v.stirTabs),a(v.eventsPublicTab,v.eventsPublicFilters,v.eventsPublic,w,l,e),a(v.eventsArtTab,v.eventsArtFilters,v.eventsArt,T,l,e),a(v.eventsWebinarsTab,v.eventsWebinarsFilters,v.eventsWebinars,D,l,e),a(v.eventsStaffTab,v.eventsStaffFilters,v.eventsStaff,F,l,e),a(v.eventsArchiveTab,v.eventsArchiveFilters,null,null,(e,t,s,i)=>u(e,i),e);const n=e=>{var t=stir.favourites.getFav(e,"event"),s=stir.node("#favbtns"+e);s&&S(s)(f("true",t,e))};function a(e,s,i,r,a,n){e.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),a(s.querySelector("input:checked").value,i,r,n)),"submit"===e.target.type&&(S(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),a(s.querySelector("input:checked").value,i,r,n))})}stir.node("main").addEventListener("click",e=>{var e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,"event"),n(e.dataset.id)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),n(e.dataset.id),"managefavs"===consts.activity)&&(e=stir.node("#fav-"+e.dataset.id))&&S(e)("")})}})}}();