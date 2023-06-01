!function(){var e=document.head.querySelector("[name=sid][content]");if(e)for(var t=document.querySelectorAll('a[data-section-id="'+e.getAttribute("content")+'"][data-type="event"]'),i=0;i<t.length;i++)t[i].parentNode.removeChild(t[i])}(),function(e){if(e){e&&(e.value=window.location.href);e=stir.node("#copyurl");e&&e.addEventListener("click",e=>(async()=>{await navigator.clipboard.writeText(window.location.href)})())}}(stir.node("#shareurl")),function(e){if(e){const i=e,t=i.dataset&&i.dataset.seriesid?i.dataset.seriesid:null,n=(e,t)=>e?`<h3 class="header-stripped ${t}">${e}</h3>`:"";const s=stir.map((e,t)=>`
        <div class="${t%2==1?"":"u-bg-grey"} ${0===t?"u-heritage-line-top u-border-width-5":""} u-p-1 c-event-list u-gap">
          <div class="u-w-500">
            <span class="u-inline-block u-mb-1"><strong>Event</strong><br />
            <a href="${e.url}">${e.title}</a></span><br />
            <strong >Date:</strong> ${e.stirStart} <br />
            <strong>Time:</strong> ${e.startTime} - ${e.endTime}
          </div>
          <div><span class="u-inline-block u-mb-1"><strong>Description</strong><br />${e.summary} </div>
          <div><span class="u-inline-block u-mb-1"><strong>Audience</strong><br />${e.isPublic?"Public":"Staff / students"} </div>
          <div>${e.recording?'<span class="u-inline-block u-mb-1"><strong>Recording</strong><br />Available':""} </div>
        </div>`),r=stir.join(""),o=()=>{var e=new Date;return Number(e.toISOString().split("T")[0].split("-").join(""))};const a=stir.filter(e=>e.endInt>=o());const d=stir.filter(e=>e.endInt<o()),l=stir.filter(e=>e.isSeriesChild===t);const c=stir.curry((e,t)=>(stir.setHTML(e,t),!0));console.log(UoS_env.name);e="dev"===(e=UoS_env.name)?"index.json":"preview"===e?'<t4 type="navigation" id="5214" />':"/data/events/revamp/json/index.json";stir.getJSON(e,e=>{var t=stir.compose(r,s,a,l)(e),e=stir.compose(r,s,d,l)(e),t=t.length?n("Upcoming","")+t:"",e=e.length?n("Passed","u-mt-2")+e:"";c(i,t+e)})}}(stir.node("#seriesevents"));