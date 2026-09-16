!function(t){if(t&&stir.feeds&&stir.feeds.data){var a=`
             <table>
                 <caption>Full time courses starting in January</caption>
                 <thead>
                     <tr><th>Course</th><th>Year of entry</th></tr>
                 </thead>
                 <tbody>
                     ${stir.feeds.data.filter(t=>t.janfull&&0<Object.keys(t.janfull).length).sort((t,a)=>t.title.localeCompare(a.title)).map(t=>{return t=((e=t).portalapply?e.portalapply.split(", ").map(t=>t.trim()):[]).map((t,a)=>`<a href="https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=${t}">${e.prefix.split(" / ")[a]} ${e.title}</a>`).join(", "),`<tr>
                <td>
                ${e.portalapply?t:""}
                </td>
                <td>${e.janfull.split(",").join(", ")}</td>
            </tr>`;var e}).join("")}
                 </tbody>
             </table>`;t&&(t.innerHTML=a)}}(stir.node("#course-list"));