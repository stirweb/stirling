!function(e){if(e){const n=e;var e=stir.node("#open_mobile_menu"),t=stir.node("#close_mobile_menu");const s=stir.node("ul.sitemenu-2"),a=["main","footer","#layout-header",".breadcrumbs-container"],i={default:s.innerHTML},o=()=>'<li><a class="button button--left-align expanded button--back secondary u-m-0 text-left" href="/">Home</a>',r=e=>e?`<li class="u-bg-heritage-green">
            <a class="button button--left-align heritage-green expanded button--back u-m-0 text-left" href="${e.p}">
                ${e.t}
            </a>
        </li>`:"",c=e=>e?`<li class="u-underline u-energy-teal--40 ">
            <a class="button no-arrow button--left-align subtle expanded u-m-0 text-left " href="${e.p}" data-action="go">
              <div class="flex-container align-middle u-gap-16">  
                <span class="u-flex1">${e.t} home</span>
                <span class="u-chevron-right"></span>
                </div>
            </a>
        </li>`:"",l=e=>{var t=e.u||e.p;return e?`
        <li class="u-underline u-energy-teal--40 flex-container align-middle">
            <a class="button no-arrow button--left-align clear expanded u-m-0 text-left" href="${t}">
              <div class="flex-container align-middle u-gap-16"> 
                <span class="u-flex1">${e.t}</span>
                <span class="u-chevron-right"></span>
              </div>
            </a>
        </li>`:""},d=e=>{var t;return t="p",[...new Map(e.map(e=>[e[t],e])).values()].map(l).join("")},u=e=>{var t=e.slice(0,-1).lastIndexOf("/"),t=-1==t?e.length:t+1;return e.substring(0,t)},p=(e,t,n)=>{const a=t.split("/").length+1;var i=e.filter(e=>{if(e.p&&e.p.split("/").length===a&&e.p.includes(t))return e});if(!i.length&&"click"===n)return"";n=e.filter(e=>{if(e.p===t)return e});const l=u(t);e=e.filter(e=>{if(e.p===l)return e});return o()+r(e[0])+c(n[0])+d(i)},f=(t,n,a)=>{const i=t.split("/")[1];l=i;var e,l="dev"===UoS_env.name||"qa"===UoS_env.name?"/pages/data/awd/mobilenavs/"+l+"/index.json":"/developer-components/includes/template-external/mobile-nav-json/"+l+"/index.json";return t.includes("https://")?(window.location=t,{action:"go "}):""===i?(s.innerHTML=n.default,{action:"navigate"}):n[i]?(e=p(n[i],t,a))?(stir.setHTML(s,e),{action:"navigate"}):(window.location=t,{action:"go "}):(stir.setHTML(s,'<li><span class="button expanded no-arrow">Loading...</span></li>'),stir.getJSON(l,e=>{if(e.error)stir.setHTML(s,n.default);else{n[i]=e;e=p(e,t,a);if(!e)return window.location=t,{action:"go"};stir.setHTML(s,e)}return{action:"navigate"}}),{action:"null"})};e&&e.addEventListener("click",e=>{a.forEach(e=>{stir.node(e)&&stir.node(e).classList.add("hide")}),n.classList.add("c-mobile-menu-visible"),f("dev"===UoS_env.name||"qa"===UoS_env.name?"/about/professional-services/":window.location.pathname,i,"open"),e.preventDefault()}),t&&t.addEventListener("click",e=>{a.forEach(e=>{stir.node(e)&&stir.node(e).classList.remove("hide")}),n.classList.remove("c-mobile-menu-visible"),e.preventDefault()}),s&&s.addEventListener("click",e=>{var t=e.target.closest("a");"go"===t.getAttribute("data-action")?window.location=t.getAttribute("href"):(t=f(t.getAttribute("href"),i,"click").action,t&&"navigate"===t&&s.scrollIntoView(),e.preventDefault())})}}(document.getElementById("mobile-menu-2"));