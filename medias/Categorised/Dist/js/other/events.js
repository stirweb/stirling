!function(){if(stir.node("#eventsrevamp")){const r=(t,e)=>`<div class="c-search-result__image"><img src="${t}" width="275" height="275" alt="Image: ${e}"></div>`,a=t=>`<div class="c-search-result__tags">
                    <span class="c-search-tag">${t}</span>
                </div>`,n=t=>`<p>Part of the ${t} series.</p>`,l=()=>'<div class="u-bg-white u-p-3"><p>No events found</p></div>';const o=stir.map(t=>`
            <div class="c-search-result ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${t.pin<0?'data-label-icon="pin"':""} >
                ${t.isSeries?a("Event series"):""} 
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
                    ${t.isSeriesChild?n(t.isSeriesChild):""}
                </div>
                ${t.image?r(t.image,t.title):""}  
            </div>`);var t=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const c=t(eventspublic),p=t(eventsstaff);var e=t(eventsarchive),t=t(eventspromo);const u=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const g=stir.filter(t=>"Yes"===t.isPublic&&t.endInt>=u()),m=stir.filter(t=>"Yes"!==t.isPublic);var s=stir.filter(t=>t.endInt<u()),i=stir.filter(t=>t.promo);const v=stir.join(""),h=(t,e)=>t.startInt-e.startInt;const f=(t,e)=>t.pin-e.pin,S=stir.curry((t,e)=>{return!!t.filter(t=>t===e).length}),$=(t,e)=>{var s=[];for(d=new Date(t);d<=new Date(e);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},D=()=>{var t=new Date,t=new Date(t.setDate(t.getDate()+(0-t.getDay())%7)),e=new Date;return e.setDate(t.getDate()+6),{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},w=()=>{var t=new Date,t=new Date(t.setDate(t.getDate()+(7-t.getDay())%7)),e=new Date;return e.setDate(t.getDate()+6),{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},y=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth(),1),t=new Date(t.getFullYear(),t.getMonth()+1,0);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},x=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth()+1,1),t=new Date(t.getFullYear(),t.getMonth()+2,0);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},I=t=>"thisweek"===t?$(D().start,D().end):"nextweek"===t?$(w().start,w().end):"thismonth"===t?$(y().start,y().end):"nextmonth"===t?$(x().start,x().end):null,b=stir.curry((e,t)=>{t=$(t.start,t.end).map(t=>S(e,t));return stir.any(t=>t,t)}),_=(eventspublicfilters.querySelector("input[type=radio]").checked=!0,eventsstafffilters.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(t=>t.id));stir.compose(c,v,o,stir.sort(f),stir.sort(h),g)(_),stir.compose(p,v,o,stir.sort(h),m)(_),stir.compose(e,v,o,stir.sort((t,e)=>e.startInt-t.startInt),s)(_),stir.compose(t,v,stir.map(t=>`
        <div class="c-search-result u-bg-grey u-p-2 ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event"  >
            ${t.isSeries?a("Event series"):""} 
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
                ${t.isSeriesChild?n(t.isSeriesChild):""}
            </div>
            ${t.image?r(t.image,t.title):""}  
        </div>`),i,stir.sort(h))(_),eventspublicfilters.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=I(t))?(t=b(t),t=stir.filter(t,_),(t=stir.compose(v,o,stir.sort(f),stir.sort(h),g)(t)).length?c(t):c(l())):(t=stir.compose(v,o,stir.sort(f),stir.sort(h),g)(_)).length?c(t):c(l()))}),eventsstafffilters.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,t=I(t),console.log(t),t?(t=b(t),t=stir.filter(t,_),(t=stir.compose(v,o,stir.sort(f),stir.sort(h),m)(t)).length?p(t):p(l())):(t=stir.compose(v,o,stir.sort(f),stir.sort(h),m)(_)).length?p(t):p(l()))})}}();