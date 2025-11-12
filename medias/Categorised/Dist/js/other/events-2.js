!function(){const d=document.querySelector("#eventsstaff"),l=document.querySelector("#eventspublic"),c=document.querySelector("#eventsart"),u=document.querySelector("#eventsarchive"),p=document.querySelector("#eventspromo"),m=document.querySelector("#eventswebinars");const g="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Devent&",v=e=>e.end===e.start?`<time datetime="${e.startISO}">${e.start}</time>`:`<time datetime="${e.startISO}">${e.start}</time> - <time datetime="${e.endISO}">${e.end}</time>`,f=(t,e)=>{return t?(e=e&&e.find(e=>e.title===t))?`<p class="text-sm">Part of the <a href="${e?e.url:"#"}">${t}</a> series.</p>`:`<p class="text-sm">Part of the <strong>${t}</strong> series.</p>`:""},h=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),b=stir.curry((e,t)=>{var a="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},i=t.custom_fields,s=D(i.d,i.e);return`
          <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event">
                  <div class="u-grid-medium-up u-gap-24  ">
                    <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                        <p class="u-text-regular u-m-0">
                            <strong><a href="${t.url}">${i.h1_custom}</a></strong>
                        </p>
                        <div class="u-flex flex-dir-column u-gap-8">
                            <div class="u-flex u-gap-16 align-middle">
                                  <span class="u-icon h5 uos-calendar"></span>
                                  <span>${v(s)}</span>
                            </div>
                        </div>
                        <p class="u-m-0">${i.snippet}</p>
                        ${f(a.isSeriesChild,e)}
                    </div>

                  </div>
            </div>`}),$=(e,t)=>`
      <div class="u-flex u-gap-16 align-middle">
        <span class="uos-clock u-icon h5"></span>
        <span><time>${e}</time> – <time>${t}</time></span>
      </div>`,y=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",r=stir.curry((e,t)=>{var a,i,s,r,n,o;return t.hide?"":(a="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},i=t.custom_fields,o=(n=D(t.start,t.end)).start===n.end,s=stir.favourites&&stir.favourites.getFav(i.sid,"event"),r=t.repeater?i.sid+"|"+new Date(t.start).getTime():i.sid,`
        <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event"
          data-label-icon="${a.isSeries?"startdates":""}" data-perf="172580">
          ${a.isSeries?`
        <div class="u-absolute u-top--16">
            <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Event series</span>
        </div>`:""}
         
            <div class="u-grid-medium-up u-gap-24 ${i.image?"u-grid-cols-3_1":""}">
                <div class=" u-flex flex-dir-column u-gap u-mt-1">
                    <p class="u-text-regular u-m-0">
                        ${y(a.cancelled)} ${y(a.rescheduled)} <strong><a href="${t.url}">${i.h1_custom}</a></strong>
                    </p>
                    <div class="u-flex flex-dir-column u-gap-8">
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span>${v(n)}</span>
                    </div>
                    ${o?$(t.startTime,t.endTime):""}
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-location "></span>
                        <span>${a.location||""}</span>
                    </div>
                    </div>
                    <p class="u-m-0">${i.snippet||""}</p>
                    ${f(a.isSeriesChild,e)}
                </div>
                ${n=i.image,o=i.h1_custom,n?`<div class="u-mt-1">
            <img src="${n}" width="275" height="275" alt="Image: ${o}"></div>
         </div>`:"<div></div>"}
                <div class="u-mt-2">
                    <div id="favbtns${r}">${s&&h("true",s,r)}</div>
                 </div>
            </div>
        </div>`)}),S=stir.curry((e,t)=>{var a=t.custom_fields,i=D(a.d,a.e),s="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},r=stir.favourites&&stir.favourites.getFav(a.sid,"event"),n=t.repeater?a.sid+"|"+new Date(t.start).getTime():a.sid,o=i.start===i.end;return`<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${a.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?renderTab("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${y(s.cancelled)} ${y(s.rescheduled)} <strong><a href="${t.url}">${a.h1_custom}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span>${v(i)}</span>
                      </div>
                     ${o?$(i.start,i.end):""}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                          <span>${s.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${a.snippet}</p>
                  ${t.isSeriesChild?f(t.isSeriesChild,e):""}
                 </div>
                   <div id="favbtns${n}">${r&&h("true",r,n)}</div>
                </div>
            </div>
            ${a.image?`<div class="cell medium-4"><img src="${a.image}" class="u-object-cover" width="800" height="800" alt="Image: ${a.h1_custom}" /></div>`:""}  
        </div>`}),x=e=>{var t=e.custom_fields,a=stir.favourites&&stir.favourites.getFav(t.sid,"webinar"),i=t.sid,s=D(t.d,t.e),r=new Date(t.d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),n=new Date(t.e).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZoneName:"short"});return`<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" 
              data-result-type="event" data-label-icon="computer" data-perf="${t.sid}">
                <div class="u-absolute u-top--16">
                  <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Webinar</span>
                </div> 
                <div class="u-grid-medium-up u-gap-24  ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1">
                      <p class="u-text-regular u-m-0">
                          <strong> <a href="${e.url}">${t.h1_custom}</a> </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${t.d}">${s.start}</time> </span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>${r}</time> – <time>${n}</time></span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-computer"></span>
                              <span>Online</span>
                          </div>
                      </div>
                      <div class="u-m-0">${t.snippet}</div>
                      <div id="favbtns${i}">${a&&h("true",a,i)}</div>
                  </div>
                 </div>
            </div>`},w=e=>`<div class="loadmorebtn u-flex align-center u-mb-2"><button class="button hollow tiny" data-page="${e}">Load more results</button></div>
        `,_=e=>`<div id="eventsarchive" class="cell large-8 large-order-2 u-mt-3-small ">
            <div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No events found.</p></div>
          </div>`,D=(e,t)=>{var a={day:"numeric",month:"long",year:"numeric"},e=new Date(e),t=new Date(t);return{start:e.toLocaleDateString("en-GB",a),end:t.toLocaleDateString("en-GB",a),startISO:e.toISOString().slice(0,10),endISO:t.toISOString().slice(0,10)}},T=()=>(new Date).toISOString();function L(e,t){var a=[{"custom_fields.tag":"Archive"},{range:{"custom_fields.e":{gt:"2015-01-01",lt:T()}}}],e=("All"!==e&&a.push({"custom_fields.tag":e}),{and:a});return`&limit=${t}&order=desc&filter=${encodeURIComponent(JSON.stringify(e))}&sort=custom_fields.e&`}const t=(e,t,a)=>{e={and:[{"custom_fields.tag":a},{not:{"custom_fields.tag":"Promo"}},{range:{"custom_fields.e":{gt:e,lt:t}}}]};return"Art Collection"!==a&&e.and.push({not:{"custom_fields.tag":"Art Collection"}}),e},n=e=>"staff"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(t(T(),"2099-12-31","StaffStudent")))}&sort=custom_fields.sort&`:"art"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(t(T(),"2099-12-31","Art Collection")))}&sort=custom_fields.sort&`:"public"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(t(T(),"2099-12-31","Public")))}&sort=custom_fields.sort&`:void 0;function M(e,t){e=new Date(e);return e.setFullYear(t.getFullYear()),e.setMonth(t.getMonth()),e.setDate(t.getDate()),e}function j(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,i=new Date(a.getFullYear(),a.getMonth()+1,1);return t<=new Date(a.getFullYear(),a.getMonth()+2,0)&&i<=e}function N(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,i=new Date(a.getFullYear(),a.getMonth(),1);return t<=new Date(a.getFullYear(),a.getMonth()+1,0)&&i<=e}function O(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,i=new Date(a.getFullYear(),a.getMonth(),a.getDate()-a.getDay());return t<=new Date(a.getFullYear(),a.getMonth(),a.getDate()+6-a.getDay())&&i<=e}function I(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,i=new Date(a.getFullYear(),a.getMonth(),a.getDate()+7-a.getDay());return t<=new Date(a.getFullYear(),a.getMonth(),a.getDate()+13-a.getDay())&&i<=e}const a=a=>{const i=stir.favourites.getFav(a,"event");document.querySelectorAll(`[id*="favbtns${a}"]`).forEach(e=>{var t=h("true",i,a);e.innerHTML=t})},E=()=>e=>{var t,e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(t=e.dataset.id.split("|")[0],stir.favourites.addToFavs(t,"event"),a(t)),"removefav"===e.dataset.action)&&(t=e.dataset.id.split("|")[0],stir.favourites.removeFromFavs(t),a(t))};function H(e,t,i,a){t=n(t);const s=r(a);fetch(e+t+"page=1").then(e=>e.json()).then(e=>{const o=[];const a=e.hits.map(s=>{const i=s.custom_fields,r=i.d.split("T")[1].split(":")[0]+":"+i.d.split("T")[1].split(":")[1],n=i.e.split("T")[1].split(":")[0]+":"+i.e.split("T")[1].split(":")[1];let e=!1;i.data&&Array.isArray(i.data)&&(0<(t=i.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.type&&"perf"===e.type)return e}).map(e=>JSON.parse(decodeURIComponent(e)))).length&&(t.forEach(e=>{var t=e.start.split("T")[1].split(":")[0]+":"+e.start.split("T")[1].split(":")[1],a=e.end.split("T")[1].split(":")[0]+":"+e.end.split("T")[1].split(":")[1],i=Number(String(e.pin).substring(0,10)),e={...s,...e,startTime:t,endTime:a,sort:i,repeater:!0};o.push(e)}),s.hide=!0),0<i.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.repeat)return e}).map(e=>JSON.parse(decodeURIComponent(e))).length)&&(e=!0,function(e,t){for(var a=[],i=new Date(e),s=new Date;i<=new Date(t);)s<i&&a.push(new Date(i)),i.setDate(i.getDate()+7);return a}(i.d,i.e).slice(0,5).forEach(e=>{var t=M(i.d,e),e=M(i.e,e),a=Number(t.toISOString().replace(/\D/g,"").slice(0,10)),t={...s,start:t.toISOString(),startTime:r,end:e.toISOString(),endTime:n,sort:a,repeater:!1};o.push(t)}),s.hide=!0);var t={start:i.d,end:i.e,startTime:r,endTime:n,sort:i.sort,repeater:e};return{...s,...t}}).concat(o).sort((e,t)=>e.sort-t.sort);e=a.map(s).join(""),i.innerHTML=e,e=i.parentNode.querySelectorAll("input[type='radio']");e&&e.forEach(e=>{e.checked=!1,"all"===e.value&&(e.checked=!0)}),e&&e.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();var t,e=e.target.value;"thisweek"===e&&(t=a.filter(O).map(s).join(""),i.innerHTML=t),"nextweek"===e&&(t=a.filter(I).map(s).join(""),i.innerHTML=t),"thismonth"===e&&(t=a.filter(N).map(s).join(""),i.innerHTML=t),"nextmonth"===e&&(t=a.filter(j).map(s).join(""),i.innerHTML=t),"all"===e&&(t=a.map(s).join(""),i.innerHTML=t)})}),i.addEventListener("click",E())})}function C(t,e,a){e=e.find(e=>t.id.includes(e.id));if(e&&e.id&&(!e||""===e.node.innerHTML.trim()))if("_1_5"===e.id){var r=g;var n=e.node;var i=a;var s=n.parentNode.querySelectorAll("input[type='radio']");const o=b(i);s&&s.forEach(e=>{e.checked=!1,"All"===e.value&&(e.checked=!0)}),i=L("All",10),fetch(r+i+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=e.hits.map(o).join(""),t=1<t?w(2):"";n.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e)),n.addEventListener("click",function(i){if("BUTTON"===i.target.tagName){const s=i.target.getAttribute("data-page");var e=L(n.parentNode.querySelector("input[type='radio']:checked").value,10);fetch(r+e+("page="+s)).then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,a=Number(s),e=e.hits.map(o).join(""),a=(i.target.parentNode.remove(),a<t?w(Number(s)+1):"");n.insertAdjacentHTML("beforeend",e+a)}).catch(e=>console.error("Error fetching data:",e))}}),s&&s.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();e=L(e.target.value,10);fetch(r+e+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=0===Number(e.total_hits)?_():e.hits.map(o).join(""),t=1<t?w(2):"";n.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e))})})}else H(g,e.type,e.node,a)}(async()=>{const t=await async function(){var e=g+`&limit=50&order=asc&filter=${encodeURIComponent(JSON.stringify({and:[{"custom_fields.tag":"Series"}]}))}&sort=custom_fields.sort`;try{return(await(await fetch(e)).json()).hits.map(e=>{return{title:("object"==typeof e.custom_fields.data?Object.assign({},...e.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{}).isSeries,url:e.url}})}catch(e){throw console.error("Error fetching data:",e),e}}(),a=[{id:"_1_1",node:d,type:"staff"},{id:"_1_2",node:l,type:"public"},{id:"_1_3",node:c,type:"art"},{id:"_1_5",node:u,type:"archive"}];p&&(e=g,i=p,s=t,n={and:[{"custom_fields.tag":"Promo"},{range:{"custom_fields.e":{gt:T(),lt:"2099-12-31"}}}]},n=`&limit=1&order=asc&filter=${encodeURIComponent(JSON.stringify(n))}&sort=custom_fields.sort&`,fetch(e+n+"page=1").then(e=>e.json()).then(e=>{0<e.total_hits&&(e=S(s,e.hits[0]),i.innerHTML=e||""),i.addEventListener("click",E())}).catch(e=>console.error("Error fetching data:",e))),l&&(l.innerHTML=""),d&&(d.innerHTML=""),c&&(c.innerHTML=""),u&&(u.innerHTML=""),m&&(m.innerHTML=""),m&&(r=m,e={and:[{range:{"custom_fields.e":{gt:T(),lt:"2099-12-31"}}}]},e=`&limit=90&order=asc&filter=${encodeURIComponent(JSON.stringify(e))}&sort=custom_fields.d&`,fetch("https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Dwebinar&"+e+"page=1").then(e=>e.json()).then(e=>{if(e&&0!==e.length){const a=e.hits.map(e=>{var t=e.custom_fields,t={start:t.d,end:t.e};return{...e,...t}});e=a.map(x).join(""),e=(r.innerHTML=e,r.parentNode.querySelectorAll("input[type='radio']"));e&&e.forEach(e=>{e.checked=!1,"all"===e.value&&(e.checked=!0)}),e&&e.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();var t,e=e.target.value;"thisweek"===e&&(t=a.filter(O).map(x).join(""),r.innerHTML=t||_()),"nextweek"===e&&(t=a.filter(I).map(x).join(""),r.innerHTML=t||_()),"thismonth"===e&&(t=a.filter(N).map(x).join(""),r.innerHTML=t||_()),"nextmonth"===e&&(t=a.filter(j).map(x).join(""),r.innerHTML=t||_()),"all"===e&&(t=a.map(x).join(""),r.innerHTML=t||_())})}),r.addEventListener("click",E())}else r.innerHTML=_()}).catch(e=>console.error("Error fetching data:",e)));var i,s,r,e,n=document.querySelectorAll('[data-behaviour="tabs"] button'),o=document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]')?document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]'):document.querySelector('.pseudotab[aria-expanded="true"]');o&&(o=o.getAttribute("aria-controls"),C(document.getElementById(o),a,t)),n.forEach(e=>{e.addEventListener("click",async e=>{e=e.target.getAttribute("aria-controls");C(document.getElementById(e),a,t)})})})()}();