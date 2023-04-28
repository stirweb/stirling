!function(){if(stir.node("#eventsrevamp")){const s=()=>'<div class="u-bg-white u-p-3"><p>No events found</p></div>';const r=stir.map(t=>`
            <div class="c-search-result ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${t.pin?'data-label-icon="pin"':""} >
                ${t.isSeries?`<div class="c-search-result__tags">
                    <span class="c-search-tag">Event series</span>
                </div>`:""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                        <strong><a href="">${t.title}</a></strong>
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
            </div>`);var t=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const i=t(eventspublic),a=t(eventsstaff);t=t(eventsarchive);const n=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const l=stir.filter(t=>"Yes"===t.isPublic&&t.endInt>=n()),o=stir.filter(t=>"Yes"!==t.isPublic);var e=stir.filter(t=>t.endInt<n());const c=stir.join(""),p=(t,e)=>t.startInt-e.startInt;const u=(t,e)=>e.pin-t.pin,g=stir.curry((t,e)=>{return!!t.filter(t=>t===e).length}),v=(t,e)=>{var s=[];for(d=new Date(t);d<=new Date(e);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},m=()=>{var t=new Date,t=new Date(t.setDate(t.getDate()+(0-t.getDay())%7)),e=new Date;return e.setDate(t.getDate()+6),{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},h=()=>{var t=new Date,t=new Date(t.setDate(t.getDate()+(7-t.getDay())%7)),e=new Date;return e.setDate(t.getDate()+6),{start:t.toISOString().split("T")[0],end:e.toISOString().split("T")[0]}},f=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth(),1),t=new Date(t.getFullYear(),t.getMonth()+1,0);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},D=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth()+1,1),t=new Date(t.getFullYear(),t.getMonth()+2,0);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},S=t=>"thisweek"===t?v(m().start,m().end):"nextweek"===t?v(h().start,h().end):"thismonth"===t?v(f().start,f().end):"nextmonth"===t?v(D().start,D().end):null,w=stir.curry((e,t)=>{t=v(t.start,t.end).map(t=>g(e,t));return stir.any(t=>t,t)}),I=(eventspublicfilters.querySelector("input[type=radio]").checked=!0,eventsstafffilters.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(t=>t.id));stir.compose(i,c,r,stir.sort(u),stir.sort(p),l)(I),stir.compose(a,c,r,stir.sort(p),o)(I),stir.compose(t,c,r,stir.sort((t,e)=>e.startInt-t.startInt),e)(I),eventspublicfilters.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=S(t))?(t=w(t),t=stir.filter(t,I),(t=stir.compose(c,r,stir.sort(u),stir.sort(p),l)(t)).length?i(t):i(s())):(t=stir.compose(c,r,stir.sort(u),stir.sort(p),l)(I)).length?i(t):i(s()))}),eventsstafffilters.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,t=S(t),console.log(t),t?(t=w(t),t=stir.filter(t,I),(t=stir.compose(c,r,stir.sort(u),stir.sort(p),o)(t)).length?a(t):a(s())):(t=stir.compose(c,r,stir.sort(u),stir.sort(p),o)(I)).length?a(t):a(s()))})}}();