!function(){var t=document.head.querySelector("[name=sid][content]");if(t)for(var e=document.querySelectorAll('a[data-section-id="'+t.getAttribute("content")+'"][data-type="event"]'),r=0;r<e.length;r++)e[r].parentNode.removeChild(e[r])}(),function(t){if(t){t&&(t.value=window.location.href);t=stir.node("#copyurl");t&&t.addEventListener("click",t=>(async()=>{await navigator.clipboard.writeText(window.location.href)})())}}(stir.node("#shareurl")),function(t){if(t){const s=t,e=s.dataset&&s.dataset.seriesid?s.dataset.seriesid:null,n=stir.node("#seriesdatefilter"),a=(t,e)=>t?`<h3 class="header-stripped ${e}">${t}</h3>`:"",r=t=>`<span class="u-bg-heritage-berry u-white c-tag u-mr-1 u-inline-block u-mb-1">${t}</span>`;const o=t=>`<option value="${t.startInt}">${t.stirStart}</option>`,i=stir.curry((t,e)=>""===t||e.startInt===Number(t)?e:void 0),l=t=>({start:t.start,stirStart:t.stirStart,startInt:t.startInt}),d=t=>t.start,c=stir.map((t,e)=>{return`
        <div class="${e%2==1?"":"u-bg-grey"} ${0===e?"u-heritage-line-top u-border-width-5":""} u-p-1 c-event-list u-gap">
          <div >
            ${t.cancelled?r("Cancelled"):""}${t.rescheduled?r("Rescheduled"):""}
            <span class="u-inline-block u-mb-1"><strong>Event</strong><br />
            <a href="${t.url}">${t.title}</a></span><br />
            <strong >Date:</strong> ${t.stirStart} <br />
            <strong>Time:</strong> ${t.startTime} - ${t.endTime}
          </div>
          <div><span class="u-inline-block u-mb-1"><strong>Description</strong><br />${t.summary} </span></div>
          <div><span class="u-inline-block u-mb-1">${e=t.audience,e.trim?"<strong>Audience</strong><br />"+e.replaceAll(",","<br/>"):""}</span></div>
          <div><span class="u-inline-block u-mb-1">${t.recording?'<strong>Recording</strong><br /><a href="https://www.youtube.com/watch?v=n_uFzLPYDd8">Available</a>':""}</span></div>
        </div>`}),u=stir.join(""),g=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join("")+("0"+t.getHours()).slice(-2)+("0"+t.getMinutes()).slice(-2))},p=(t,e)=>t.startInt-e.startInt;const h=stir.filter(t=>t.endInt>=g());const v=stir.filter(t=>t.endInt<g()),m=stir.filter(t=>t.isSeriesChild===e);const b=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),f=(t,e)=>{t=stir.filter(i(t)),t=stir.compose(u,c,stir.sort(p),t,h,m)(e);return t.length?a("Upcoming","")+t:""};t="dev"===(t=UoS_env.name)?"index.json":"preview"===t?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";stir.getJSON(t,r=>{const i=(t=>{t=stir.compose(u,c,stir.sort(p),v,m)(t);return t.length?a("Passed","u-mt-2")+t:""})(r);b(s,f("",r)+i),n&&(b(n,'<option value="">Filter by date</option>'+(t=>{t=((e,r)=>{var i={},s=[];for(let t=0;t<e.length;t++)i[e[t][r]]||(i[e[t][r]]=!0,s.push(e[t]));return s})(stir.compose(stir.map(l),stir.sort(p),h,m,stir.filter(d))(t),"startInt");return stir.compose(u,stir.map(o))(t)})(r)),n.addEventListener("change",t=>{var e=f(n.options[n.selectedIndex].value,r);b(s,e+i)}))})}}(stir.node("#seriesevents")),function(t){t&&gallery&&galleryId&&stir.curry((t,e)=>(stir.setHTML(t,e),!0))(t,gallery.map(t=>`<img alt="Stirling AMAM Golf Day 2019" class="u-object-cover"  src="https://farm${t.farm}.staticflickr.com/${t.server}/${t.id}_${t.secret}_c.jpg" width="${t.o_width}" height="${t.o_height}"></img>`).join("")+`<div>
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