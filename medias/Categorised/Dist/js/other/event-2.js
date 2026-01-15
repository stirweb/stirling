const getObject=(e,t,n)=>{return{and:[{"custom_fields.tag":n},{range:{"custom_fields.e":{gt:e,lt:t}}}]}},getNow=()=>(new Date).toISOString(),getFilterString=(e,t)=>"upcoming"===t?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getObject(getNow(),"2099-12-31",e)))}&sort=custom_fields.sort&`:`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getObject("2015-01-01",getNow(),e)))}&sort=custom_fields.sort&`;function getEvery7Days(e,t){for(var n=[],r=new Date(e),i=new Date;r<=new Date(t);)i<r&&n.push(new Date(r)),r.setDate(r.getDate()+7);return n}function combineDateAndTime(e,t){e=new Date(e);return e.setFullYear(t.getFullYear()),e.setMonth(t.getMonth()),e.setDate(t.getDate()),e}const getEventDateTimes=(e,t)=>{var n={day:"numeric",month:"long",year:"numeric"},e=new Date(e),t=new Date(t);return{start:e.toLocaleDateString("en-GB",n),end:t.toLocaleDateString("en-GB",n)}},renderAudience=e=>{e=e.filter(e=>"Public"===e||"StaffStudent"===e).map(e=>"StaffStudent"===e?"Staff, Students":e).join(",");return e.trim?"<strong>Audience</strong><br />"+e.replaceAll(",","<br/>"):""},renderEndDate=e=>e.start===e.end?"":"- "+e.end,renderMoreEvent=e=>{var t=e.custom_fields,n=getEventDateTimes(t.d,t.e);return`<a href="${e.url}" class="u-border u-p-1 u-mb-1 flex-container flex-dir-column large-flex-dir-row   u-gap">
                <span class="u-flex1"><strong>${t.h1_custom}</strong></span>
                <span class="flex-container align-middle u-gap u-dark-grey">
                    <strong>${n.start} ${renderEndDate(n)}</strong>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1080 800"
                        stroke-width="1.5" stroke="none" style="width: 20px; height:20px">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M315.392 9.728c0 8.192 4.096 16.384 10.24 22.528l413.696 415.744-413.696 415.744c-12.288 12.288-12.288 32.768 0 47.104 12.288 12.288 32.768 12.288 47.104 0l438.272-438.272c12.288-12.288 12.288-34.816 0-47.104l-440.32-438.272c-12.288-12.288-32.768-12.288-47.104 0-6.144 6.144-8.192 14.336-8.192 22.528z" />
                    </svg>
                </span>
            </a>`},renderLink=e=>e.url?`<a href="${e.url}" class="u-underline">${e.custom_fields.name}</a><br />`:e.custom_fields.name+"<br />",renderInfoTag=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-inline-block u-mb-tiny u-mr-1">${e}</span>`:"",renderEvent=(e,t)=>{var n="object"==typeof e.custom_fields.data?Object.assign({},...e.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},r=e.custom_fields,i=getEventDateTimes(e.start,e.end),s=new Date(r.d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),a=new Date(r.e).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZoneName:"short"});return`
            <div class="u-bg-white ${0===t?"u-heritage-line-top u-border-width-5":"u-grey-line-top "} u-p-1 c-event-list u-gap">
                <div>
                    ${n.cancelled?renderInfoTag("Cancelled"):""}
                    ${n.rescheduled?renderInfoTag("Rescheduled"):""}
                    <span class="u-inline-block u-mb-1">
                        <strong>Event</strong><br />
                        ${renderLink(e)}
                        <strong>Date:</strong> ${i.start} ${i.end!==i.start?" - "+i.end:""}<br />
                        <strong>Time:</strong> ${s} - ${a}
                    </span>
                </div>
                <div>
                    <span class="u-inline-block u-mb-1">
                        <strong>Description</strong><br />
                        ${r.snippet}<br />
                        <strong>Location</strong><br />
                        ${n.location}.
                    </span>
                </div>
                <div>
                    <span class="u-inline-block u-mb-1">
                        ${renderAudience(r.tag)}
                    </span>
                </div>
                <div>
                    <span class="u-inline-block u-mb-1">
                        ${r.tag.includes("Recording")?`<strong>Recording</strong><br /><a href="${n.recordingLink}">Available</a>`:""}
                    </span>
                </div>
            </div>`};async function doPast(e,t,n){n=getFilterString(n,"past");fetch(e+n+"page=1").then(e=>e.json()).then(e=>{e=e.hits.map(e=>{var t=e.custom_fields,n=t.d.split("T")[1].split(":")[0]+":"+t.d.split("T")[1].split(":")[1],r=t.e.split("T")[1].split(":")[0]+":"+t.e.split("T")[1].split(":")[1],n={start:t.d,end:t.e,startTime:n,endTime:r,sort:t.sort,repeater:null};return{...e,...n}}).map(renderEvent).join("");t.innerHTML=e})}async function doUpcoming(e,n,t,r){t=getFilterString(t,"upcoming");fetch(e+t+"page=1").then(e=>e.json()).then(e=>{const o=[];var e=e.hits.map(i=>{const r=i.custom_fields,s=r.d.split("T")[1].split(":")[0]+":"+r.d.split("T")[1].split(":")[1],a=r.e.split("T")[1].split(":")[0]+":"+r.e.split("T")[1].split(":")[1];let e=!1;r.data&&Array.isArray(r.data)&&(r.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.type&&"perf"===e.type)return e}).map(e=>JSON.parse(decodeURIComponent(e))).forEach(e=>{var t=e.start.split("T")[1].split(":")[0]+":"+e.start.split("T")[1].split(":")[1],n=e.end.split("T")[1].split(":")[0]+":"+e.end.split("T")[1].split(":")[1],r=Number(String(e.pin).substring(0,10)),e={...i,...e,startTime:t,endTime:n,sort:r,repeater:!0};o.push(e)}),0<r.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.repeat)return e}).map(e=>JSON.parse(decodeURIComponent(e))).length)&&(e=!0,getEvery7Days(r.d,r.e).slice(0,5).forEach(e=>{var t=combineDateAndTime(r.d,e),e=combineDateAndTime(r.e,e),n=Number(t.toISOString().replace(/\D/g,"").slice(0,10)),t={...i,start:t.toISOString(),startTime:s,end:e.toISOString(),endTime:a,sort:n,repeater:!1};o.push(t)}),i.hide=!0);var t={start:r.d,end:r.e,startTime:s,endTime:a,sort:r.sort,repeater:e};return{...i,...t}}).concat(o).sort((e,t)=>e.sort-t.sort).filter(e=>!e.hide),t=r.map(e=>{var t={sort:Number(String(e.pin).slice(0,10))};return{...e,...t}}),e=e.concat(t).sort((e,t)=>e.sort-t.sort).map(renderEvent).join("");n.innerHTML=e})}async function doMoreEvents(e,t,n){n={and:[{not:{"custom_fields.sid":n}},{range:{"custom_fields.e":{gt:getNow(),lt:"2090-12-31"}}}]},n=`&limit=3&order=asc&filter=${encodeURIComponent(JSON.stringify(n))}&sort=custom_fields.sort&`;fetch(e+n).then(e=>e.json()).then(e=>{t.innerHTML=e.hits.map(renderMoreEvent).join("")})}(async()=>{var e,t,n,r="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Devent&resultType=organic&",i=window.miniEvents&&window.miniEvents.length?window.miniEvents.map(e=>JSON.parse(e)):[],i=stir.flatten(i).filter(e=>e.id),s=document.getElementById("seriesevents"),a=document.getElementById("moreevents");s&&(e=document.getElementById("serieseventspast"),t="SeriesChildof"+s.getAttribute("data-seriesid"),n=r+"customField=series%3D",s&&await doUpcoming(n,s,t,stir.flatten(i)),e)&&await doPast(n,e,t),a&&doMoreEvents(r,a,a.getAttribute("data-currentid"))})(),function(e){e&&gallery&&galleryId&&stir.curry((e,t)=>(stir.setHTML(e,t),!0))(e,gallery.map(e=>{return`<img alt="${e.title.length?e.title:"Flickr image "+e.id}" class="u-object-cover"  src="https://farm${e.farm}.staticflickr.com/${e.server}/${e.id}_${e.secret}_c.jpg" width="${e.o_width}" height="${e.o_height}"></img>`}).join("")+`<div>
              <svg width="70px" height="70px" viewBox="0 -13 47 47" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Color-" transform="translate(-501.000000, -474.000000)">
                        <g id="Flickr" transform="translate(501.000000, 474.000000)">
                            <path d="M46.8292683,10.1695828 C46.8292683,15.7864719 42.2171072,20.3418803 36.5173021,20.3418803 C30.8119899,20.3418803 26.1970752,15.7864719 26.1970752,10.1695828 C26.1970752,4.55540841 30.8119899,0 36.5173021,0 C42.2171072,0 46.8292683,4.55540841 46.8292683,10.1695828" fill="#FF007F">
                            </path>
                            <path d="M20.6294395,10.1695828 C20.6294395,15.7864719 16.0145249,20.3418803 10.3092127,20.3418803 C4.61216113,20.3418803 0,15.7864719 0,10.1695828 C0,4.55540841 4.61216113,0 10.3092127,0 C16.0145249,0 20.6294395,4.55540841 20.6294395,10.1695828" fill="#0960D5">
                            </path>
                        </g>
                    </g>
                </g>
              </svg>
              <a href="https://www.flickr.com/photos/79498756@N04/albums/${galleryId}" class="button expanded heritage-green">View the album on Flickr</a>
            </div>`)}(stir.node("#flickrgallery"));