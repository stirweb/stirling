var stir=stir||{};if(stir.templates=stir.templates||{},stir.const=stir.const||{},stir.templates.search=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const r=()=>"https://"+stir.funnelback.getHostname(),a=e=>`<p class="u-heritage-berry u-border-solid u-p-1"><span class="uos-lightbulb"></span> ${e}</p>`,s={staff:"University of Stirling staff",students:"current students and staff"},t={staff:["staff","students"],student:["students"]};var e=window[["s","e","i","k","o","o","C"].reverse().join("")];const l=!!e.get("psessv0")?e.get("psessv0").split("|")[0]:"EXTERNAL",i=e=>-1<t[l.toLowerCase()]?.indexOf(e.toLowerCase()),c=(e,t)=>{return i(t)?`<p class=c-search-result__summary>${e}</p>`:(e=t,a(`This page is only available to ${s[e]}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`))},n=e=>{e=e.toUpperCase().split("/").slice(-1).toString().split(".");return 1<e.length&&e[1].match(/PDF|DOCX?/)};const o=(e,t,r)=>`<span class=c-tag data-name="${t}" data-value="${r}">✖️ ${e}</span>`,u=(e,t,r,a)=>{return e?(e=-1<e.indexOf("|")?e.split("|")[1]||e.split("|")[0]:e,`<div class=c-search-result__image>
			${stir.funnelback.getCroppedImageElement({url:e.trim(),alt:t||"",width:r||550,height:a||550})}
			</div>`):""},d=e=>`<a href="${e.href}">${e.text}</a>`,m=e=>stir.courses&&stir.courses.clearing&&Object.values&&e.clearing&&0<=Object.values(e.clearing).join().indexOf("Yes"),p={SINGLE_DRILL_DOWN:void 0,CHECKBOX:"checkbox",RADIO_BUTTON:"radio",TAB:void 0,UNKNOWN:void 0},h=function(){if(!stir.t4Globals||!stir.t4Globals.search||!stir.t4Globals.search.facets)return(e,t)=>t;const r=stir.t4Globals.search.facets;return(e,t)=>{return r[e]?(e=r[e]).findIndex?e[e.findIndex(e=>t===e.toLowerCase())]||t:e[t]||t:t}}(),g=(e,t)=>h(e,t);return{tag:o,stag:e=>e?`<span class="c-search-tag">${e}</span>`:"",tagGroup:e=>{e=e.split("="),e=e[1]&&e[1].replace(/,([^\s])/gi,"__SPLIT__$&").split("__SPLIT__,");return e?e.map(stir.templates.search.stag).join(""):""},breadcrumb:e=>`<p class="u-m-0">${e}</p>`,trailstring:e=>e.length?e.map(d).join(" > "):"",message:(e,t,r)=>{var a=document.createElement("p");return a.classList.add(e?"text-sm":"search_summary_noresults"),a.innerHTML=e?`There are <strong>${t} results</strong>`:"<strong>There are no results</strong>",r&&a.insertAdjacentText("beforeend"," for "),a},summary:e=>{var t=document.createElement("div");return t.classList.add("u-py-2"),e&&(t.innerHTML=`<p>Page: ${e.page}, total_hits: ${e.total_hits}, processing_time_ms: ${e.processing_time_ms}, hits: ${e.hits.length}, facets: ${JSON.stringify(e.facets,null,"\t")}, fieldStats: ${e.fieldStats}, rangeFacets: ${e.rangeFacets}, hierarchicalFacets: ${e.hierarchicalFacets}</p>`),t},pagination:e=>{var{currEnd:e,totalMatching:t,progress:r}=e;return 0===t?"":`
			<div class="cell text-center u-my-2">
				<progress value="${r}" max="100"></progress><br />
				You have viewed ${t===e?"all":e+" of "+t} results
			</div>`},suppressed:e=>`<!-- Suppressed search result: ${e} -->`,auto:e=>{const r={text:e.categories.slice(1),href:new URL(e.url).pathname.split("/").slice(1,-1)};var t,a,s=r.text.map((e,t)=>({text:e.split("x")[1],href:"/"+r.href.slice(0,t+1).join("/")+"/"}));return`<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${e.score}>
				<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
					${s=s,t=e.url,a=0,s&&0<s.length?stir.templates.search.breadcrumb(stir.templates.search.trailstring(s)):n(t)?`Document: ${n(t)} <small>${stir.Math.fileSize(a||0,0)}</small>`:""}
					<p class="u-text-regular u-m-0"><strong><a href="${e.url}">${e.title.split("|")[0].trim().replace(/\xA0/g," ")}</a></strong></p>
					<p>${e.meta_description}</p>
				</div>
			</div>`},internal:e=>{const r={text:e.metaData?.breadcrumbs?.split(" > ")||[],href:new URL(e.liveUrl).pathname.split("/").filter(e=>e)};var t,a=i(e.metaData.group)?stir.templates.search.trailstring(r.text.map((e,t)=>({text:e,href:"/"+r.href.slice(0,t+1).join("/")+"/"})).slice(0,-1)):`<a href="https://www.stir.ac.uk/${r.href[0]}/">${r.text[0]}</a>`;return`
	  <div class="u-border-width-5 u-heritage-line-left c-search-result${t=e.metaData.group,i(t)?" c-internal-search-result":" c-internal-locked-search-result"}" data-rank=${e.rank}${e.metaData.type?' data-result-type="'+e.metaData.type.toLowerCase()+'"':""} data-access="${e.metaData.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="c-search-result__breadcrumb">${a} ..:: INTERNAL ::..</p>
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.replace(/Current S\S+ ?\| ?/,"").split(" | ")[0].trim()}</a></strong></p>
				${c(e.summary,e.metaData.group)}
			  </div>
			</div>`},combo:e=>`<li title="${e.prefix} ${e.title}">${e.courses.map(stir.templates.search.comboCourse).join(" and ")}${e?.codes?.ucas?" <small>&hyphen; "+e.codes.ucas+"</small>":""}${m(e)?' <sup class="c-search-result__seasonal">*</sup>':""}</li>`,comboCourse:e=>`<a href="${e.url}">${e.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi,"")}</a>`,clearing:e=>{if(Object.keys&&e.metaData&&0<=Object.keys(e.metaData).join().indexOf("clearing"))return'<p class="u-m-0"><strong class="u-energy-purple">Clearing 2025: places may be available on this course.</strong></p>'},combos:e=>0===e.combos.length?"":`
				<div class="combo-accordion" data-behaviour=accordion>
					<accordion-summary>Course combinations</accordion-summary>
					<div>
						<p>${e.title} can be combined with:</p>
						<ul class="u-columns-2">
							${e.combos.map(stir.templates.search.combo).join("")}
						</ul>
						${0<=e.combos.map(m).indexOf(!0)?'<p class="u-footnote">Combinations marked with <sup class=c-search-result__seasonal>*</sup> may have Clearing places available.</p>':""}
					</div>
				</div>`,pathways:e=>{var t;return!e.metaData.pathways||0===(t=e.metaData.pathways.split("|"))?"":`
				<div class="combo-accordion" data-behaviour=accordion>
					<accordion-summary>Course pathways</accordion-summary>
					<div>
						<p>${e.title} has the following optional pathways:</p>
						<ul class="u-columns-2">
							${t.map(e=>`<li>${e}</li>`).join("\n\t")}
						</ul>
					</div>
				</div>`},courseFact:(e,t,r)=>e&&t?`<div class="cell medium-4"><strong class="u-heritage-green">${e}</strong><p${r?" class=u-text-sentence-case":""}>${t.replace(/\|/g,", ")}</p></div>`:"",course:e=>{return'<div class="c-search-result u-border-width-5 u-heritage-line-left">COURSE RESULT</div>'},coursemini:e=>`
			<div>
				<p><strong><a href="${r()+e.clickTrackingUrl}" title="${e.liveUrl}" class="u-border-none">
					${e.metaData.award||""} ${e.title} ${e.metaData.ucas?" - "+e.metaData.ucas:""} ${e.metaData.code?" - "+e.metaData.code:""}
				</a></strong></p>
				<p>${e.summary}</p>
			</div>`,courseminiFooter:e=>`<p class="u-mb-2 flex-container u-align-items-center u-gap-8">
				<svg class="u-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
					<title>cap</title>
					<g fill="currentColor">
						<path d="M32 37.888c-0.128 0-0.384 0-0.512-0.128l-28.16-11.264c-0.512-0.128-0.768-0.64-0.768-1.152s0.256-1.024 0.768-1.152l28.16-11.264c0.256-0.128 0.64-0.128 0.896 0l28.16 11.264c0.512 0.256 0.768 0.64 0.768 1.152s-0.256 1.024-0.768 1.152l-28.16 11.264c0 0.128-0.256 0.128-0.384 0.128zM7.296 25.344l24.704 9.856 24.704-9.856-24.704-9.856-24.704 9.856z"></path>
						<path d="M32 49.152c-5.888 0-11.776-1.92-17.664-5.888-0.384-0.256-0.512-0.64-0.512-1.024v-11.264c0-0.768 0.512-1.28 1.28-1.28s1.28 0.512 1.28 1.28v10.624c10.496 6.784 20.736 6.784 31.232 0v-10.624c0-0.768 0.512-1.28 1.28-1.28s1.28 0.512 1.28 1.28v11.264c0 0.384-0.256 0.768-0.512 1.024-5.888 3.968-11.776 5.888-17.664 5.888z"></path>
						<path d="M54.528 40.704c-0.64 0-1.152-0.512-1.28-1.152-0.128-1.408-1.28-8.704-7.936-13.184-5.376-3.584-11.008-3.072-13.184-2.56-0.64 0.128-1.408-0.384-1.536-1.024s0.384-1.408 1.024-1.536c2.432-0.512 8.832-1.024 14.976 2.944 7.552 4.992 8.832 13.44 8.96 14.976 0.128 0.64-0.384 1.28-1.152 1.408 0.256 0.128 0.128 0.128 0.128 0.128z"></path>
						<path d="M55.936 47.232c-0.896 0-1.792-0.256-2.56-0.896-0.896-0.64-1.408-1.664-1.536-2.688s0.128-2.176 0.896-3.072c1.408-1.792 3.968-2.048 5.76-0.768 1.792 1.408 2.048 3.968 0.768 5.76v0c-0.64 0.896-1.664 1.408-2.688 1.536-0.384 0.128-0.512 0.128-0.64 0.128zM58.112 43.776v0 0zM55.936 41.6c-0.512 0-0.896 0.256-1.28 0.64-0.256 0.384-0.384 0.768-0.256 1.152 0 0.384 0.256 0.768 0.64 1.024 0.64 0.512 1.664 0.384 2.176-0.256s0.384-1.664-0.256-2.176c-0.384-0.256-0.768-0.384-1.024-0.384z"></path>
					</g>
				</svg>
				<a href="?tab=courses&query=${e}">View all course results</a>
			</p>
			<p class="flex-container u-align-items-center u-gap-8">
				<svg class="u-icon" data-stiricon="heart-active" fill="currentColor" viewBox="0 0 50 50">
					<title>heart</title>
					<path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2c0,0-0.1,0-0.1,0c-3,0-5.8,1.2-7.9,3.4 c-4.3,4.5-4.2,11.7,0.2,16l18.1,18.1c0.5,0.5,1.6,0.5,2.1,0l17.9-17.9c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9 C47.5,15,46.3,12.2,44.1,10.1z M42,24.2l-17,17l-17-17c-3.3-3.3-3.3-8.6,0-11.8c1.6-1.6,3.7-2.4,5.9-2.4c2.2-0.1,4.4,0.8,6,2.5 l4.1,4.1c0.6,0.6,1.5,0.6,2.1,0l4.2-4.2c3.4-3.2,8.5-3.2,11.8,0C45.3,15.6,45.3,20.9,42,24.2z" />
				</svg>
				<a href="${stir.courses.favsUrl}">My favourite courses</a>
			</p>`,person:e=>`
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=person>
				<div class=c-search-result__tags>
					${""}
				</div>
				<div class="flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						<a href="${e.url}">${e.title.split(" | ")[0].trim()}</a>
					</strong></p>
					<div>${e?.metaData?.role||"\x3c!-- Job title --\x3e"}<br>${e?.metaData?.faculty||""}</div>
					<!-- <p>${e?.metaData?.c?(e?.metaData?.c+".").replace(" at the University of Stirling",""):""}</p> -->
				</div>
				${u("data:image/jpeg;base64,"+e.images.main_b64,e.title.split(" | ")[0].trim(),400,400)}
				<div class=c-search-result__footer>
					${stir.funnelback.getTags(e?.metaData?.category)?"<p><strong>Research interests</strong></p>":""}
					<p>${stir.funnelback.getTags(e?.metaData?.category)||""}</p>
				</div>
			</div>`,scholarship:e=>`
		<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=scholarship data-rank=${e.rank}>
			<div class=c-search-result__tags>
				${stir.templates.search.stag(e.metaData.level?"Scholarship: "+e.metaData.level.toLowerCase():"")}
			</div>
			<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.split("|")[0].trim().replace(/\xA0/g," ")}</a></strong></p>
				<p>${e.summary.replace(/\xA0/g," ")}</p>
				<div class="c-search-result__meta grid-x">
					${stir.templates.search.courseFact("Value",e.metaData.value,!1)}
					${stir.templates.search.courseFact("Number of awards",e.metaData.number,!1)}
					${stir.templates.search.courseFact("Fee status",e.metaData.status,!1)}
				</div>
			</div>
		</div>`,studentstory:(e,t)=>`
				<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=studentstory>
					<div><a href="${t[0].href}">${t[0].text}</a></div>
					<div class="c-search-result__body flex-container flex-dir-column u-gap ">
						<p class="u-text-regular u-m-0"><strong>
							<a href="${r()+e.clickTrackingUrl}">${e.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="u-m-0">
						${e.metaData.profileCourse1?e.metaData.profileCourse1+"<br />":""}
						${e.metaData.profileCountry||""}
						</p>
						<p>${e.metaData.profileSnippet?"<q>"+e.metaData.profileSnippet+"</q>":"\x3c!-- 28d3702e2064f72d5dfcba865e3cc5d5 --\x3e"}</p>
					</div>
					${e.metaData.profileImage?u("https://www.stir.ac.uk"+e.metaData.profileImage,e.title.split(" | ")[0].trim(),400,400):""}
				</div>`,news:e=>{return`
				<div class="u-border-width-5 u-heritage-line-left c-search-result c-search-result__with-thumbnail" data-rank=${e.score} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0">
							<strong>
								<a href="${e.url}">${e.title.split(" | ")[0].trim()}</a>
							</strong>
						</p>
						<div>${e.custom_fields.d?stir.Date.newsDate(new Date(e.custom_fields.d.split("|")[0])):""}</div>
						<p class="text-sm">${e.meta_description}</p>
					</div>
					<div class=c-search-result__image>
						<img src="data:image/jpeg;base64,${e.images.main_b64}" alt="${e.title.split(" | ")[0].trim()}" height="275" width="275" loading="lazy">
					</div>
				</div>`},gallery:e=>{return`
				<div class="u-border-width-5 u-heritage-line-left c-search-result c-search-result__with-thumbnail" data-rank=${e.rank} data-result-type=news>
					
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${r()+e.clickTrackingUrl}">${e.metaData.h1||e.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="c-search-result__secondary">${stir.Date.newsDate(new Date(e.metaData.d))}</p>
						<p >${e.summary}</p>	
					</div>
					<div class=c-search-result__image>
						${stir.funnelback.getCroppedImageElement({url:(t=JSON.parse(e.metaData.custom),t.id?`https://farm${t.farm}.staticflickr.com/${t.server}/${t.id}_${t.secret}_c.jpg`:""),alt:"Image of "+e.title.split(" | ")[0].trim(),width:550,height:550})}
					</div>
				</div>`;var t},event:e=>{return stir.templates.search.auto(e)},research:e=>stir.templates.search.auto(e),cura:e=>e.messageHtml?`<div class="c-search-result-curated" data-result-type=curated-message>
					${e.messageHtml}
				</div>`:`<div class="c-search-result" data-result-type=curated>
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${r()+e.linkUrl}" title="${e.displayUrl}">${e.titleHtml}</a><br>
							<small class="c-search-result__breadcrumb">${e.displayUrl}</small>
						</strong></p>
						<p>${e.descriptionHtml}</p>
					</div>
				</div>`,facet:t=>`<fieldset data-facet="${t.name}">
				<legend class="show-for-sr">Filter by ${t.name}</legend>
				<div data-behaviour=accordion>
					<accordion-summary>${t.name}</accordion-summary>
					<div>
						<ul>${t.allValues.filter(e=>g(t.name,e.label)).map(stir.templates.search.labelledFacetItems(t)).join("")}</ul>
					</div>
				</div>
			</fieldset>`,labelledFacetItems:stir.curry((e,t)=>`
	<li>
		<label>
			<input type=${p[e.guessedDisplayType]||"text"} name="${t.queryStringParamName}" value="${t.queryStringParamValue}" ${t.selected?"checked":""}>
			${g(e.name,t.label)}
			<!-- <span>${t.count||"0"}</span> -->
		</label>
	</li>`)}})(),"undefined"!=typeof window&&!("onscrollend"in window)){const Z0=new Event("scrollend"),$0=new Set;document.addEventListener("touchstart",e=>{for(var t of e.changedTouches)$0.add(t.identifier)},{passive:!0}),document.addEventListener("touchend",e=>{for(var t of e.changedTouches)$0.delete(t.identifier)},{passive:!0}),document.addEventListener("touchcancel",e=>{for(var t of e.changedTouches)$0.delete(t.identifier)},{passive:!0});let s=new WeakMap;function e(e,t,r){let a=e[t];e[t]=function(){var e=Array.prototype.slice.apply(arguments,[0]);a.apply(this,e),e.unshift(a),r.apply(this,e)}}function t(e,t,r,a){if("scroll"==t||"scrollend"==t){let r=this,a=s.get(r);if(void 0===a){let t=0;a={scrollListener:e=>{clearTimeout(t),t=setTimeout(()=>{$0.size?setTimeout(a.scrollListener,100):(r&&r.dispatchEvent(Z0),t=0)},100)},listeners:0},e.apply(r,["scroll",a.scrollListener]),s.set(r,a)}a.listeners++}}function n(e,t,r){"scroll"!=t&&"scrollend"!=t||void 0===(t=s.get(this))||0<--t.listeners||(e.apply(this,["scroll",t.scrollListener]),s.delete(this))}e(Element.prototype,"addEventListener",t),e(window,"addEventListener",t),e(document,"addEventListener",t),e(Element.prototype,"removeEventListener",n),e(window,"removeEventListener",n),e(document,"removeEventListener",n)}var scrollend={__proto__:null};!function(){const a=(t,r)=>{let a;return(...e)=>{clearTimeout(a),a=setTimeout(()=>t.apply(this,e),r)}},t=e=>{const s=e.querySelector(".carousel-slides"),l=e.querySelector(".carousel-slides h2:first-of-type button"),i=e.querySelector(".carousel-slides h2:last-of-type button"),c=e.querySelector(".slide-arrow-prev"),n=e.querySelector(".slide-arrow-next"),o=e=>{e.setAttribute("disabled","disabled"),e.querySelector("span")?.classList.add("u-opacity-0")},u=e=>{e.removeAttribute("disabled"),e.querySelector("span")?.classList.remove("u-opacity-0")},d=e=>{e?s.classList.add("align-center"):s.classList.remove("align-center"),e?c.classList.remove("u-border-right-solid"):c.classList.add("u-border-right-solid"),e?n.classList.remove("u-border-left-solid"):n.classList.add("u-border-left-solid")};e=()=>{let e=!1,t=!1;u(c),u(n);var r=l.getBoundingClientRect(),a=s.getBoundingClientRect(),r=(r.left>=a.left&&(o(c),e=!0),i.getBoundingClientRect());r.right<=a.right&&(o(n),t=!0),e&&t?d(!0):d(!1)};const r=a(e,250),t=e=>{var t=s.clientWidth+10;s.scrollLeft+="prev"===e?-t:t,s.addEventListener("scrollend",r)};e();["wheel","touchend"].forEach(e=>{s.addEventListener(e,r)}),c.addEventListener("click",()=>t("prev")),n.addEventListener("click",()=>t("next")),window.addEventListener("resize",r)},r=i=>{if(i){i.classList.remove("hide");var e=i.querySelector("nav#nav-slider");const c=e&&e.querySelectorAll("button"),n=i.querySelectorAll("#mySlider1 > div");c&&c.forEach(e=>{e.addEventListener("click",e=>{var t,r,a,s,l=e.target.closest("button[data-open]");l&&(l=l.getAttribute("data-open")||"all",t=l,r=n,a=c,s=i,r.forEach(e=>{e.setAttribute("aria-hidden","true"),e.classList.add("hide")}),a&&a.forEach(e=>{e&&e.classList.remove("u-white","u-bg-heritage-green")}),(r=s.querySelector(`[data-panel="${t}"]`))&&(r.classList.remove("hide"),r.removeAttribute("aria-hidden")),(a=s.querySelector(`[data-open="${t}"]`))&&a.classList.add("u-white","u-bg-heritage-green"),e.isTrusted)&&QueryParams.set("tab",l)})}),n&&1<n.length&&(n.forEach(e=>{var t=e.getAttribute("data-panel");e.setAttribute("role","tabpanel"),e.setAttribute("tabindex","0"),e.setAttribute("id","search_results_panel_"+t),e.setAttribute("aria-labelledby","searchtab_"+t)}),e=QueryParams.get("tab")||"all",e=i.querySelector(`[data-open="${e}"]`))&&(e.click(),e.scrollIntoView({block:"end"}))}};void 0!==window.URLSearchParams&&(stir.nodes(".c-search-results-area").forEach(e=>r(e)),stir.nodes(".carousel").forEach(e=>t(e)))}(),stir.courses=(()=>{const t="dev"===UoS_env.name||"qa"===UoS_env.name;return{clearing:!0,getCombos:()=>{var e;if(!stir.courses.combos)return e={dev:"combo.json",qa:"combo.json",preview:stir?.t4Globals?.search?.combos||"",prod:"https://www.stir.ac.uk/media/stirling/feeds/combo.json"},t&&console.info(`[Search] Getting combo data for ${UoS_env.name} environment (${e[UoS_env.name]})`),stir.getJSON(e[UoS_env.name],e=>stir.courses.combos=e&&!e.error?e.slice(0,-1):[])},showCombosFor:e=>{if(!e||!stir.courses.combos)return[];for(var t=isNaN(e)&&new URL(e).pathname,r=[],a=0;a<stir.courses.combos.length;a++)for(var s=0;s<stir.courses.combos[a].courses.length;s++)if(t&&t===stir.courses.combos[a].courses[s].url||stir.courses.combos[a].courses[s].url.split("/").slice(-1)==e){var l=stir.clone(stir.courses.combos[a]);l.courses.splice(s,1),l.courses=l.courses.filter(e=>e.text),r.push(l);break}return r},favsUrl:function(){switch(UoS_env.name){case"dev":return"/pages/search/course-favs/index.html";case"qa":return"/stirling/pages/search/course-favs/";default:return'<t4 type="navigation" name="Helper: Path to Courses Favourites" id="5195" />'}}()}})(),stir.courses.startdates=function(){var e=Array.prototype.slice.call(document.querySelectorAll('[name="f.Start date|startval"]'));if(e&&0!==e.length){const s=[,"January","February","March","April","May","June","July","August","September","October","November","December"],l={other:"Other","1st-every-month":"First day of any month"},i=new RegExp(/\d{4}-\d{2}ay\d{4}\D\d{2}/i),c=new RegExp(/\d{4}/),n=new RegExp(/ay\d{4}\D\d{2}/i),o=new RegExp(/ay/i),u=e.filter(e=>e.value.match(i)).map(e=>({data:e.value,date:e.value.replace(n,""),month:-1<e.value.indexOf("-")&&s[parseInt(e.value.split("-")[1])]||"",year:e.value.match(c)?e.value.match(c).shift():"",acyear:e.value.match(n)?e.value.match(n).shift().replace(o,""):"",checked:e.checked}));var t=e.filter(e=>!e.value.match(i)).map(e=>(console.info("OTHER!",e,l[e.value]||e.value),{label:l[e.value]||e.value,value:e.value,checked:e.checked})),r=u.map(e=>e.acyear.replace(o,"")).filter((e,t,r)=>r.indexOf(e)===t&&e),a=e[0].parentElement.parentElement.parentElement;if(0!==r.length+t.length){e.forEach(e=>{e.parentElement.parentElement.remove()});const d=(e,t,r)=>{s="radio",l="f.Start date|startval",t=""+t,r=r,(a=document.createElement("input")).type=s,a.name=l,a.value=t,a.checked=r;var a,s=a,l=document.createElement("label");return l.appendChild(s),l.appendChild(document.createTextNode(e)),l},m=(e,t=[])=>{var r=document.createElement("fieldset"),a=document.createElement("legend");return a.classList.add("u-mb-tiny","text-xsm"),r.appendChild(a),r.classList.add("u-mb-1","c-search-filters-subgroup"),a.innerText=e,r.append(...t),r},p=document.createElement("li");r.forEach(t=>{var e=u.filter(e=>e.acyear===t).filter(e=>e.acyear===t).map(e=>d(e.month+" "+e.year,e.data,e.checked));p.append(m("Academic year "+t,e))}),t.length&&p.append(m("Other",t.map(e=>d(e.label,e.value,e.checked)))),a.appendChild(p)}}},(stir=stir||{}).funnelback=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const e=UoS_env.search,t=`https://${e}/s/`;return{getHostname:()=>e,getJsonEndpoint:()=>new URL("search.json",t),getScaleEndpoint:()=>new URL("scale",t),getCroppedImageElement:e=>{return e.url?`<img src="${(e={src:e.url,alt:e.alt,width:Math.floor(e.width/2),height:Math.floor(e.height/2),original:e.url}).src}" alt="${e.alt}" height="${e.height}" width="${e.width}" loading=lazy data-original=${e.original}>`:"\x3c!-- no image --\x3e"},getTags:e=>{e=e&&e.split(";");return e&&e.map(stir.templates.search.tagGroup).join("")},imgError:e=>{e.target.getAttribute("data-original")&&e.target.getAttribute("src")!=e.target.getAttribute("data-original")?e.target.src=e.target.getAttribute("data-original"):(e.target.parentElement.parentElement?.classList?.remove("c-search-result__with-thumbnail"),e.target.parentElement.parentElement.removeChild(e.target.parentElement))}}})(),stir.addSearch={getJsonEndpoint:()=>new URL("/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de","https://api.addsearch.com")},stir.search=()=>{if(void 0===window.URLSearchParams)return void((e=document.querySelector(".c-search-results-area"))&&e.parentElement.removeChild(e));const u="dev"===UoS_env.name||"qa"===UoS_env.name;u||UoS_env.name;var e="small"===stir.MediaQuery.current?5:10;const s=256;stir.courses.clearing;u&&console.info("[Search] initialising…");var t=stir.curry((e,t)=>(e.search=new URLSearchParams(t),e));const a=stir.curry((e,t)=>stir.Object.extend({},e,t)),l=(e,t)=>{var r,a,s=new URLSearchParams(t);for([r,a]of new URLSearchParams(e.search))s.set(r,a);return e.search=s,e};const i={url:stir.addSearch.getJsonEndpoint(),form:document.querySelector("form.x-search-redevelopment"),input:document.querySelector('form.x-search-redevelopment input[name="term"]'),parameters:{any:{term:"University+of+Stirling"},news:{customField:"type=news"},event:{customField:"type=event"},gallery:{customField:"type=gallery"},course:{customField:"type=course"},coursemini:{customField:"type=course"},person:{customField:"type=profile"},research:{categories:"2xhub"},internal:{categories:"1xinternal-staff"},clearing:{num_ranks:e}},noquery:{course:{}}};if(!i.form||!i.form.term)return;u&&console.info("[Search] initialised with host:",i.url.hostname);const c=e=>i.form.term.value||QueryParams.get("term")||i.parameters[e].term||"University of Stirling",r=()=>i.form.term.value?QueryParams.set("term",i.form.term.value):QueryParams.remove("term"),d=e=>e.getAttribute("data-type")||e.parentElement.getAttribute("data-type"),m=e=>QueryParams.set(e,parseInt(QueryParams.get(e)||1)+1);const p=()=>Object.keys(i.parameters).forEach(e=>QueryParams.remove(e)),n=e=>{var t,e=document.querySelector(".c-search-results-area form[data-filters="+e+"]"),r=e?new FormData(e):new FormData;for(t of r.keys())0!==t.indexOf("f.")&&1<r.getAll(t).length&&r.set(t,"["+r.getAll(t).join(" ").replace(/\[|\]/g,"")+"]");return r},h=stir.curry((e,t)=>e.insertAdjacentHTML("beforeend",t)),g=stir.curry((e,t)=>e.innerHTML=t),v=stir.curry((e,t)=>(e&&t&&0<t.total_hits&&e.removeAttribute("disabled"),t)),o=e=>new stir.accord(e,!1),f=stir.curry((e,t)=>{var r;e.closest&&(r=(e=e.closest("[data-panel]")).querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)'),e.querySelectorAll("img"),Array.prototype.forEach.call(r,o))}),y=stir.curry((e,t)=>{e=e.parentElement.parentElement.querySelector(".c-search-results-summary");return e&&(e.innerHTML="",e.append(stir.templates.search.summary(t))),t}),b={string:{urlDecode:e=>decodeURIComponent(e.replace(/\+/g," "))}},$=stir.curry((e,t)=>{return t}),w=stir.curry((e,t)=>t?k[e](t.hits):"NO DATA"),_=e=>{var t;return!(!e||!e.hasAttribute("data-fallback")||(t=(t=document.getElementById(e.getAttribute("data-fallback")))&&(t.innerHTML||""),e.innerHTML=t,0))},E=t(i.url);e=stir.curry((e,t)=>{u&&console.info();var r=a(i.parameters[e])(stir.Object.extend({},{term:c(e)},(r=e,i.form.term.value?{}:i.noquery[r]),(()=>{let r=QueryParams.getAll();return Object.keys(r).filter(e=>0===e.indexOf("f.")).reduce((e,t)=>({...e,[t]:b.string.urlDecode(r[t]).toLowerCase()}),{})})())),r=l(E(r),n(e));console.info("[Search] Type",e),console.info("[Search] Query",c(e)),console.info("[Search] URL",r),stir.getJSON(r,t)}),t=stir.curry((e,t)=>{var r=c(e).trim(),r=a(i.parameters[e])({term:`[t:${r} c:${r} subject:${r}]`}),r=l(E(r),n(e));stir.getJSON(r,t)});const S=e=>{if(e.innerHTML="",e.hasAttribute("data-infinite")){const n=document.createElement("div");var t=document.createElement("div");(r=document.createElement("button")).innerText="Load more results",r.setAttribute("class","button hollow tiny");const o=r;o.setAttribute("disabled",!0),o.addEventListener("click",e=>{{var t=n,r=o,a=d(t);if(L[a]){var s=y(t),l=h(t),i=w(a),t=f(t);const c=stir.compose(t,l,i,v(r),s);m(a),L[a](e=>e&&!e.error?c(e):new Function)}}}),e.appendChild(n),e.appendChild(t),t.appendChild(o),t.setAttribute("class","c-search-results__loadmore flex-container align-center u-mb-2"),D(n,o)}else D(e);var r},x=Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]")),L={any:e("any"),news:e("news"),event:e("event"),gallery:e("gallery"),course:e("course"),coursemini:t("coursemini"),person:e("person"),research:e("research"),internal:e("internal"),clearing:e("clearing")},k={any:e=>e.map(stir.templates.search.auto).join(""),news:e=>e.map(stir.templates.search.news).join(""),event:e=>e.map(stir.templates.search.event).join(""),gallery:e=>e.map(stir.templates.search.gallery).join(""),course:e=>e.map(stir.templates.search.course).join(""),coursemini:e=>e.map(stir.templates.search.coursemini).join(""),person:e=>e.map(stir.templates.search.person).join(""),research:e=>e.map(stir.templates.search.research).join(""),cura:e=>e.map(stir.templates.search.cura).join(""),internal:e=>e.map(stir.templates.search.auto).join(""),clearing:e=>e.map(stir.templates.search.auto).join("")};const A={course:e=>{stir.coursefavs&&stir.coursefavs.attachEventHandlers();var t=stir.courses.getCombos();t?t.addEventListener("loadend",e):e.call()}},D=(t,e)=>{u&&console.info("[Search] Getting initial results…");const r=d(t);if(L[r]){var a=$(r),s=y(t),e=v(e),l=g(t),i=w(r),c=f(t);const n=stir.compose(c,l,i,e,s,a),o=e=>(u&&console.info("[Search] Request callback",e),t&&t.parentElement?!e||e.error||0===e.total_hits&&_(t)?void 0:n(e):u&&console.error("[Search] late callback, element no longer on DOM"));if(p(),A[r])return A[r](e=>L[r](o));L[r](o)}},C=()=>x.forEach(S),U=(Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-area form[data-filters]"),t=>{var e=t.getAttribute("data-filters");const r=document.querySelector(`.c-search-results[data-type="${e}"]`);t.addEventListener("reset",e=>{Array.prototype.forEach.call(t.querySelectorAll("input"),e=>e.checked=!1),S(r)}),t.addEventListener("change",e=>{d(r),S(r)}),t.addEventListener("submit",e=>{S(r),e.preventDefault()})}),e=>{var t;e&&e.target&&(t=`input[name="${e.target.getAttribute("data-name")}"][value="${e.target.getAttribute("data-value")}"]`,(t=(e.target.closest("[data-panel]")||document).querySelector(t))?(t.checked=!t.checked,e.target.parentElement.removeChild(e.target),C()):(t=`select[name="${e.target.getAttribute("data-name")}"]`,(t=document.querySelector(t))&&(t.selectedIndex=0,e.target.parentElement.removeChild(e.target),C())))}),T=(Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-summary"),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-suggest")?(e.preventDefault(),i.input.value=e.target.innerText,r(),C()):e.target.hasAttribute("data-value")&&U(e)})}),Array.prototype.forEach.call(document.querySelectorAll(".c-search-results"),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-value")&&U(e)})}),e=>{r(),C(),e.preventDefault()});t=e=>{void 0!==QueryParams.get("term")&&(i.form.term.value=QueryParams.get("term").substring(0,s));var t=QueryParams.getAll();for(const a in t){var r=document.querySelector(`input[name="${encodeURIComponent(a)}"][value="${encodeURIComponent(t[a])}"]`);r&&(r.checked=!0)}i.form.addEventListener("submit",T),C()};t(),window.addEventListener("popstate",t)},stir.search();