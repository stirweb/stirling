!function(){if(stir.node("#eventsrevamp")){const H=stir.node("#eventspublic"),A=stir.node("#eventsstaff"),R=stir.node("#eventsarchive");var e=stir.node("#eventspromo");const s=stir.node("#eventspublicfilters"),r=stir.node("#eventsstafffilters"),i=stir.node("#eventsarchivefilters");var M=stir.node("#eventspublictab"),Y=stir.node("#eventsstafftab"),j=stir.node("#eventsarchivetab"),F=stir.nodes(".stir-tabs__tab");const a=(e,t)=>`<div class="c-search-result__image"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,n=e=>`<div class="c-search-result__tags">
                <span class="c-search-tag">${e}</span>
            </div>`,l=e=>`<p>Part of the ${e} series.</p>`,u=()=>'<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No more events found</p></div>',c=e=>e?`<span class="u-bg-heritage-berry u-white c-tag u-mr-1">${e}</span>`:"";const p=(e,t)=>t<e?"":'<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',m=(e,t,s)=>e<2?"":`<div class="flex-container align-center u-mb-2">Showing ${e+1}-${s<t?s:t} of ${s} results</div>`,o=stir.map(e=>{return`
            <div class="c-search-result  ${e.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${e.pin<0?'data-label-icon="pin"':""} >
                ${e.isSeries?n("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                      ${c(e.cancelled)} ${c(e.rescheduled)}
                        <strong><a href="${e.url}">${"Webinar"===e.type?"Webinar: ":""}${e.title}</a></strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${e.start}">${e.stirStart}</time> ${t=e.start,s=e.end,r=e.stirEnd,t===s?"":`– <time datetime="${s}">${r}</time>`}</span>
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
            </div>`;var t,s,r}),g=stir.map(e=>`
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
            </div>`),v=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),h=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e));e=v(e);const t=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join(""))};const f=stir.filter(e=>"Yes"===e.isPublic),$=stir.filter(e=>"Yes"!==e.isPublic);const y=stir.filter(e=>e.endInt<t());const b=stir.filter(e=>e.endInt>=t());var W=stir.filter(e=>e.promo);const S=stir.join(""),D=(e,t)=>e.startInt-t.startInt,w=(e,t)=>t.startInt-e.startInt,x=(e,t)=>e.pin-t.pin,z=stir.filter(e=>e.recording),I=stir.curry((e,t,s)=>{e=t*(e-1);return e<=s&&s<e+t}),B=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),k=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},P=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},T=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},Q=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},_=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},E=e=>"thisweek"===e?k(P().start,P().end):"nextweek"===e?k(T().start,T().end):"thismonth"===e?k(Q().start,Q().end):"nextmonth"===e?k(_().start,_().end):null,O=stir.curry((t,e)=>{e=k(e.start,e.end).map(e=>B(t,e));return stir.any(e=>e,e)}),q=(e,t)=>{e=E(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=4*(s-1),n=4+a,l=(1===s?v:h)(H),c=stir.filter((e,t)=>{if(I(s,4,t))return e});e?(e=O(e),e=stir.filter(e,t),e=stir.compose(stir.sort(x),stir.sort(D),f,b)(e),r=stir.compose(S,o,c)(e),i=e.length,e.length?l(m(a,n,i)+r+p(n,i)):l(u())):(e=stir.compose(stir.sort(x),stir.sort(D),f,b)(t),r=stir.compose(S,o,c)(e),i=e.length,e.length?l(m(a,n,i)+r+p(n,i)):l(u()))},N=(e,t)=>{e=E(e);const s=Number(QueryParams.get("page"))||1;var r,i,a=4*(s-1),n=4+a,l=(1===s?v:h)(A),c=stir.filter((e,t)=>{if(I(s,4,t))return e});e?(e=O(e),e=stir.filter(e,t),e=stir.compose(stir.sort(x),stir.sort(D),$,b)(e),r=stir.compose(S,o,c)(e),i=e.length,e.length?l(m(a,n,i)+r+p(n,i)):l(u())):(e=stir.compose(stir.sort(x),stir.sort(D),$,b)(t),r=stir.compose(S,o,c)(e),i=e.length,e.length?l(m(a,n,i)+r+p(n,i)):l(u()))},L=(e,t)=>{const s=Number(QueryParams.get("page"))||1;var r,i,a,n=4*(s-1),l=4+n,c=(1===s?v:h)(R),o=stir.filter((e,t)=>{if(I(s,4,t))return e});"all"===e&&(r=stir.compose(stir.sort(w),y)(t),i=stir.compose(S,g,o)(r),a=r.length,r.length?c(m(n,l,a)+i+p(l,a)):c(u())),"recordings"===e&&(r=stir.compose(stir.sort(w),z,y)(t),i=stir.compose(S,g,o)(r),a=r.length,r.length?c(m(n,l,a)+i+p(l,a)):c(u())),"public"===e&&(r=stir.compose(stir.sort(w),f,y)(t),i=stir.compose(S,g,o)(r),a=r.length,r.length?c(m(n,l,a)+i+p(l,a)):c(u())),"staffstudent"===e&&(r=stir.compose(stir.sort(w),$,y)(t),i=stir.compose(S,g,o)(r),a=r.length,r.length?c(m(n,l,a)+i+p(l,a)):c(u()))},C=(s.querySelector("input[type=radio]").checked=!0,r.querySelector("input[type=radio]").checked=!0,i.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(e=>e.id));QueryParams.set("page",1),q("all",C),N("all",C),L("all",C),stir.compose(e,S,stir.map(e=>`
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell u-p-2 small-12 ${e.image?"medium-8":""} ">
                ${e.isSeries?n("Event series"):""}
                <p class="u-text-regular u-mb-2">
                    <strong><a href="${e.url}">${e.title}</a></strong>
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
        </div>`),W,stir.sort(D))(C),stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},F),M.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),q(s.querySelector("input:checked").value,C)),"submit"===e.target.type&&(v(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),q(s.querySelector("input:checked").value,C))}),Y.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),N(r.querySelector("input:checked").value,C)),"submit"===e.target.type&&(v(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),N(r.querySelector("input:checked").value,C))}),j.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),L(i.querySelector("input:checked").value,C)),"submit"===e.target.type&&(v(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),L(i.querySelector("input:checked").value,C))})}}();