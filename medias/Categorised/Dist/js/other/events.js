!function(){if(stir.node("#eventsrevamp")){const u=10;var e=stir.node("[data-tags]")||"",e=e?e.dataset.tags:"";const z=stir.node("#eventspublic"),B=stir.node("#eventsstaff"),G=stir.node("#eventsarchive");var t=stir.node("#eventspromo");const s=stir.node("#eventspublicfilters"),r=stir.node("#eventsstafffilters"),i=stir.node("#eventsarchivefilters");var C=stir.node("#eventspublictab"),F=stir.node("#eventsstafftab"),j=stir.node("#eventsarchivetab"),W=stir.nodes(".stir-tabs__tab");const a=(e,t)=>`<div class="c-search-result__image"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,n=e=>`<div class="c-search-result__tags">
                <span class="c-search-tag">${e}</span>
            </div>`,l=e=>`<p class="text-sm">Part of the ${e} series.</p>`,m=()=>'<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No more events found</p></div>',c=e=>e?`<span class="u-bg-heritage-berry u-white c-tag u-mr-1">${e}</span>`:"";const p=(e,t)=>t<=e?"":'<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',g=(e,t,s)=>e<2?"":`<div class="flex-container align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`,o=stir.map(e=>{return`
            <div class="c-search-result  ${e.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${r=e,r.pin<1?'data-label-icon="pin"':r.isSeries?'data-label-icon="startdates"':""} data-perf="${e.perfId}" >
                ${e.isSeries?n("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                      ${c(e.cancelled)} ${c(e.rescheduled)} 
                        <strong>${r=e,r.url?` <a href="${r.url}">${"Webinar"===r.type?"Webinar: ":""}${r.title}</a>`:("Webinar"===r.type?"Webinar: ":"")+r.title} </strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${e.start}">${e.stirStart}</time> ${r=e.start,t=e.end,s=e.stirEnd,r===t?"":`– <time datetime="${t}">${s}</time>`}</span>
                        </div>
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
                        </div>
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 ${e.online?"uos-computer":"uos-location"} "></span>
                            <span>${e.location}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${e.summary}</p>
                    ${e.isSeriesChild?l(e.isSeriesChild):""}

                    ${e.tags}
                </div>
                ${e.image?a(e.image,e.title):""}  
            </div>`;var t,s,r}),v=stir.map(e=>`
            <div class="c-search-result ${e.image?"c-search-result__with-thumbnail":""}" data-result-type="event"  >
                ${e.recording?n("Recording available"):""} 
                ${e.isSeries?n("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                        <strong><a href="${e.url}">${e.title}</a></strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${e.start}">${e.stirStart}</time> – <time datetime="${e.end}">${e.stirEnd}</time></span>
                        </div>
                    </div>
                    <p class="u-m-0">${e.summary}</p>
                    ${e.isSeriesChild?l(e.isSeriesChild):""}
                </div>
                ${e.image?a(e.image,e.title):""}  
            </div>`),h=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),f=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e));t=h(t);const $=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join("")+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))};const b=stir.filter(e=>e.audience.includes("Public")),y=stir.filter(e=>e.audience.includes("Staff")||e.audience.includes("Student"));const S=stir.filter(e=>Number(e.endInt)<$()&&e.archive.length);const D=stir.filter(e=>Number(e.endInt)>=$()&&!e.hideFromFeed.length);var Y=stir.filter(e=>e.eventPromo);const x=stir.join("");var H=stir.filter((e,t)=>0===t);const w=(e,t)=>Number(e.startInt)-Number(t.startInt),I=(e,t)=>Number(t.startInt)-Number(e.startInt),k=(e,t)=>Number(e.pin)-Number(t.pin),J=stir.filter(e=>e.recording),P=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t});var A=stir.curry((t,s)=>{var r={},i=[];for(let e=0;e<s.length;e++)r[s[e][t]]||(r[s[e][t]]=!0,i.push(s[e]));return i});const K=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),N=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},T=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},Q=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},U=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},V=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},X=e=>"thisweek"===e?N(T().start,T().end):"nextweek"===e?N(Q().start,Q().end):"thismonth"===e?N(U().start,U().end):"nextmonth"===e?N(V().start,V().end):null,Z=stir.curry((t,e)=>{e=N(e.start,e.end).map(e=>K(t,e));return stir.any(e=>e,e)});var R=stir.curry((e,t)=>{e=e.split(", ");if(!e&&!e.length)return t;if(1===e.length&&""===e[0])return t;const s=t.tags.split(", ");e=e.map(e=>s.includes(e));return stir.all(e=>e,e)?t:void 0});const _=stir.filter(R(e)),E=A("perfId"),O=(e,t)=>{e=X(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=u*(s-1),n=a+u,l=(1===s?h:f)(z),c=stir.filter((e,t)=>{if(P(s,u,t))return e});e?(e=Z(e),e=stir.filter(e,t),e=stir.compose(stir.sort(k),stir.sort(w),b,_,E,D)(e),r=stir.compose(x,o,c)(e),i=e.length,e.length?l(g(a,n,i)+r+p(n,i)):l(m())):(e=stir.compose(stir.sort(k),stir.sort(w),b,_,E,D)(t),r=stir.compose(x,o,c)(e),i=e.length,e.length?l(g(a,n,i)+r+p(n,i)):l(m()))},q=(e,t)=>{e=X(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=u*(s-1),n=a+u,l=(1===s?h:f)(B),c=stir.filter((e,t)=>{if(P(s,u,t))return e});e?(e=Z(e),e=stir.filter(e,t),e=stir.compose(stir.sort(k),stir.sort(w),y,_,E,D)(e),r=stir.compose(x,o,c)(e),i=e.length,e.length?l(g(a,n,i)+r+p(n,i)):l(m())):(e=stir.compose(stir.sort(k),stir.sort(w),y,_,E,D)(t),r=stir.compose(x,o,c)(e),i=e.length,e.length?l(g(a,n,i)+r+p(n,i)):l(m()))},L=(e,t)=>{const s=Number(QueryParams.get("page"))||1;var r,i,a,n=u*(s-1),l=n+u,c=(1===s?h:f)(G),o=stir.filter((e,t)=>{if(P(s,u,t))return e});"all"===e&&(r=stir.compose(stir.sort(I),_,S)(t),i=stir.compose(x,v,o)(r),a=r.length,r.length?c(g(n,l,a)+i+p(l,a)):c(m())),"recordings"===e&&(r=stir.compose(stir.sort(I),J,_,S)(t),i=stir.compose(x,v,o)(r),a=r.length,r.length?c(g(n,l,a)+i+p(l,a)):c(m())),"public"===e&&(r=stir.compose(stir.sort(I),b,_,S)(t),i=stir.compose(x,v,o)(r),a=r.length,r.length?c(g(n,l,a)+i+p(l,a)):c(m())),"staffstudent"===e&&(r=stir.compose(stir.sort(I),y,_,S)(t),i=stir.compose(x,v,o)(r),a=r.length,r.length?c(g(n,l,a)+i+p(l,a)):c(m()))},M=(s.querySelector("input[type=radio]").checked=!0,r.querySelector("input[type=radio]").checked=!0,i.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(e=>e.id));QueryParams.set("page",1),console.log($()),console.log(M),O("all",M),q("all",M),L("all",M),stir.compose(t,x,stir.map(e=>`
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell u-p-2 small-12 ${e.image?"medium-8":""} ">
                ${e.isSeries?n("Event series"):""}
                <p class="u-text-regular u-mb-2">
                ${c(e.cancelled)} ${c(e.rescheduled)} <strong><a href="${e.url}">${e.title}</a></strong>
                </p>
                <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span><time datetime="${e.start}">${e.stirStart}</time> – <time datetime="${e.end}">${e.stirEnd}</time></span>
                    </div>
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="uos-clock u-icon h5"></span>
                        <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
                    </div>
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 ${e.online?"uos-computer":"uos-location"}"></span>
                        <span>${e.location}</span>
                    </div>
                </div>
                <p class="u-m-0 text-sm">${e.summary}</p>
                ${e.isSeriesChild?l(e.isSeriesChild):""}
            </div>
            ${e.image?`<div class="cell medium-4"><img src="${e.image}" class="u-object-cover" width="800" height="800" alt="Image: ${e.title}" /></div>`:""}  
        </div>`),H,Y,stir.sort(w),_,D)(M),stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},W),C.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),O(s.querySelector("input:checked").value,M)),"submit"===e.target.type&&(h(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),O(s.querySelector("input:checked").value,M))}),F.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),q(r.querySelector("input:checked").value,M)),"submit"===e.target.type&&(h(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),q(r.querySelector("input:checked").value,M))}),j.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),L(i.querySelector("input:checked").value,M)),"submit"===e.target.type&&(h(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),L(i.querySelector("input:checked").value,M))})}}();