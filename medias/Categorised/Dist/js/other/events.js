!function(){if(stir.node("#eventsrevamp")){const i=()=>'<div class="u-bg-white u-p-3"><p>No events found</p></div>';const a=stir.map(t=>`
            <div class="c-search-result ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${t.pin<0?'data-label-icon="pin"':""} >
                ${t.isSeries?`<div class="c-search-result__tags">
                    <span class="c-search-tag">Event series</span>
                </div>`:""} 
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
                    ${t.isSeriesChild?`<p>Part of the ${t.isSeriesChild} series.</p>`:""}
                </div>
                ${t.image?`<div class="c-search-result__image"><img src="${t.image}" width="275" height="275" alt="Image: ${t.title}"></div>`:""}  
            </div>`);var t=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const n=t(eventspublic),l=t(eventsstaff);var e=t(eventsarchive),t=t(eventspromo);const o=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const c=stir.filter(t=>"Yes"===t.isPublic&&t.endInt>=o()),p=stir.filter(t=>"Yes"!==t.isPublic);var s=stir.filter(t=>t.endInt<o()),r=stir.filter(t=>t.promo);const u=stir.join(""),g=(t,e)=>t.startInt-e.startInt;const v=(t,e)=>t.pin-e.pin,m=stir.curry((t,e)=>{return!!t.filter(t=>t===e).length}),h=(t,e)=>{var s=[];for(d=new Date(t);d<=new Date(e);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},f=()=>{var t=new Date,t=new Date(t.setDate(t.getDate()+(0-t.getDay())%7)),e=new Date;return e.setDate(t.getDate()+6),{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},D=()=>{var t=new Date,t=new Date(t.setDate(t.getDate()+(7-t.getDay())%7)),e=new Date;return e.setDate(t.getDate()+6),{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},S=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth(),1),t=new Date(t.getFullYear(),t.getMonth()+1,0);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},w=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth()+1,1),t=new Date(t.getFullYear(),t.getMonth()+2,0);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},I=t=>"thisweek"===t?h(f().start,f().end):"nextweek"===t?h(D().start,D().end):"thismonth"===t?h(S().start,S().end):"nextmonth"===t?h(w().start,w().end):null,$=stir.curry((e,t)=>{t=h(t.start,t.end).map(t=>m(e,t));return stir.any(t=>t,t)}),y=(eventspublicfilters.querySelector("input[type=radio]").checked=!0,eventsstafffilters.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(t=>t.id));stir.compose(n,u,a,stir.sort(v),stir.sort(g),c)(y),stir.compose(l,u,a,stir.sort(g),p)(y),stir.compose(e,u,a,stir.sort((t,e)=>e.startInt-t.startInt),s)(y),stir.compose(t,u,stir.map(t=>`<div class="u-bg-grey u-p-2" >
                <p>${t.title}</p>
            </div>`),stir.sort(g),c,r)(y),eventspublicfilters.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=I(t))?(t=$(t),t=stir.filter(t,y),(t=stir.compose(u,a,stir.sort(v),stir.sort(g),c)(t)).length?n(t):n(i())):(t=stir.compose(u,a,stir.sort(v),stir.sort(g),c)(y)).length?n(t):n(i()))}),eventsstafffilters.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,t=I(t),console.log(t),t?(t=$(t),t=stir.filter(t,y),(t=stir.compose(u,a,stir.sort(v),stir.sort(g),p)(t)).length?l(t):l(i())):(t=stir.compose(u,a,stir.sort(v),stir.sort(g),p)(y)).length?l(t):l(i()))})}}();