var stir=stir||{};if(stir.templates=stir.templates||{},stir.const=stir.const||{},stir.templates.search=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const s=e=>`<p class="u-heritage-berry u-border-solid u-p-1"><span class="uos-lightbulb"></span> ${e}</p>`,r={staff:"University of Stirling staff",student:"current students and staff"},t={staff:["staff","student"],student:["student"]};var e=window[["s","e","i","k","o","o","C"].reverse().join("")];const a=!!e.get("psessv0")?e.get("psessv0").split("|")[0]:"EXTERNAL",i=e=>-1<t[a.toLowerCase()]?.indexOf(e.toLowerCase()),c=(e,t)=>{return i(t)?`<p class=c-search-result__summary>${e}</p>`:(e=t,s(`This page is only available to ${r[e]||e}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`))},l=e=>{e=e.toUpperCase().split("/").slice(-1).toString().split(".");return 1<e.length&&e[1].match(/PDF|DOCX?/)};const o=(e,t,s)=>`<span class=c-tag data-name="${t}" data-value="${s}">✖️ ${e}</span>`,n=e=>{switch(e){case"staff":return"Staff";case"student":return"Student";case"module":return"CPD and short courses";case"Postgraduate (taught)":case"Postgraduate (research)":return"Postgraduate";case"undergraduate":return"Undergraduate";default:return e}},d=(e,t,s,r)=>{return e?(e=-1<e.indexOf("|")?e.split("|")[1]||e.split("|")[0]:e,`<div class=c-search-result__image>
			${stir.funnelback.getCroppedImageElement({url:e.trim(),alt:t||"",width:s||550,height:r||550})}
			</div>`):""},u=e=>`<a href="${e.href}">${e.text}</a>`,m=e=>stir.courses&&stir.courses.clearing&&Object.values&&e.clearing&&0<=Object.values(e.clearing).join().indexOf("Yes"),p=e=>"object"==typeof e?Object.assign({},...e.map(e=>JSON.parse(decodeURIComponent(e)))):JSON.parse(decodeURIComponent(e)),h={SINGLE_DRILL_DOWN:void 0,CHECKBOX:"checkbox",RADIO_BUTTON:"radio",TAB:void 0,UNKNOWN:void 0},f=function(){if(!stir.t4Globals||!stir.t4Globals.search||!stir.t4Globals.search.facets)return(e,t)=>t;const s=stir.t4Globals.search.facets;return(e,t)=>{return s[e]?(e=s[e]).findIndex?e[e.findIndex(e=>t===e.toLowerCase())]||t:e[t]||t:t}}(),g=(e,t)=>f(e,t),v=e=>f("Start date",e),y=e=>`<a href="${e.url}" data-docid="${e.id}" data-position="${e.position||""}">${e.title.split("|")[0].trim().replace(/\xA0/g," ")}</a>`;return{strings:{buttons:{more:"Load more results"}},classes:{buttons:{more:"button hollow tiny",wrapper:"c-search-results__loadmore flex-container align-center u-mb-2"}},selector:{form:"form.x-search-redevelopment",query:'form.x-search-redevelopment input[name="term"]',results:".c-search-results-area",summary:".c-search-results-summary"},tag:o,stag:e=>e?`<span class="c-search-tag">${e}</span>`:"",tagGroup:e=>{e=e.split("="),e=e[1]&&e[1].replace(/,([^\s])/gi,"__SPLIT__$&").split("__SPLIT__,");return e?e.map(stir.templates.search.stag).join(""):""},breadcrumb:e=>`<p class="u-m-0">${e}</p>`,trailstring:e=>e.length?e.map(u).join("<small> &gt; </small> "):"",message:(e,t,s)=>{var r=document.createElement("p");return r.classList.add(e?"text-sm":"search_summary_noresults"),r.innerHTML=e?`There are <strong>${t} results</strong>`:"<strong>There are no results</strong>",s&&r.insertAdjacentText("beforeend"," for "),r},summary:e=>{e.page,e.hits,e.hits;var t=e.total_hits,s=document.createElement("div"),e=stir.String.htmlEntities(e.question.term).replace(/^!padrenullquery$/,"").replace(/^\*$/,"").trim()||"",r=document.createElement("em"),t=stir.templates.search.message(0<t,t.toLocaleString("en"),1<e.length);return s.classList.add("u-py-2"),1<(r.textContent=e).length&&t.append(r),s.append(t),s},pagination:e=>{var{currEnd:e,totalMatching:t,progress:s}=e;return 0===t?"":`
			<div class="cell text-center u-my-2">
				<progress value="${s}" max="100"></progress><br />
				You have viewed ${t===e?"all":e+" of "+t} results
			</div>`},suppressed:e=>`<!-- Suppressed search result: ${e} -->`,auto:(e,t,s)=>e.type&&"PROMOTED"===e.type?stir.templates.search.cura(e):"course"==e.custom_fields.type?stir.templates.search.course(e):"news"===e.custom_fields.type?stir.templates.search.news(e):"event"==e.custom_fields.type||"webinar"==e.custom_fields.type?stir.templates.search.event(e):e.custom_fields.access?stir.templates.search.internal(e):e.custom_fields.type&&-1<e.custom_fields.type.indexOf("contract")?stir.templates.search.research(e):e.custom_fields.type&&-1<e.custom_fields.type.indexOf("profile")?stir.templates.search.person(e):e.custom_fields.type&&-1<e.custom_fields.type.indexOf("studentstory")?stir.templates.search.studentstory(e):`<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${e.score||""}>
				<div class="c-search-result__body flex-container flex-dir-column u-gap">
				${e.custom_fields.type?"<div class=c-search-result__tags>":""}
					${e.custom_fields.type?stir.templates.search.stag([e.custom_fields.type]):""}
				${e.custom_fields.type?"</div>":""}
					${(e=>{const s={text:e.custom_fields.breadcrumb?e.custom_fields.breadcrumb.split(" > ").slice(1,-1):e.categories.slice?e.categories.slice(1,-1).map(e=>e.split("x")[1]):[""],href:new URL(e.url).pathname.split("/").slice(1,-1)};var t=s.text.map((e,t)=>({text:e,href:"/"+s.href.slice(0,t+1).join("/")+"/"}));return t&&0<t.length?stir.templates.search.breadcrumb(stir.templates.search.trailstring(t)):l(e.url)?`Document: ${l(e.url)} <small>${stir.Math.fileSize(fileSize||0,0)}</small>`:""})(e)}
					<p class="u-text-regular u-m-0"><strong>${y(e)}</strong></p>
					<p>${e.meta_description||""}</p>
				</div>
			</div>`,internal:e=>{return`
	  <div class="u-border-width-5 u-heritage-line-left c-search-result${t=e.custom_fields.access,i(t)?" c-internal-search-result":" c-internal-locked-search-result"}" data-rank=${e.score}${e.custom_fields.type?' data-result-type="'+e.custom_fields.type.toLowerCase()+'"':""} data-access="${e.custom_fields.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${n(e.custom_fields.access)||""}</span>
				</div>
				<p class="u-text-regular u-m-0"><strong><a href="${e.url}">${e.title.replace(/Current S\S+ ?\| ?/,"").split(" | ")[0].trim()}</a></strong></p>
				${c(e.meta_description,e.custom_fields.access)}
			  </div>
			</div>`;var t},combo:e=>`<li title="${e.prefix} ${e.title}">${e.courses.map(stir.templates.search.comboCourse).join(" and ")}${e?.codes?.ucas?" <small>&hyphen; "+e.codes.ucas+"</small>":""}${m(e)?' <sup class="c-search-result__seasonal">*</sup>':""}</li>`,comboCourse:e=>`<a href="${e.url}">${e.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi,"")}</a>`,clearing:e=>{if(Object.keys&&e.custom_fields&&0<=Object.keys(e.custom_fields).join().indexOf("clearing"))return'<p class="u-m-0"><strong class="u-energy-purple">Clearing 2025: places may be available on this course.</strong></p>'},combos:e=>0===e.combos.length?"":`
				<div class="combo-accordion" data-behaviour=accordion>
					<accordion-summary>Course combinations</accordion-summary>
					<div>
						<p>${e.title} can be combined with:</p>
						<ul class="u-columns-2">
							${e.combos.map(stir.templates.search.combo).join("")}
						</ul>
						${0<=e.combos.map(m).indexOf(!0)?'<p class="u-footnote">Combinations marked with <sup class=c-search-result__seasonal>*</sup> may have Clearing places available.</p>':""}
					</div>
				</div>`,pathways:e=>{var t;return!e.custom_fields.pathways||0===(t=e.custom_fields.pathways.split("|"))?"":`
				<div class="combo-accordion" data-behaviour=accordion>
					<accordion-summary>Course pathways</accordion-summary>
					<div>
						<p>${e.title} has the following optional pathways:</p>
						<ul class="u-columns-2">
							${t.map(e=>`<li>${e}</li>`).join("\n\t")}
						</ul>
					</div>
				</div>`},facts:e=>{var t=[];return e.custom_fields.start&&(e.custom_fields.start.map?t.push(stir.templates.search.courseFact("Start dates",e.custom_fields.start.map(v).join(", "),!1)):t.push(stir.templates.search.courseFact("Start dates",v(e.custom_fields.start),!1))),e.custom_fields.mode&&(e.custom_fields.mode.join?t.push(stir.templates.search.courseFact("Study modes",e.custom_fields.mode.join(", "),!0)):t.push(stir.templates.search.courseFact("Study modes",e.custom_fields.mode,!0))),e.custom_fields.delivery&&(e.custom_fields.delivery.join?t.push(stir.templates.search.courseFact("Delivery",e.custom_fields.delivery.join(", "),!0)):t.push(stir.templates.search.courseFact("Delivery",e.custom_fields.delivery,!0))),`<div class="c-search-result__meta grid-x">${t.join("")}</div>`},courseFact:(e,t,s)=>e&&t?`<div class="cell medium-4"><strong class="u-heritage-green">${e}</strong><p${s?" class=u-text-sentence-case":""}>${t}</p></div>`:"",course:e=>{var t,s;return e.type&&"PROMOTED"===e.type?stir.templates.search.cura(e):("preview"!==UoS_env.name&&"dev"!==UoS_env.name&&UoS_env.name,t=!!(e.custom_fields.delivery&&-1<e.custom_fields.delivery.indexOf("online")),s=-1<UoS_env.name.indexOf("preview")?(s=e.custom_fields.sid)?"/terminalfour/preview/1/en/"+s:"#":e.url,e.combos=stir.courses.showCombosFor("preview"==UoS_env.name?e.custom_fields.sid:e.url),`
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-rank=${e.score} data-sid=${e.custom_fields.sid} data-result-type=course${t?" data-delivery=online":""}>
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${n(e.custom_fields.level||e.custom_fields.type||"")}</span>
				</div>

		<div class="flex-container flex-dir-column u-gap u-mt-1 ">
		  <p class="u-text-regular u-m-0">
			<strong><a href="${s}" title="${e.url}" data-docid="${e.id||""}" data-position="${e.position||""}">
			${e.custom_fields.award||""} ${e.custom_fields.name||e.title.split("|")[0]}
			${e.custom_fields.ucas?" - "+e.custom_fields.ucas:""}
			${e.custom_fields.code?" - "+e.custom_fields.code:""}
			</a></strong>
		  </p>
		  <p class="u-m-0 c-course-summary">${e.meta_description}</p>
		  ${stir.templates.search.clearing(e)||""}
		  ${stir.templates.search.facts(e)||""}
		  <div class="flex-container u-gap u-mb-1 text-xsm flex-dir-column medium-flex-dir-row">
			<div data-nodeid="coursefavsbtn" data-favsurl="/courses/favourites/" class="flex-container u-gap-8" >
			  ${stir.coursefavs&&stir.coursefavs.createCourseBtnHTML(e.custom_fields.sid,"/courses/favourites/")}
			</div>
		  </div>
		  
		  ${stir.templates.search.combos(e)}
		  ${stir.templates.search.pathways(e)}
		</div>
			</div>`)},coursemini:e=>e.custom_fields?"\t\t\t"+`<div>
				<p><strong><a href="${e.url}" title="${e.url}" data-docid="${e.id||""}" data-position="${e.position||""}" class="u-border-none">
					${e.custom_fields.award||""} ${e.title.split(" | ")[0]} ${e.custom_fields.ucas?" - "+e.custom_fields.ucas:""} ${e.custom_fields.code?" - "+e.custom_fields.code:""}
				</a></strong></p>
				<p>${e.meta_description}</p>
			</div>`:"",courseminiFooter:e=>`<p class="u-mb-2 flex-container u-align-items-center u-gap-8">
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
			</p>`,person:e=>{var t,s;return e.type&&"PROMOTED"===e.type?stir.templates.search.cura(e):(t=e.url.split("/").slice(-1),s="object"==typeof e.custom_fields.data?Object.assign({},...e.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):JSON.parse(decodeURIComponent(e.custom_fields.data)),`
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=person>
				<div class=c-search-result__tags>
					${""}
				</div>
				<div class="flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						${y(e)}
					</strong></p>
					<div>${s.JobTitle||"\x3c!-- Job title --\x3e"}<br>${s.OrgUnitName||"\x3c!-- Department --\x3e"}</div>
					<!-- <p>${e?.custom_fields?.c?(e?.custom_fields?.c+".").replace(" at the University of Stirling",""):""}</p> -->
				</div>
				${d(e.custom_fields.image||"https://www.stir.ac.uk/research/hub/image/"+t,e.title.split(" | ")[0].trim(),400,400)}
				<div class=c-search-result__footer>
					${stir.funnelback.getTags(e?.custom_fields?.category)?"<p><strong>Research interests</strong></p>":""}
					<p>${stir.funnelback.getTags(e?.custom_fields?.category)||""}</p>
				</div>
			</div>`)},scholarship:e=>`
		<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=scholarship data-rank=${e.score}>
			<div class=c-search-result__tags>
				${stir.templates.search.stag(e.custom_fields.level?"Scholarship: "+e.custom_fields.level.toLowerCase():"")}
			</div>
			<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.split("|")[0].trim().replace(/\xA0/g," ")}</a></strong></p>
				<p>${e.meta_description.replace(/\xA0/g," ")}</p>
				<div class="c-search-result__meta grid-x">
					${stir.templates.search.courseFact("Value",e.custom_fields.value,!1)}
					${stir.templates.search.courseFact("Number of awards",e.custom_fields.number,!1)}
					${stir.templates.search.courseFact("Fee status",e.custom_fields.status,!1)}
				</div>
			</div>
		</div>`,studentstory:e=>{var t=e.custom_fields.data?p(e.custom_fields.data):{};return`
				<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=studentstory>
					<div class="c-search-result__body flex-container flex-dir-column u-gap">
						<div class=c-search-result__tags>${stir.templates.search.stag(["Student stories"])}</div>
						<p class="u-text-regular u-m-0"><strong>
							${y(e)}
						</strong></p>
						<p class="u-m-0">
						${t.degree?t.degree+"<br />":""}
						${e.custom_fields.country||""}
						</p>
						<p>${e.custom_fields.snippet?"<q>"+e.custom_fields.snippet+"</q>":"\x3c!-- 28d3702e2064f72d5dfcba865e3cc5d5 --\x3e"}</p>
					</div>
					${e.custom_fields.image?d("https://www.stir.ac.uk"+e.custom_fields.image,e.title.split(" | ")[0].trim(),400,400):""}
				</div>`},news:e=>{var t,s;return e.type&&"PROMOTED"===e.type?stir.templates.search.cura(e):(t=!!(s=e.custom_fields.data?p(e.custom_fields.data):{}).thumbnail,s=s.thumbnail?`data-original="${s.thumbnail}"`:"",`
				<div class="u-border-width-5 u-heritage-line-left c-search-result${t?" c-search-result__with-thumbnail":""}" data-rank=${e.score} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0">
							<strong>
								${y(e)}
							</strong>
						</p>
						<div>${stir.Date.newsDate(new Date(e.custom_fields.d?e.custom_fields.d.split("|")[0]:e.ts))}</div>
						<p class="text-sm">${e.meta_description}</p>
					</div>
					<div class=c-search-result__image>
						<img src="${e.images.main}" alt="${e.title.split(" | ")[0].trim()}" ${s} height=275 width=275 loading=lazy>
					</div>
				</div>`)},gallery:e=>{return`
				<div class="u-border-width-5 u-heritage-line-left c-search-result c-search-result__with-thumbnail" data-rank=${e.score} data-result-type=news>
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>${y(e)}</strong></p>
						<p class="c-search-result__secondary">${stir.Date.newsDate(new Date(e.custom_fields.d))}</p>
						<p>${e.meta_description||""}</p>	
					</div>
					<div class=c-search-result__image>
						${stir.funnelback.getCroppedImageElement({url:(t=JSON.parse(e.custom_fields.custom),t.id?`https://farm${t.farm}.staticflickr.com/${t.server}/${t.id}_${t.secret}_c.jpg`:""),alt:"Image of "+e.title.split(" | ")[0].trim(),width:550,height:550})}
					</div>
				</div>`;var t},event:e=>{var t,s,r,a,i,c,l,o;return e.type&&"PROMOTED"===e.type?stir.templates.search.cura(e):(r=(s=(t="object"==typeof e.custom_fields.data?Object.assign({},...e.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):JSON.parse(decodeURIComponent(e.custom_fields.data))).tags&&-1<t.tags.indexOf("Webinar")||"webinar"===e.custom_fields.type)||e.custom_fields.online,i=e.custom_fields?.image||s,a=e.custom_fields.e?new Date(e.custom_fields.e)<new Date:void 0,e.custom_fields.name||e.title.split("|")[0].trim(),e.url,`
			<div class="u-border-width-5 u-heritage-line-left c-search-result${i?" c-search-result__with-thumbnail":""}" data-rank=${e.score} data-result-type=event>
				<div class=c-search-result__tags>
					${t.isSeriesChild?stir.templates.search.stag(t.isSeriesChild):""}
					${s?stir.templates.search.stag("Webinar"):""}
				</div>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0">
						<strong>${y(e)}</strong>
					</p>
					<div class="flex-container flex-dir-column u-gap-8">
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-calendar"></span>
							<span>${i=e.custom_fields.d,c=e.custom_fields.e,i?(i=new Date(i),l=stir.Date.newsDate(i),i=stir.Date.timeElementDatetime(i),!c||(o=(c=c&&new Date(c))&&stir.Date.newsDate(c),c=c&&stir.Date.timeElementDatetime(c),l==o)?`<time datetime="${i}">${l}</time>`:`<time datetime="${i}">${l}</time>–<time datetime="${c}">${o}</time>`):'<abbr title="To be confirmed">TBC</abbr>'}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="uos-clock u-icon h5"></span>
							<span>
							${a?"This event has ended.":(i=e.custom_fields.d,l=e.custom_fields.e,(i?`<time>${stir.Date.time24(new Date(i))}</time>`:"")+(l?`–<time>${stir.Date.time24(new Date(l))}</time>`:""))}
							</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-${r?"web":"location"}"></span>
							<span>${r?"Online":t.location||""}</span>
						</div>
					</div>
					<p class=text-sm>${e.custom_fields.snippet||e.meta_description}</p>
					${t.register?`<p class="u-m-0 text-sm"><a href="${t.register}" class="u-m-0 button hollow tiny">Register now</a></p>`:""}
				</div>
				${d(e.custom_fields.image&&e.custom_fields.image.split("|")[0],e.title.split(" | ")[0])}
				${s?'<div class=c-search-result__image><div class="c-icon-image"><span class="uos-web"></span></div></div>':""}
			</div>`)},research:e=>e.type&&"PROMOTED"===e.type?stir.templates.search.cura(e):`<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${e.score}${e.custom_fields.type?' data-result-type="'+e.custom_fields.type.toLowerCase()+'"':""}>
				<div>
					<div class="c-search-result__tags"><span class="c-search-tag">${e.title.split(" | ").slice(0,1).toString()}</span></div>
					<div class="flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0"><strong>${y(e)}</strong></p>
						${stir.String.stripHtml(e.meta_description)?'<div class="text-sm">'+stir.String.stripHtml(e.meta_description)+"</div>":""}
						${stir.funnelback.getTags(e.custom_fields.category)?"<div class=c-search-result__footer>"+stir.funnelback.getTags(e.custom_fields.category)+"</div>":""}
					</div>
				</div>
			</div>`,cura:e=>`<div class="c-search-result-curated" data-result-type=curated>
					<a href="${e.url}" data-docid=${e.id} data-position=${e.position}><img src="${e.images.main}" alt="${e.title}"></a>
				</div>`,facet:t=>`<fieldset data-facet="${t.name}">
				<legend class="show-for-sr">Filter by ${t.name}</legend>
				<div data-behaviour=accordion>
					<accordion-summary>${t.name}</accordion-summary>
					<div>
						<ul>${t.allValues.filter(e=>g(t.name,e.label)).map(stir.templates.search.labelledFacetItems(t)).join("")}</ul>
					</div>
				</div>
			</fieldset>`,labelledFacetItems:stir.curry((e,t)=>`<li>
					<label>
						<input type=${h[e.guessedDisplayType]||"text"} name="${t.queryStringParamName}" value="${t.queryStringParamValue}" ${t.selected?"checked":""}>
						${g(e.name,t.label)}
						<!-- <span>${t.count||"0"}</span> -->
					</label>
				</li>`)}})(),"undefined"!=typeof window&&!("onscrollend"in window)){const qb=new Event("scrollend"),rb=new Set;document.addEventListener("touchstart",e=>{for(var t of e.changedTouches)rb.add(t.identifier)},{passive:!0}),document.addEventListener("touchend",e=>{for(var t of e.changedTouches)rb.delete(t.identifier)},{passive:!0}),document.addEventListener("touchcancel",e=>{for(var t of e.changedTouches)rb.delete(t.identifier)},{passive:!0});let a=new WeakMap;function e(e,t,s){let r=e[t];e[t]=function(){var e=Array.prototype.slice.apply(arguments,[0]);r.apply(this,e),e.unshift(r),s.apply(this,e)}}function t(e,t,s,r){if("scroll"==t||"scrollend"==t){let s=this,r=a.get(s);if(void 0===r){let t=0;r={scrollListener:e=>{clearTimeout(t),t=setTimeout(()=>{rb.size?setTimeout(r.scrollListener,100):(s&&s.dispatchEvent(qb),t=0)},100)},listeners:0},e.apply(s,["scroll",r.scrollListener]),a.set(s,r)}r.listeners++}}function n(e,t,s){"scroll"!=t&&"scrollend"!=t||void 0===(t=a.get(this))||0<--t.listeners||(e.apply(this,["scroll",t.scrollListener]),a.delete(this))}e(Element.prototype,"addEventListener",t),e(window,"addEventListener",t),e(document,"addEventListener",t),e(Element.prototype,"removeEventListener",n),e(window,"removeEventListener",n),e(document,"removeEventListener",n)}var scrollend={__proto__:null};!function(){const r=(t,s)=>{let r;return(...e)=>{clearTimeout(r),r=setTimeout(()=>t.apply(this,e),s)}},t=e=>{const a=e.querySelector(".carousel-slides"),i=e.querySelector(".carousel-slides h2:first-of-type button"),c=e.querySelector(".carousel-slides h2:last-of-type button"),l=e.querySelector(".slide-arrow-prev"),o=e.querySelector(".slide-arrow-next"),n=e=>{e.setAttribute("disabled","disabled"),e.querySelector("span")?.classList.add("u-opacity-0")},d=e=>{e.removeAttribute("disabled"),e.querySelector("span")?.classList.remove("u-opacity-0")},u=e=>{e?a.classList.add("align-center"):a.classList.remove("align-center"),e?l.classList.remove("u-border-right-solid"):l.classList.add("u-border-right-solid"),e?o.classList.remove("u-border-left-solid"):o.classList.add("u-border-left-solid")};e=()=>{let e=!1,t=!1;d(l),d(o);var s=i.getBoundingClientRect(),r=a.getBoundingClientRect(),s=(s.left>=r.left&&(n(l),e=!0),c.getBoundingClientRect());s.right<=r.right&&(n(o),t=!0),e&&t?u(!0):u(!1)};const s=r(e,250),t=e=>{var t=a.clientWidth+10;a.scrollLeft+="prev"===e?-t:t,a.addEventListener("scrollend",s)};e();["wheel","touchend"].forEach(e=>{a.addEventListener(e,s)}),l.addEventListener("click",()=>t("prev")),o.addEventListener("click",()=>t("next")),window.addEventListener("resize",s)},s=c=>{if(c){c.classList.remove("hide");var e=c.querySelector("nav#nav-slider");const l=e&&e.querySelectorAll("button"),o=c.querySelectorAll("#mySlider1 > div");l&&l.forEach(e=>{e.addEventListener("click",e=>{var t,s,r,a,i=e.target.closest("button[data-open]");i&&(i=i.getAttribute("data-open")||"all",t=i,s=o,r=l,a=c,s.forEach(e=>{e.setAttribute("aria-hidden","true"),e.classList.add("hide")}),r&&r.forEach(e=>{e&&e.classList.remove("u-white","u-bg-heritage-green")}),(s=a.querySelector(`[data-panel="${t}"]`))&&(s.classList.remove("hide"),s.removeAttribute("aria-hidden")),(r=a.querySelector(`[data-open="${t}"]`))&&r.classList.add("u-white","u-bg-heritage-green"),e.isTrusted)&&QueryParams.set("tab",i)})}),o&&1<o.length&&(o.forEach(e=>{var t=e.getAttribute("data-panel");e.setAttribute("role","tabpanel"),e.setAttribute("tabindex","0"),e.setAttribute("id","search_results_panel_"+t),e.setAttribute("aria-labelledby","searchtab_"+t)}),e=QueryParams.get("tab")||"all",e=c.querySelector(`[data-open="${e}"]`))&&(e.click(),e.scrollIntoView({block:"end"}))}};void 0!==window.URLSearchParams&&(stir.nodes(".c-search-results-area").forEach(e=>s(e)),stir.nodes(".carousel").forEach(e=>t(e)))}(),stir.courses=(()=>{const t="dev"===UoS_env.name||"qa"===UoS_env.name;return t&&console.info("[Search] Clearing is closed"),{clearing:!1,getCombos:()=>{var e;if(!stir.courses.combos)return e={dev:"combo.json",qa:"combo.json",preview:stir?.t4Globals?.search?.combos||"",prod:"https://www.stir.ac.uk/media/stirling/feeds/combo.json"},t&&console.info(`[Search] Getting combo data for ${UoS_env.name} environment (${e[UoS_env.name]})`),stir.getJSON(e[UoS_env.name],e=>stir.courses.combos=e&&!e.error?e.slice(0,-1):[])},showCombosFor:e=>{if(!e||!stir.courses.combos)return[];for(var t=isNaN(e)&&new URL(e).pathname,s=[],r=0;r<stir.courses.combos.length;r++)for(var a=0;a<stir.courses.combos[r].courses.length;a++)if(t&&t===stir.courses.combos[r].courses[a].url||stir.courses.combos[r].courses[a].url.split("/").slice(-1)==e){var i=stir.clone(stir.courses.combos[r]);i.courses.splice(a,1),i.courses=i.courses.filter(e=>e.text),s.push(i);break}return s},favsUrl:function(){switch(UoS_env.name){case"dev":return"/pages/search/course-favs/index.html";case"qa":return"/stirling/pages/search/course-favs/";default:return'<t4 type="navigation" name="Helper: Path to Courses Favourites" id="5195" />'}}()}})(),stir.courses.startdates=function(){var e=Array.prototype.slice.call(document.querySelectorAll('[name="f.Start date|startval"]'));if(e&&0!==e.length){const a=[,"January","February","March","April","May","June","July","August","September","October","November","December"],i={other:"Other","1st-every-month":"First day of any month"},c=new RegExp(/\d{4}-\d{2}ay\d{4}\D\d{2}/i),l=new RegExp(/\d{4}/),o=new RegExp(/ay\d{4}\D\d{2}/i),n=new RegExp(/ay/i),d=e.filter(e=>e.value.match(c)).map(e=>({data:e.value,date:e.value.replace(o,""),month:-1<e.value.indexOf("-")&&a[parseInt(e.value.split("-")[1])]||"",year:e.value.match(l)?e.value.match(l).shift():"",acyear:e.value.match(o)?e.value.match(o).shift().replace(n,""):"",checked:e.checked}));var t=e.filter(e=>!e.value.match(c)).map(e=>({label:i[e.value]||e.value,value:e.value,checked:e.checked})),s=d.map(e=>e.acyear.replace(n,"")).filter((e,t,s)=>s.indexOf(e)===t&&e),r=e[0].parentElement.parentElement.parentElement;if(0!==s.length+t.length){e.forEach(e=>{e.parentElement.parentElement.remove()});const u=(e,t,s)=>{a="radio",i="f.Start date|startval",t=""+t,s=s,(r=document.createElement("input")).type=a,r.name=i,r.value=t,r.checked=s;var r,a=r,i=document.createElement("label");return i.appendChild(a),i.appendChild(document.createTextNode(e)),i},m=(e,t=[])=>{var s=document.createElement("fieldset"),r=document.createElement("legend");return r.classList.add("u-mb-tiny","text-xsm"),s.appendChild(r),s.classList.add("u-mb-1","c-search-filters-subgroup"),r.innerText=e,s.append(...t),s},p=document.createElement("li");s.forEach(t=>{var e=d.filter(e=>e.acyear===t).filter(e=>e.acyear===t).map(e=>u(e.month+" "+e.year,e.data,e.checked));p.append(m("Academic year "+t,e))}),t.length&&p.append(m("Other",t.map(e=>u(e.label,e.value,e.checked)))),r.appendChild(p)}}},(stir=stir||{}).session=(()=>{var e="dev"===UoS_env.name||"qa"===UoS_env.name,t={},s=window.Cookies&&Cookies.getJSON("CookieControl");return s&&s.optionalCookies&&"accepted"===s.optionalCookies.performance?(e&&console.info("[Session] performance cookie consent: given"),window.sessionStorage&&sessionStorage.getItem("session")?(t.id=sessionStorage.getItem("session"),e&&console.info("[Session] ongoing session:",t.id)):(t.id=r(),window.sessionStorage&&sessionStorage.setItem("session",t.id),e&&console.info("[Session] new session:",t.id))):(e&&console.info("[Session] performance cookie consent: not given"),window.sessionStorage&&sessionStorage.removeItem("session"),t.id=r()),t;function r(){return Date.now()+"_"+Math.floor(1000000001*Math.random())}})(),stir.funnelback=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const e=UoS_env.search,t=`https://${e}/s/`;return{getHostname:()=>e,getJsonEndpoint:()=>new URL("search.json",t),getScaleEndpoint:()=>new URL("scale",t),getCroppedImageElement:e=>{return e.url?`<img src="${(e={src:e.url,alt:e.alt,width:Math.floor(e.width/2),height:Math.floor(e.height/2),original:e.url}).src}" alt="${e.alt}" height="${e.height}" width="${e.width}" loading=lazy data-original=${e.original}>`:"\x3c!-- no image --\x3e"},getTags:e=>{e=e&&e.split(";");return e&&e.map(stir.templates.search.tagGroup).join("")}}})(),stir.addSearch=stir.addSearch||(()=>{const r="dev"===UoS_env.name||"qa"===UoS_env.name,a=!r,i="dbe6bc5995c4296d93d74b99ab0ad7de";const c="https://api.addsearch.com",e=()=>new URL("/v1/search/"+i,c);return{getJsonEndpoint:e,getCompletions:(e,t)=>{"function"==typeof t&&(t=new URL("/v1/autocomplete/document-field/"+i,c),e=new URLSearchParams(e),t.search=e,stir.getJSON(t,e=>console.info("getCompletions",e)))},getSuggestions:(e,t)=>{var s;"function"==typeof t&&((s=new URL("/v1/suggest/"+i,c)).search="term="+e,stir.getJSON(s,t))},getRecommendations:(e,t)=>{"function"==typeof t&&stir.getJSON((e=e,new URL(`/v1/recommendations/index/${i}/block/`+e,c)),t)},putReport:s=>{if(!a)return r&&console.info("[AddSearch] reporting is disabled",s),new Promise((e,t)=>{e(s)});r&&console.info("[AddSearch] Report",s);var e=new URL("/v1/stats/"+i,c),t={method:"POST",body:JSON.stringify(s)};return fetch(new Request(e,t))}}})(),stir.search=(()=>{if(void 0===window.URLSearchParams)return void((e=document.querySelector(stir.templates.search.selector.results))&&e.parentElement.removeChild(e));const d="dev"===UoS_env.name||"qa"===UoS_env.name;d&&console.info("[Search] initialising…");var e="small"===stir.MediaQuery.current?5:10;const c=256;stir.courses.clearing;let l=!0;const i=stir.curry((e,t)=>(e.search=new URLSearchParams(t),e)),o={url:stir.addSearch.getJsonEndpoint(),form:document.querySelector(stir.templates.search.selector.form),input:document.querySelector(stir.templates.search.selector.query),parameters:{any:{term:"University of Stirling",limit:e,collectAnalytics:!1},news:{customField:"type=news",sort:"custom_fields.d",collectAnalytics:!1,resultType:"organic"},event:{collectAnalytics:!1,filter:JSON.stringify({and:[{or:[{"custom_fields.type":"event"},{"custom_fields.type":"webinar"}]},{range:{"custom_fields.e":{gt:stir.Date.timeElementDatetime((j=new Date,new Date(j.setDate(j.getDate()-1))))}}}]})},gallery:{customField:"type=gallery",collectAnalytics:!1},course:{customField:"type=course",collectAnalytics:!1},coursemini:{customField:"type=course",limit:5,collectAnalytics:!1,resultType:"organic"},person:{customField:"type=profile",collectAnalytics:!1,resultType:"organic"},research:{categories:"2xhub",collectAnalytics:!1},internal:{collectAnalytics:!1,resultType:"organic",filter:JSON.stringify({or:[{"custom_fields.access":"staff"},{"custom_fields.access":"student"}]})},clearing:{collectAnalytics:!1,limit:e,term:"*"}},noquery:{any:{dateFrom:stir.Date.timeElementDatetime((j=new Date,new Date(j.setFullYear(j.getFullYear()-1))))},course:{sort:"custom_fields.name",order:"asc"},person:{sort:"custom_fields.sort",order:"desc"},event:{sort:"custom_fields.e",order:"asc"}}};if(!o.form||!o.form.term)return;d&&console.info("[Search] initialised with host:",o.url.hostname);const n=e=>{return o.form.term.value||QueryParams.get("term")||QueryParams.get("query")||((e=e)&&o.parameters[e]?o.parameters[e].term:void 0)||"*"},t=()=>o.form.term.value?QueryParams.set("term",o.form.term.value):QueryParams.remove("term"),u=e=>parseInt(QueryParams.get(e)||1),m=e=>e.getAttribute("data-type")||e.parentElement.getAttribute("data-type"),p=e=>QueryParams.set(e,parseInt(QueryParams.get(e)||1)+1),h=()=>Object.keys(o.parameters).forEach(e=>QueryParams.remove(e)),f=stir.curry((e,t)=>e.insertAdjacentHTML("beforeend",t)),g=stir.curry((e,t)=>e.innerHTML=t),v=stir.curry((e,t)=>{var s,r;return e&&(t&&0<t.total_hits&&e.removeAttribute("disabled"),s=t.question&&t.question.limit?t.question.limit:10,r=Math.ceil(t.total_hits/s),t.page>=r&&e.setAttribute("disabled",!0),d)&&console.info(`[AddSearch] page ${t.page} of ${r}. [${s}]`),t}),r=e=>new stir.accord(e,!1),a=e=>e.addEventListener("error",M),y=stir.curry((e,t)=>{var s;e.closest&&(s=(e=e.closest("[data-panel]")).querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)'),e=e.querySelectorAll("img"),s&&Array.prototype.forEach.call(s,r),e)&&Array.prototype.forEach.call(e,a)}),b=stir.curry((e,t)=>{var s=1+t.page*t.hits.length-t.hits.length,r=t.total_hits,a=e.parentElement.parentElement.querySelector(stir.templates.search.selector.summary);return a&&(a.innerHTML="",a.append(stir.templates.search.summary(t))),e.setAttribute("data-page",Math.floor(s/r+1)),t});const _={string:{urlDecode:e=>decodeURIComponent(e.replace(/\+/g," "))}},$=stir.curry((e,t)=>t),w=stir.curry((e,t,s,r)=>{var a=u(e)-1,e=o.parameters[e].limit||10;return t.position=t.position||1+s+a*e,t}),S=stir.curry((e,t)=>{return(t?C[e](t.hits.map(w(e))).join(""):"NO DATA")+stir.templates.search.pagination({currEnd:(s=t.page,r=t.hits.length,(s-1)*r+1+r-1),totalMatching:t.total_hits,progress:10/t.total_hits*100})+(O[e]?O[e]():"");var s,r}),E=e=>{var t;return!(!e||!e.hasAttribute("data-fallback")||(t=(t=document.getElementById(e.getAttribute("data-fallback")))&&(t.innerHTML||""),e.innerHTML=t,0))};{let r=document.getElementById("courseSubjectFilters");if(r&&stir.t4Globals.search.facets.Subject&&stir.t4Globals.search.facets.Subject.forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="subject=${e}">${e}</label>`,r.appendChild(t)}),(r=document.querySelector('[data-facet="Faculty"] ul'))&&stir.t4Globals.search.facets.Faculty){r.innerHTML="";let s=stir.t4Globals.search.facets.Faculty;Object.keys(s).forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="faculty=${s[e]}">${s[e]}</label>`,r.appendChild(t)})}if((r=document.querySelector('[data-facet="Start date"] ul'))&&stir.t4Globals.search.facets["Start date"]){r.innerHTML="";let s=stir.t4Globals.search.facets["Start date"];Object.keys(s).forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="start=${e}">${s[e]}</label>`,r.appendChild(t)})}if((r=document.querySelector('[data-facet="Topic"] ul'))&&stir.t4Globals.search.facets.Topic){r.innerHTML="";let s=stir.t4Globals.search.facets.Topic;Object.keys(s).forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="tag=${e}">${s[e]}</label>`,r.appendChild(t)})}if((r=document.querySelector('[data-facet="SDGs"] ul'))&&stir.t4Globals.search.facets.SDGs){r.innerHTML="";let s=stir.t4Globals.search.facets.SDGs;Object.keys(s).forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="sdg=${s[e]}">${s[e]}</label>`,r.appendChild(t)})}}e=stir.curry((e,t)=>{const s=n(e),r=stir.Object.extend({},o.parameters[e],{page:u(e),term:s},(a=e,o.form.term.value?{}:o.noquery[a]),(()=>{let s=QueryParams.getAll();return Object.keys(s).filter(e=>0===e.indexOf("f.")).reduce((e,t)=>({...e,[t]:_.string.urlDecode(s[t]).toLowerCase()}),{})})());var a=((e,t)=>{var s,r,a=new URLSearchParams(e.search);for([s,r]of new URLSearchParams(t))"sort"===s?a.set(s,r):a.append(s,r);return e.search=a,e})(i(o.url,r),(e=>{e=document.querySelector(stir.templates.search.selector.results+` form[data-filters="${e}"]`);return e?new FormData(e):new FormData})(e));stir.getJSON(a,e=>{q(s,e.total_hits),t(r,e)})});const x=(s,e)=>{const t=m(s);if(k[t]){var r=$(t),a=b(s),e=v(e),i=g(s),c=S(t),l=y(s);const o=stir.compose(l,i,c,e,a,r),n=stir.curry((e,t)=>(d&&console.info("[Search] API callback with parameters",e),s&&s.parentElement?!t||t.error||0===t.total_hits&&E(s)?void 0:o(stir.Object.extend({},t,{question:e})):d&&console.error("[Search] late callback, element no longer on DOM")));if(h(),D[t])return D[t](e=>k[t](n));k[t](n)}},L=()=>s.forEach(A),A=e=>{if(e.innerHTML="",e.hasAttribute("data-infinite")){const o=document.createElement("div");var t=document.createElement("div");(s=document.createElement("button")).innerText=stir.templates.search.strings.buttons.more,s.setAttribute("class",stir.templates.search.classes.buttons.more);const n=s;n.setAttribute("disabled",!0),n.addEventListener("click",e=>{var t=o,s=n,r=m(t);if(k[r]){var a=b(t),i=f(t),c=S(r),t=y(t);const l=stir.compose(t,i,c,v(s),a);t=stir.curry((e,t)=>t&&!t.error?l(stir.Object.extend({},t,{question:e})):new Function);p(r),k[r](t)}}),e.appendChild(o),e.appendChild(t),t.appendChild(n),t.setAttribute("class",stir.templates.search.classes.buttons.wrapper),x(o,n)}else x(e);var s},s=Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]")),k={any:e("any"),news:e("news"),event:e("event"),gallery:e("gallery"),course:e("course"),coursemini:e("coursemini"),person:e("person"),research:e("research"),internal:e("internal"),clearing:e("clearing")},C={any:e=>e.map(stir.templates.search.auto),news:e=>e.map(stir.templates.search.news),event:e=>e.map(stir.templates.search.event),gallery:e=>e.map(stir.templates.search.gallery),course:e=>e.map(stir.templates.search.course),coursemini:e=>e.map(stir.templates.search.coursemini),person:e=>e.map(stir.templates.search.person),research:e=>e.map(stir.templates.search.research),cura:e=>e.map(stir.templates.search.cura),internal:e=>e.map(stir.templates.search.auto),clearing:e=>e.map(stir.templates.search.auto)},O={coursemini:()=>stir.templates.search.courseminiFooter(n("any"))},D={course:e=>{stir.coursefavs&&stir.coursefavs.attachEventHandlers();var t=stir.courses.getCombos();t?t.addEventListener("loadend",e):e.call()}},T=async s=>{if(!l)return!0;if(s&&s.target){const c=s.target.hasAttribute("data-docid")?s.target:s.target.parentElement.hasAttribute("data-docid")?s.target.parentElement:null;var e,t,r,a,i;c&&(a=(a=c.closest(".c-search-results"))&&a.getAttribute("data-type"),e=c.getAttribute("href"),t=c.getAttribute("data-docid"),r=c.getAttribute("data-position"),a=a&&n(a),i={action:"click",session:stir.session.id,keyword:a,docid:t,position:r},e&&a&&r&&t?(s.preventDefault(),stir.addSearch.putReport(i).then(e=>{let t=!0;d&&(t=confirm("Check console for click reporting.")),l=!1,t&&c.dispatchEvent(new MouseEvent("click",{bubbles:!0,shiftKey:s.shiftKey,altKey:s.altKey,ctrlKey:s.ctrlKey,metaKey:s.metaKey})),l=!0}).catch(e=>console.error("[AddSearch] fetch error",e))):d&&console.error("Error tracking click:",s,i))}},q=async(e,t)=>{e={action:"search",session:stir.session.id,keyword:e,numberOfResults:t};stir.addSearch.putReport(e).catch(e=>console.error(e))};function M(e){e.target.getAttribute("data-original")&&e.target.getAttribute("src")!=e.target.getAttribute("data-original")?e.target.src=e.target.getAttribute("data-original"):(e.target.parentElement.parentElement?.classList?.remove("c-search-result__with-thumbnail"),e.target.parentElement.parentElement.removeChild(e.target.parentElement))}document.querySelectorAll("[data-panel]").forEach(e=>e.addEventListener("click",T)),Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-area form[data-filters]"),t=>{var e=t.getAttribute("data-filters");const s=document.querySelector(`.c-search-results[data-type="${e}"]`);t.addEventListener("reset",e=>{Array.prototype.forEach.call(t.querySelectorAll("input"),e=>e.checked=!1),A(s)}),t.addEventListener("change",e=>{m(s),A(s)}),t.addEventListener("submit",e=>{A(s),e.preventDefault()})});const U=e=>{var t;e&&e.target&&(t=`input[name="${e.target.getAttribute("data-name")}"][value="${e.target.getAttribute("data-value")}"]`,(t=(e.target.closest("[data-panel]")||document).querySelector(t))?(t.checked=!t.checked,e.target.parentElement.removeChild(e.target),L()):(t=`select[name="${e.target.getAttribute("data-name")}"]`,(t=document.querySelector(t))&&(t.selectedIndex=0,e.target.parentElement.removeChild(e.target),L())))},R=(Array.prototype.forEach.call(document.querySelectorAll(stir.templates.search.selector.summary),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-suggest")?(e.preventDefault(),o.input.value=e.target.innerText,t(),L()):e.target.hasAttribute("data-value")&&U(e)})}),Array.prototype.forEach.call(document.querySelectorAll(".c-search-results"),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-value")&&U(e)})}),e=>{t(),L(),e.preventDefault()});var j=e=>{var t,s,r=QueryParams.get("term")||QueryParams.get("query"),a=(void 0!==r&&(o.form.term.value=r.substring(0,c)),QueryParams.getAll());for(const i in a)i.indexOf("|")&&(t=`input[name="customField"][value="${i.split("|")[1]}=${a[i]}"i]`,(s=document.querySelector(t))&&(s.checked=!0),d)&&console.info("[Search] query parameter",t,s);o.form.addEventListener("submit",R),L()};return window.addEventListener("popstate",j),{init:j,constants:o,getPage:u}})(),stir.search.init();