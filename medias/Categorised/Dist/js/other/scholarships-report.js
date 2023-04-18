!function(){var t=stir.jsonscholarships.scholarships||[],e=stir.node("#report"),i=stir.node("#overdue");if(t.length&&e){const r=Number((new Date).toISOString().split("T")[0].replaceAll("-",""));e.innerHTML=t.filter(t=>t.title).map(t=>(console.log(t),`
          <div class="u-border-solid u-p-2 u-mt-2">
              <p><strong>${t.title}</strong></p>

              <div><strong>Deadline:</strong> ${t.deadlineFormatted||"N/A"} |  
                  <a href="https://stiracuk-cms01-production.terminalfour.net/terminalfour/page/content#edit/${t.sid}/${t.cid}" class="u-border-bottom-solid" target="_blank">Edit this scholarship</a> | 
                  <a href="${t.url}" class="u-border-bottom-solid">Preview page</a></div>
              
              <div class="u-mt-1"><strong>Last edited:</strong> ${t.lastEditedFormatted} by ${t.lastEditedBy}</div>
              <div class="u-mb-1"><strong>Owner:</strong> ${t.owner}</div>
              
              <div><strong>Metadata:</strong></div> 
              <div>${t.metadata}</div>
              <div><strong>Teaser:</strong></div> 
              <div>${t.teaser}</div>

              <div class="u-mt-1"><strong>Study Level (tag):</strong> ${t.studyLevel}</div>
              <div><strong>Fee Status (tag):</strong> ${t.feeStatus}</div>
              <div><strong>Nationalities (tag):</strong> ${t.nationality}</div>
              <div><strong>Promoted Subjects (Tag):</strong> ${t.promotedSubject}</div>
              <div><strong>Value:</strong> ${t.value}</div>
              <div><strong>Awards:</strong> ${t.awards}</div>
          </div>`)).join(""),i.innerHTML=t.filter(t=>t.title).filter(t=>{if(t.deadline&&Number(t.deadline)<r)return t}).sort((t,e)=>t.deadline-e.deadline).map(t=>`
        <div class="u-mb-1">
          <strong>${t.title}</strong>. (Deadline: ${t.deadlineFormatted}). <a class="u-border-bottom-solid" href="https://stiracuk-cms01-production.terminalfour.net/terminalfour/page/section#edit/${t.sid}">Edit section</a>
        </div>`).join("")}}();