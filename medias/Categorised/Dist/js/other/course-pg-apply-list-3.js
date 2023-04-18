!function(t){if(!t)return;const e=(t,s)=>stir.filter(t=>{if(t.subject&&t.subject.includes(s))return t},t);var s,i,r=stir.curry((t,s)=>(t.innerHTML=s,t)),l=stir.t4Globals.subjects.subjects||[],a=stir.t4Globals.applycodes||[];l.length&&a.length&&(l=stir.clone(l),l=stir.map(t=>t.value,l).sort(),a=stir.clone(a),r(t,((r=l).length?`
      <ul class="anchorlist">
          ${stir.map(t=>`<li><a href="#${t.split(" ").join("_")}">${t}</a></li>`,r).join("")}
      </ul>`:"").concat((s=a,i={taught:"https://portal.stir.ac.uk/student/course-application/pg/application.jsp?crsCode=",research:"https://portal.stir.ac.uk/student/course-application/pgr/application.jsp?crsCode="},""+stir.map(t=>""+((t,s,i)=>{const r=e(t,s);return r.length?`
      <h2 class="u-padding-top" id="${s.split(" ").join("_")}">${s}</h2> 
      <ul>
        ${stir.map(t=>`<li>
                <a href="${i[t.type]}${t.code}">${t.title} (${t.code})</a>
              </li>`,r).join("")}
      </ul>`:""})(s,t,i),l).join("")))))}(stir.node("#course-subject--listing"));