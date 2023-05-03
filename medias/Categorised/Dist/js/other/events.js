!function(){if(stir.node("#eventsrevamp")){var t=stir.node("#eventspublic"),e=stir.node("#eventsstaff"),s=stir.node("#eventsarchive"),i=stir.node("#eventspromo"),r=stir.node("#eventspublicfilters"),a=stir.node("#eventsstafffilters");const l=(t,e)=>`<div class="c-search-result__image"><img src="${t}" width="275" height="275" alt="Image: ${e}"></div>`,o=t=>`<div class="c-search-result__tags">
                    <span class="c-search-tag">${t}</span>
                </div>`,c=t=>`<p>Part of the ${t} series.</p>`,p=()=>'<div class="u-bg-white u-p-3"><p>No events found</p></div>';const u=stir.map(t=>`
            <div class="c-search-result ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${t.pin<0?'data-label-icon="pin"':""} >
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
            </div>`);var n=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const g=n(t),m=n(e);t=n(s),e=n(i);const v=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const h=stir.filter(t=>"Yes"===t.isPublic&&t.endInt>=v()),f=stir.filter(t=>"Yes"!==t.isPublic);s=stir.filter(t=>t.endInt<v()),n=stir.filter(t=>t.promo);const $=stir.join(""),S=(t,e)=>t.startInt-e.startInt;const D=(t,e)=>t.pin-e.pin,w=stir.curry((t,e)=>{return!!t.filter(t=>t===e).length}),y=(t,e)=>{var s=[];for(d=new Date(t);d<=new Date(e);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},x=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(0-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},I=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(7-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},T=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth(),2),t=new Date(t.getFullYear(),t.getMonth()+1,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},b=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth()+1,2),t=new Date(t.getFullYear(),t.getMonth()+2,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},_=t=>"thisweek"===t?y(x().start,x().end):"nextweek"===t?y(I().start,I().end):"thismonth"===t?y(T().start,T().end):"nextmonth"===t?y(b().start,b().end):null,O=stir.curry((e,t)=>{t=y(t.start,t.end).map(t=>w(e,t));return stir.any(t=>t,t)}),k=(r.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(t=>t.id));stir.compose(g,$,u,stir.sort(D),stir.sort(S),h)(k),stir.compose(m,$,u,stir.sort(S),f)(k),stir.compose(t,$,u,stir.sort((t,e)=>e.startInt-t.startInt),s)(k),stir.compose(e,$,stir.map(t=>`
        <div class="c-search-result u-bg-grey u-p-2 ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event"  >
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
        </div>`),n,stir.sort(S))(k),r.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=_(t))?(t=O(t),t=stir.filter(t,k),(t=stir.compose($,u,stir.sort(D),stir.sort(S),h)(t)).length?g(t):g(p())):(t=stir.compose($,u,stir.sort(D),stir.sort(S),h)(k)).length?g(t):g(p()))}),a.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=_(t))?(t=O(t),t=stir.filter(t,k),(t=stir.compose($,u,stir.sort(D),stir.sort(S),f)(t)).length?m(t):m(p())):(t=stir.compose($,u,stir.sort(D),stir.sort(S),f)(k)).length?m(t):m(p()))})}}();