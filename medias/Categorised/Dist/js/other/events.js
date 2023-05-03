!function(){if(stir.node("#eventsrevamp")){var t=stir.node("#eventspublic"),e=stir.node("#eventsstaff"),s=stir.node("#eventsarchive"),i=stir.node("#eventspromo"),r=stir.node("#eventspublicfilters"),a=stir.node("#eventsstafffilters");const l=t=>`<div class="c-search-result__tags">
                    <span class="c-search-tag">${t}</span>
                </div>`,o=t=>`<p>Part of the ${t} series.</p>`,c=()=>'<div class="u-bg-white u-p-3"><p>No events found</p></div>';const p=stir.map(t=>`
            <div class="c-search-result  ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${t.pin<0?'data-label-icon="pin"':""} >
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
                            <span><time>${t.startTime}</time> – <time>${t.endTime}</time></span>
                        </div>
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-location"></span>
                            <span>${t.location}</span>
                        </div>
                    </div>
                    <p class="u-m-0">${t.summary}</p>
                    ${t.isSeriesChild?o(t.isSeriesChild):""}
                </div>
                ${t.image?`<div class="c-search-result__image"><img src="${t.image}" width="275" height="275" alt="Image: ${t.title}"></div>`:""}  
            </div>`);var n=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const u=n(t),m=n(e);t=n(s),e=n(i);const g=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const v=stir.filter(t=>"Yes"===t.isPublic&&t.endInt>=g()),h=stir.filter(t=>"Yes"!==t.isPublic);s=stir.filter(t=>t.endInt<g()),n=stir.filter(t=>t.promo);const f=stir.join(""),$=(t,e)=>t.startInt-e.startInt;const S=(t,e)=>t.pin-e.pin,D=stir.curry((t,e)=>{return!!t.filter(t=>t===e).length}),w=(t,e)=>{var s=[];for(d=new Date(t);d<=new Date(e);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},x=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(0-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},I=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(7-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},y=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth(),2),t=new Date(t.getFullYear(),t.getMonth()+1,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},b=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth()+1,2),t=new Date(t.getFullYear(),t.getMonth()+2,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},T=t=>"thisweek"===t?w(x().start,x().end):"nextweek"===t?w(I().start,I().end):"thismonth"===t?w(y().start,y().end):"nextmonth"===t?w(b().start,b().end):null,O=stir.curry((e,t)=>{t=w(t.start,t.end).map(t=>D(e,t));return stir.any(t=>t,t)}),k=(r.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(t=>t.id));stir.compose(u,f,p,stir.sort(S),stir.sort($),v)(k),stir.compose(m,f,p,stir.sort($),h)(k),stir.compose(t,f,p,stir.sort((t,e)=>e.startInt-t.startInt),s)(k),stir.compose(e,f,stir.map(t=>`
        <div class=" u-bg-grey u-p-2 flex-container flex-dir-column medium-flex-dir-row u-gap u-mt-1 u-mb-2 u-flex1 "   >
            <div>
            ${t.isSeries?l("Event series"):""}
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
                <p class="u-m-0 text-sm">${t.summary}</p>
                ${t.isSeriesChild?o(t.isSeriesChild):""}
            </div>
            ${t.image?`<img src="${t.image}" width="700" height="700" alt="Image: ${t.title}" />`:""}  
        </div>`),n,stir.sort($))(k),r.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=T(t))?(t=O(t),t=stir.filter(t,k),(t=stir.compose(f,p,stir.sort(S),stir.sort($),v)(t)).length?u(t):u(c())):(t=stir.compose(f,p,stir.sort(S),stir.sort($),v)(k)).length?u(t):u(c()))}),a.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=T(t))?(t=O(t),t=stir.filter(t,k),(t=stir.compose(f,p,stir.sort(S),stir.sort($),h)(t)).length?m(t):m(c())):(t=stir.compose(f,p,stir.sort(S),stir.sort($),h)(k)).length?m(t):m(c()))})}}();