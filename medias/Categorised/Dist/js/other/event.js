!function(){var t=document.head.querySelector("[name=sid][content]");if(t)for(var e=document.querySelectorAll('a[data-section-id="'+t.getAttribute("content")+'"][data-type="event"]'),i=0;i<e.length;i++)e[i].parentNode.removeChild(e[i])}(),function(t){if(t){t&&(t.value=window.location.href);t=stir.node("#copyurl");t&&t.addEventListener("click",t=>(async()=>{await navigator.clipboard.writeText(window.location.href)})())}}(stir.node("#shareurl")),function(t){if(t){const i=t,e=i.dataset&&i.dataset.seriesid?i.dataset.seriesid:null,n=(t,e)=>t?`<h3 class="header-stripped ${e}">${t}</h3>`:"";const s=stir.map((t,e)=>`
        <div class="${e%2==1?"":"u-bg-grey"} ${0===e?"u-heritage-line-top u-border-width-5":""} u-p-1 c-event-list u-gap">
          <div class="u-w-500">
            <span class="u-inline-block u-mb-1"><strong>Event</strong><br />
            <a href="${t.url}">${t.title}</a></span><br />
            <strong >Date:</strong> ${t.stirStart} <br />
            <strong>Time:</strong> ${t.startTime} - ${t.endTime}
          </div>
          <div><span class="u-inline-block u-mb-1"><strong>Description</strong><br />${t.summary} </div>
          <div><span class="u-inline-block u-mb-1"><strong>Audience</strong><br />${t.isPublic?"Public":"Staff / students"} </div>
          <div>${t.recording?'<span class="u-inline-block u-mb-1"><strong>Recording</strong><br />Available':""} </div>
        </div>`),r=stir.join(""),o=()=>{var t=new Date;return Number(t.toISOString().split("T")[0].split("-").join(""))};const a=stir.filter(t=>t.endInt>=o());const d=stir.filter(t=>t.endInt<o()),l=stir.filter(t=>t.isSeriesChild===e);const c=stir.curry((t,e)=>(stir.setHTML(t,e),!0));stir.getJSON("index.json",t=>{var e=stir.compose(r,s,a,l)(t),t=stir.compose(r,s,d,l)(t),e=e.length?n("Upcoming","")+e:"",t=t.length?n("Passed","u-mt-2")+t:"";c(i,e+t)})}}(stir.node("#seriesevents"));