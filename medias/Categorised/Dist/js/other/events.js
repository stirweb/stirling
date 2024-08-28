!function(){if(stir.node("#eventsrevamp")){const c=10;var e=stir.node("[data-tags]")||"",e=e?e.dataset.tags:"";const p=stir.node("#eventspublic"),m=stir.node("#eventsstaff"),M=stir.node("#eventsarchive");var t=stir.node("#eventspromo");const r=stir.node("#eventspublicfilters"),i=stir.node("#eventsstafffilters"),a=stir.node("#eventsarchivefilters"),W=stir.node("#eventspublictab"),C=stir.node("#eventsstafftab"),_=stir.node("#eventsarchivetab"),Y=stir.nodes(".stir-tabs__tab"),n=(e,t)=>`<div class="u-mt-1"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,l=e=>`<div class="u-absolute u-top--16">
                <span class="c-search-tag">${e}</span>
            </div>`,g=e=>`<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">${e}</p></div>`,u=(e,t,s)=>e===t?"":`– <time datetime="${t}">${s}</time>`,o=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",v=e=>e.isSeries?"":`<div class="u-flex u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
        </div>`,h=(t,e)=>{e=e.filter(e=>e.isSeries===t);return`<p class="text-sm">Part of the ${e.length?`<a href="${e[0].url}">${e[0].title}</a>`:t} series.</p>`},H=stir.curry((e,t)=>{return`
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
                          ${v(t)}
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"} "></span>
                              <span>${t.location}</span>
                          </div>
                      </div>
                      <p class="u-m-0">${t.summary}</p>
                      ${t.isSeriesChild?h(t.isSeriesChild,e):""}
                  </div>
                ${t.image?n(t.image,t.title):""}  
                </div>
            </div>`;var s}),A=stir.curry((e,t)=>`
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
                      ${t.isSeriesChild?h(t.isSeriesChild,e):""}
                  </div>
                  ${t.image?n(t.image,t.title):""}  
                </div>
            </div>`),J=stir.curry((e,t)=>`
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${t.image?"medium-8":""} ">
                <div class=" u-p-2">
                  ${t.isSeries?l("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${o(t.cancelled)} ${o(t.rescheduled)} <strong><a href="${t.url}">${t.title}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span><time datetime="${t.start}">${t.stirStart}</time> ${u(t.start,t.end,t.stirEnd)}</span>
                      </div>
                      ${v(t)}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                          <span>${t.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${t.summary}</p>
                  ${t.isSeriesChild?h(t.isSeriesChild,e):""}
                </div>
            </div>
            ${t.image?`<div class="cell medium-4"><img src="${t.image}" class="u-object-cover" width="800" height="800" alt="Image: ${t.title}" /></div>`:""}  
        </div>`),f=(e,t)=>t<=e?"":'<div class="loadmorebtn u-flex align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',b=(e,t,s)=>e<2?"":`<div class="u-flex align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`,y=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),$=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),R=y(t),U=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))};const S=stir.filter(e=>e.audience.includes("Public")),x=stir.filter(e=>e.audience.includes("Staff")||e.audience.includes("Student"));const w=stir.filter(e=>Number(e.endInt)<U()&&e.archive.length&&!e.hideFromFeed.length);const D=stir.filter(e=>Number(e.endInt)>=U()&&!e.hideFromFeed.length);const z=stir.filter(e=>e.eventPromo),N=stir.join(""),B=stir.filter((e,t)=>0===t),I=(e,t)=>Number(e.startInt)-Number(t.startInt),T=(e,t)=>Number(t.startInt)-Number(e.startInt),P=(e,t)=>Number(e.pin)-Number(t.pin),G=stir.filter(e=>e.recording),k=stir.filter(e=>e.isSeries.length),Q=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t});t=stir.curry((t,s)=>{var r={},i=[];for(let e=0;e<s.length;e++)r[s[e][t]]||(r[s[e][t]]=!0,i.push(s[e]));return i});const K=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),O=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},V=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},X=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},Z=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},ee=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},te=e=>"thisweek"===e?O(V().start,V().end):"nextweek"===e?O(X().start,X().end):"thismonth"===e?O(Z().start,Z().end):"nextmonth"===e?O(ee().start,ee().end):null,se=stir.curry((t,e)=>{e=O(e.start,e.end).map(e=>K(t,e));return stir.any(e=>e,e)});var s=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const s=t.tags.split(", ");e=e.map(e=>s.includes(e));return stir.all(e=>e,e)?t:void 0});const E=stir.filter(s(e)),q=t("perfId"),F=(e,t)=>{e=te(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=c*(s-1),n=a+c,l=stir.compose(k)(t),l=stir.map(H(l)),u=(1===s?y:$)(p),o=stir.filter((e,t)=>{if(Q(s,c,t))return e});e?(e=se(e),e=stir.filter(e,t),e=stir.compose(stir.sort(P),stir.sort(I),S,E,q,D)(e),r=stir.compose(N,l,o)(e),i=e.length,e.length?u(b(a,n,i)+r+f(n,i)):u(g("No events found. Try the staff and student events tab."))):(e=stir.compose(stir.sort(P),stir.sort(I),S,E,q,D)(t),r=stir.compose(N,l,o)(e),i=e.length,e.length?u(b(a,n,i)+r+f(n,i)):u(g("No events found. Try the staff and student events tab.")))},j=(e,t)=>{e=te(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=c*(s-1),n=a+c,l=stir.compose(k)(t),l=stir.map(H(l)),u=(1===s?y:$)(m),o=stir.filter((e,t)=>{if(Q(s,c,t))return e});e?(e=se(e),e=stir.filter(e,t),e=stir.compose(stir.sort(P),stir.sort(I),x,E,q,D)(e),r=stir.compose(N,l,o)(e),i=e.length,e.length?u(b(a,n,i)+r+f(n,i)):u(g("No events found. Try the public events tab."))):(e=stir.compose(stir.sort(P),stir.sort(I),x,E,q,D)(t),r=stir.compose(N,l,o)(e),i=e.length,e.length?u(b(a,n,i)+r+f(n,i)):u(g("No events found. Try the public events tab.")))},L=(e,t)=>{const s=Number(QueryParams.get("page"))||1;var r,i,a,n=c*(s-1),l=n+c,u=stir.compose(k)(t),u=stir.map(A(u)),o=(1===s?y:$)(M),d=stir.filter((e,t)=>{if(Q(s,c,t))return e});"all"===e&&(r=stir.compose(stir.sort(T),E,w)(t),i=stir.compose(N,u,d)(r),a=r.length,r.length?o(b(n,l,a)+i+f(l,a)):o(g("No events found."))),"recordings"===e&&(r=stir.compose(stir.sort(T),G,E,w)(t),i=stir.compose(N,u,d)(r),a=r.length,r.length?o(b(n,l,a)+i+f(l,a)):o(g("No events found."))),"public"===e&&(r=stir.compose(stir.sort(T),S,E,w)(t),i=stir.compose(N,u,d)(r),a=r.length,r.length?o(b(n,l,a)+i+f(l,a)):o(g("No events found."))),"staffstudent"===e&&(r=stir.compose(stir.sort(T),x,E,w)(t),i=stir.compose(N,u,d)(r),a=r.length,r.length?o(b(n,l,a)+i+f(l,a)):o(g("No events found.")))};y(p,""),y(m,""),r.querySelector("input[type=radio]").checked=!0,i.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0;e="dev"===(s=UoS_env.name)?"../index.json":"preview"===s||"appdev-preview"===s?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";stir.getJSON(e,e=>{if(!e.error){const s=e.filter(e=>e.id);var t;QueryParams.set("page",1),F("all",s),j("all",s),L("all",s),e=s,t=stir.filter(k,e),t=J(t),stir.compose(R,N,stir.map(t),B,z,stir.sort(I),E,D)(e),stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},Y),W.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),F(r.querySelector("input:checked").value,s)),"submit"===e.target.type&&(y(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),F(r.querySelector("input:checked").value,s))}),C.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),j(i.querySelector("input:checked").value,s)),"submit"===e.target.type&&(y(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),j(i.querySelector("input:checked").value,s))}),_.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),L(a.querySelector("input:checked").value,s)),"submit"===e.target.type&&(y(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),L(a.querySelector("input:checked").value,s))})}})}}();