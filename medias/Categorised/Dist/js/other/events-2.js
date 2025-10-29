!function(){const d=document.querySelector("#eventsstaff"),l=document.querySelector("#eventspublic"),u=document.querySelector("#eventsart"),c=document.querySelector("#eventsarchive"),p=document.querySelector("#eventspromo"),m=document.querySelector("#eventswebinars");const v="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Devent&",g=e=>e.end===e.start?`<time datetime="${e.startISO}">${e.start}</time>`:`<time datetime="${e.startISO}">${e.start}</time> - <time datetime="${e.endISO}">${e.end}</time>`,f=(t,e)=>{return t?(e=e&&e.find(e=>e.title===t))?`<p class="text-sm">Part of the <a href="${e?e.url:"#"}">${t}</a> series.</p>`:`<p class="text-sm">Part of the ${t} series.</p>`:""},h=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),b=stir.curry((e,t)=>{var a="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},s=t.custom_fields,i=D(s.d,s.e);return`
          <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event">
                  <div class="u-grid-medium-up u-gap-24  ">
                    <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                        <p class="u-text-regular u-m-0">
                            <strong><a href="${t.url}">${s.h1_custom}</a></strong>
                        </p>
                        <div class="u-flex flex-dir-column u-gap-8">
                            <div class="u-flex u-gap-16 align-middle">
                                  <span class="u-icon h5 uos-calendar"></span>
                                  <span>${g(i)}</span>
                            </div>
                        </div>
                        <p class="u-m-0">${s.snippet}</p>
                        ${f(a.isSeriesChild,e)}
                    </div>

                  </div>
            </div>`}),$=(e,t)=>`
      <div class="u-flex u-gap-16 align-middle">
        <span class="uos-clock u-icon h5"></span>
        <span><time>${e}</time> – <time>${t}</time></span>
      </div>`,y=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",r=stir.curry((e,t)=>{var a,s,i,r,n,o;return t.hide?"":(a="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},s=t.custom_fields,o=(n=D(t.start,t.end)).start===n.end,i=stir.favourites&&stir.favourites.getFav(s.sid,"event"),r=t.repeater?s.sid+"|"+new Date(t.start).getTime():s.sid,`
        <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event"
          data-label-icon="${a.isSeries?"startdates":""}" data-perf="172580">
          ${a.isSeries?`
        <div class="u-absolute u-top--16">
            <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Event series</span>
        </div>`:""}
         
            <div class="u-grid-medium-up u-gap-24 ${s.image?"u-grid-cols-3_1":""}">
                <div class=" u-flex flex-dir-column u-gap u-mt-1">
                    <p class="u-text-regular u-m-0">
                        ${y(a.cancelled)} ${y(a.rescheduled)} <strong><a href="${t.url}">${s.h1_custom}</a></strong>
                    </p>
                    <div class="u-flex flex-dir-column u-gap-8">
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span>${g(n)}</span>
                    </div>
                    ${o?$(t.startTime,t.endTime):""}
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-location "></span>
                        <span>${a.location||""}</span>
                    </div>
                    </div>
                    <p class="u-m-0">${s.snippet||""}</p>
                    ${f(a.isSeriesChild,e)}
                </div>
                ${n=s.image,o=s.h1_custom,n?`<div class="u-mt-1">
            <img src="${n}" width="275" height="275" alt="Image: ${o}"></div>
         </div>`:"<div></div>"}
                <div class="u-mt-2">
                    <div id="favbtns${r}">${i&&h("true",i,r)}</div>
                 </div>
            </div>
        </div>`)}),S=stir.curry((e,t)=>{var a=t.custom_fields,s=D(a.d,a.e),i="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},r=stir.favourites&&stir.favourites.getFav(a.sid,"event"),n=t.repeater?a.sid+"|"+new Date(t.start).getTime():a.sid,o=s.start===s.end;return`<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${a.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?renderTab("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${y(i.cancelled)} ${y(i.rescheduled)} <strong><a href="${t.url}">${a.h1_custom}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span>${g(s)}</span>
                      </div>
                     ${o?$(s.start,s.end):""}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                          <span>${i.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${a.snippet}</p>
                  ${t.isSeriesChild?f(t.isSeriesChild,e):""}
                 </div>
                   <div id="favbtns${n}">${r&&h("true",r,n)}</div>
                </div>
            </div>
            ${a.image?`<div class="cell medium-4"><img src="${a.image}" class="u-object-cover" width="800" height="800" alt="Image: ${a.h1_custom}" /></div>`:""}  
        </div>`}),x=e=>{var t=stir.favourites&&stir.favourites.getFav(e.id,"webinar"),a=e.id;return`<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" 
              data-result-type="event" data-label-icon="computer" data-perf="${e.perfId}">
                <div class="u-absolute u-top--16">
                  <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Webinar</span>
                </div> 
                <div class="u-grid-medium-up u-gap-24  ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1">
                      <p class="u-text-regular u-m-0">
                          <strong> <a href="${e.url}">${e.title}</a> </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${e.start}">${e.stirStart}</time> </span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>${e.startTime}</time> – <time>${e.endTime}</time> ${e.timezone}</span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-computer "></span>
                              <span>Online</span>
                          </div>
                      </div>
                      <div class="u-m-0">${e.summary}</div>
                      <div id="favbtns${a}">${t&&h("true",t,a)}</div>
                  </div>
                 </div>
            </div>`},w=e=>`<div class="loadmorebtn u-flex align-center u-mb-2"><button class="button hollow tiny" data-page="${e}">Load more results</button></div>
        `,_=e=>`<div id="eventsarchive" class="cell large-8 large-order-2 u-mt-3-small ">
            <div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No events found.</p></div>
          </div>`,D=(e,t)=>{var a={day:"numeric",month:"long",year:"numeric"},e=new Date(e),t=new Date(t);return{start:e.toLocaleDateString("en-GB",a),end:t.toLocaleDateString("en-GB",a),startISO:e.toISOString().slice(0,10),endISO:t.toISOString().slice(0,10)}},T=()=>(new Date).toISOString();function I(e,t){var a=[{"custom_fields.tag":"Archive"},{range:{"custom_fields.e":{gt:"2015-01-01",lt:T()}}}],e=("All"!==e&&a.push({"custom_fields.tag":e}),{and:a});return`&limit=${t}&order=desc&filter=${encodeURIComponent(JSON.stringify(e))}&sort=custom_fields.e&`}const t=(e,t,a)=>{e={and:[{"custom_fields.tag":a},{not:{"custom_fields.tag":"Promo"}},{range:{"custom_fields.e":{gt:e,lt:t}}}]};return"Art Collection"!==a&&e.and.push({not:{"custom_fields.tag":"Art Collection"}}),e},n=e=>"staff"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(t(T(),"2099-12-31","StaffStudent")))}&sort=custom_fields.sort&`:"art"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(t(T(),"2099-12-31","Art Collection")))}&sort=custom_fields.sort&`:"public"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(t(T(),"2099-12-31","Public")))}&sort=custom_fields.sort&`:void 0;function O(e,t){e=new Date(e);return e.setFullYear(t.getFullYear()),e.setMonth(t.getMonth()),e.setDate(t.getDate()),e}function L(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,s=new Date(a.getFullYear(),a.getMonth()+1,1);return t<=new Date(a.getFullYear(),a.getMonth()+2,0)&&s<=e}function M(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,s=new Date(a.getFullYear(),a.getMonth(),1);return t<=new Date(a.getFullYear(),a.getMonth()+1,0)&&s<=e}function N(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,s=new Date(a.getFullYear(),a.getMonth(),a.getDate()-a.getDay());return t<=new Date(a.getFullYear(),a.getMonth(),a.getDate()+6-a.getDay())&&s<=e}function j(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,s=new Date(a.getFullYear(),a.getMonth(),a.getDate()+7-a.getDay());return t<=new Date(a.getFullYear(),a.getMonth(),a.getDate()+13-a.getDay())&&s<=e}const a=a=>{const s=stir.favourites.getFav(a,"event");document.querySelectorAll(`[id*="favbtns${a}"]`).forEach(e=>{var t=h("true",s,a);e.innerHTML=t})},E=()=>e=>{var t,e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(t=e.dataset.id.split("|")[0],stir.favourites.addToFavs(t,"event"),a(t)),"removefav"===e.dataset.action)&&(t=e.dataset.id.split("|")[0],stir.favourites.removeFromFavs(t),a(t))};function C(e,t,s,a){t=n(t);const i=r(a);fetch(e+t+"page=1").then(e=>e.json()).then(e=>{const o=[];const a=e.hits.map(i=>{const s=i.custom_fields,r=s.d.split("T")[1].split(":")[0]+":"+s.d.split("T")[1].split(":")[1],n=s.e.split("T")[1].split(":")[0]+":"+s.e.split("T")[1].split(":")[1];let e=!1;s.data&&Array.isArray(s.data)&&(s.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.type&&"perf"===e.type)return e}).map(e=>JSON.parse(decodeURIComponent(e))).forEach(e=>{var t=e.start.split("T")[1].split(":")[0]+":"+e.start.split("T")[1].split(":")[1],a=e.end.split("T")[1].split(":")[0]+":"+e.end.split("T")[1].split(":")[1],s=Number(String(e.pin).substring(0,10)),e={...i,...e,startTime:t,endTime:a,sort:s,repeater:!0};o.push(e)}),0<s.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.repeat)return e}).map(e=>JSON.parse(decodeURIComponent(e))).length)&&(e=!0,function(e,t){for(var a=[],s=new Date(e),i=new Date;s<=new Date(t);)i<s&&a.push(new Date(s)),s.setDate(s.getDate()+7);return a}(s.d,s.e).slice(0,5).forEach(e=>{var t=O(s.d,e),e=O(s.e,e),a=Number(t.toISOString().replace(/\D/g,"").slice(0,10)),t={...i,start:t.toISOString(),startTime:r,end:e.toISOString(),endTime:n,sort:a,repeater:!1};o.push(t)}),i.hide=!0);var t={start:s.d,end:s.e,startTime:r,endTime:n,sort:s.sort,repeater:e};return{...i,...t}}).concat(o).sort((e,t)=>e.sort-t.sort);e=a.map(i).join(""),s.innerHTML=e,e=s.parentNode.querySelectorAll("input[type='radio']");e&&e.forEach(e=>{e.checked=!1,"all"===e.value&&(e.checked=!0)}),e&&e.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();var t,e=e.target.value;"thisweek"===e&&(t=a.filter(N).map(i).join(""),s.innerHTML=t),"nextweek"===e&&(t=a.filter(j).map(i).join(""),s.innerHTML=t),"thismonth"===e&&(t=a.filter(M).map(i).join(""),s.innerHTML=t),"nextmonth"===e&&(t=a.filter(L).map(i).join(""),s.innerHTML=t),"all"===e&&(t=a.map(i).join(""),s.innerHTML=t)})}),s.addEventListener("click",E())})}function A(t,e,a){e=e.find(e=>e.id===t.id);if(e&&e.id&&(!e||""===e.node.innerHTML.trim()))if("panel_1_5"===e.id){var r=v;var n=e.node;var s=a;var i=n.parentNode.querySelectorAll("input[type='radio']");const o=b(s);i&&i.forEach(e=>{e.checked=!1,"All"===e.value&&(e.checked=!0)}),s=I("All",10),fetch(r+s+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=e.hits.map(o).join(""),t=1<t?w(2):"";n.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e)),n.addEventListener("click",function(s){if("BUTTON"===s.target.tagName){const i=s.target.getAttribute("data-page");var e=I(n.parentNode.querySelector("input[type='radio']:checked").value,10);fetch(r+e+("page="+i)).then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,a=Number(i),e=e.hits.map(o).join(""),a=(s.target.parentNode.remove(),a<t?w(Number(i)+1):"");n.insertAdjacentHTML("beforeend",e+a)}).catch(e=>console.error("Error fetching data:",e))}}),i&&i.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();e=I(e.target.value,10);fetch(r+e+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=0===Number(e.total_hits)?_():e.hits.map(o).join(""),t=1<t?w(2):"";n.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e))})})}else C(v,e.type,e.node,a)}(async()=>{const t=await async function(){var e=v+`&limit=50&order=asc&filter=${encodeURIComponent(JSON.stringify({and:[{"custom_fields.tag":"Series"}]}))}&sort=custom_fields.sort`;try{return(await(await fetch(e)).json()).hits.map(e=>{return{title:e.custom_fields.h1_custom,url:e.url}})}catch(e){throw console.error("Error fetching data:",e),e}}(),a=[{id:"panel_1_1",node:d,type:"staff"},{id:"panel_1_2",node:l,type:"public"},{id:"panel_1_3",node:u,type:"art"},{id:"panel_1_5",node:c,type:"archive"}];p&&(n=v,s=p,i=t,o={and:[{"custom_fields.tag":"Promo"},{range:{"custom_fields.e":{gt:T(),lt:"2099-12-31"}}}]},o=`&limit=1&order=asc&filter=${encodeURIComponent(JSON.stringify(o))}&sort=custom_fields.sort&`,fetch(n+o+"page=1").then(e=>e.json()).then(e=>{0<e.total_hits&&(e=S(i,e.hits[0]),s.innerHTML=e||""),s.addEventListener("click",E())}).catch(e=>console.error("Error fetching data:",e))),l&&(l.innerHTML=""),d&&(d.innerHTML=""),u&&(u.innerHTML=""),c&&(c.innerHTML=""),m&&(m.innerHTML=""),m&&(r=m,t,fetch("./webinars.json").then(e=>e.json()).then(e=>{e=e.filter(e=>"Webinar"===e.type).map(x).join("");r.innerHTML=e,r.addEventListener("click",E())}).catch(e=>console.error("Error fetching data:",e)));var s,i,r,e,n=document.querySelectorAll('[data-behaviour="tabs"] [role="tab"]'),o=document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]');o&&(e=o.getAttribute("aria-controls"),A(document.getElementById(e),a,t)),n.forEach(e=>{e.addEventListener("click",async e=>{e=e.target.getAttribute("aria-controls");A(document.getElementById(e),a,t)})})})()}();