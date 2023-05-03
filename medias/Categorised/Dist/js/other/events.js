!function(){if(stir.node("#eventsrevamp")){var t=stir.node("#eventspublic"),e=stir.node("#eventsstaff"),s=stir.node("#eventsarchive"),i=stir.node("#eventspromo"),r=stir.node("#eventspublicfilters"),a=stir.node("#eventsstafffilters");const l=(t,e)=>`<div class="c-search-result__image"><img src="${t}" width="275" height="275" alt="Image: ${e}"></div>`,o=t=>`<div class="c-search-result__tags">
                    <span class="c-search-tag">${t}</span>
                </div>`,c=t=>`<p>Part of the ${t} series.</p>`,p=()=>'<div class="u-bg-white u-p-3"><p>No events found</p></div>';const u=stir.map(t=>`
            <div class="c-search-result  ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${t.pin<0?'data-label-icon="pin"':""} >
                ${t.isSeries?o("Event series"):""} 
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
                            <span><time>${t.startTime}</time> – <time>${t.endTime}</time></span>
                        </div>
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-location"></span>
                            <span>${t.location}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${t.summary}</p>
                    ${t.isSeriesChild?c(t.isSeriesChild):""}
                </div>
                ${t.image?l(t.image,t.title):""}  
            </div>`);var n=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const m=n(t),g=n(e);t=n(s),e=n(i);const v=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const h=stir.filter(t=>"Yes"===t.isPublic&&t.endInt>=v()),f=stir.filter(t=>"Yes"!==t.isPublic);s=stir.filter(t=>t.endInt<v()),n=stir.filter(t=>t.promo);const S=stir.join(""),$=(t,e)=>t.startInt-e.startInt;const D=(t,e)=>t.pin-e.pin,w=stir.curry((t,e)=>{return!!t.filter(t=>t===e).length}),x=(t,e)=>{var s=[];for(d=new Date(t);d<=new Date(e);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},y=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(0-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},I=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(7-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},b=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth(),2),t=new Date(t.getFullYear(),t.getMonth()+1,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},T=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth()+1,2),t=new Date(t.getFullYear(),t.getMonth()+2,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},O=t=>"thisweek"===t?x(y().start,y().end):"nextweek"===t?x(I().start,I().end):"thismonth"===t?x(b().start,b().end):"nextmonth"===t?x(T().start,T().end):null,k=stir.curry((e,t)=>{t=x(t.start,t.end).map(t=>w(e,t));return stir.any(t=>t,t)}),_=(r.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(t=>t.id));stir.compose(m,S,u,stir.sort(D),stir.sort($),h)(_),stir.compose(g,S,u,stir.sort($),f)(_),stir.compose(t,S,u,stir.sort((t,e)=>e.startInt-t.startInt),s)(_),stir.compose(e,S,stir.map(t=>`
        <div class=" u-bg-grey u-p-2 flex-container flex-dir-column medium-flex-dir-row u-gap u-mt-1 u-mb-2 u-flex1 "   >
            <div >
            ${t.isSeries?o("Event series"):""}
                <p class="u-text-regular u-mb-2">
                    <strong><a href="${t.url}">${t.title}</a></strong>
                </p>
                <div class="flex-container flex-dir-column u-gap-8 u-mb-2">
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
                ${t.isSeriesChild?c(t.isSeriesChild):""}
            </div>
            ${t.image?l(t.image,t.title):""}  
        </div>`),n,stir.sort($))(_),r.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=O(t))?(t=k(t),t=stir.filter(t,_),(t=stir.compose(S,u,stir.sort(D),stir.sort($),h)(t)).length?m(t):m(p())):(t=stir.compose(S,u,stir.sort(D),stir.sort($),h)(_)).length?m(t):m(p()))}),a.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=O(t))?(t=k(t),t=stir.filter(t,_),(t=stir.compose(S,u,stir.sort(D),stir.sort($),f)(t)).length?g(t):g(p())):(t=stir.compose(S,u,stir.sort(D),stir.sort($),f)(_)).length?g(t):g(p()))})}}();