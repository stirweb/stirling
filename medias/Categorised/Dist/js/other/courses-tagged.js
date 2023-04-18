!function(t){if(!t)return;const n=stir.curry((t,i)=>{const s=t=>t;return stir.all(s,stir.map(r=>{var t=stir.map(t=>-1!==r.value.indexOf(t.trim()),i[r.name].split(","));return stir.any(s,t)},t))}),o=stir.curry((t,r)=>(t.innerHTML=r,t)),p=t=>`
        <div class="cell small-12 u-padding-top ">
          <h3 class="header-stripped"><a href="${t.url}">${t.prefix} ${t.title}</a></h3>
          <p><strong>${t.starts} </strong></p>
          <p>${t.description}</p>
          <!-- <p class="debug">Modes: ${t.mode}<br> 
          Awards: ${t.award}</p> -->
        </div>`,c=stir.courses||[];c.length&&t.forEach(t=>{var r=c,i=(console.log("main"),i=Object.entries(t.dataset),stir.filter(t=>""!==t.value,stir.map(t=>({name:t[0],value:t[1].trim()}),i))),t=o(t),i=stir.filter(n(i)),s=stir.sort((t,r)=>t.title>r.title?1:r.title>t.title?-1:0),e=stir.filter(t=>t.title),a=stir.map(p),l=stir.join("");return stir.compose(t,l,a,s,i,e,stir.clone)(r)})}(stir.nodes(".courselisting"));