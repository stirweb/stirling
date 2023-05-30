!function(){if(stir.node("#eventsrevamp")){const a=stir.node("#eventspublic"),n=stir.node("#eventsstaff"),A=stir.node("#eventsarchive");var e=stir.node("#eventspromo");const s=stir.node("#eventspublicfilters"),r=stir.node("#eventsstafffilters"),i=stir.node("#eventsarchivefilters");var M=stir.node("#eventspublictab"),Y=stir.node("#eventsstafftab"),j=stir.node("#eventsarchivetab"),F=stir.nodes(".stir-tabs__tab");const t=(e,t)=>`<div class="c-search-result__image"><img src="${e}" width="275" height="275" alt="Image: ${t}"></div>`,l=e=>`<div class="c-search-result__tags">
                <span class="c-search-tag">${e}</span>
            </div>`,c=e=>`<p>Part of the ${e} series.</p>`,o=()=>'<div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No more events found</p></div>';const u=()=>'<div class="loadmorebtn flex-container align-center u-mb-2" ><button class="button hollow tiny">Load more results</button></div>',m=stir.map(e=>`
            <div class="c-search-result  ${e.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${e.pin<0?'data-label-icon="pin"':""} >
                ${e.isSeries?l("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                        <strong><a href="${e.url}">${e.title}</a></strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
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
                    <p class="u-m-0">${e.summary}</p>
                    ${e.isSeriesChild?c(e.isSeriesChild):""}
                </div>
                ${e.image?t(e.image,e.title):""}  
            </div>`),p=stir.map(e=>`
            <div class="c-search-result ${e.image?"c-search-result__with-thumbnail":""}" data-result-type="event"  >
                ${e.recording?l("Recording available"):""} 
                ${e.isSeries?l("Event series"):""} 
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
                    ${e.isSeriesChild?c(e.isSeriesChild):""}
                </div>
                ${e.image?t(e.image,e.title):""}  
            </div>`),g=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),v=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e));e=g(e);const h=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join(""))};const f=stir.filter(e=>"Yes"===e.isPublic),y=stir.filter(e=>"Yes"!==e.isPublic);const $=stir.filter(e=>e.endInt<h());const b=stir.filter(e=>e.endInt>=h());var H=stir.filter(e=>e.promo);const S=stir.join(""),D=(e,t)=>e.startInt-t.startInt,x=(e,t)=>t.startInt-e.startInt,w=(e,t)=>e.pin-t.pin,R=stir.filter(e=>e.recording),I=stir.curry((e,t)=>{e=4*(e-1);return e<=t&&t<4+e}),z=stir.curry((e,t)=>{return!!e.filter(e=>e===t).length}),k=(e,t)=>{var s=[];for(d=new Date(e);d<=new Date(t);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},P=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(0-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},T=()=>{var e=new Date,t=new Date(e.setDate(e.getDate()+(7-e.getDay())%7)),e=new Date(e.setDate(e.getDate()+6));return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},Q=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth(),2),e=new Date(e.getFullYear(),e.getMonth()+1,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},_=()=>{var e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,2),e=new Date(e.getFullYear(),e.getMonth()+2,1);return{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},E=e=>"thisweek"===e?k(P().start,P().end):"nextweek"===e?k(T().start,T().end):"thismonth"===e?k(Q().start,Q().end):"nextmonth"===e?k(_().start,_().end):null,O=stir.curry((t,e)=>{e=k(e.start,e.end).map(e=>z(t,e));return stir.any(e=>e,e)}),q=(e,t)=>{e=E(e);const s=Number(QueryParams.get("page"))||1;var r=(1===s?g:v)(a),i=stir.filter((e,t)=>{if(I(s,t))return e});e?(e=O(e),e=stir.filter(e,t),(e=stir.compose(S,m,i,stir.sort(w),stir.sort(D),f,b)(e)).length?r(e+u()):r(o())):(e=stir.compose(S,m,i,stir.sort(w),stir.sort(D),f,b)(t)).length?r(e+u()):r(o())},N=(e,t)=>{e=E(e);const s=Number(QueryParams.get("page"))||1;var r=(1===s?g:v)(n),i=stir.filter((e,t)=>{if(I(s,t))return e});e?(e=O(e),e=stir.filter(e,t),(e=stir.compose(S,m,i,stir.sort(w),stir.sort(D),y,b)(e)).length?r(e+u()):r(o())):(e=stir.compose(S,m,i,stir.sort(w),stir.sort(D),y,b)(t)).length?r(e+u()):r(o())},L=(e,t)=>{const s=Number(QueryParams.get("page"))||1;var r,i=(1===s?g:v)(A),a=stir.filter((e,t)=>{if(I(s,t))return e});"all"===e&&((r=stir.compose(S,p,a,stir.sort(x),$)(t)).length?i(r+u()):i(o())),"recordings"===e&&((r=stir.compose(S,p,a,stir.sort(x),R,$)(t)).length?i(r+u()):i(o())),"public"===e&&((r=stir.compose(S,p,a,stir.sort(x),f,$)(t)).length?i(r+u()):i(o())),"staffstudent"===e&&((r=stir.compose(S,p,a,stir.sort(x),y,$)(t)).length?i(r+u()):i(o()))},C=(s.querySelector("input[type=radio]").checked=!0,r.querySelector("input[type=radio]").checked=!0,i.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(e=>e.id));QueryParams.set("page",1),q("all",C),N("all",C),L("all",C),stir.compose(e,S,stir.map(e=>`
          <div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell u-p-2 small-12 ${e.image?"medium-8":""} ">
                ${e.isSeries?l("Event series"):""}
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
                ${e.isSeriesChild?c(e.isSeriesChild):""}
            </div>
            ${e.image?`<div class="cell medium-4"><img src="${e.image}" class="u-object-cover" width="800" height="800" alt="Image: ${e.title}" /></div>`:""}  
        </div>`),H,stir.sort(D))(C),stir.each(e=>{e.addEventListener("click",e=>{QueryParams.set("page",1)})},F),M.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),q(s.querySelector("input:checked").value,C)),"submit"===e.target.type&&(g(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),q(s.querySelector("input:checked").value,C))}),Y.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),N(r.querySelector("input:checked").value,C)),"submit"===e.target.type&&(g(e.target.closest(".loadmorebtn"),""),QueryParams.set("page",t+1),N(r.querySelector("input:checked").value,C))}),j.addEventListener("click",e=>{var t=Number(QueryParams.get("page"))||1;"radio"===e.target.type&&(QueryParams.set("page",1),L(i.querySelector("input:checked").value,C)),"submit"===e.target.type&&(g(stir.node(".loadmorebtn"),""),QueryParams.set("page",t+1),L(i.querySelector("input:checked").value,C))})}}();