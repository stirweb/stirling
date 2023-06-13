!function(){if(stir.node("#eventsrevamp")){const u=10,H=stir.node("#eventspublic"),A=stir.node("#eventsstaff"),R=stir.node("#eventsarchive");var e=stir.node("#eventspromo");const s=stir.node("#eventspublicfilters"),r=stir.node("#eventsstafffilters"),i=stir.node("#eventsarchivefilters");var M=stir.node("#eventspublictab"),W=stir.node("#eventsstafftab"),j=stir.node("#eventsarchivetab"),F=stir.nodes(".stir-tabs__tab");const a=(e,t)=>`<div class="c-search-result__image"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,n=e=>`<div class="c-search-result__tags">
                <span class="c-search-tag">${e}</span>
            </div>`,l=e=>`<p class="text-sm">Part of the ${e} series.</p>`,p=()=>'<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No more events found</p></div>',c=e=>e?`<span class="u-bg-heritage-berry u-white c-tag u-mr-1">${e}</span>`:"";const m=(e,t)=>t<=e?"":'<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',g=(e,t,s)=>e<2?"":`<div class="flex-container align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`,o=stir.map(e=>{return`
            <div class="c-search-result  ${e.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${e.pin<0?'data-label-icon="pin"':""} >
                ${e.isSeries?n("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                      ${c(e.cancelled)} ${c(e.rescheduled)} 
                        <strong>${r=e,r.url?` <a href="${r.url}">${"Webinar"===r.type?"Webinar: ":""}${r.title}</a>`:("Webinar"===r.type?"Webinar: ":"")+r.title}</strong>
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
                            <span class="u-icon h5 ${"Webinar"===e.type?"uos-computer":"uos-location"} "></span>
                            <span>${e.location}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${e.summary}</p>
                    ${e.isSeriesChild?l(e.isSeriesChild):""}
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
            </div>`),h=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),f=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e));e=h(e);const t=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join(""))};const $=stir.filter(e=>e.audience.includes("Public")),y=stir.filter(e=>e.audience.includes("Staff")||e.audience.includes("Student"));const b=stir.filter(e=>e.endInt<t());const S=stir.filter(e=>e.endInt>=t());var Y=stir.filter(e=>e.promo);const D=stir.join(""),x=(e,t)=>e.startInt-t.startInt,w=(e,t)=>t.startInt-e.startInt,I=(e,t)=>e.pin-t.pin,z=stir.filter(e=>e.recording),k=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t}),B=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),P=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},T=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},Q=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},_=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},E=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},O=e=>"thisweek"===e?P(T().start,T().end):"nextweek"===e?P(Q().start,Q().end):"thismonth"===e?P(_().start,_().end):"nextmonth"===e?P(E().start,E().end):null,G=stir.curry((t,e)=>{e=P(e.start,e.end).map(e=>B(t,e));return stir.any(e=>e,e)}),q=(e,t)=>{e=O(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=u*(s-1),n=a+u,l=(1===s?h:f)(H),c=stir.filter((e,t)=>{if(k(s,u,t))return e});e?(e=G(e),e=stir.filter(e,t),e=stir.compose(stir.sort(I),stir.sort(x),$,S)(e),r=stir.compose(D,o,c)(e),i=e.length,e.length?l(g(a,n,i)+r+m(n,i)):l(p())):(e=stir.compose(stir.sort(I),stir.sort(x),$,S)(t),r=stir.compose(D,o,c)(e),i=e.length,e.length?l(g(a,n,i)+r+m(n,i)):l(p()))},N=(e,t)=>{e=O(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=u*(s-1),n=a+u,l=(1===s?h:f)(A),c=stir.filter((e,t)=>{if(k(s,u,t))return e});e?(e=G(e),e=stir.filter(e,t),e=stir.compose(stir.sort(I),stir.sort(x),y,S)(e),r=stir.compose(D,o,c)(e),i=e.length,e.length?l(g(a,n,i)+r+m(n,i)):l(p())):(e=stir.compose(stir.sort(I),stir.sort(x),y,S)(t),r=stir.compose(D,o,c)(e),i=e.length,e.length?l(g(a,n,i)+r+m(n,i)):l(p()))},L=(e,t)=>{const s=Number(QueryParams.get("page"))||1;var r,i,a,n=u*(s-1),l=n+u,c=(1===s?h:f)(R),o=stir.filter((e,t)=>{if(k(s,u,t))return e});"all"===e&&(r=stir.compose(stir.sort(w),b)(t),i=stir.compose(D,v,o)(r),a=r.length,r.length?c(g(n,l,a)+i+m(l,a)):c(p())),"recordings"===e&&(r=stir.compose(stir.sort(w),z,b)(t),i=stir.compose(D,v,o)(r),a=r.length,r.length?c(g(n,l,a)+i+m(l,a)):c(p())),"public"===e&&(r=stir.compose(stir.sort(w),$,b)(t),i=stir.compose(D,v,o)(r),a=r.length,r.length?c(g(n,l,a)+i+m(l,a)):c(p())),"staffstudent"===e&&(r=stir.compose(stir.sort(w),y,b)(t),i=stir.compose(D,v,o)(r),a=r.length,r.length?c(g(n,l,a)+i+m(l,a)):c(p()))},C=(s.querySelector("input[type=radio]").checked=!0,r.querySelector("input[type=radio]").checked=!0,i.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(e=>e.id));QueryParams.set("page",1),q("all",C),N("all",C),L("all",C),stir.compose(e,D,stir.map(e=>`
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
                        <span class="u-icon h5 uos-location"></span>
                        <span>${e.location}</span>
                    </div>
                </div>
                <p class="u-m-0 text-sm">${e.summary}</p>
                ${e.isSeriesChild?l(e.isSeriesChild):""}
            </div>
            ${e.image?`<div class="cell medium-4"><img src="${e.image}" class="u-object-cover" width="800" height="800" alt="Image: ${e.title}" /></div>`:""}  
        </div>`),Y,stir.sort(x))(C),stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},F),M.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),q(s.querySelector("input:checked").value,C)),"submit"===e.target.type&&(h(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),q(s.querySelector("input:checked").value,C))}),W.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),N(r.querySelector("input:checked").value,C)),"submit"===e.target.type&&(h(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),N(r.querySelector("input:checked").value,C))}),j.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),L(i.querySelector("input:checked").value,C)),"submit"===e.target.type&&(h(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),L(i.querySelector("input:checked").value,C))})}}();