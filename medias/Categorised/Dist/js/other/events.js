!function(){if(stir.node("#eventsrevamp")){const m=10;var e=stir.node("[data-tags]")||"",e=e?e.dataset.tags:"";const Y=stir.node("#eventspublic"),H=stir.node("#eventsstaff"),A=stir.node("#eventsarchive");var t=stir.node("#eventspromo");const s=stir.node("#eventspublicfilters"),i=stir.node("#eventsstafffilters"),a=stir.node("#eventsarchivefilters");var M=stir.node("#eventspublictab"),C=stir.node("#eventsstafftab"),j=stir.node("#eventsarchivetab"),W=stir.nodes(".stir-tabs__tab");const n=(e,t)=>`<div class="c-search-result__image"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,l=e=>`<div class="c-search-result__tags">
                <span class="c-search-tag">${e}</span>
            </div>`,p=()=>'<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No more events found</p></div>',c=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",o=e=>e.isSeries?"":`<div class="flex-container u-gap-16 align-middle">
          <span class="uos-clock u-icon h5"></span>
          <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
        </div>`,u=(t,e)=>{e=e.filter(e=>e.title===t);return`<p class="text-sm">Part of the ${e.length?`<a href="${e[0].url}">${e[0].title}</a>`:t} series.</p>`},g=stir.curry((e,t)=>{return`
            <div class="u-border-width-4 u-heritage-line-left c-search-result  ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${i=t,i.pin<1?'data-label-icon="pin"':i.isSeries?'data-label-icon="startdates"':""} data-perf="${t.perfId}" >
                ${t.isSeries?l("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                      ${c(t.cancelled)} ${c(t.rescheduled)} 
                        <strong>${i=t,i.url?` <a href="${i.url}">${"Webinar"===i.type?"Webinar: ":""}${i.title}</a>`:("Webinar"===i.type?"Webinar: ":"")+i.title} </strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${t.start}">${t.stirStart}</time> ${i=t.start,r=t.end,s=t.stirEnd,i===r?"":`– <time datetime="${r}">${s}</time>`}</span>
                        </div>
                        ${o(t)}
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"} "></span>
                            <span>${t.location}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${t.summary}</p>
                    ${t.isSeriesChild?u(t.isSeriesChild,e):""}
                </div>
                ${t.image?n(t.image,t.title):""}  
            </div>`;var r,s,i}),R=stir.curry((e,t)=>`
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell u-p-2 small-12 ${t.image?"medium-8":""} ">
                ${t.isSeries?l("Event series"):""}
                <p class="u-text-regular u-mb-2">
                ${c(t.cancelled)} ${c(t.rescheduled)} <strong><a href="${t.url}">${t.title}</a></strong>
                </p>
                <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span><time datetime="${t.start}">${t.stirStart}</time> – <time datetime="${t.end}">${t.stirEnd}</time></span>
                    </div>
                    ${o(t)}
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                        <span>${t.location}</span>
                    </div>
                </div>
                <p class="u-m-0 text-sm">${t.summary}</p>
                ${t.isSeriesChild?u(t.isSeriesChild,e):""}
            </div>
            ${t.image?`<div class="cell medium-4"><img src="${t.image}" class="u-object-cover" width="800" height="800" alt="Image: ${t.title}" /></div>`:""}  
        </div>`),z=stir.curry((e,t)=>`
            <div class="u-border-width-4 u-heritage-line-left c-search-result ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event"  >
                ${t.recording?l("Recording available"):""} 
                ${t.isSeries?l("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                        <strong><a href="${t.url}">${t.title}</a></strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${t.start}">${t.stirStart}</time> – <time datetime="${t.end}">${t.stirEnd}</time></span>
                        </div>
                    </div>
                    <p class="u-m-0">${t.summary}</p>
                    ${t.isSeriesChild?u(t.isSeriesChild,e):""}
                </div>
                ${t.image?n(t.image,t.title):""}  
            </div>`),h=(e,t)=>t<=e?"":'<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',v=(e,t,r)=>e<2?"":`<div class="flex-container align-center u-mb-2">Showing ${e+1}-${r<t?r:t} of ${r} results</div>`,f=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),$=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),B=f(t),b=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))};const y=stir.filter(e=>e.audience.includes("Public")),S=stir.filter(e=>e.audience.includes("Staff")||e.audience.includes("Student"));const x=stir.filter(e=>Number(e.endInt)<b()&&e.archive.length&&!e.hideFromFeed.length);const w=stir.filter(e=>Number(e.endInt)>=b()&&!e.hideFromFeed.length);const G=stir.filter(e=>e.eventPromo),D=stir.join(""),J=stir.filter((e,t)=>0===t),I=(e,t)=>Number(e.startInt)-Number(t.startInt),P=(e,t)=>Number(t.startInt)-Number(e.startInt),k=(e,t)=>Number(e.pin)-Number(t.pin),K=stir.filter(e=>e.recording),N=stir.filter(e=>e.isSeries.length),Q=stir.curry((e,t,r)=>{e=t*(e-1);return e<=r&&r<e+t});t=stir.curry((t,r)=>{var s={},i=[];for(let e=0;e<r.length;e++)s[r[e][t]]||(s[r[e][t]]=!0,i.push(r[e]));return i});const U=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),T=(e,t)=>{var r=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))r.push(new Date(d).toISOString().split("T")[0]);return r},V=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},X=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},Z=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},ee=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},te=e=>"thisweek"===e?T(V().start,V().end):"nextweek"===e?T(X().start,X().end):"thismonth"===e?T(Z().start,Z().end):"nextmonth"===e?T(ee().start,ee().end):null,re=stir.curry((t,e)=>{e=T(e.start,e.end).map(e=>U(t,e));return stir.any(e=>e,e)});var r=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const r=t.tags.split(", ");e=e.map(e=>r.includes(e));return stir.all(e=>e,e)?t:void 0});const _=stir.filter(r(e)),E=t("perfId"),O=(e,t)=>{e=te(e);const r=Number(QueryParams.get("page"))||1;var s,i,a=m*(r-1),n=a+m,l=stir.compose(N)(t),l=stir.map(g(l)),c=(1===r?f:$)(Y),o=stir.filter((e,t)=>{if(Q(r,m,t))return e});e?(e=re(e),e=stir.filter(e,t),e=stir.compose(stir.sort(k),stir.sort(I),y,_,E,w)(e),s=stir.compose(D,l,o)(e),i=e.length,e.length?c(v(a,n,i)+s+h(n,i)):c(p())):(e=stir.compose(stir.sort(k),stir.sort(I),y,_,E,w)(t),s=stir.compose(D,l,o)(e),i=e.length,e.length?c(v(a,n,i)+s+h(n,i)):c(p()))},q=(e,t)=>{e=te(e);const r=Number(QueryParams.get("page"))||1;var s,i,a=m*(r-1),n=a+m,l=stir.filter(N,t),l=stir.map(g(l)),c=(1===r?f:$)(H),o=stir.filter((e,t)=>{if(Q(r,m,t))return e});e?(e=re(e),e=stir.filter(e,t),e=stir.compose(stir.sort(k),stir.sort(I),S,_,E,w)(e),s=stir.compose(D,l,o)(e),i=e.length,e.length?c(v(a,n,i)+s+h(n,i)):c(p())):(e=stir.compose(stir.sort(k),stir.sort(I),S,_,E,w)(t),s=stir.compose(D,l,o)(e),i=e.length,e.length?c(v(a,n,i)+s+h(n,i)):c(p()))},F=(e,t)=>{const r=Number(QueryParams.get("page"))||1;var s,i,a,n=m*(r-1),l=n+m,c=stir.filter(N,t),c=stir.map(z(c)),o=(1===r?f:$)(A),u=stir.filter((e,t)=>{if(Q(r,m,t))return e});"all"===e&&(s=stir.compose(stir.sort(P),_,x)(t),i=stir.compose(D,c,u)(s),a=s.length,s.length?o(v(n,l,a)+i+h(l,a)):o(p())),"recordings"===e&&(s=stir.compose(stir.sort(P),K,_,x)(t),i=stir.compose(D,c,u)(s),a=s.length,s.length?o(v(n,l,a)+i+h(l,a)):o(p())),"public"===e&&(s=stir.compose(stir.sort(P),y,_,x)(t),i=stir.compose(D,c,u)(s),a=s.length,s.length?o(v(n,l,a)+i+h(l,a)):o(p())),"staffstudent"===e&&(s=stir.compose(stir.sort(P),S,_,x)(t),i=stir.compose(D,c,u)(s),a=s.length,s.length?o(v(n,l,a)+i+h(l,a)):o(p()))};s.querySelector("input[type=radio]").checked=!0,i.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0;const L=stir.feeds.events.filter(e=>e.id);QueryParams.set("page",1),O("all",L),q("all",L),F("all",L),r=L,e=stir.filter(N,r),e=R(e),stir.compose(B,D,stir.map(e),J,G,stir.sort(I),_,w)(r),stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},W),M.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),O(s.querySelector("input:checked").value,L)),"submit"===e.target.type&&(f(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),O(s.querySelector("input:checked").value,L))}),C.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),q(i.querySelector("input:checked").value,L)),"submit"===e.target.type&&(f(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),q(i.querySelector("input:checked").value,L))}),j.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),F(a.querySelector("input:checked").value,L)),"submit"===e.target.type&&(f(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),F(a.querySelector("input:checked").value,L))})}}();