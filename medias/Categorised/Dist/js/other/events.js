!function(){if(stir.node("#eventsrevamp")){const p=10;var e=stir.node("[data-tags]")||"",e=e?e.dataset.tags:"";const L=stir.node("#eventspublic"),M=stir.node("#eventsstaff"),W=stir.node("#eventsarchive");var t=stir.node("#eventspromo");const s=stir.node("#eventspublicfilters"),i=stir.node("#eventsstafffilters"),a=stir.node("#eventsarchivefilters"),C=stir.node("#eventspublictab"),Y=stir.node("#eventsstafftab"),H=stir.node("#eventsarchivetab"),A=stir.nodes(".stir-tabs__tab"),n=(e,t)=>`<div class="c-search-result__image"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,l=e=>`<div class="c-search-result__tags">
                <span class="c-search-tag">${e}</span>
            </div>`,m=()=>'<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No more events found</p></div>',o=(e,t,r)=>e===t?"":`– <time datetime="${t}">${r}</time>`,c=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",u=e=>e.isSeries?"":`<div class="flex-container u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
        </div>`,g=(t,e)=>{e=e.filter(e=>e.isSeries===t);return`<p class="text-sm">Part of the ${e.length?`<a href="${e[0].url}">${e[0].title}</a>`:t} series.</p>`},v=stir.curry((e,t)=>{return`
            <div class="u-border-width-5 u-heritage-line-left c-search-result  ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${r=t,console.log(r),r.pin<1?'data-label-icon="pin"':"Webinar"===r.type?'data-label-icon="computer"':r.isSeries?'data-label-icon="startdates"':""} data-perf="${t.perfId}" >
                ${r=t,"Webinar"===r.type?l("Webinar"):r.isSeries?l("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                      ${c(t.cancelled)} ${c(t.rescheduled)} 
                        <strong>${r=t,r.url?` <a href="${r.url}">${"Webinar"===r.type?"Webinar: ":""}${r.title}</a>`:("Webinar"===r.type?"Webinar: ":"")+r.title} </strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${t.start}">${t.stirStart}</time> ${o(t.start,t.end,t.stirEnd)}</span>
                        </div>
                        ${u(t)}
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"} "></span>
                            <span>${t.location}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${t.summary}</p>
                    ${t.isSeriesChild?g(t.isSeriesChild,e):""}
                </div>
                ${t.image?n(t.image,t.title):""}  
            </div>`;var r}),J=stir.curry((e,t)=>`
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell u-p-2 small-12 ${t.image?"medium-8":""} ">
                ${t.isSeries?l("Event series"):""}
                <p class="u-text-regular u-mb-2">
                ${c(t.cancelled)} ${c(t.rescheduled)} <strong><a href="${t.url}">${t.title}</a></strong>
                </p>
                <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span><time datetime="${t.start}">${t.stirStart}</time> ${o(t.start,t.end,t.stirEnd)}</span>
                    </div>
                    ${u(t)}
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                        <span>${t.location}</span>
                    </div>
                </div>
                <p class="u-m-0 text-sm">${t.summary}</p>
                ${t.isSeriesChild?g(t.isSeriesChild,e):""}
            </div>
            ${t.image?`<div class="cell medium-4"><img src="${t.image}" class="u-object-cover" width="800" height="800" alt="Image: ${t.title}" /></div>`:""}  
        </div>`),R=stir.curry((e,t)=>`
            <div class="u-border-width-5 u-heritage-line-left c-search-result ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event"  >
                ${t.recording?l("Recording available"):""} 
                ${t.isSeries?l("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                        <strong><a href="${t.url}">${t.title}</a></strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${t.start}">${t.stirStart}</time> ${o(t.start,t.end,t.stirEnd)}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${t.summary}</p>
                    ${t.isSeriesChild?g(t.isSeriesChild,e):""}
                </div>
                ${t.image?n(t.image,t.title):""}  
            </div>`),h=(e,t)=>t<=e?"":'<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',f=(e,t,r)=>e<2?"":`<div class="flex-container align-center u-mb-2">Showing ${e+1}-${r<t?r:t} of ${r} results</div>`,b=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),y=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),U=b(t),$=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))};const S=stir.filter(e=>e.audience.includes("Public")),x=stir.filter(e=>e.audience.includes("Staff")||e.audience.includes("Student"));const w=stir.filter(e=>Number(e.endInt)<$()&&e.archive.length&&!e.hideFromFeed.length);const D=stir.filter(e=>Number(e.endInt)>=$()&&!e.hideFromFeed.length);const z=stir.filter(e=>e.eventPromo),I=stir.join(""),B=stir.filter((e,t)=>0===t),N=(e,t)=>Number(e.startInt)-Number(t.startInt),P=(e,t)=>Number(t.startInt)-Number(e.startInt),k=(e,t)=>Number(e.pin)-Number(t.pin),G=stir.filter(e=>e.recording),_=stir.filter(e=>e.isSeries.length),Q=stir.curry((e,t,r)=>{e=t*(e-1);return e<=r&&r<e+t});t=stir.curry((t,r)=>{var s={},i=[];for(let e=0;e<r.length;e++)s[r[e][t]]||(s[r[e][t]]=!0,i.push(r[e]));return i});const K=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),T=(e,t)=>{var r=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))r.push(new Date(d).toISOString().split("T")[0]);return r},V=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},X=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},Z=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},ee=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},te=e=>"thisweek"===e?T(V().start,V().end):"nextweek"===e?T(X().start,X().end):"thismonth"===e?T(Z().start,Z().end):"nextmonth"===e?T(ee().start,ee().end):null,re=stir.curry((t,e)=>{e=T(e.start,e.end).map(e=>K(t,e));return stir.any(e=>e,e)});var r=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const r=t.tags.split(", ");e=e.map(e=>r.includes(e));return stir.all(e=>e,e)?t:void 0});const O=stir.filter(r(e)),E=t("perfId"),q=(e,t)=>{e=te(e);const r=Number(QueryParams.get("page"))||1;var s,i,a=p*(r-1),n=a+p,l=stir.compose(_)(t),l=stir.map(v(l)),o=(1===r?b:y)(L),c=stir.filter((e,t)=>{if(Q(r,p,t))return e});e?(e=re(e),e=stir.filter(e,t),e=stir.compose(stir.sort(k),stir.sort(N),S,O,E,D)(e),s=stir.compose(I,l,c)(e),i=e.length,e.length?o(f(a,n,i)+s+h(n,i)):o(m())):(e=stir.compose(stir.sort(k),stir.sort(N),S,O,E,D)(t),s=stir.compose(I,l,c)(e),i=e.length,e.length?o(f(a,n,i)+s+h(n,i)):o(m()))},F=(e,t)=>{e=te(e);const r=Number(QueryParams.get("page"))||1;var s,i,a=p*(r-1),n=a+p,l=stir.compose(_)(t),l=stir.map(v(l)),o=(1===r?b:y)(M),c=stir.filter((e,t)=>{if(Q(r,p,t))return e});e?(e=re(e),e=stir.filter(e,t),e=stir.compose(stir.sort(k),stir.sort(N),x,O,E,D)(e),s=stir.compose(I,l,c)(e),i=e.length,e.length?o(f(a,n,i)+s+h(n,i)):o(m())):(e=stir.compose(stir.sort(k),stir.sort(N),x,O,E,D)(t),s=stir.compose(I,l,c)(e),i=e.length,e.length?o(f(a,n,i)+s+h(n,i)):o(m()))},j=(e,t)=>{const r=Number(QueryParams.get("page"))||1;var s,i,a,n=p*(r-1),l=n+p,o=stir.compose(_)(t),o=stir.map(R(o)),c=(1===r?b:y)(W),u=stir.filter((e,t)=>{if(Q(r,p,t))return e});"all"===e&&(s=stir.compose(stir.sort(P),O,w)(t),i=stir.compose(I,o,u)(s),a=s.length,s.length?c(f(n,l,a)+i+h(l,a)):c(m())),"recordings"===e&&(s=stir.compose(stir.sort(P),G,O,w)(t),i=stir.compose(I,o,u)(s),a=s.length,s.length?c(f(n,l,a)+i+h(l,a)):c(m())),"public"===e&&(s=stir.compose(stir.sort(P),S,O,w)(t),i=stir.compose(I,o,u)(s),a=s.length,s.length?c(f(n,l,a)+i+h(l,a)):c(m())),"staffstudent"===e&&(s=stir.compose(stir.sort(P),x,O,w)(t),i=stir.compose(I,o,u)(s),a=s.length,s.length?c(f(n,l,a)+i+h(l,a)):c(m()))};s.querySelector("input[type=radio]").checked=!0,i.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0;e="dev"===(r=UoS_env.name)?"../index.json":"preview"===r||"appdev-preview"===r?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";stir.getJSON(e,e=>{if(!e.error){const r=e.filter(e=>e.id);var t;QueryParams.set("page",1),q("all",r),F("all",r),j("all",r),e=r,t=stir.filter(_,e),t=J(t),stir.compose(U,I,stir.map(t),B,z,stir.sort(N),O,D)(e),stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},A),C.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),q(s.querySelector("input:checked").value,r)),"submit"===e.target.type&&(b(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),q(s.querySelector("input:checked").value,r))}),Y.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),F(i.querySelector("input:checked").value,r)),"submit"===e.target.type&&(b(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),F(i.querySelector("input:checked").value,r))}),H.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),j(a.querySelector("input:checked").value,r)),"submit"===e.target.type&&(b(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),j(a.querySelector("input:checked").value,r))})}})}}();