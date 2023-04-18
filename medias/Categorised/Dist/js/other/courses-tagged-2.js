!function(t){if(!t)return;"localhost"!=window.location.hostname&&window.location.hostname;const o=t=>stir.map(t=>({name:t[0],value:t[1].trim()}),t),l=(t,e,s,r,i)=>{var l=Object.entries(e.dataset),a=[{name:"subject",value:i}],l=o(l),l=stir.filter(t=>""!==t.value,l),a=[...l,...a],a=stir.filter(t=>""!==t.value,a),r=stir.filter(t=>t.title,r),l=stir.filter(n(l),r),r=stir.filter(n(a),l),a=l.map(t=>t.subject).join(", ").split(", "),l=stir.removeDuplicates(a).sort(),a=(p(s,u(l,i)),t.dataset.render||""),s=stir.sort((t,e)=>t.title>e.title?1:e.title>t.title?-1:0),l=c(a),i=p(e);stir.compose(i,l,s)(r)},n=stir.curry((t,s)=>{const r=t=>t;return stir.all(r,stir.map(e=>{var t=stir.map(t=>-1!==e.value.indexOf(t.trim()),s[e.name].split(","));return stir.any(r,t)},t))}),c=stir.curry((t,e)=>("compact"===t?stir.map(s,e):stir.map(r,e)).join("")),u=(t,e)=>`<option value="">Filter by subject...</option>
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
			</div>`,p=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),a=stir.courses||[];a.length&&t.forEach(t=>{{var e=t,s=a;t=e.querySelector(".filtersbox");const r=e.querySelector(".resultbox"),i=(p(t,`
          <label class="show-for-sr" for="subjectsfilter">Filter by subject</label>
          <select id="subjectsfilter">
			        <option value="">Filter by subject...</option>
			      </select>`),t.querySelector("select"));return i&&i.addEventListener("change",t=>{t.preventDefault();t=t.target.options[t.target.selectedIndex].value;return l(e,r,i,s,t)}),l(e,r,i,s,"")}})}(stir.nodes(".courselisting"));