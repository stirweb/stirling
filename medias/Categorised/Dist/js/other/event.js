!function(t){if(t){t&&(t.value=window.location.href);t=stir.node("#copyurl");t&&t.addEventListener("click",t=>(async()=>{await navigator.clipboard.writeText(window.location.href)})())}}(stir.node("#shareurl")),function(){const a=stir.node("#seriesevents"),r=a&&a.dataset&&a.dataset.seriesid?a.dataset.seriesid:null,l=stir.node("#seriesdatefilter"),o=stir.node("#moreevents");if(a||o){const e=(t,r)=>t?`<h3 class="header-stripped ${r}">${t}</h3>`:"",s=t=>`<span class="u-bg-heritage-berry u-white c-tag u-mr-1 u-inline-block u-mb-1">${t}</span>`;const d=t=>`<option value="${t.start}">${t.stirStart}</option>`;const c=stir.map(t=>{return`<a href="#" class="u-border u-p-1 u-mb-1 flex-container flex-dir-column large-flex-dir-row   u-gap">
                <span class="u-flex1"><strong>${t.title}</strong></span>
                <span class="flex-container align-middle u-gap u-grey--dark">
                    <strong>${t.stirStart} ${t=t,t.stirStart===t.stirEnd?"":"- "+t.stirEnd}</strong>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1080 800"
                        stroke-width="1.5" stroke="none" style="width: 20px; height:20px">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M315.392 9.728c0 8.192 4.096 16.384 10.24 22.528l413.696 415.744-413.696 415.744c-12.288 12.288-12.288 32.768 0 47.104 12.288 12.288 32.768 12.288 47.104 0l438.272-438.272c12.288-12.288 12.288-34.816 0-47.104l-440.32-438.272c-12.288-12.288-32.768-12.288-47.104 0-6.144 6.144-8.192 14.336-8.192 22.528z" />
                    </svg>
                </span>
            </a>`}),u=stir.filter((t,r)=>r<3),i=stir.curry((t,r)=>""===t||r.start===t?r:void 0),g=t=>({start:t.start,stirStart:t.stirStart,startInt:t.startInt}),p=stir.curry((r,e)=>{var s={},i=[];for(let t=0;t<e.length;t++)s[e[t][r]]||(s[e[t][r]]=!0,i.push(e[t]));return i}),h=t=>t.start,n=stir.map((t,r)=>{return`
        <div class="${r%2==1?"":"u-bg-grey"} ${0===r?"u-heritage-line-top u-border-width-5":""} u-p-1 c-event-list u-gap">
          <div >
            ${t.cancelled?s("Cancelled"):""}${t.rescheduled?s("Rescheduled"):""}
            <span class="u-inline-block u-mb-1"><strong>Event</strong><br />
            <a href="${t.url}">${t.title}</a></span><br />
            <strong >Date:</strong> ${t.stirStart} <br />
            <strong>Time:</strong> ${t.startTime} - ${t.endTime}
          </div>
          <div><span class="u-inline-block u-mb-1"><strong>Description</strong><br />${t.summary} </span></div>
          <div><span class="u-inline-block u-mb-1">${r=t.audience,r.trim?"<strong>Audience</strong><br />"+r.replaceAll(",","<br/>"):""}</span></div>
          <div><span class="u-inline-block u-mb-1">${t.recording?'<strong>Recording</strong><br /><a href="https://www.youtube.com/watch?v=n_uFzLPYDd8">Available</a>':""}</span></div>
        </div>`}),v=stir.join(""),m=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join("")+("0"+t.getHours()).slice(-2)+("0"+t.getMinutes()).slice(-2))},f=(t,r)=>t.startInt-r.startInt;const w=stir.filter(t=>t.endInt>=m());const b=stir.filter(t=>Number(t.endInt)<m()&&t.archive.length),$=stir.filter(t=>t.isSeriesChild===r),x=(t,r)=>Number(t.pin)-Number(r.pin);const k=stir.curry((t,r)=>(stir.setHTML(t,r),!0)),y=stir.curry((t,r)=>{t=t.split(", ");if(!t&&!t.length)return r;if(1===t.length&&""===t[0])return r;const e=r.tags.split(", ");t=t.map(t=>e.includes(t));return stir.any(t=>t,t)?r:void 0}),C=(t,r)=>{t=stir.filter(i(t)),t=stir.compose(v,n,stir.sort(f),t,w,$)(r);return t.length?e("Upcoming","")+t:""},I=(t,r)=>{t=stir.filter(i(t)),t=stir.compose(v,n,stir.sort(f),t,b,$)(r);return t.length?e("Passed","u-mt-2")+t:""};var t="dev"===(t=UoS_env.name)?"index.json":"preview"===t?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";stir.getJSON(t,s=>{if(!s.error&&(console.log(s),a&&l&&(r=I("",s),k(a,C("",s)+r),k(l,'<option value="">Filter by date</option>'+(r=s,t=p("start"),stir.compose(v,stir.map(d),t,stir.map(g),stir.sort(f),$,stir.filter(h))(r))),l.addEventListener("change",t=>{var r=C(l.options[l.selectedIndex].value,s),e=I(l.options[l.selectedIndex].value,s);k(a,r+e)})),o)){var t=s;var r=p("id");const n=o.dataset.currentid||null;var e=n?stir.filter(t=>t.id===Number(n),t):null,e=e.length?e[0]:null,e=e?e.tags:null,e=stir.filter(y(e)),i=stir.filter(t=>t.id!==Number(n)),e=stir.compose(i,e,stir.sort(f),w)(t),i=stir.compose(i,stir.sort(x),stir.sort(f),w)(t),t=[...e,...i];stir.compose(k(o),v,c,u,r)(t)}})}}(),function(t){t&&gallery&&galleryId&&stir.curry((t,r)=>(stir.setHTML(t,r),!0))(t,gallery.map(t=>{return`<img alt="${t.title.length?t.title:"Flickr image "+t.id}" class="u-object-cover"  src="https://farm${t.farm}.staticflickr.com/${t.server}/${t.id}_${t.secret}_c.jpg" width="${t.o_width}" height="${t.o_height}"></img>`}).join("")+`<div>
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