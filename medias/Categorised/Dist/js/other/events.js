!function(){if(stir.node("#eventsrevamp")){const n=(t,e)=>`<div class="c-search-result__image"><img src="${t}" width="275" height="275" alt="Image: ${e}"></div>`,l=t=>`<div class="c-search-result__tags">
                    <span class="c-search-tag">${t}</span>
                </div>`,o=t=>`<p>Part of the ${t} series.</p>`,c=()=>'<div class="u-bg-white u-p-3"><p>No events found</p></div>';const p=stir.map(t=>`
            <div class="c-search-result ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${t.pin<0?'data-label-icon="pin"':""} >
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
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>12.00</time> – <time>18:00</time></span>
                        </div>
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-location"></span>
                            <span>${t.location}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${t.summary}</p>
                    ${t.isSeriesChild?o(t.isSeriesChild):""}
                </div>
                ${t.image?n(t.image,t.title):""}  
            </div>`);var t=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const u=t(eventspublic),g=t(eventsstaff);var e=t(eventsarchive),t=t(eventspromo);const m=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const v=stir.filter(t=>"Yes"===t.isPublic&&t.endInt>=m()),h=stir.filter(t=>"Yes"!==t.isPublic);var s=stir.filter(t=>t.endInt<m()),i=stir.filter(t=>t.promo);const f=stir.join(""),S=(t,e)=>t.startInt-e.startInt;const $=(t,e)=>t.pin-e.pin,D=stir.curry((t,e)=>{return!!t.filter(t=>t===e).length}),w=(t,e)=>{var s=[];for(d=new Date(t);d<=new Date(e);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},y=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(0-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},x=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(7-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},I=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth(),2),t=new Date(t.getFullYear(),t.getMonth()+1,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},b=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth()+1,2),t=new Date(t.getFullYear(),t.getMonth()+2,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},_=t=>"thisweek"===t?w(y().start,y().end):"nextweek"===t?w(x().start,x().end):"thismonth"===t?w(I().start,I().end):"nextmonth"===t?w(b().start,b().end):null,T=stir.curry((e,t)=>{t=w(t.start,t.end).map(t=>D(e,t));return stir.any(t=>t,t)});var r=stir.node("#eventspublicfilters"),a=stir.node("#eventsstafffilters");r.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0;const O=stir.feeds.events.filter(t=>t.id);stir.compose(u,f,p,stir.sort($),stir.sort(S),v)(O),stir.compose(g,f,p,stir.sort(S),h)(O),stir.compose(e,f,p,stir.sort((t,e)=>e.startInt-t.startInt),s)(O),stir.compose(t,f,stir.map(t=>`
        <div class="c-search-result u-bg-grey u-p-2 ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event"  >
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
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="uos-clock u-icon h5"></span>
                        <span><time>12.00</time> – <time>18:00</time></span>
                    </div>
                    <div class="flex-container u-gap-16 align-middle">
                        <span class="u-icon h5 uos-location"></span>
                        <span>${t.location}</span>
                    </div>
                </div>
                <p class="u-m-0">${t.summary}</p>
                ${t.isSeriesChild?o(t.isSeriesChild):""}
            </div>
            ${t.image?n(t.image,t.title):""}  
        </div>`),i,stir.sort(S))(O),r.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=_(t))?(t=T(t),t=stir.filter(t,O),(t=stir.compose(f,p,stir.sort($),stir.sort(S),v)(t)).length?u(t):u(c())):(t=stir.compose(f,p,stir.sort($),stir.sort(S),v)(O)).length?u(t):u(c()))}),a.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=_(t))?(t=T(t),t=stir.filter(t,O),(t=stir.compose(f,p,stir.sort($),stir.sort(S),h)(t)).length?g(t):g(c())):(t=stir.compose(f,p,stir.sort($),stir.sort(S),h)(O)).length?g(t):g(c()))})}}();