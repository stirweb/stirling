var stir=stir||{};stir.templates=stir.templates||{},stir.const=stir.const||{},stir.templates.search=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const r=()=>"https://"+stir.funnelback.getHostname(),a=e=>`<p class="u-heritage-berry u-border-solid u-p-1"><span class="uos-lightbulb"></span> ${e}</p>`,s={staff:"University of Stirling staff",students:"current students and staff"},t={staff:["staff","students"],student:["students"]};var e=window[["s","e","i","k","o","o","C"].reverse().join("")];const i=!!e.get("psessv0")?e.get("psessv0").split("|")[0]:"EXTERNAL",l=e=>-1<t[i.toLowerCase()]?.indexOf(e.toLowerCase()),n=(e,t)=>{return l(t)?`<p class=c-search-result__summary>${e}</p>`:(e=t,a(`This page is only available to ${s[e]}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`))},c=e=>{e=e.toUpperCase().split("/").slice(-1).toString().split(".");return 1<e.length&&e[1].match(/PDF|DOCX?/)},o=(e,t)=>document.querySelector(`input[name="${e}"][value="${t}"],select[name="${e}"] option[value="${t}"]`),u=e=>e.map(e=>e.selectedValues.map(e=>{{var t=e.queryStringParamName,a=(e=e.queryStringParamValue,o(t,e));if(a)return d(Array.prototype.slice.call(a.parentElement.childNodes).map(e=>3===e.nodeType?e.textContent:"").join(""),t,e)}}).join(" ")).join(" "),d=(e,t,a)=>`<span class=c-tag data-name="${t}" data-value="${a}">✖️ ${e}</span>`,m=(e,t,a,r)=>{return e?(e=-1<e.indexOf("|")?e.split("|")[1]||e.split("|")[0]:e,`<div class=c-search-result__image>
			${stir.funnelback.getCroppedImageElement({url:e.trim(),alt:t||"",width:a||550,height:r||550})}
			</div>`):""},p=e=>`<a href="${e.href}">${e.text}</a>`,h=e=>stir.courses&&stir.courses.clearing&&Object.values&&e.clearing&&0<=Object.values(e.clearing).join().indexOf("Yes"),g={SINGLE_DRILL_DOWN:void 0,CHECKBOX:"checkbox",RADIO_BUTTON:"radio",TAB:void 0,UNKNOWN:void 0},v=function(){if(!stir.t4Globals||!stir.t4Globals.search||!stir.t4Globals.search.facets)return(e,t)=>t;const a=stir.t4Globals.search.facets;return(e,t)=>{return a[e]?(e=a[e]).findIndex?e[e.findIndex(e=>t===e.toLowerCase())]:e[t]||t:t}}();return{tag:d,stag:e=>e?`<span class="c-search-tag">${e}</span>`:"",tagGroup:e=>{e=e.split("="),e=e[1]&&e[1].replace(/,([^\s])/gi,"__SPLIT__$&").split("__SPLIT__,");return e?e.map(stir.templates.search.stag).join(""):""},breadcrumb:e=>`<p class="u-m-0">${e}</p>`,trailstring:e=>e.length?e.map(p).join(" > "):"",summary:e=>{var t,a=e.response.resultPacket.resultsSummary["totalMatching"],r=stir.String.htmlEntities(e.question.originalQuery).replace(/^!padrenullquery$/,"").trim(),s=1<r.length?` for <em>${r}</em>`:"";return`<div class="u-py-2"> ${0<a?`	<p class="text-sm">There are <strong>${a.toLocaleString("en")} results</strong>${s}.</p>`:`<p id="search_summary_noresults"><strong>There are no results${s}</strong>.</p>`} ${[(t=e.question.rawInputParameters,Object.keys(t).filter(e=>0===e.indexOf("meta_")&&t[e][0]).map(a=>{var e;return(el=o(a,t[a]))?"hidden"===el.type?void 0:d(el.innerText||el.parentElement.innerText,a,t[a]):(e=new RegExp(/\[([^\[^\]]+)\]/),t[a].toString().replace(e,"$1").split(/\s/).map(e=>{var t=o(a,e);return t?d(t.parentElement.innerText,a,e):""}).join(" "))}).join(" ")),u(e.response.facets||[])].join(" ")} ${r&&(a=e.response.resultPacket.spell)?`<p>Did you mean <a href="#" data-suggest>${a.text.split(" ")[0]}</a>?</p>`:""} </div>`},pagination:e=>{var{currEnd:e,totalMatching:t,progress:a}=e;return 0===t?"":`
			<div class="cell text-center u-my-2">
				<progress value="${a}" max="100"></progress><br />
				You have viewed ${t===e?"all":e+" of "+t} results
			</div>`},suppressed:e=>`<!-- Suppressed search result: ${e} -->`,auto:e=>{if("https://www.stir.ac.uk/"===e.liveUrl)return stir.templates.search.suppressed("homepage");if("scholarship"==e.metaData.type)return stir.templates.search.scholarship(e);if("Course"==e.metaData.type||e.metaData.level)return stir.templates.search.course(e);if("News"==e.metaData.type)return stir.templates.search.news(e);if("Gallery"==e.metaData.type)return stir.templates.search.gallery(e);if("Event"==e.metaData.type)return stir.templates.search.event(e);if("stir-events"==e.collection)return stir.templates.search.event(e);if(e.metaData.access)return stir.templates.search.internal(e);if(e.metaData.type&&-1<e.metaData.type.indexOf("output"))return stir.templates.search.research(e);if(e.metaData.type&&-1<e.metaData.type.indexOf("contract"))return stir.templates.search.research(e);if(e.metaData.type&&-1<e.metaData.type.indexOf("profile"))return stir.templates.search.person(e);if(0===e.liveUrl.indexOf("https://www.stir.ac.uk/news"))return stir.templates.search.news(e);const a={text:e.metaData?.breadcrumbs?.split(" > ").slice(1,-1)||[],href:new URL(e.liveUrl).pathname.split("/").slice(1,-1)};var t,r=a.text.map((e,t)=>({text:e,href:"/"+a.href.slice(0,t+1).join("/")+"/"})),s=-1<e.liveUrl.indexOf("policyblog.stir")?'<div class=" c-search-result__tags"><span class="c-search-tag">Public Policy Blog</span></div>':"";return e.metaData.type&&-1<e.metaData.type.indexOf("studentstory")?stir.templates.search.studentstory(e,r):`
				<div class="c-search-result" data-rank=${e.rank}${e.metaData.type||c(e.liveUrl)?' data-result-type="'+(e.metaData.type||(c(e.liveUrl)?"document":"")).toLowerCase()+'"':""}${e.metaData.access?' data-access="'+e.metaData.access+'"':""}>
					<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
						${s}
						${s=r,r=e.liveUrl,t=e.fileSize,s&&0<s.length?stir.templates.search.breadcrumb(stir.templates.search.trailstring(s)):c(r)?`Document: ${c(r)} <small>${stir.Math.fileSize(t||0,0)}</small>`:""}
						<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.split("|")[0].trim().replace(/\xA0/g," ")}</a></strong></p>
						<p >${e.summary.replace(/\xA0/g," ")}</p>
					</div>
				</div>`},internal:e=>{const a={text:e.metaData?.breadcrumbs?.split(" > ")||[],href:new URL(e.liveUrl).pathname.split("/").filter(e=>e)};var t,r=l(e.metaData.group)?stir.templates.search.trailstring(a.text.map((e,t)=>({text:e,href:"/"+a.href.slice(0,t+1).join("/")+"/"})).slice(0,-1)):`<a href="https://www.stir.ac.uk/${a.href[0]}/">${a.text[0]}</a>`;return`
	  <div class="c-search-result${t=e.metaData.group,l(t)?" c-internal-search-result":" c-internal-locked-search-result"}" data-rank=${e.rank}${e.metaData.type?' data-result-type="'+e.metaData.type.toLowerCase()+'"':""} data-access="${e.metaData.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="c-search-result__breadcrumb">${r}</p>
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.replace(/Current S\S+ ?\| ?/,"").split(" | ")[0].trim()}</a></strong></p>
				${n(e.summary,e.metaData.group)}
			  </div>
			</div>`},combo:e=>`<li title="${e.prefix} ${e.title}">${e.courses.map(stir.templates.search.comboCourse).join(" and ")}${e?.codes?.ucas?" <small>&hyphen; "+e.codes.ucas+"</small>":""}${h(e)?' <sup class="c-search-result__seasonal">*</sup>':""}</li>`,comboCourse:e=>`<a href="${e.url}">${e.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi,"")}</a>`,clearing:e=>{if(Object.keys&&e.metaData&&0<=Object.keys(e.metaData).join().indexOf("clearing"))return'<p class="u-m-0"><strong class="u-heritage-berry">Clearing 2023: places may be available on this course.</strong></p>'},combos:e=>0===e.combos.length?"":`
				<div class="combo-accordion" data-behaviour=accordion>
					<accordion-summary>Course combinations</accordion-summary>
					<div>
						<p>${e.title} can be combined with:</p>
						<ul class="u-columns-2">
							${e.combos.map(stir.templates.search.combo).join("")}
						</ul>
						${0<=e.combos.map(h).indexOf(!0)?'<p class="u-footnote">Combinations marked with <sup class=c-search-result__seasonal>*</sup> may have Clearing places available.</p>':""}
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
				</div>`},courseFact:(e,t,a)=>e&&t?`<div class="cell medium-4"><strong class="u-heritage-green">${e}</strong><p${a?" class=u-text-sentence-case":""}>${t.replace(/\|/g,", ")}</p></div>`:"",course:e=>{e.metaData.subject&&e.metaData.subject.split(/,\s?/).slice(0,1);var t=!!(e.metaData.delivery&&-1<e.metaData.delivery.toLowerCase().indexOf("online")),a=-1<UoS_env.name.indexOf("preview")?(a=e.metaData.sid)?"/terminalfour/preview/1/en/"+a:"#":r()+e.clickTrackingUrl;return e.combos=stir.courses.showCombosFor("preview"==UoS_env.name?e.metaData.sid:e.liveUrl),`
			<div class="c-search-result" data-rank=${e.rank} data-sid=${e.metaData.sid} data-result-type=course${t?" data-delivery=online":""}>
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
		  <p class="u-m-0">${e.summary}</p>
		  ${stir.templates.search.clearing(e)||""}
		  <div class="c-search-result__meta grid-x">
			${stir.templates.search.courseFact("Start dates",e.metaData.start,!1)}
			${stir.templates.search.courseFact("Study modes",e.metaData.modes,!0)}
			${stir.templates.search.courseFact("Delivery",e.metaData.delivery,!0)}
		  </div>
		  
		  <div class="flex-container u-gap u-mb-1 text-xsm flex-dir-column medium-flex-dir-row">
			<div data-nodeid="coursefavsbtn" class="flex-container u-gap-8" data-id="${e.metaData.sid}">
			  ${stir.favs.createCourseBtnHTML(e.metaData.sid)}
			</div>
			<span><a href="/courses/favourites/">View favourites</a></span>
		  </div>
		  
		  ${stir.templates.search.combos(e)}
		  ${stir.templates.search.pathways(e)}
		</div>
			</div>`},coursemini:e=>`
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
			<div class=c-search-result data-result-type=person>
				<div class=c-search-result__tags>
					${stir.templates.search.stag(e.metaData.faculty?stir.research.hub.getFacultyFromOrgUnitName(e.metaData.faculty):"")}
				</div>
				<div class="flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						<a href="${r()+e.clickTrackingUrl}">${e.title.split(" | ")[0].trim()}</a>
					</strong></p>
					<div>${e.metaData.role||"\x3c!-- Job title --\x3e"}<br>${e.metaData.faculty||""}</div>
					<!-- <p>${e.metaData.c?(e.metaData.c+".").replace(" at the University of Stirling",""):""}</p> -->
				</div>
				${m(e.metaData.image,e.title.split(" | ")[0].trim(),400,400)}
				<div class=c-search-result__footer>
					${stir.funnelback.getTags(e.metaData.category)?"<p><strong>Research interests</strong></p>":""}
					<p>${stir.funnelback.getTags(e.metaData.category)||""}</p>
				</div>
			</div>`,scholarship:e=>`
		<div class="c-search-result" data-result-type=scholarship data-rank=${e.rank}>
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
				<div class=c-search-result data-result-type=studentstory>
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
					${e.metaData.profileImage?m("https://www.stir.ac.uk"+e.metaData.profileImage,e.title.split(" | ")[0].trim(),400,400):""}
				</div>`,news:e=>`
				<div class="c-search-result${e.metaData.image?" c-search-result__with-thumbnail":""}" data-rank=${e.rank} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0">
							<strong>
								<a href="${r()+e.clickTrackingUrl}">${e.metaData.h1||e.title.split(" | ")[0].trim()}</a>
							</strong>
						</p>
						<div>${e.metaData.d?stir.Date.newsDate(new Date(e.metaData.d)):""}</div>
						<p class="text-sm">${e.summary}</p>
						<!-- <p>
							${e.listMetadata&&e.listMetadata.tag?'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px;height: 20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"></path></svg>':""}
							${e.listMetadata&&e.listMetadata.tag&&e.listMetadata.tag.map(e=>`<span>${e}</span>`).join(", ")||""}
						</p> -->
					</div>
					${m(e.metaData.image,e.title.split(" | ")[0].trim())}
				</div>`,gallery:e=>{return`
				<div class="c-search-result c-search-result__with-thumbnail" data-rank=${e.rank} data-result-type=news>
					
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
				</div>`;var t},event:e=>{var t,a=e.metaData?.image||-1<e.metaData?.tags?.indexOf("Webinar"),r=e.title.split(" | ")[0],s=e.metaData.image.split("|"),i=s[1]||"/events/";return`
			<div class="c-search-result${a?" c-search-result__with-thumbnail":""}" data-rank=${e.rank} data-result-type=event>
				<div class="c-search-result__tags">
					${e.metaData?.tags?e.metaData.tags.split(",").map(stir.templates.search.stag).join(""):""}
				</div>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0">
			<strong>
			  ${e.metaData.register?p({text:r,href:e.metaData.register}):p({text:r,href:i})}
					  </strong>
		  </p>
					<div class="flex-container flex-dir-column u-gap-8">
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-calendar"></span>
							<span>${a=e.metaData.startDate,r=e.metaData.d,a?(a=new Date(a),i=stir.Date.newsDate(a),a=stir.Date.timeElementDatetime(a),!r||(t=(r=r&&new Date(r))&&stir.Date.newsDate(r),r=r&&stir.Date.timeElementDatetime(r),i==t)?`<time datetime="${a}">${i}</time>`:`<time datetime="${a}">${i}</time>–<time datetime="${r}">${t}</time>`):'<abbr title="To be confirmed">TBC</abbr>'}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="uos-clock u-icon h5"></span>
							<span>${a=e.metaData.startDate,i=e.metaData.d,(a?`<time>${stir.Date.time24(new Date(a))}</time>`:"")+(i?`–<time>${stir.Date.time24(new Date(i))}</time>`:"")}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-${e.metaData.online?"web":"location"}"></span>
							<span>${e.metaData.online?"Online":e.metaData.venue||""}</span>
						</div>
					</div>
					<p class="text-sm">${e.summary}</p>
				</div>
				${m(s[0],e.title.split(" | ")[0])}
				${-1<e.metaData?.tags?.indexOf("Webinar")?'<div class=c-search-result__image><div class="c-icon-image"><span class="uos-web"></span></div></div>':""}
			</div>`},research:e=>`
			<div class="c-search-result" data-rank=${e.rank}${e.metaData.type?' data-result-type="'+e.metaData.type.toLowerCase()+'"':""}>
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
						<p class="c-search-result__breadcrumb">${e.displayUrl}</p>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${r()+e.linkUrl}" title="${e.displayUrl}">${e.titleHtml}</a>
						</strong></p>
						<p>${e.descriptionHtml}</p>
					</div>
				</div>`,facet:r=>`<fieldset data-facet="${r.name}">
				<legend class="show-for-sr">Filter by ${r.name}</legend>
				<div data-behaviour=accordion>
					<accordion-summary>${r.name}</accordion-summary>
					<div>
						<ul>${r.allValues.map(e=>{return`<li>
									<label>
										<input type=${g[r.guessedDisplayType]||"text"} name="${e.queryStringParamName}" value="${e.queryStringParamValue}" ${e.selected?"checked":""}>
										${t=r.name,a=e.label,v(t,a)}
										<!-- <span>${e.count||"0"}</span> -->
									</label>
								</li>`;var t,a}).join("")}</ul>
					</div>
				</div>
			</fieldset>`}})(),function(){var e=Array.prototype.slice.call(document.querySelectorAll("[name=meta_startval]"));if(e.length){const r=[,"January",,,,,,,,"September",,,],s=new RegExp(/\d\d\d\d/),i=new RegExp(/AY\d\d\d\d\D\d\d/i),l=new RegExp(/ay/i),n=e.map(e=>({data:e.value,date:e.value.replace(i,""),month:-1<e.value.indexOf("-")&&r[parseInt(e.value.split("-")[1])]||"",year:e.value.match(s)?e.value.match(s).shift():"",acyear:e.value.match(i)?e.value.match(i).shift().replace(l,""):""}));var t=n.map(e=>e.acyear.replace(l,"")).filter((e,t,a)=>a.indexOf(e)===t&&e),a=e[0].parentElement.parentElement.parentElement;if(t.length){e.forEach(e=>{e.parentElement.parentElement.remove()});const c=(e,t)=>{r="radio",s="meta_startval",t=`[1st ${t}]`,(a=document.createElement("input")).type=r,a.name=s,a.value=t;var a,r=a,s=document.createElement("label");return s.appendChild(r),s.appendChild(document.createTextNode(e)),s},o=document.createElement("li");t.forEach(t=>{var e=n.filter(e=>e.acyear===t),a=e.filter(e=>-1===e.date.indexOf("-01")&&-1===e.date.indexOf("-09")).map(e=>e.data).join(" ");const r=document.createElement("fieldset");var s=document.createElement("legend");s.classList.add("u-my-1","text-xsm"),r.appendChild(s),r.setAttribute("class","c-search-filters-subgroup"),s.innerText="Academic year "+t,o.appendChild(r),e.filter(e=>e.acyear===t&&(-1<e.date.indexOf("-01")||-1<e.date.indexOf("-09"))).map(e=>{r.appendChild(c(e.month+" "+e.year,e.data))}),a.length&&r.appendChild(c("Other "+t,""+a))}),a.appendChild(o)}}}(),(stir=stir||{}).searchUI=stir.searchUI||{},stir.searchUI.asideAccordion=(e,t)=>{var a=e.querySelector("p.c-search-filters-header");const r=e.querySelector("div");if(a&&r){e.setAttribute("data-behaviour","accordion");const s=document.createElement("button");s.innerHTML=a.innerHTML,s.setAttribute("id","filteraccordbtn_"+t),s.setAttribute("aria-controls","filteraccordpanel_"+t),s.setAttribute("aria-expanded","false"),a.innerHTML="",a.appendChild(s),r.setAttribute("id","filteraccordpanel_"+t),r.setAttribute("aria-labelledby","filteraccordbtn_"+t),r.setAttribute("role","region"),r.classList.add("hide"),s.addEventListener("click",e=>{r.classList.toggle("hide"),r.classList.contains("hide")?s.setAttribute("aria-expanded","false"):s.setAttribute("aria-expanded","true")})}},stir.searchUI.verticalSlider=(e,t)=>{const s=()=>{var e=document.createElement("div");return e.classList.add("tns-controls"),e.setAttribute("aria-label","Carousel Navigation"),e.setAttribute("tabindex","0"),e},i=(e,t,a)=>{var r=document.createElement("button");return r.innerHTML='<span class="uos-'+a+' icon--medium "></span>',r.setAttribute("data-controls",t),r.setAttribute("aria-label",t),r.setAttribute("type","button"),r.setAttribute("tabindex","-1"),r.setAttribute("aria-controls",e),r},a=(e,t,a)=>{var r=s(),e=i(e,t,a);return r.insertAdjacentElement("beforeend",e),e.addEventListener("click",e=>{e.preventDefault(),n.goTo(t)}),r};var r,l;const n=tns({container:e,controls:!1,loop:!1,slideBy:7,items:7,axis:"vertical",autoHeight:!1,touch:!0,swipeAngle:30,speed:400});n&&(e=n.getInfo().container)&&(r=a(e.id,"prev","chevron-up"),l=a(e.id,"next","chevron-down"),e.parentElement.parentElement.insertAdjacentElement("afterend",l),e.parentElement.parentElement.insertAdjacentElement("beforebegin",r),t.parentElement.setAttribute("data-inittns",""))},stir.searchUI.sliderArias=a=>{a&&setTimeout(()=>{var e=a.querySelector('[data-controls="prev"]'),t=a.querySelector('[data-controls="next"]');return e&&e.setAttribute("aria-label","Previous"),t&&t.setAttribute("aria-label","Next"),!0},100)},stir.searchUI.slideTab=r=>{if(!r)return;const s={slideBox:r,slideNavBox:r.querySelector("[data-searchbtnstns]"),slideNavBtns:Array.prototype.slice.call(r.querySelectorAll("[data-searchbtnstns] h2 button")),slideResultTabs:Array.prototype.slice.call(r.querySelectorAll("#mySlider1 > div")),accordions:Array.prototype.slice.call(r.querySelectorAll("[data-behaviour=accordion]"))};if(!s.slideNavBox||!s.slideNavBtns||!s.slideResultTabs)return;const t=e=>{var t=tns({container:"#"+e.slideNavBox.id,items:i(stir.MediaQuery.current),loop:!1,slideBy:"page",controls:!0,controlsText:['<span class="uos-chevron-left icon--medium "></span>','<span class="uos-chevron-right icon--medium "></span>'],touch:!0,swipeAngle:30,navPosition:"top",autoHeight:!0,autoplay:!1}),a=(e.slideNavBox.setAttribute("role","tablist"),stir.searchUI.sliderArias(e.slideBox),e.slideNavBtns.forEach(e=>{e.closest("h2").style.width="90px",e.closest("div.tns-item").setAttribute("role","tab"),e.setAttribute("tabindex","-1"),e.setAttribute("type","button"),e.setAttribute("aria-controls","search_results_panel_"+e.getAttribute("data-open")),e.setAttribute("id","searchtab_"+e.getAttribute("data-open"))}),e.slideResultTabs.forEach(e=>{e.setAttribute("role","tabpanel"),e.setAttribute("tabindex","0"),e.setAttribute("id","search_results_panel_"+e.getAttribute("data-panel")),e.setAttribute("aria-labelledby","searchtab_"+e.getAttribute("data-panel"))}),QueryParams.get("tab")?QueryParams.get("tab"):"all"),a=r.querySelector("button[data-open="+a+"]");e.slideNavBox&&e.slideNavBox.classList.contains("hide-no-js")&&e.slideNavBox.classList.remove("hide-no-js"),a&&(a.click(),e.slideNavBtns.indexOf(a)>=i(stir.MediaQuery.current))&&t.goTo(e.slideNavBtns.indexOf(a))},i=e=>"small"===e?3:"medium"===e?4:s.slideNavBtns.length;var e,a,l;document.addEventListener("scroll",(e=()=>{var e=s.slideBox.getBoundingClientRect().top;e<.01&&s.slideBox.classList.add("stuck"),0<e&&s.slideBox.classList.remove("stuck")},l=!(a=200),function(){l||(e.call(),l=!0,setTimeout(function(){l=!1},a))})),s.slideNavBox.addEventListener("click",e=>{var t=e.target.closest("button[data-open]");if(t){const r=t.getAttribute("data-open")||"null";var a=stir.node('[data-panel="'+r+'"]');s.slideNavBtns.forEach(e=>{e.parentElement.classList.remove("slide-tab--active")}),t.closest("h2").classList.add("slide-tab--active"),s.slideResultTabs.forEach(e=>{e.classList.add("hide"),e.setAttribute("aria-hidden","true"),e.getAttribute("data-panel")===r&&(e.classList.remove("hide"),e.removeAttribute("aria-hidden"))}),a.classList.remove("hide"),a.removeAttribute("aria-hidden"),stir.scrollToElement&&stir.scrollToElement(s.slideBox,0),e.isTrusted&&QueryParams.set("tab",r)}}),window.addEventListener("popstate",e=>t(s)),t(s)},function(){if(void 0!==window.URLSearchParams){const t=e=>{var t;""===e.target.parentElement.dataset.containtns&&""!==e.target.parentElement.dataset.inittns&&(t=e.target.parentElement.nextElementSibling.children[0])&&stir.searchUI.verticalSlider(t,e.target)};stir.nodes('[data-containtns=""]').forEach(e=>{e.children[0].addEventListener("click",t)});var e=stir.nodes(".c-search-results-area"),e=(e.length&&e.forEach(e=>stir.searchUI.slideTab(e)),stir.nodes(".c-search-results-filters"));"small"!==stir.MediaQuery.current&&"medium"!==stir.MediaQuery.current||e.length&&e.forEach((e,t)=>stir.searchUI.asideAccordion(e,t))}}(),(stir=stir||{}).funnelback=(()=>{const e="dev"===UoS_env.name||"qa"===UoS_env.name?"stage-shared-15-24-search.clients.uk.funnelback.com":"search.stir.ac.uk",t=`https://${e}/s/`;const r=()=>new URL("scale",t);return{getHostname:()=>e,getJsonEndpoint:()=>new URL("search.json",t),getScaleEndpoint:r,getCroppedImageElement:e=>{var t,a;return e.url?(t=r(),a=stir.Object.extend({},e,{type:"crop_center",format:"jpeg"}),t.search=new URLSearchParams(a),`<img src="${(a={src:t,alt:e.alt,width:Math.floor(e.width/2),height:Math.floor(e.height/2),original:e.url}).src}" alt="${a.alt}" height="${a.height}" width="${a.width}" loading=lazy data-original=${a.original}>`):"\x3c!-- no image --\x3e"},getTags:e=>{e=e&&e.split(";");return e&&e.map(stir.templates.search.tagGroup).join("")},imgError:e=>{e.target.getAttribute("data-original")&&e.target.getAttribute("src")!=e.target.getAttribute("data-original")?e.target.src=e.target.getAttribute("data-original"):(e.target.parentElement.parentElement?.classList?.remove("c-search-result__with-thumbnail"),e.target.parentElement.parentElement.removeChild(e.target.parentElement))}}})(),stir.courses=(()=>{const t="dev"===UoS_env.name||"qa"===UoS_env.name;return{clearing:!0,getCombos:()=>{var e;if(!stir.courses.combos)return e={dev:"combo.json",qa:"combo.json",preview:stir?.t4Globals?.search?.combos||"",prod:"https://www.stir.ac.uk/media/stirling/feeds/combo.json"},t&&console.info(`[Search] Getting combo data for ${UoS_env.name} environment (${e[UoS_env.name]})`),stir.getJSON(e[UoS_env.name],e=>stir.courses.combos=e&&!e.error?e.slice(0,-1):[])},showCombosFor:e=>{if(!e||!stir.courses.combos)return[];for(var t=isNaN(e)&&new URL(e).pathname,a=[],r=0;r<stir.courses.combos.length;r++)for(var s=0;s<stir.courses.combos[r].courses.length;s++)if(t&&t===stir.courses.combos[r].courses[s].url||stir.courses.combos[r].courses[s].url.split("/").slice(-1)==e){var i=stir.clone(stir.courses.combos[r]);i.courses.splice(s,1),i.courses=i.courses.filter(e=>e.text),a.push(i);break}return a},favsUrl:function(){switch(UoS_env.name){case"dev":return"/pages/search/course-favs/index.html";case"qa":return"/stirling/pages/search/course-favs/";default:return'<t4 type="navigation" name="Helper: Path to Courses Favourites" id="5195" />'}}()}})(),stir.search=()=>{if(void 0===window.URLSearchParams)return void((e=document.querySelector(".c-search-results-area"))&&e.parentElement.removeChild(e));const u="dev"===UoS_env.name||"qa"===UoS_env.name;u||UoS_env.name;var e="small"===stir.MediaQuery.current?5:10;const s=256;var t=stir.courses.clearing,a=(u&&console.info("[Search] initialising…"),stir.curry((e,t)=>(e.search=new URLSearchParams(t),e)));const r=stir.curry((e,t)=>stir.Object.extend({},e,t)),i=(e,t)=>{var a,r,s=new URLSearchParams(t);for([a,r]of new URLSearchParams(e.search))s.set(a,r);return e.search=s,e};t={main:["c","d","access","award","biogrgaphy","breadcrumbs","category","custom","delivery","faculty","group","h1","image","imagealt","level","modes","online","pathways","role","register","sid","start","startDate","subject","tag","tags","type","ucas","venue","profileCountry","profileCourse1","profileImage","profileSnippet"],courses:["c","award","code","delivery","faculty","image","level","modes","pathways","sid","start","subject","ucas"],clearing:t?["clearingEU","clearingInternational","clearingRUK","clearingScotland","clearingSIMD"]:[],scholarships:["value","status","number"]};const l={url:stir.funnelback.getJsonEndpoint(),form:document.querySelector("form.x-search-redevelopment"),input:document.querySelector('form.x-search-redevelopment input[name="query"]'),parameters:{any:{collection:"stir-main",SF:`[${t.main.concat(t.clearing,t.scholarships).join(",")}]`,num_ranks:e,query:"",spelling:!0,explain:!0,sortall:!0,sort:"score_ignoring_tiers","cool.21":.9},news:{collection:"stir-www",meta_type:"News",meta_v_not:"faculty-news",sort:"date",fmo:"true",SF:"[c,d,h1,image,imagealt,tags,tag]",num_ranks:e,SBL:450},event:{collection:"stir-events",fmo:!0,SF:"[c,d,image,imagealt,startDate,venue,online,tags,type,register]",query:"!padrenullquery",num_ranks:e},gallery:{collection:"stir-www",meta_type:"Gallery",sort:"date",fmo:"true",SF:"[c,d,image]",num_ranks:e},course:{collection:"stir-courses",SF:`[${t.courses.concat(t.clearing).join(",")}]`,fmo:"true",num_ranks:e,explain:!0,query:"!padrenullquery",timestamp:+new Date},coursemini:{collection:"stir-courses",SF:"[c,award,code,delivery,faculty,image,level,modes,sid,start,subject,teaser,ucas]",num_ranks:3,curator:"off",query:"!padrenullquery"},person:{collection:"stir-research",meta_type:"profile",fmo:"true",SF:"[c,d,biogrgaphy,category,faculty,groups,image,imagealt,programme,role,themes]",SM:"meta",MBL:350,num_ranks:e},research:{collection:"stir-research",SM:"meta",SF:"[c,d,category,groups,output,programme,themes,type]",MBL:450,num_ranks:e}},noquery:{course:{sort:"title"}}};if(!l.form||!l.form.query)return;u&&console.info("[Search] initialised with host:",l.url.hostname);const n=e=>l.form.query.value||QueryParams.get("query")||l.parameters[e].query||"University of Stirling",c=()=>l.form.query.value?QueryParams.set("query",l.form.query.value):QueryParams.remove("query"),d=e=>e.getAttribute("data-type")||e.parentElement.getAttribute("data-type"),m=e=>QueryParams.set(e,parseInt(QueryParams.get(e)||1)+1),o=e=>{return(parseInt(QueryParams.get(e)||1)-1)*(l.parameters[e].num_ranks||20)+1},p=()=>Object.keys(l.parameters).forEach(e=>QueryParams.remove(e));const h=e=>{var t,e=document.querySelector(".c-search-results-area form[data-filters="+e+"]"),a=e?new FormData(e):new FormData;for(t of a.keys())0!==t.indexOf("f.")&&1<a.getAll(t).length&&a.set(t,"["+a.getAll(t).join(" ").replace(/\[|\]/g,"")+"]");return a},g=stir.curry((e,t)=>e.insertAdjacentHTML("beforeend",t)),v=stir.curry((e,t)=>e.innerHTML=t),f=stir.curry((e,t)=>(e&&(0<t.response.resultPacket.resultsSummary.totalMatching&&e.removeAttribute("disabled"),t.response.resultPacket.resultsSummary.currEnd===t.response.resultPacket.resultsSummary.totalMatching)&&e.setAttribute("disabled",!0),t)),y=e=>new stir.accord(e,!1),b=e=>e.addEventListener("error",stir.funnelback.imgError),$=stir.curry((e,t)=>{var a;e.closest&&(a=(e=e.closest("[data-panel]")).querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)'),e=e.querySelectorAll("img"),Array.prototype.forEach.call(a,y),Array.prototype.forEach.call(e,b))}),x=stir.curry((e,t)=>{var a=t.response.resultPacket.resultsSummary.currStart,r=t.response.resultPacket.resultsSummary.numRanks,s=e.parentElement.parentElement.querySelector(".c-search-results-summary");return e.setAttribute("data-page",Math.floor(a/r+1)),s&&(s.innerHTML=stir.templates.search.summary(t)),t}),D={meta_level:"f.Level|level",meta_faculty:"f.Faculty|faculty",meta_subject:"f.Subject|subject",meta_delivery:"f.Delivery mode|delivery",meta_modes:"f.Study mode|modes"},w=stir.curry((e,t)=>{const n=document.querySelector(`form[data-filters="${e}"]`);if(n){const c=QueryParams.getAll();t.response.facets.forEach(e=>{var t="stir-accordion--active",a=n.querySelector(`[data-facet="${e.name}"]`),r=a&&a.querySelector("[data-behaviour=accordion]"),r=r&&-1<r.getAttribute("class").indexOf(t),s=e.categories&&e.categories[0]&&e.categories[0].queryStringParamName;const i=s&&Object.keys(D)[Object.values(D).indexOf(s)];var l=i&&c[i],s=s&&l&&`input[name="${s}"][value~="${l.toLowerCase()}"]`,l=stir.DOM.frag(stir.String.domify(stir.templates.search.facet(e))),e=s&&Array.prototype.slice.call(l.querySelectorAll(s)),s=(e&&e.forEach(e=>{e.checked=!0,QueryParams.remove(i)}),l.querySelector("[data-behaviour=accordion]"));(r||e)&&s&&s.setAttribute("class",t),a?(a.insertAdjacentElement("afterend",l.firstChild),a.parentElement.removeChild(a)):n.insertAdjacentElement("afterbegin",l.firstChild)})}return t}),_=stir.curry((e,t)=>U.cura(t.response.curator.exhibits)+U[e](t.response.resultPacket.results)+stir.templates.search.pagination({currEnd:t.response.resultPacket.resultsSummary.currEnd,totalMatching:t.response.resultPacket.resultsSummary.totalMatching,progress:t.response.resultPacket.resultsSummary.currEnd/t.response.resultPacket.resultsSummary.totalMatching*100})+(q[e]?q[e]():"")),S=e=>{var t;return!(!e||!e.hasAttribute("data-fallback")||(t=(t=document.getElementById(e.getAttribute("data-fallback")))&&(t.innerHTML||""),e.innerHTML=t,0))},k=a(l.url);t=stir.curry((e,t)=>{var a=r(l.parameters[e])(stir.Object.extend({},{start_rank:o(e),query:n(e),curator:!(1<o(e))},(a=e,l.form.query.value?{}:l.noquery[a]))),a=i(k(a),h(e));u?stir.getJSONAuthenticated(a,t):stir.getJSON(a,t)}),e=stir.curry((e,t)=>{var a=n(e).trim(),a=r(l.parameters[e])({start_rank:o(e),query:`[t:${a} c:${a} subject:${a}]`}),a=i(k(a),h(e));u?stir.getJSONAuthenticated(a,t):stir.getJSON(a,t)});const A=e=>{if(e.innerHTML="",e.hasAttribute("data-infinite")){const c=document.createElement("div");var t=document.createElement("div");(a=document.createElement("button")).innerText="Load more results",a.setAttribute("class","button hollow tiny");const o=a;o.setAttribute("disabled",!0),o.addEventListener("click",e=>{{var t=c,a=o,r=d(t);if(L[r]){var s=x(t),i=g(t),l=_(r),t=$(t);const n=stir.compose(t,i,l,f(a),s);m(r),L[r](e=>e&&!e.error?n(e):new Function)}}}),e.appendChild(c),e.appendChild(t),t.appendChild(o),t.setAttribute("class","c-search-results__loadmore flex-container align-center u-mb-2"),C(c,o)}else C(e);var a},E=Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]")),L={any:t("any"),news:t("news"),event:t("event"),gallery:t("gallery"),course:t("course"),coursemini:e("coursemini"),person:t("person"),research:t("research")},U={any:e=>e.map(stir.templates.search.auto).join(""),news:e=>e.map(stir.templates.search.news).join(""),event:e=>e.map(stir.templates.search.event).join(""),gallery:e=>e.map(stir.templates.search.gallery).join(""),course:e=>e.map(stir.templates.search.course).join(""),coursemini:e=>e.map(stir.templates.search.coursemini).join(""),person:e=>e.map(stir.templates.search.person).join(""),research:e=>e.map(stir.templates.search.research).join(""),cura:e=>e.map(stir.templates.search.cura).join("")},q={coursemini:()=>stir.templates.search.courseminiFooter(n("any"))},j={course:e=>{stir.favs&&stir.favs.attachEventHandlers();var t=stir.courses.getCombos();t?t.addEventListener("loadend",e):e.call()}},C=(t,e)=>{const a=d(t);if(L[a]){var r=w(a),s=x(t),e=f(e),i=v(t),l=_(a),n=$(t);const c=stir.compose(n,i,l,e,s,r),o=e=>t&&t.parentElement?!e||e.error||!e.response||!e.response.resultPacket||0===e.response.resultPacket.resultsSummary.totalMatching&&S(t)?void 0:c(e):u&&console.error("[Search] late callback, element no longer on DOM");if(p(),j[a])return j[a](e=>L[a](o));L[a](o)}},T=()=>E.forEach(A),O=(Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-area form[data-filters]"),t=>{var e=t.getAttribute("data-filters");const a=document.querySelector(`.c-search-results[data-type="${e}"]`);t.addEventListener("reset",e=>{Array.prototype.forEach.call(t.querySelectorAll("input"),e=>e.checked=!1),A(a)}),t.addEventListener("change",e=>{d(a),A(a)}),t.addEventListener("submit",e=>{A(a),e.preventDefault()})}),e=>{var t;e&&e.target&&(t=`input[name="${e.target.getAttribute("data-name")}"][value="${e.target.getAttribute("data-value")}"]`,(t=document.querySelector(t))?(t.checked=!t.checked,e.target.parentElement.removeChild(e.target),T()):(t=`select[name="${e.target.getAttribute("data-name")}"]`,(t=document.querySelector(t))&&(t.selectedIndex=0,e.target.parentElement.removeChild(e.target),T())))}),M=(Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-summary"),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-suggest")?(e.preventDefault(),l.input.value=e.target.innerText,c(),T()):e.target.hasAttribute("data-value")&&O(e)})}),Array.prototype.forEach.call(document.querySelectorAll(".c-search-results"),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-value")&&O(e)})}),e=>{c(),T(),e.preventDefault()});a=e=>{void 0!==QueryParams.get("query")&&(l.form.query.value=QueryParams.get("query").substring(0,s));var t=QueryParams.getAll();for(const r in t){var a=document.querySelector(`input[name="${encodeURIComponent(r)}"][value="${encodeURIComponent(t[r])}"]`);a&&(a.checked=!0)}l.form.addEventListener("submit",M),T()};a(),window.addEventListener("popstate",a)},stir.search();