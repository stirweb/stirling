!function(){if(stir.node("#eventsrevamp")){var t=stir.node("#eventspublic"),e=stir.node("#eventsstaff"),s=stir.node("#eventsarchive"),i=stir.node("#eventspromo"),r=stir.node("#eventspublicfilters"),a=stir.node("#eventsstafffilters"),n=stir.node("#eventsarchivefilters");const o=(t,e)=>`<div class="c-search-result__image"><img src="${t}" width="275" height="275" alt="Image: ${e}"></div>`,c=t=>`<div class="c-search-result__tags">
                <span class="c-search-tag">${t}</span>
            </div>`,p=t=>`<p>Part of the ${t} series.</p>`,u=()=>'<div class="u-bg-white u-p-3"><p>No events found</p></div>';const m=stir.map(t=>`
            <div class="c-search-result  ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event" ${t.pin<0?'data-label-icon="pin"':""} >
                ${t.isSeries?c("Event series"):""} 
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
                    ${t.isSeriesChild?p(t.isSeriesChild):""}
                </div>
                ${t.image?o(t.image,t.title):""}  
            </div>`),g=stir.map(t=>` <div class="c-search-result ${t.image?"c-search-result__with-thumbnail":""}" data-result-type="event"  >
                ${t.isSeries?c("Event series"):""} 
                <div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1 ">
                    <p class="u-text-regular u-m-0">
                        <strong><a href="${t.url}">${t.title}</a></strong>
                    </p>
                    <div class="flex-container flex-dir-column u-gap-8">
                        <div class="flex-container u-gap-16 align-middle">
                            <span class="u-icon h5 uos-calendar"></span>
                            <span><time datetime="${t.start}">${t.stirStart}</time> – <time datetime="${t.end}">${t.stirEnd}</time></span>
                        </div>
                    </div>
                    <p class="u-m-0">${t.summary}</p>
                    ${t.isSeriesChild?p(t.isSeriesChild):""}
                </div>
                ${t.image?o(t.image,t.title):""}  
            </div>`);var l=stir.curry((t,e)=>(stir.setHTML(t,e),!0));const v=l(t),h=l(e),$=l(s);t=l(i);const f=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const S=stir.filter(t=>"Yes"===t.isPublic),D=stir.filter(t=>"Yes"!==t.isPublic);const x=stir.filter(t=>t.endInt<f());const w=stir.filter(t=>t.endInt>=f());e=stir.filter(t=>t.promo);const y=stir.join(""),I=(t,e)=>t.startInt-e.startInt,b=(t,e)=>e.startInt-t.startInt,T=(t,e)=>t.pin-e.pin,_=stir.filter(t=>t.recording),k=stir.curry((t,e)=>{return!!t.filter(t=>t===e).length}),O=(t,e)=>{var s=[];for(d=new Date(t);d<=new Date(e);d.setDate(d.getDate()+1))s.push(new Date(d).toISOString().split("T")[0]);return s},E=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(0-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},C=()=>{var t=new Date,e=new Date(t.setDate(t.getDate()+(7-t.getDay())%7)),t=new Date(t.setDate(t.getDate()+6));return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},Y=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth(),2),t=new Date(t.getFullYear(),t.getMonth()+1,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},F=()=>{var t=new Date,e=new Date(t.getFullYear(),t.getMonth()+1,2),t=new Date(t.getFullYear(),t.getMonth()+2,1);return{start:e.toISOString().split("T")[0],end:t.toISOString().split("T")[0]}},M=t=>"thisweek"===t?O(E().start,E().end):"nextweek"===t?O(C().start,C().end):"thismonth"===t?O(Y().start,Y().end):"nextmonth"===t?O(F().start,F().end):null,L=stir.curry((e,t)=>{t=O(t.start,t.end).map(t=>k(e,t));return stir.any(t=>t,t)}),P=(r.querySelector("input[type=radio]").checked=!0,a.querySelector("input[type=radio]").checked=!0,n.querySelector("input[type=radio]").checked=!0,stir.feeds.events.filter(t=>t.id));stir.compose(v,y,m,stir.sort(T),stir.sort(I),S,w)(P),stir.compose(h,y,m,stir.sort(I),D,w)(P),stir.compose($,y,g,stir.sort(b),x)(P),stir.compose(t,y,stir.map(t=>`
          <div class="grid-x grid-padding-x u-bg-grey u-p-2 u-mb-2">
            <div class="cell small-12 ${t.image?"medium-8":""} ">
                ${t.isSeries?c("Event series"):""}
                <p class="u-text-regular u-mb-2">
                    <strong><a href="${t.url}">${t.title}</a></strong>
                </p>
                <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
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
                <p class="u-m-0 text-sm">${t.summary}</p>
                ${t.isSeriesChild?p(t.isSeriesChild):""}
            </div>
            ${t.image?`<div class="cell medium-4"><img src="${t.image}" width="500" height="500" alt="Image: ${t.title}" /></div>`:""}  
        </div>`),e,stir.sort(I))(P),r.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=M(t))?(t=L(t),t=stir.filter(t,P),(t=stir.compose(y,m,stir.sort(T),stir.sort(I),isPublicFilte,w)(t)).length?v(t):v(u())):(t=stir.compose(y,m,stir.sort(T),stir.sort(I),S,w)(P)).length?v(t):v(u()))}),a.addEventListener("click",t=>{"radio"===t.target.type&&(t=t.target.value,(t=M(t))?(t=L(t),t=stir.filter(t,P),(t=stir.compose(y,m,stir.sort(T),stir.sort(I),D,w)(t)).length?h(t):h(u())):(t=stir.compose(y,m,stir.sort(T),stir.sort(I),D,w)(P)).length?h(t):h(u()))}),n.addEventListener("click",t=>{var e;"radio"===t.target.type&&("all"===t.target.value&&((e=stir.compose(y,g,stir.sort(b),x)(P)).length?$(e):$(u())),"recordings"===t.target.value&&((e=stir.compose(y,g,stir.sort(b),_,x)(P)).length?$(e):$(u())),"public"===t.target.value&&((e=stir.compose(y,g,stir.sort(b),S,x)(P)).length?$(e):$(u())),"staffstudent"===t.target.value)&&((e=stir.compose(y,g,stir.sort(b),D,x)(P)).length?$(e):$(u()))})}}();