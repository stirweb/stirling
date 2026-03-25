!function(t){if(!t)return;"localhost"!=window.location.hostname&&window.location.hostname;const l=(t,e,s,r,i)=>{var l=Object.entries(e.dataset),a=[{name:"subject",value:i}],l=p(l),l=stir.filter(t=>""!==t.value,l),a=[...l,...a],a=stir.filter(t=>""!==t.value,a),r=stir.filter(t=>t.title,r),l=stir.filter(o(l),r),r=stir.filter(o(a),l),a=l.map(t=>t.subject).join(", ").split(", "),l=stir.removeDuplicates(a).sort(),a=(u(s,c(l,i)),t.dataset.render||""),s=stir.sort((t,e)=>t.title>e.title?1:e.title>t.title?-1:0),l=n(a),i=u(e);stir.compose(i,l,s)(r)},o=stir.curry((t,s)=>{const r=t=>t;return stir.all(r,stir.map(e=>{var t=s[e.name].split(",").map(t=>""!==t.trim()&&-1!==e.value.indexOf(t.trim()));return stir.any(r,t)},t))}),n=stir.curry((t,e)=>("compact"===t?stir.map(s,e):stir.map(r,e)).join("")),c=(t,e)=>`<option value="">Filter by subject...</option>
			`+t.map(t=>`<option value="${t}" ${t===e?"selected":""}>${t}</option>`).join(""),s=t=>`
			<div class="cell small-12 medium-4 u-pt-2">
			  <div class="u-green-line-top">
				  <h3 class="header-stripped u-my-1 "><a href="${t.url}" class="c-link">${t.prefix} ${t.title}</a></h3>
				  <p class="u-my-1 text-sm"><strong>Start dates: </strong><br />${t.starts}</p>
				  <p class="text-sm"><strong>Duration: </strong><br />${t.duration}, ${t.mode}</p> 
			  </div>
			</div>`,r=t=>`
			<div class="cell small-12 medium-4  u-pt-2">
        <div class="u-green-line-top">
          <h3 class="header-stripped u-my-1"><a href="${t.url}" class="c-link" >${t.prefix} ${t.title}</a></h3>
          <p class="text-sm"><strong>${t.starts} </strong></p>
          <p class="text-sm">${t.description}</p>
        </div>
			</div>`,u=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),p=t=>stir.map(t=>({name:t[0],value:t[1].trim()}),t),a=stir.courses||[];a.length&&t.forEach(t=>{{var e=t,s=a;t=e.querySelector(".filtersbox");const r=e.querySelector(".resultbox"),i=(u(t,`
          <label class="show-for-sr" for="subjectsfilter">Filter by subject</label>
          <select id="subjectsfilter">
			        <option value="">Filter by subject...</option>
			    </select>`),t.querySelector("select"));return i&&i.addEventListener("change",t=>{t.preventDefault();t=t.target.options[t.target.selectedIndex].value;return l(e,r,i,s,t)}),l(e,r,i,s,"")}})}(stir.nodes(".courselisting"));