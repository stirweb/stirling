!function(){if(stir.node("#eventsrevamp")){const c=10;var e=stir.node("[data-tags]")||"",e=e?e.dataset.tags:"";const o=stir.node("#eventspublic"),p=stir.node("#eventsstaff"),M=stir.node("#eventsarchive");var t=stir.node("#eventspromo");const i=stir.node("#eventspublicfilters"),a=stir.node("#eventsstafffilters"),n=stir.node("#eventsarchivefilters"),W=stir.node("#eventspublictab"),C=stir.node("#eventsstafftab"),_=stir.node("#eventsarchivetab"),Y=stir.nodes(".stir-tabs__tab"),l=(e,t)=>`<div class="u-mt-1"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,u=e=>`<div class="u-absolute u-top--16">
                <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">${e}</span>
            </div>`,m=e=>`<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">${e}</p></div>`,v=(e,t,s)=>e===t?"":`– <time datetime="${t}">${s}</time>`,g=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",H=e=>e.isSeries?"":`<div class="u-flex u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
        </div>`,f=(t,e)=>{e=e.filter(e=>e.isSeries===t);return`<p class="text-sm">Part of the ${e.length?`<a href="${e[0].url}">${e[0].title}</a>`:t} series.</p>`},h=(e,t,s)=>t.length?stir.favourites.renderRemoveBtn(s,t[0].date,e):stir.favourites.renderAddBtn(s,e),A=stir.curry((e,t)=>{var s,r=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`
            <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event" ${s=t,s.pin<1?'data-label-icon="pin"':"Webinar"===s.type?'data-label-icon="computer"':s.isSeries?'data-label-icon="startdates"':""} data-perf="${t.perfId}" >
                ${s=t,"Webinar"===s.type?u("Webinar"):s.isSeries?u("Event series"):""} 
                <div class="u-grid-medium-up u-gap-24 ${t.image?"u-grid-cols-3_1":""} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1" >
                      <p class="u-text-regular u-m-0">
                        ${g(t.cancelled)} ${g(t.rescheduled)} 
                          <strong>${s=t,s.url?` <a href="${s.url}">${"Webinar"===s.type?"Webinar: ":""}${s.title}</a>`:("Webinar"===s.type?"Webinar: ":"")+s.title} </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${t.start}">${t.stirStart}</time> ${v(t.start,t.end,t.stirEnd)}</span>
                          </div>
                          ${H(t)}
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"} "></span>
                              <span>${t.location}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${t.summary}</p>
                      ${t.isSeriesChild?f(t.isSeriesChild,e):""}
                  </div>
                ${t.image?l(t.image,t.title):""} 
                 </div>
                  <div class="u-mt-2" id="favbtns${t.sid}">${r&&h("true",r,t.sid)}</div>
            </div>`}),B=stir.curry((e,t)=>`
            <div class="u-border-width-5 u-heritage-line-left  u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event"  >
                ${t.recording?u("Recording available"):""} 
                ${t.isSeries?u("Event series"):""} 
                
                <div class="u-grid-medium-up u-gap-24 ${t.image?"u-grid-cols-3_1":""} ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                      <p class="u-text-regular u-m-0">
                          <strong><a href="${t.url}">${t.title}</a></strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${t.start}">${t.stirStart}</time> ${v(t.start,t.end,t.stirEnd)}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${t.summary}</p>
                      ${t.isSeriesChild?f(t.isSeriesChild,e):""}
                  </div>
                  ${t.image?l(t.image,t.title):""}  
                </div>
            </div>`),R=stir.curry((e,t)=>{var s=stir.favourites&&stir.favourites.getFav(t.sid,"event");return`
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${t.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?u("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${g(t.cancelled)} ${g(t.rescheduled)} <strong><a href="${t.url}">${t.title}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span><time datetime="${t.start}">${t.stirStart}</time> ${v(t.start,t.end,t.stirEnd)}</span>
                      </div>
                      ${H(t)}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                          <span>${t.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${t.summary}</p>
                  ${t.isSeriesChild?f(t.isSeriesChild,e):""}
                 </div>
                  <div id="favbtns${t.sid}">${s&&h("true",s,t.sid)}</div>
                </div>
            </div>
            ${t.image?`<div class="cell medium-4"><img src="${t.image}" class="u-object-cover" width="800" height="800" alt="Image: ${t.title}" /></div>`:""}  
        </div>`}),b=(e,t)=>t<=e?"":'<div class="loadmorebtn u-flex align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',y=(e,t,s)=>e<2?"":`<div class="u-flex align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`,$=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),S=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),J=$(t),U=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))};const x=stir.filter(e=>e.audience.includes("Public")),w=stir.filter(e=>e.audience.includes("Staff")||e.audience.includes("Student"));const D=stir.filter(e=>Number(e.endInt)<U()&&e.archive.length&&!e.hideFromFeed.length);const N=stir.filter(e=>Number(e.endInt)>=U()&&!e.hideFromFeed.length);const z=stir.filter(e=>e.eventPromo),I=stir.join(""),G=stir.filter((e,t)=>0===t),T=(e,t)=>Number(e.startInt)-Number(t.startInt),k=(e,t)=>Number(t.startInt)-Number(e.startInt),P=(e,t)=>Number(e.pin)-Number(t.pin),K=stir.filter(e=>e.recording),F=stir.filter(e=>e.isSeries.length),Q=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t});t=stir.curry((t,s)=>{var r={},i=[];for(let e=0;e<s.length;e++)r[s[e][t]]||(r[s[e][t]]=!0,i.push(s[e]));return i});const V=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),r=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},X=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},Z=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},ee=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},te=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},se=e=>"thisweek"===e?r(X().start,X().end):"nextweek"===e?r(Z().start,Z().end):"thismonth"===e?r(ee().start,ee().end):"nextmonth"===e?r(te().start,te().end):null,re=stir.curry((t,e)=>{e=r(e.start,e.end).map(e=>V(t,e));return stir.any(e=>e,e)});var s=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const s=t.tags.split(", ");e=e.map(e=>s.includes(e));return stir.all(e=>e,e)?t:void 0});const E=stir.filter(s(e)),O=t("perfId"),q=(e,t)=>{e=se(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=c*(s-1),n=a+c,l=stir.compose(F)(t),l=stir.map(A(l)),u=(1===s?$:S)(o),d=stir.filter((e,t)=>{if(Q(s,c,t))return e});e?(e=re(e),e=stir.filter(e,t),e=stir.compose(stir.sort(P),stir.sort(T),x,E,O,N)(e),r=stir.compose(I,l,d)(e),i=e.length,e.length?u(y(a,n,i)+r+b(n,i)):u(m("No events found. Try the staff and student events tab."))):(e=stir.compose(stir.sort(P),stir.sort(T),x,E,O,N)(t),r=stir.compose(I,l,d)(e),i=e.length,e.length?u(y(a,n,i)+r+b(n,i)):u(m("No events found. Try the staff and student events tab.")))},L=(e,t)=>{e=se(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=c*(s-1),n=a+c,l=stir.compose(F)(t),l=stir.map(A(l)),u=(1===s?$:S)(p),d=stir.filter((e,t)=>{if(Q(s,c,t))return e});e?(e=re(e),e=stir.filter(e,t),e=stir.compose(stir.sort(P),stir.sort(T),w,E,O,N)(e),r=stir.compose(I,l,d)(e),i=e.length,e.length?u(y(a,n,i)+r+b(n,i)):u(m("No events found. Try the public events tab."))):(e=stir.compose(stir.sort(P),stir.sort(T),w,E,O,N)(t),r=stir.compose(I,l,d)(e),i=e.length,e.length?u(y(a,n,i)+r+b(n,i)):u(m("No events found. Try the public events tab.")))},j=(e,t)=>{const s=Number(QueryParams.get("page"))||1;var r,i,a,n=c*(s-1),l=n+c,u=stir.compose(F)(t),u=stir.map(B(u)),d=(1===s?$:S)(M),o=stir.filter((e,t)=>{if(Q(s,c,t))return e});"all"===e&&(r=stir.compose(stir.sort(k),E,D)(t),i=stir.compose(I,u,o)(r),a=r.length,r.length?d(y(n,l,a)+i+b(l,a)):d(m("No events found."))),"recordings"===e&&(r=stir.compose(stir.sort(k),K,E,D)(t),i=stir.compose(I,u,o)(r),a=r.length,r.length?d(y(n,l,a)+i+b(l,a)):d(m("No events found."))),"public"===e&&(r=stir.compose(stir.sort(k),x,E,D)(t),i=stir.compose(I,u,o)(r),a=r.length,r.length?d(y(n,l,a)+i+b(l,a)):d(m("No events found."))),"staffstudent"===e&&(r=stir.compose(stir.sort(k),w,E,D)(t),i=stir.compose(I,u,o)(r),a=r.length,r.length?d(y(n,l,a)+i+b(l,a)):d(m("No events found.")))};$(o,""),$(p,""),i.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0,n.querySelector("input[type=radio]").checked=!0;e="dev"===(s=UoS_env.name)?"../index.json":"preview"===s||"appdev-preview"===s?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";stir.getJSON(e,e=>{if(!e.error){const s=e.filter(e=>e.id);var t;QueryParams.set("page",1),q("all",s),L("all",s),j("all",s),e=s,t=stir.filter(F,e),t=R(t),stir.compose(J,I,stir.map(t),G,z,stir.sort(T),E,N)(e);const r=e=>{var t=stir.favourites.getFav(e,"event"),s=stir.node("#favbtns"+e);s&&$(s)(h("true",t,e))};stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},Y),W.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),q(i.querySelector("input:checked").value,s)),"submit"===e.target.type&&($(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),q(i.querySelector("input:checked").value,s))}),C.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),L(a.querySelector("input:checked").value,s)),"submit"===e.target.type&&($(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),L(a.querySelector("input:checked").value,s))}),_.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),j(n.querySelector("input:checked").value,s)),"submit"===e.target.type&&($(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),j(n.querySelector("input:checked").value,s))}),stir.node("main").addEventListener("click",e=>{var e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,"event"),r(e.dataset.id)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),r(e.dataset.id),"managefavs"===consts.activity)&&(e=stir.node("#fav-"+e.dataset.id))&&$(e)("")})}})}}();