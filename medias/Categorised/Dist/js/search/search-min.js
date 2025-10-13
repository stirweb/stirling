var stir=stir||{};if(stir.templates=stir.templates||{},stir.const=stir.const||{},stir.templates.search=(()=>{const c="dev"===UoS_env.name||"qa"===UoS_env.name,i=()=>"https://"+stir.funnelback.getHostname(),a=e=>`<p class="u-heritage-berry u-border-solid u-p-1"><span class="uos-lightbulb"></span> ${e}</p>`,r={staff:"University of Stirling staff",students:"current students and staff"},t={staff:["staff","students"],student:["students"]};var e=window[["s","e","i","k","o","o","C"].reverse().join("")];const s=!!e.get("psessv0")?e.get("psessv0").split("|")[0]:"EXTERNAL",l=e=>-1<t[s.toLowerCase()]?.indexOf(e.toLowerCase()),n=(e,t)=>{return l(t)?`<p class=c-search-result__summary>${e}</p>`:(e=t,a(`This page is only available to ${r[e]}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`))},o=e=>{e=e.toUpperCase().split("/").slice(-1).toString().split(".");return 1<e.length&&e[1].match(/PDF|DOCX?/)},u=(e,t)=>document.querySelector(`form[data-filters] input[name="${e}"][value="${t}"],select[name="${e}"] option[value="${t}"]`),m=e=>e.map(e=>e.selectedValues.map(e=>{{var t=e.queryStringParamName,a=(e=e.queryStringParamValue,u(t,e));if(a)return d(Array.prototype.slice.call(a.parentElement.childNodes).map(e=>3===e.nodeType?e.textContent:"").join(""),t,e)}}).join(" ")).join(" "),d=(e,t,a)=>`<span class=c-tag data-name="${t}" data-value="${a}">✖️ ${e}</span>`,p=(e,t,a,r)=>{return e?(e=-1<e.indexOf("|")?e.split("|")[1]||e.split("|")[0]:e,`<div class=c-search-result__image>
			${stir.funnelback.getCroppedImageElement({url:e.trim(),alt:t||"",width:a||550,height:r||550})}
			</div>`):""},h=e=>`<a href="${e.href}">${e.text}</a>`,g=e=>stir.courses&&stir.courses.clearing&&Object.values&&e.clearing&&0<=Object.values(e.clearing).join().indexOf("Yes"),v={SINGLE_DRILL_DOWN:void 0,CHECKBOX:"checkbox",RADIO_BUTTON:"radio",TAB:void 0,UNKNOWN:void 0},f=function(){if(!stir.t4Globals||!stir.t4Globals.search||!stir.t4Globals.search.facets)return(e,t)=>t;const a=stir.t4Globals.search.facets;return(e,t)=>{return a[e]?(e=a[e]).findIndex?e[e.findIndex(e=>t===e.toLowerCase())]||t:e[t]||t:t}}(),y=(e,t)=>f(e,t);return{tag:d,stag:e=>e?`<span class="c-search-tag">${e}</span>`:"",tagGroup:e=>{e=e.split("="),e=e[1]&&e[1].replace(/,([^\s])/gi,"__SPLIT__$&").split("__SPLIT__,");return e?e.map(stir.templates.search.stag).join(""):""},breadcrumb:e=>`<p class="u-m-0">${e}</p>`,trailstring:e=>e.length?e.map(h).join(" > "):"",message:(e,t,a)=>{var r=document.createElement("p");return r.classList.add(e?"text-sm":"search_summary_noresults"),r.innerHTML=e?`There are <strong>${t} results</strong>`:"<strong>There are no results</strong>",a&&r.insertAdjacentText("beforeend"," for "),r},summary:e=>{var t,a=document.createElement("div"),r=e.response.resultPacket.resultsSummary["totalMatching"],s=stir.String.htmlEntities(e.question.originalQuery).replace(/^!padrenullquery$/,"").trim()||"",i=document.createElement("em"),r=stir.templates.search.message(0<r,r.toLocaleString("en"),1<s.length),l=[(t=e.question.rawInputParameters,Object.keys(t).filter(e=>0===e.indexOf("meta_")&&t[e][0]).map(a=>{var e;return(el=u(a,t[a]))?"hidden"===el.type?void 0:d(el.innerText||el.parentElement.innerText,a,t[a]):(e=new RegExp(/\[([^\[^\]]+)\]/),t[a].toString().replace(e,"$1").split(/\s/).map(e=>{var t=u(a,e);return t?d(t.parentElement.innerText,a,e):""}).join(" "))}).join(" ")),m(e.response.facets||[])].join(" "),n=s&&(n=e.response.resultPacket.spell)?`<p>Did you mean <a href="#" data-suggest>${n.text.split(" ")[0]}</a>?</p>`:"",e=c?`<small>${e.question.additionalParameters.HTTP_HOST}</small>`:"";return 1<(i.textContent=s).length&&r.append(i),a.classList.add("u-py-2"),a.insertAdjacentHTML("afterbegin",e),a.append(r),a.insertAdjacentHTML("beforeend",l+" "+n),a},pagination:e=>{var{currEnd:e,totalMatching:t,progress:a}=e;return 0===t?"":`
			<div class="cell text-center u-my-2">
				<progress value="${a}" max="100"></progress><br />
				You have viewed ${t===e?"all":e+" of "+t} results
			</div>`},suppressed:e=>`<!-- Suppressed search result: ${e} -->`,auto:e=>{if("https://www.stir.ac.uk/"===e.liveUrl)return stir.templates.search.suppressed("homepage");if("scholarship"==e.metaData.type)return stir.templates.search.scholarship(e);if("Course"==e.metaData.type||e.metaData.level)return stir.templates.search.course(e);if("News"==e.metaData.type)return stir.templates.search.news(e);if("Gallery"==e.metaData.type)return stir.templates.search.gallery(e);if("Event"==e.metaData.type)return stir.templates.search.event(e);if("stir-events"==e.collection)return stir.templates.search.event(e);if(e.metaData.access)return stir.templates.search.internal(e);if(e.metaData.type&&-1<e.metaData.type.indexOf("output"))return stir.templates.search.research(e);if(e.metaData.type&&-1<e.metaData.type.indexOf("contract"))return stir.templates.search.research(e);if(e.metaData.type&&-1<e.metaData.type.indexOf("profile"))return stir.templates.search.person(e);if(0===e.liveUrl.indexOf("https://www.stir.ac.uk/news"))return stir.templates.search.news(e);const a={text:e.metaData?.breadcrumbs?.split(" > ").slice(1,-1)||[],href:new URL(e.liveUrl).pathname.split("/").slice(1,-1)};var t,r=a.text.map((e,t)=>({text:e,href:"/"+a.href.slice(0,t+1).join("/")+"/"})),s=-1<e.liveUrl.indexOf("policyblog.stir")?'<div class=" c-search-result__tags"><span class="c-search-tag">Public Policy Blog</span></div>':"";return e.metaData.type&&-1<e.metaData.type.indexOf("studentstory")?stir.templates.search.studentstory(e,r):`
				<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${e.rank}${e.metaData.type||o(e.liveUrl)?' data-result-type="'+(e.metaData.type||(o(e.liveUrl)?"document":"")).toLowerCase()+'"':""}${e.metaData.access?' data-access="'+e.metaData.access+'"':""}>
					<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
						${s}
						${s=r,r=e.liveUrl,t=e.fileSize,s&&0<s.length?stir.templates.search.breadcrumb(stir.templates.search.trailstring(s)):o(r)?`Document: ${o(r)} <small>${stir.Math.fileSize(t||0,0)}</small>`:""}
						<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.split("|")[0].trim().replace(/\xA0/g," ")}</a></strong></p>
						<p >${e.summary.replace(/\xA0/g," ")}</p>
					</div>
				</div>`},internal:e=>{const a={text:e.metaData?.breadcrumbs?.split(" > ")||[],href:new URL(e.liveUrl).pathname.split("/").filter(e=>e)};var t,r=l(e.metaData.group)?stir.templates.search.trailstring(a.text.map((e,t)=>({text:e,href:"/"+a.href.slice(0,t+1).join("/")+"/"})).slice(0,-1)):`<a href="https://www.stir.ac.uk/${a.href[0]}/">${a.text[0]}</a>`;return`
	  <div class="u-border-width-5 u-heritage-line-left c-search-result${t=e.metaData.group,l(t)?" c-internal-search-result":" c-internal-locked-search-result"}" data-rank=${e.rank}${e.metaData.type?' data-result-type="'+e.metaData.type.toLowerCase()+'"':""} data-access="${e.metaData.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="c-search-result__breadcrumb">${r}</p>
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.replace(/Current S\S+ ?\| ?/,"").split(" | ")[0].trim()}</a></strong></p>
				${n(e.summary,e.metaData.group)}
			  </div>
			</div>`},combo:e=>`<li title="${e.prefix} ${e.title}">${e.courses.map(stir.templates.search.comboCourse).join(" and ")}${e?.codes?.ucas?" <small>&hyphen; "+e.codes.ucas+"</small>":""}${g(e)?' <sup class="c-search-result__seasonal">*</sup>':""}</li>`,comboCourse:e=>`<a href="${e.url}">${e.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi,"")}</a>`,clearing:e=>{if(Object.keys&&e.metaData&&0<=Object.keys(e.metaData).join().indexOf("clearing"))return'\x3c!-- <p class="u-m-0"><strong class="u-energy-purple">Clearing 2025: places may be available on this course.</strong></p> --\x3e'},combos:e=>0===e.combos.length?"":`
				<div class="combo-accordion" data-behaviour=accordion>
					<accordion-summary>Course combinations</accordion-summary>
					<div>
						<p>${e.title} can be combined with:</p>
						<ul class="u-columns-2">
							${e.combos.map(stir.templates.search.combo).join("")}
						</ul>
						${0<=e.combos.map(g).indexOf(!0)?'<p class="u-footnote">Combinations marked with <sup class=c-search-result__seasonal>*</sup> may have Clearing places available.</p>':""}
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
				</div>`},courseFact:(e,t,a)=>e&&t?`<div class="cell medium-4"><strong class="u-heritage-green">${e}</strong><p${a?" class=u-text-sentence-case":""}>${t.replace(/\|/g,", ")}</p></div>`:"",course:e=>{e.metaData.subject&&e.metaData.subject.split(/,\s?/).slice(0,1);var t=!!(e.metaData.delivery&&-1<e.metaData.delivery.toLowerCase().indexOf("online")),a=-1<UoS_env.name.indexOf("preview")?(a=e.metaData.sid)?"/terminalfour/preview/1/en/"+a:"#":i()+e.clickTrackingUrl;return e.combos=stir.courses.showCombosFor("preview"==UoS_env.name?e.metaData.sid:e.liveUrl),`
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-rank=${e.rank} data-sid=${e.metaData.sid} data-result-type=course${t?" data-delivery=online":""}>
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${(e=>{switch(e){case"module":return"CPD and short courses";case"Postgraduate (taught)":return"Postgraduate";default:return e}})(e.metaData.level||e.metaData.type||"")}</span>
				</div>

		<div class="flex-container flex-dir-column u-gap u-mt-1 ">
		  <p class="u-text-regular u-m-0">
			<strong><a href="${a}" title="${e.liveUrl}">
			${e.metaData.award||""} ${e.title}
			${e.metaData.ucas?" - "+e.metaData.ucas:""}
			${e.metaData.code?" - "+e.metaData.code:""}
			</a></strong>
		  </p>
		  <p class="u-m-0 c-course-summary">${e.summary}</p>
		  ${stir.templates.search.clearing(e)||""}
		  <div class="c-search-result__meta grid-x">
			${stir.templates.search.courseFact("Start dates",e.metaData.start,!1)}
			${stir.templates.search.courseFact("Study modes",e.metaData.modes,!0)}
			${stir.templates.search.courseFact("Delivery",e.metaData.delivery,!0)}
		  </div>
		  
		  <div class="flex-container u-gap u-mb-1 text-xsm flex-dir-column medium-flex-dir-row">
			<div data-nodeid="coursefavsbtn" data-favsurl="/courses/favourites/" class="flex-container u-gap-8" >
			  ${stir.coursefavs&&stir.coursefavs.createCourseBtnHTML(e.metaData.sid,"/courses/favourites/")}
			</div>
		  </div>
		  
		  ${stir.templates.search.combos(e)}
		  ${stir.templates.search.pathways(e)}
		</div>
			</div>`},coursemini:e=>`
			<div>
				<p><strong><a href="${i()+e.clickTrackingUrl}" title="${e.liveUrl}" class="u-border-none">
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
					${stir.templates.search.stag(e.metaData.faculty?stir.research.hub.getFacultyFromOrgUnitName(e.metaData.faculty):"")}
				</div>
				<div class="flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						<a href="${i()+e.clickTrackingUrl}">${e.title.split(" | ")[0].trim()}</a>
					</strong></p>
					<div>${e.metaData.role||"\x3c!-- Job title --\x3e"}<br>${e.metaData.faculty||""}</div>
					<!-- <p>${e.metaData.c?(e.metaData.c+".").replace(" at the University of Stirling",""):""}</p> -->
				</div>
				${p(e.metaData.image,e.title.split(" | ")[0].trim(),400,400)}
				<div class=c-search-result__footer>
					${stir.funnelback.getTags(e.metaData.category)?"<p><strong>Research interests</strong></p>":""}
					<p>${stir.funnelback.getTags(e.metaData.category)||""}</p>
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
							<a href="${i()+e.clickTrackingUrl}">${e.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="u-m-0">
						${e.metaData.profileCourse1?e.metaData.profileCourse1+"<br />":""}
						${e.metaData.profileCountry||""}
						</p>
						<p>${e.metaData.profileSnippet?"<q>"+e.metaData.profileSnippet+"</q>":"\x3c!-- 28d3702e2064f72d5dfcba865e3cc5d5 --\x3e"}</p>
					</div>
					${e.metaData.profileImage?p("https://www.stir.ac.uk"+e.metaData.profileImage,e.title.split(" | ")[0].trim(),400,400):""}
				</div>`,news:e=>`
				<div class="u-border-width-5 u-heritage-line-left c-search-result${e.metaData.thumbnail?" c-search-result__with-thumbnail":""}" data-rank=${e.rank} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0">
							<strong>
								<a href="${i()+e.clickTrackingUrl}">${e.metaData.h1||e.title.split(" | ")[0].trim()}</a>
							</strong>
						</p>
						<div>${e.metaData.d?stir.Date.newsDate(new Date(e.metaData.d.split("|")[0])):""}</div>
						<p class="text-sm">${e.metaData.abstract||e.summary}</p>
						<!-- <p>
							${e.listMetadata&&e.listMetadata.tag?'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px;height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"></path></svg>':""}
							${e.listMetadata&&e.listMetadata.tag&&e.listMetadata.tag.map(e=>`<span>${e}</span>`).join(", ")||""}
						</p> -->
					</div>
					<div class=c-search-result__image>
						<img src="${e.metaData.thumbnail}" alt="${e.title.split(" | ")[0].trim()}" height="275" width="275" loading="lazy">
					</div>
				</div>`,gallery:e=>{return`
				<div class="u-border-width-5 u-heritage-line-left c-search-result c-search-result__with-thumbnail" data-rank=${e.rank} data-result-type=news>
					
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${i()+e.clickTrackingUrl}">${e.metaData.h1||e.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="c-search-result__secondary">${stir.Date.newsDate(new Date(e.metaData.d))}</p>
						<p >${e.summary}</p>	
					</div>
					<div class=c-search-result__image>
						${stir.funnelback.getCroppedImageElement({url:(t=JSON.parse(e.metaData.custom),t.id?`https://farm${t.farm}.staticflickr.com/${t.server}/${t.id}_${t.secret}_c.jpg`:""),alt:"Image of "+e.title.split(" | ")[0].trim(),width:550,height:550})}
					</div>
				</div>`;var t},event:e=>{var t,a=-1<e.metaData?.tags?.indexOf("Webinar"),a=e.metaData?.image||a,r=e.title.split(" | ")[0],s="stir-events"==e.collection?e.metaData.page||e.metaData.register||"#":i()+e.clickTrackingUrl;return`
			<div class="u-border-width-5 u-heritage-line-left c-search-result${a?" c-search-result__with-thumbnail":""}" data-rank=${e.rank} data-result-type=event>
				<div class=c-search-result__tags>
					${e.metaData?.tags?e.metaData.tags.split(",").map(stir.templates.search.stag).join(""):""}
				</div>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0">
						<strong>${h({text:r,href:s})}</strong>
					</p>
					<div class="flex-container flex-dir-column u-gap-8">
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-calendar"></span>
							<span>${a=e.metaData.startDate,r=e.metaData.d,a?(a=new Date(a),s=stir.Date.newsDate(a),a=stir.Date.timeElementDatetime(a),!r||(t=(r=r&&new Date(r))&&stir.Date.newsDate(r),r=r&&stir.Date.timeElementDatetime(r),s==t)?`<time datetime="${a}">${s}</time>`:`<time datetime="${a}">${s}</time>–<time datetime="${r}">${t}</time>`):'<abbr title="To be confirmed">TBC</abbr>'}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="uos-clock u-icon h5"></span>
							<span>${a=e.metaData.startDate,s=e.metaData.d,(a?`<time>${stir.Date.time24(new Date(a))}</time>`:"")+(s?`–<time>${stir.Date.time24(new Date(s))}</time>`:"")}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-${e.metaData.online?"web":"location"}"></span>
							<span>${e.metaData.online?"Online":e.metaData.venue||""}</span>
						</div>
					</div>
					<p class=text-sm>${e.summary}</p>
					${e.metaData.register?`<p class="u-m-0 text-sm"><a href="${e.metaData.register}" class="u-m-0 button hollow tiny">Register now</a></p>`:""}
				</div>
				${p(e.metaData.image&&e.metaData.image.split("|")[0],e.title.split(" | ")[0])}
				${-1<e.metaData?.tags?.indexOf("Webinar")?'<div class=c-search-result__image><div class="c-icon-image"><span class="uos-web"></span></div></div>':""}
			</div>`},research:e=>`
			<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${e.rank}${e.metaData.type?' data-result-type="'+e.metaData.type.toLowerCase()+'"':""}>
				<div>
					<div class="c-search-result__tags"><span class="c-search-tag">${e.title.split(" | ").slice(0,1).toString()}</span></div>
					<div class="flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0"><strong>
							<a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">
								${-1<e.title.indexOf("|")?e.title.split(" | ")[1]:e.title}
							</a>
						</strong></p>
						${stir.String.stripHtml(e.metaData.c||"")?'<div class="text-sm">'+stir.String.stripHtml(e.metaData.c||"")+"</div>":""}
						${stir.funnelback.getTags(e.metaData.category)?"<div class=c-search-result__footer>"+stir.funnelback.getTags(e.metaData.category)+"</div>":""}
					</div>
				</div>
			</div>`,cura:e=>e.messageHtml?`<div class="c-search-result-curated" data-result-type=curated-message>
					${e.messageHtml}
				</div>`:`<div class="c-search-result" data-result-type=curated>
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${i()+e.linkUrl}" title="${e.displayUrl}">${e.titleHtml}</a><br>
							<small class="c-search-result__breadcrumb">${e.displayUrl}</small>
						</strong></p>
						<p>${e.descriptionHtml}</p>
					</div>
				</div>`,facet:t=>`<fieldset data-facet="${t.name}">
				<legend class="show-for-sr">Filter by ${t.name}</legend>
				<div data-behaviour=accordion>
					<accordion-summary>${t.name}</accordion-summary>
					<div>
						<ul>${t.allValues.filter(e=>y(t.name,e.label)).map(stir.templates.search.labelledFacetItems(t)).join("")}</ul>
					</div>
				</div>
			</fieldset>`,labelledFacetItems:stir.curry((e,t)=>`
	<li>
		<label>
			<input type=${v[e.guessedDisplayType]||"text"} name="${t.queryStringParamName}" value="${t.queryStringParamValue}" ${t.selected?"checked":""}>
			${y(e.name,t.label)}
			<!-- <span>${t.count||"0"}</span> -->
		</label>
	</li>`)}})(),"undefined"!=typeof window&&!("onscrollend"in window)){const hb=new Event("scrollend"),ib=new Set;document.addEventListener("touchstart",e=>{for(var t of e.changedTouches)ib.add(t.identifier)},{passive:!0}),document.addEventListener("touchend",e=>{for(var t of e.changedTouches)ib.delete(t.identifier)},{passive:!0}),document.addEventListener("touchcancel",e=>{for(var t of e.changedTouches)ib.delete(t.identifier)},{passive:!0});let s=new WeakMap;function e(e,t,a){let r=e[t];e[t]=function(){var e=Array.prototype.slice.apply(arguments,[0]);r.apply(this,e),e.unshift(r),a.apply(this,e)}}function t(e,t,a,r){if("scroll"==t||"scrollend"==t){let a=this,r=s.get(a);if(void 0===r){let t=0;r={scrollListener:e=>{clearTimeout(t),t=setTimeout(()=>{ib.size?setTimeout(r.scrollListener,100):(a&&a.dispatchEvent(hb),t=0)},100)},listeners:0},e.apply(a,["scroll",r.scrollListener]),s.set(a,r)}r.listeners++}}function n(e,t,a){"scroll"!=t&&"scrollend"!=t||void 0===(t=s.get(this))||0<--t.listeners||(e.apply(this,["scroll",t.scrollListener]),s.delete(this))}e(Element.prototype,"addEventListener",t),e(window,"addEventListener",t),e(document,"addEventListener",t),e(Element.prototype,"removeEventListener",n),e(window,"removeEventListener",n),e(document,"removeEventListener",n)}var scrollend={__proto__:null};!function(){const r=(t,a)=>{let r;return(...e)=>{clearTimeout(r),r=setTimeout(()=>t.apply(this,e),a)}},t=e=>{const s=e.querySelector(".carousel-slides"),i=e.querySelector(".carousel-slides h2:first-of-type button"),l=e.querySelector(".carousel-slides h2:last-of-type button"),n=e.querySelector(".slide-arrow-prev"),c=e.querySelector(".slide-arrow-next"),o=e=>{e.setAttribute("disabled","disabled"),e.querySelector("span")?.classList.add("u-opacity-0")},u=e=>{e.removeAttribute("disabled"),e.querySelector("span")?.classList.remove("u-opacity-0")},m=e=>{e?s.classList.add("align-center"):s.classList.remove("align-center"),e?n.classList.remove("u-border-right-solid"):n.classList.add("u-border-right-solid"),e?c.classList.remove("u-border-left-solid"):c.classList.add("u-border-left-solid")};e=()=>{let e=!1,t=!1;u(n),u(c);var a=i.getBoundingClientRect(),r=s.getBoundingClientRect(),a=(a.left>=r.left&&(o(n),e=!0),l.getBoundingClientRect());a.right<=r.right&&(o(c),t=!0),e&&t?m(!0):m(!1)};const a=r(e,250),t=e=>{var t=s.clientWidth+10;s.scrollLeft+="prev"===e?-t:t,s.addEventListener("scrollend",a)};e();["wheel","touchend"].forEach(e=>{s.addEventListener(e,a)}),n.addEventListener("click",()=>t("prev")),c.addEventListener("click",()=>t("next")),window.addEventListener("resize",a)},a=l=>{if(l){l.classList.remove("hide");var e=l.querySelector("nav#nav-slider");const n=e&&e.querySelectorAll("button"),c=l.querySelectorAll("#mySlider1 > div");n&&n.forEach(e=>{e.addEventListener("click",e=>{var t,a,r,s,i=e.target.closest("button[data-open]");i&&(i=i.getAttribute("data-open")||"all",t=i,a=c,r=n,s=l,a.forEach(e=>{e.setAttribute("aria-hidden","true"),e.classList.add("hide")}),r&&r.forEach(e=>{e&&e.classList.remove("u-white","u-bg-heritage-green")}),(a=s.querySelector(`[data-panel="${t}"]`))&&(a.classList.remove("hide"),a.removeAttribute("aria-hidden")),(r=s.querySelector(`[data-open="${t}"]`))&&r.classList.add("u-white","u-bg-heritage-green"),e.isTrusted)&&QueryParams.set("tab",i)})}),c&&1<c.length&&(c.forEach(e=>{var t=e.getAttribute("data-panel");e.setAttribute("role","tabpanel"),e.setAttribute("tabindex","0"),e.setAttribute("id","search_results_panel_"+t),e.setAttribute("aria-labelledby","searchtab_"+t)}),e=QueryParams.get("tab")||"all",e=l.querySelector(`[data-open="${e}"]`))&&(e.click(),e.scrollIntoView({block:"end"}))}};void 0!==window.URLSearchParams&&(stir.nodes(".c-search-results-area").forEach(e=>a(e)),stir.nodes(".carousel").forEach(e=>t(e)))}(),stir.courses=(()=>{const t="dev"===UoS_env.name||"qa"===UoS_env.name;return{clearing:!0,getCombos:()=>{var e;if(!stir.courses.combos)return e={dev:"combo.json",qa:"combo.json",preview:stir?.t4Globals?.search?.combos||"",prod:"https://www.stir.ac.uk/media/stirling/feeds/combo.json"},t&&console.info(`[Search] Getting combo data for ${UoS_env.name} environment (${e[UoS_env.name]})`),stir.getJSON(e[UoS_env.name],e=>stir.courses.combos=e&&!e.error?e.slice(0,-1):[])},showCombosFor:e=>{if(!e||!stir.courses.combos)return[];for(var t=isNaN(e)&&new URL(e).pathname,a=[],r=0;r<stir.courses.combos.length;r++)for(var s=0;s<stir.courses.combos[r].courses.length;s++)if(t&&t===stir.courses.combos[r].courses[s].url||stir.courses.combos[r].courses[s].url.split("/").slice(-1)==e){var i=stir.clone(stir.courses.combos[r]);i.courses.splice(s,1),i.courses=i.courses.filter(e=>e.text),a.push(i);break}return a},favsUrl:function(){switch(UoS_env.name){case"dev":return"/pages/search/course-favs/index.html";case"qa":return"/stirling/pages/search/course-favs/";default:return'<t4 type="navigation" name="Helper: Path to Courses Favourites" id="5195" />'}}()}})(),stir.courses.startdates=function(){var e=Array.prototype.slice.call(document.querySelectorAll('[name="f.Start date|startval"]'));if(e&&0!==e.length){const s=[,"January","February","March","April","May","June","July","August","September","October","November","December"],i={other:"Other","1st-every-month":"First day of any month"},l=new RegExp(/\d{4}-\d{2}ay\d{4}\D\d{2}/i),n=new RegExp(/\d{4}/),c=new RegExp(/ay\d{4}\D\d{2}/i),o=new RegExp(/ay/i),u=e.filter(e=>e.value.match(l)).map(e=>({data:e.value,date:e.value.replace(c,""),month:-1<e.value.indexOf("-")&&s[parseInt(e.value.split("-")[1])]||"",year:e.value.match(n)?e.value.match(n).shift():"",acyear:e.value.match(c)?e.value.match(c).shift().replace(o,""):"",checked:e.checked}));var t=e.filter(e=>!e.value.match(l)).map(e=>(console.info("OTHER!",e,i[e.value]||e.value),{label:i[e.value]||e.value,value:e.value,checked:e.checked})),a=u.map(e=>e.acyear.replace(o,"")).filter((e,t,a)=>a.indexOf(e)===t&&e),r=e[0].parentElement.parentElement.parentElement;if(0!==a.length+t.length){e.forEach(e=>{e.parentElement.parentElement.remove()});const m=(e,t,a)=>{s="radio",i="f.Start date|startval",t=""+t,a=a,(r=document.createElement("input")).type=s,r.name=i,r.value=t,r.checked=a;var r,s=r,i=document.createElement("label");return i.appendChild(s),i.appendChild(document.createTextNode(e)),i},d=(e,t=[])=>{var a=document.createElement("fieldset"),r=document.createElement("legend");return r.classList.add("u-mb-tiny","text-xsm"),a.appendChild(r),a.classList.add("u-mb-1","c-search-filters-subgroup"),r.innerText=e,a.append(...t),a},p=document.createElement("li");a.forEach(t=>{var e=u.filter(e=>e.acyear===t).filter(e=>e.acyear===t).map(e=>m(e.month+" "+e.year,e.data,e.checked));p.append(d("Academic year "+t,e))}),t.length&&p.append(d("Other",t.map(e=>m(e.label,e.value,e.checked)))),r.appendChild(p)}}},(stir=stir||{}).funnelback=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const e=UoS_env.search,t=`https://${e}/s/`;const r=()=>new URL("scale",t);return{getHostname:()=>e,getJsonEndpoint:()=>new URL("search.json",t),getScaleEndpoint:r,getCroppedImageElement:e=>{var t,a;return e.url?(t=r(),a=stir.Object.extend({},e,{type:"crop_center",format:"jpeg"}),t.search=new URLSearchParams(a),`<img src="${(a={src:t,alt:e.alt,width:Math.floor(e.width/2),height:Math.floor(e.height/2),original:e.url}).src}" alt="${a.alt}" height="${a.height}" width="${a.width}" loading=lazy data-original=${a.original}>`):"\x3c!-- no image --\x3e"},getTags:e=>{e=e&&e.split(";");return e&&e.map(stir.templates.search.tagGroup).join("")},imgError:e=>{e.target.getAttribute("data-original")&&e.target.getAttribute("src")!=e.target.getAttribute("data-original")?e.target.src=e.target.getAttribute("data-original"):(e.target.parentElement.parentElement?.classList?.remove("c-search-result__with-thumbnail"),e.target.parentElement.parentElement.removeChild(e.target.parentElement))}}})(),stir.search=()=>{if(void 0===window.URLSearchParams)return void((e=document.querySelector(".c-search-results-area"))&&e.parentElement.removeChild(e));const u="dev"===UoS_env.name||"qa"===UoS_env.name,r=!(!u&&"preview"!==UoS_env.name);var e="small"===stir.MediaQuery.current?5:10;const s=256;var t=stir.courses.clearing,a=(u&&console.info("[Search] initialising…"),stir.curry((e,t)=>(e.search=new URLSearchParams(t),e)));const i=stir.curry((e,t)=>stir.Object.extend({},e,t)),l=(e,t)=>{var a,r,s=new URLSearchParams(t);for([a,r]of new URLSearchParams(e.search))s.set(a,r);return e.search=s,e};t={main:["c","d","access","award","biogrgaphy","breadcrumbs","category","custom","delivery","faculty","group","h1","image","imagealt","level","modes","online","page","pathways","role","register","sid","start","startDate","subject","tag","tags","thumbnail","type","ucas","venue","profileCountry","profileCourse1","profileImage","profileSnippet"],courses:["c","award","code","delivery","faculty","image","level","modes","pathways","sid","start","subject","ucas"],clearing:t?["clearing"]:[],scholarships:["value","status","number"],news:["abstract","c","d","h1","image","imagealt","tags","tag","thumbnail"]};const n={url:stir.funnelback.getJsonEndpoint(),form:document.querySelector("form.x-search-redevelopment"),input:document.querySelector('form.x-search-redevelopment input[name="query"]'),parameters:{any:{collection:"stir-main",SF:`[${t.main.concat(t.clearing,t.scholarships).join(",")}]`,num_ranks:e,query:"",spelling:!0,explain:!0,sortall:!0,sort:"score_ignoring_tiers","cool.21":.9},news:{collection:"stir-www",query:"!padrenullquery",meta_type:"News",meta_v_not:"faculty-news",sort:"date",fmo:"true",SF:`[${t.news.join(",")}]`,num_ranks:e,SBL:450},event:{collection:"stir-events",fmo:!0,SF:"[c,d,image,imagealt,online,page,register,startDate,tags,type,venue]",query:"!padrenullquery",num_ranks:e},gallery:{collection:"stir-www",meta_type:"Gallery",sort:"date",fmo:"true",SF:"[c,d,image]",num_ranks:e},course:{collection:"stir-courses",SF:`[${t.courses.concat(t.clearing).join(",")}]`,fmo:"true",num_ranks:e,explain:!0,query:"!padrenullquery",timestamp:+new Date},coursemini:{collection:"stir-courses",SF:"[c,award,code,delivery,faculty,image,level,modes,sid,start,subject,teaser,ucas]",num_ranks:3,curator:"off",query:"!padrenullquery"},person:{collection:"stir-research",meta_type:"profile",fmo:"true",SF:"[c,d,biogrgaphy,category,faculty,groups,image,imagealt,programme,role,themes]",SM:"meta",MBL:350,num_ranks:e},research:{collection:"stir-research",SM:"meta",SF:"[c,d,category,groups,output,programme,themes,type]",MBL:450,num_ranks:e},internal:{collection:"stir-internal",SF:"[c,access,breadcrumbs,group]",query:"!padrenullquery"},clearing:{collection:"stir-courses-combos",query:"!padrenullquery",sort:"title",meta_clearing:"[scotland simd rukroi international eu]",SF:`[${t.courses.concat(t.clearing).join(",")}]`,fmo:"true",num_ranks:e}},noquery:{course:{sort:"title"}}};if(!n.form||!n.form.query)return;u&&console.info("[Search] initialised with host:",n.url.hostname);const c=e=>n.form.query.value||QueryParams.get("query")||n.parameters[e].query||"University of Stirling",o=()=>n.form.query.value?QueryParams.set("query",n.form.query.value):QueryParams.remove("query"),m=e=>e.getAttribute("data-type")||e.parentElement.getAttribute("data-type"),d=e=>QueryParams.set(e,parseInt(QueryParams.get(e)||1)+1),p=e=>{return(parseInt(QueryParams.get(e)||1)-1)*(n.parameters[e].num_ranks||20)+1},h=()=>Object.keys(n.parameters).forEach(e=>QueryParams.remove(e)),g=e=>{var t,e=document.querySelector(".c-search-results-area form[data-filters="+e+"]"),a=e?new FormData(e):new FormData;for(t of a.keys())0!==t.indexOf("f.")&&1<a.getAll(t).length&&a.set(t,"["+a.getAll(t).join(" ").replace(/\[|\]/g,"")+"]");return a},v=stir.curry((e,t)=>e.insertAdjacentHTML("beforeend",t)),f=stir.curry((e,t)=>e.innerHTML=t),y=stir.curry((e,t)=>(e&&(0<t.response.resultPacket.resultsSummary.totalMatching&&e.removeAttribute("disabled"),t.response.resultPacket.resultsSummary.currEnd===t.response.resultPacket.resultsSummary.totalMatching)&&e.setAttribute("disabled",!0),t)),b=e=>new stir.accord(e,!1),$=e=>e.addEventListener("error",stir.funnelback.imgError),w=stir.curry((e,t)=>{var a;e.closest&&(a=(e=e.closest("[data-panel]")).querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)'),e=e.querySelectorAll("img"),Array.prototype.forEach.call(a,b),Array.prototype.forEach.call(e,$))}),D=stir.curry((e,t)=>{var a=t.response.resultPacket.resultsSummary.currStart,r=t.response.resultPacket.resultsSummary.numRanks,s=e.parentElement.parentElement.querySelector(".c-search-results-summary");return e.setAttribute("data-page",Math.floor(a/r+1)),s&&(s.innerHTML="",s.append(stir.templates.search.summary(t))),t}),x={meta_level:"f.Level|level",meta_faculty:"f.Faculty|faculty",meta_subject:"f.Subject|subject",meta_delivery:"f.Delivery mode|delivery",meta_modes:"f.Study mode|modes"},_={string:{urlDecode:e=>decodeURIComponent(e.replace(/\+/g," "))}},S=stir.curry((e,t)=>{const c=document.querySelector(`form[data-filters="${e}"]`);if(c){const o=QueryParams.getAll(),u="stir-accordion--active";t.response.facets.forEach(e=>{var t=c.querySelector(`[data-facet="${e.name}"]`),a=t&&t.querySelector("[data-behaviour=accordion]"),a=a&&-1<a.getAttribute("class").indexOf(u);const r=e.categories&&e.categories[0]&&e.categories[0].queryStringParamName,s=r&&Object.keys(x)[Object.values(x).indexOf(r)];var i=s&&o[s]||o[r]&&_.string.urlDecode(o[r]),i=r&&i&&`input[name="${r}"][value="${i.toLowerCase()}"]`,l=stir.DOM.frag(stir.String.domify(stir.templates.search.facet(e))),i=i&&Array.prototype.slice.call(l.querySelectorAll(i)),n=(i&&i.forEach(e=>{e.checked=!0,s&&QueryParams.remove(s,!1,null,!0),r&&QueryParams.remove(r,!1,null,!0,!1)}),l.querySelector("[data-behaviour=accordion]"));(a||i)&&n&&n.setAttribute("class",u),t?(t.insertAdjacentElement("afterend",l.firstChild),t.parentElement.removeChild(t)):c.insertAdjacentElement("afterbegin",l.firstChild),"Start date"===e.name&&stir.courses.startdates()})}return t}),k=stir.curry((e,t)=>A.cura(t.response.curator.exhibits)+A[e](t.response.resultPacket.results)+stir.templates.search.pagination({currEnd:t.response.resultPacket.resultsSummary.currEnd,totalMatching:t.response.resultPacket.resultsSummary.totalMatching,progress:t.response.resultPacket.resultsSummary.currEnd/t.response.resultPacket.resultsSummary.totalMatching*100})+(j[e]?j[e]():"")),P=e=>{var t;return!(!e||!e.hasAttribute("data-fallback")||(t=(t=document.getElementById(e.getAttribute("data-fallback")))&&(t.innerHTML||""),e.innerHTML=t,0))},E=a(n.url);t=stir.curry((e,t)=>{var a=i(n.parameters[e])(stir.Object.extend({},{start_rank:p(e),query:c(e),curator:!(1<p(e))},(a=e,n.form.query.value?{}:n.noquery[a]),(()=>{let a=QueryParams.getAll();return Object.keys(a).filter(e=>0===e.indexOf("f.")).reduce((e,t)=>({...e,[t]:_.string.urlDecode(a[t]).toLowerCase()}),{})})(),r?{profile:"_default_preview"}:{})),a=l(E(a),g(e));u?stir.getJSONAuthenticated(a,t):stir.getJSON(a,t)}),e=stir.curry((e,t)=>{var a=c(e).trim(),a=i(n.parameters[e])({start_rank:p(e),query:`[t:${a} c:${a} subject:${a}]`}),a=l(E(a),g(e));u?stir.getJSONAuthenticated(a,t):stir.getJSON(a,t)});const L=e=>{if(e.innerHTML="",e.hasAttribute("data-infinite")){const c=document.createElement("div");var t=document.createElement("div");(a=document.createElement("button")).innerText="Load more results",a.setAttribute("class","button hollow tiny");const o=a;o.setAttribute("disabled",!0),o.addEventListener("click",e=>{{var t=c,a=o,r=m(t);if(q[r]){var s=D(t),i=v(t),l=k(r),t=w(t);const n=stir.compose(t,i,l,y(a),s);d(r),q[r](e=>e&&!e.error?n(e):new Function)}}}),e.appendChild(c),e.appendChild(t),t.appendChild(o),t.setAttribute("class","c-search-results__loadmore flex-container align-center u-mb-2"),U(c,o)}else U(e);var a},M=Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]")),q={any:t("any"),news:t("news"),event:t("event"),gallery:t("gallery"),course:t("course"),coursemini:e("coursemini"),person:t("person"),research:t("research"),internal:t("internal"),clearing:t("clearing")},A={any:e=>e.map(stir.templates.search.auto).join(""),news:e=>e.map(stir.templates.search.news).join(""),event:e=>e.map(stir.templates.search.event).join(""),gallery:e=>e.map(stir.templates.search.gallery).join(""),course:e=>e.map(stir.templates.search.course).join(""),coursemini:e=>e.map(stir.templates.search.coursemini).join(""),person:e=>e.map(stir.templates.search.person).join(""),research:e=>e.map(stir.templates.search.research).join(""),cura:e=>e.map(stir.templates.search.cura).join(""),internal:e=>e.map(stir.templates.search.auto).join(""),clearing:e=>e.map(stir.templates.search.auto).join("")},j={coursemini:()=>stir.templates.search.courseminiFooter(c("any"))},C={course:e=>{stir.coursefavs&&stir.coursefavs.attachEventHandlers();var t=stir.courses.getCombos();t?t.addEventListener("loadend",e):e.call()}},U=(t,e)=>{const a=m(t);if(q[a]){var r=S(a),s=D(t),e=y(e),i=f(t),l=k(a),n=w(t);const c=stir.compose(n,i,l,e,s,r),o=e=>t&&t.parentElement?!e||e.error||!e.response||!e.response.resultPacket||0===e.response.resultPacket.resultsSummary.totalMatching&&P(t)?void 0:c(e):u&&console.error("[Search] late callback, element no longer on DOM");if(h(),C[a])return C[a](e=>q[a](o));q[a](o)}},T=()=>M.forEach(L),O=(Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-area form[data-filters]"),t=>{var e=t.getAttribute("data-filters");const a=document.querySelector(`.c-search-results[data-type="${e}"]`);t.addEventListener("reset",e=>{Array.prototype.forEach.call(t.querySelectorAll("input"),e=>e.checked=!1),L(a)}),t.addEventListener("change",e=>{m(a),L(a)}),t.addEventListener("submit",e=>{L(a),e.preventDefault()})}),e=>{var t;e&&e.target&&(t=`input[name="${e.target.getAttribute("data-name")}"][value="${e.target.getAttribute("data-value")}"]`,(t=(e.target.closest("[data-panel]")||document).querySelector(t))?(t.checked=!t.checked,e.target.parentElement.removeChild(e.target),T()):(t=`select[name="${e.target.getAttribute("data-name")}"]`,(t=document.querySelector(t))&&(t.selectedIndex=0,e.target.parentElement.removeChild(e.target),T())))}),F=(Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-summary"),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-suggest")?(e.preventDefault(),n.input.value=e.target.innerText,o(),T()):e.target.hasAttribute("data-value")&&O(e)})}),Array.prototype.forEach.call(document.querySelectorAll(".c-search-results"),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-value")&&O(e)})}),e=>{o(),T(),e.preventDefault()});a=e=>{void 0!==QueryParams.get("query")&&(n.form.query.value=QueryParams.get("query").substring(0,s));var t=QueryParams.getAll();for(const r in t){var a=document.querySelector(`input[name="${encodeURIComponent(r)}"][value="${encodeURIComponent(t[r])}"]`);a&&(a.checked=!0)}n.form.addEventListener("submit",F),T()};a(),window.addEventListener("popstate",a)},stir.search();