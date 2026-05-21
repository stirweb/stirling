!function(t){if(t)if(stir.feeds&&stir.feeds.data){const a=stir.curry(a=>{var t=(a.portalapply?a.portalapply.split(", ").map(t=>t.trim()):[]).map((t,r)=>`<a href="https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=${t}">${a.prefix.split(" / ")[r]} ${a.title}</a>`).join(", ");return`<tr>
                <td>
                ${a.portalapply?t:""}
                </td>
                <td>${a.janfull.split(",").join(", ")}</td>
            </tr>`});var r=stir.curry(t=>`
             <table>
                 <caption>Full time courses starting in January</caption>
                 <thead>
                     <tr><th>Course</th><th>Year of entry</th></tr>
                 </thead>
                 <tbody>
                     ${t.map(t=>a(t)).join("")}
                 </tbody>
             </table>`)(stir.feeds.data.filter(t=>t.janfull&&0<Object.keys(t.janfull).length).sort((t,r)=>t.title.localeCompare(r.title)));t&&(t.innerHTML=r)}else console.error("Course data feed not found")}(stir.node("#course-list"));