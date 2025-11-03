var stir=stir||{};if(stir.templates=stir.templates||{},stir.const=stir.const||{},stir.templates.search=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const s=()=>"https://"+stir.funnelback.getHostname(),r=e=>`<p class="u-heritage-berry u-border-solid u-p-1"><span class="uos-lightbulb"></span> ${e}</p>`,a={staff:"University of Stirling staff",students:"current students and staff"},t={staff:["staff","students"],student:["students"]};var e=window[["s","e","i","k","o","o","C"].reverse().join("")];const i=!!e.get("psessv0")?e.get("psessv0").split("|")[0]:"EXTERNAL",l=e=>-1<t[i.toLowerCase()]?.indexOf(e.toLowerCase()),c=(e,t)=>{return l(t)?`<p class=c-search-result__summary>${e}</p>`:(e=t,r(`This page is only available to ${a[e]}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`))},o=e=>{e=e.toUpperCase().split("/").slice(-1).toString().split(".");return 1<e.length&&e[1].match(/PDF|DOCX?/)};const n=(e,t,s)=>`<span class=c-tag data-name="${t}" data-value="${s}">✖️ ${e}</span>`,u=(e,t,s,r)=>{return e?(e=-1<e.indexOf("|")?e.split("|")[1]||e.split("|")[0]:e,`<div class=c-search-result__image>
			${stir.funnelback.getCroppedImageElement({url:e.trim(),alt:t||"",width:s||550,height:r||550})}
			</div>`):""},d=e=>`<a href="${e.href}">${e.text}</a>`;const m=e=>stir.courses&&stir.courses.clearing&&Object.values&&e.clearing&&0<=Object.values(e.clearing).join().indexOf("Yes"),p={SINGLE_DRILL_DOWN:void 0,CHECKBOX:"checkbox",RADIO_BUTTON:"radio",TAB:void 0,UNKNOWN:void 0},h=function(){if(!stir.t4Globals||!stir.t4Globals.search||!stir.t4Globals.search.facets)return(e,t)=>t;const s=stir.t4Globals.search.facets;return(e,t)=>{return s[e]?(e=s[e]).findIndex?e[e.findIndex(e=>t===e.toLowerCase())]||t:e[t]||t:t}}(),f=(e,t)=>h(e,t),g=e=>h("Start date",e);return{strings:{buttons:{more:"Load more results"}},classes:{buttons:{more:"button hollow tiny",wrapper:"c-search-results__loadmore flex-container align-center u-mb-2"}},selector:{form:"form.x-search-redevelopment",query:'form.x-search-redevelopment input[name="term"]',results:".c-search-results-area",summary:".c-search-results-summary"},tag:n,stag:e=>e?`<span class="c-search-tag">${e}</span>`:"",tagGroup:e=>{e=e.split("="),e=e[1]&&e[1].replace(/,([^\s])/gi,"__SPLIT__$&").split("__SPLIT__,");return e?e.map(stir.templates.search.stag).join(""):""},breadcrumb:e=>`<p class="u-m-0">${e}</p>`,trailstring:e=>e.length?e.map(d).join(" > "):"",message:(e,t,s)=>{var r=document.createElement("p");return r.classList.add(e?"text-sm":"search_summary_noresults"),r.innerHTML=e?`There are <strong>${t} results</strong>`:"<strong>There are no results</strong>",s&&r.insertAdjacentText("beforeend"," for "),r},summary:e=>{e.page,e.hits,e.hits;var t=e.total_hits,s=document.createElement("div"),r=(s.classList.add("u-py-2"),stir.String.htmlEntities("Example query apples fred ninja").replace(/^!padrenullquery$/,"").replace(/^\*$/,"").trim()||""),a=document.createElement("em"),t=stir.templates.search.message(0<t,t.toLocaleString("en"),1<r.length);return 1<(a.textContent=r).length&&t.append(a),e&&(s.innerHTML=`<p>Page: ${e.page}, total_hits: ${e.total_hits}, hits: ${e.hits.length}</p><details><summary>JSON data</summary><pre>${JSON.stringify(e,null,"\t")}</pre></details>`),s.append(t),s},pagination:e=>{var{currEnd:e,totalMatching:t,progress:s}=e;return 0===t?"":`
			<div class="cell text-center u-my-2">
				<progress value="${s}" max="100"></progress><br />
				You have viewed ${t===e?"all":e+" of "+t} results
			</div>`},suppressed:e=>`<!-- Suppressed search result: ${e} -->`,auto:e=>{const s={text:e.categories.slice(1),href:new URL(e.url).pathname.split("/").slice(1,-1)};var t,r,a=s.text.map((e,t)=>({text:e.split("x")[1],href:"/"+s.href.slice(0,t+1).join("/")+"/"}));return`<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank=${e.score}>
				<div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
					${a=a,t=e.url,r=0,a&&0<a.length?stir.templates.search.breadcrumb(stir.templates.search.trailstring(a)):o(t)?`Document: ${o(t)} <small>${stir.Math.fileSize(r||0,0)}</small>`:""}
					<p class="u-text-regular u-m-0"><strong><a href="${e.url}">${e.title.split("|")[0].trim().replace(/\xA0/g," ")}</a></strong></p>
					<p>${e.meta_description}</p>
					<p>${e.custom_fields.d||""}</p>
					<p>${e.custom_fields.sid||""}</p>
				</div>
			</div>`},internal:e=>{const s={text:e.custom_fields?.breadcrumbs?.split(" > ")||[],href:new URL(e.url).pathname.split("/").filter(e=>e)};var t,r=l(e.custom_fields.group)?stir.templates.search.trailstring(s.text.map((e,t)=>({text:e,href:"/"+s.href.slice(0,t+1).join("/")+"/"})).slice(0,-1)):`<a href="https://www.stir.ac.uk/${s.href[0]}/">${s.text[0]}</a>`;return`
	  <div class="u-border-width-5 u-heritage-line-left c-search-result${t=e.custom_fields.group,l(t)?" c-internal-search-result":" c-internal-locked-search-result"}" data-rank=${e.rank}${e.custom_fields.type?' data-result-type="'+e.custom_fields.type.toLowerCase()+'"':""} data-access="${e.custom_fields.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
				<p class="c-search-result__breadcrumb">${r} ..:: INTERNAL ::..</p>
				<p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.replace(/Current S\S+ ?\| ?/,"").split(" | ")[0].trim()}</a></strong></p>
				${c(e.meta_description,e.custom_fields.group)}
			  </div>
			</div>`},combo:e=>`<li title="${e.prefix} ${e.title}">${e.courses.map(stir.templates.search.comboCourse).join(" and ")}${e?.codes?.ucas?" <small>&hyphen; "+e.codes.ucas+"</small>":""}${m(e)?' <sup class="c-search-result__seasonal">*</sup>':""}</li>`,comboCourse:e=>`<a href="${e.url}">${e.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi,"")}</a>`,clearing:e=>{if(Object.keys&&e.custom_fields&&0<=Object.keys(e.custom_fields).join().indexOf("clearing"))return'<p class="u-m-0"><strong class="u-energy-purple">Clearing 2025: places may be available on this course.</strong></p>'},combos:e=>0===e.combos.length?"":`
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
				</div>`},facts:e=>{var t=[];return e.custom_fields.start&&(e.custom_fields.start.map?t.push(stir.templates.search.courseFact("Start dates",e.custom_fields.start.map(g).join(", "),!1)):t.push(stir.templates.search.courseFact("Start dates",g(e.custom_fields.start),!1))),e.custom_fields.mode&&(e.custom_fields.mode.join?t.push(stir.templates.search.courseFact("Study modes",e.custom_fields.mode.join(", "),!0)):t.push(stir.templates.search.courseFact("Study modes",e.custom_fields.mode,!0))),e.custom_fields.delivery&&(e.custom_fields.delivery.join?t.push(stir.templates.search.courseFact("Delivery",e.custom_fields.delivery.join(", "),!0)):t.push(stir.templates.search.courseFact("Delivery",e.custom_fields.delivery,!0))),`<div class="c-search-result__meta grid-x">${t.join("")}</div>`},courseFact:(e,t,s)=>e&&t?`<div class="cell medium-4"><strong class="u-heritage-green">${e}</strong><p${s?" class=u-text-sentence-case":""}>${t}</p></div>`:"",course:e=>{var t=!!(e.custom_fields.delivery&&-1<e.custom_fields.delivery.indexOf("online")),s=e.url;return e.combos=stir.courses.showCombosFor("preview"==UoS_env.name?e.custom_fields.sid:e.url),`
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-rank=${e.rank} data-sid=${e.custom_fields.sid} data-result-type=course${t?" data-delivery=online":""}>
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${(e=>{switch(e){case"module":return"CPD and short courses";case"Postgraduate (taught)":return"Postgraduate";default:return e}})(e.custom_fields.level||e.custom_fields.type||"")}</span>
				</div>

		<div class="flex-container flex-dir-column u-gap u-mt-1 ">
		  <p class="u-text-regular u-m-0">
			<strong><a href="${s}" title="${e.url}">
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
			</div>`},coursemini:e=>`
			<div>
				<p><strong><a href="${s()+e.clickTrackingUrl}" title="${e.url}" class="u-border-none">
					${e.custom_fields.award||""} ${e.title} ${e.custom_fields.ucas?" - "+e.custom_fields.ucas:""} ${e.custom_fields.code?" - "+e.custom_fields.code:""}
				</a></strong></p>
				<p>${e.meta_description}</p>
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
			</p>`,person:e=>{var t=e.url.split("/").slice(-1),s="object"==typeof e.custom_fields.data?Object.assign({},...e.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{};return`
			<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=person>
				<div class=c-search-result__tags>
					${""}
				</div>
				<div class="flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						<a href="${e.url}">${e.title.split(" | ")[0].trim()}</a>
					</strong></p>
					<div>${s.JobTitle||"\x3c!-- Job title --\x3e"}<br>${s.OrgUnitName||"\x3c!-- Department --\x3e"}</div>
					<!-- <p>${e?.custom_fields?.c?(e?.custom_fields?.c+".").replace(" at the University of Stirling",""):""}</p> -->
				</div>
				${u(e.custom_fields.image||"https://www.stir.ac.uk/research/hub/image/"+t,e.title.split(" | ")[0].trim(),400,400)}
				<div class=c-search-result__footer>
					${stir.funnelback.getTags(e?.custom_fields?.category)?"<p><strong>Research interests</strong></p>":""}
					<p>${stir.funnelback.getTags(e?.custom_fields?.category)||""}</p>
				</div>
			</div>`},scholarship:e=>`
		<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=scholarship data-rank=${e.rank}>
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
		</div>`,studentstory:(e,t)=>`
				<div class="c-search-result u-border-width-5 u-heritage-line-left" data-result-type=studentstory>
					<div><a href="${t[0].href}">${t[0].text}</a></div>
					<div class="c-search-result__body flex-container flex-dir-column u-gap ">
						<p class="u-text-regular u-m-0"><strong>
							<a href="${s()+e.clickTrackingUrl}">${e.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="u-m-0">
						${e.custom_fields.profileCourse1?e.custom_fields.profileCourse1+"<br />":""}
						${e.custom_fields.profileCountry||""}
						</p>
						<p>${e.custom_fields.profileSnippet?"<q>"+e.custom_fields.profileSnippet+"</q>":"\x3c!-- 28d3702e2064f72d5dfcba865e3cc5d5 --\x3e"}</p>
					</div>
					${e.custom_fields.profileImage?u("https://www.stir.ac.uk"+e.custom_fields.profileImage,e.title.split(" | ")[0].trim(),400,400):""}
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
						<!-- <img src="data:image/jpeg;base64,${e.images.main_b64}" alt="${e.title.split(" | ")[0].trim()}" height="68" width="68" loading="lazy"> -->
						<img src="${e.images.main}" alt="${e.title.split(" | ")[0].trim()}" height="275" width="275" loading="lazy">
					</div>
				</div>`},gallery:e=>{return`
				<div class="u-border-width-5 u-heritage-line-left c-search-result c-search-result__with-thumbnail" data-rank=${e.rank} data-result-type=news>
					
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${s()+e.clickTrackingUrl}">${e.custom_fields.h1||e.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="c-search-result__secondary">${stir.Date.newsDate(new Date(e.custom_fields.d))}</p>
						<p >${e.meta_description}</p>	
					</div>
					<div class=c-search-result__image>
						${stir.funnelback.getCroppedImageElement({url:(t=JSON.parse(e.custom_fields.custom),t.id?`https://farm${t.farm}.staticflickr.com/${t.server}/${t.id}_${t.secret}_c.jpg`:""),alt:"Image of "+e.title.split(" | ")[0].trim(),width:550,height:550})}
					</div>
				</div>`;var t},event:e=>{var t,s=-1<e.custom_fields?.tags?.indexOf("Webinar"),s=e.custom_fields?.image||s,r=e.custom_fields.name||e.title.split("|")[0].trim(),a=e.url,i="object"==typeof e.custom_fields.data?Object.assign({},...e.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{};return`
			<div class="u-border-width-5 u-heritage-line-left c-search-result${s?" c-search-result__with-thumbnail":""}" data-rank=${e.rank} data-result-type=event>
				<div class=c-search-result__tags>
					${i.isSeriesChild?stir.templates.search.stag(i.isSeriesChild):""}
				</div>
				<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0">
						<strong>${d({text:r,href:a})}</strong>
					</p>
					<div class="flex-container flex-dir-column u-gap-8">
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-calendar"></span>
							<span>${s=e.custom_fields.d,r=e.custom_fields.e,s?(s=new Date(s),a=stir.Date.newsDate(s),s=stir.Date.timeElementDatetime(s),!r||(t=(r=r&&new Date(r))&&stir.Date.newsDate(r),r=r&&stir.Date.timeElementDatetime(r),a==t)?`<time datetime="${s}">${a}</time>`:`<time datetime="${s}">${a}</time>–<time datetime="${r}">${t}</time>`):'<abbr title="To be confirmed">TBC</abbr>'}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="uos-clock u-icon h5"></span>
							<span>${s=e.custom_fields.d,a=e.custom_fields.e,(s?`<time>${stir.Date.time24(new Date(s))}</time>`:"")+(a?`–<time>${stir.Date.time24(new Date(a))}</time>`:"")}</span>
						</div>
						<div class="flex-container u-gap-16 align-middle">
							<span class="u-icon h5 uos-${e.custom_fields.online?"web":"location"}"></span>
							<span>${i.online?"Online":i.location||""}</span>
						</div>
					</div>
					<p class=text-sm>${e.meta_description||"DEBUG: No Description"}</p>
					${i.register?`<p class="u-m-0 text-sm"><a href="${i.register}" class="u-m-0 button hollow tiny">Register now</a></p>`:""}
				</div>
				${u(e.custom_fields.image&&e.custom_fields.image.split("|")[0],e.title.split(" | ")[0])}
				${-1<e.custom_fields?.tags?.indexOf("Webinar")?'<div class=c-search-result__image><div class="c-icon-image"><span class="uos-web"></span></div></div>':""}
				<details><summary>JSON data</summary><pre>${JSON.stringify(e.custom_fields,null,"\t")}</pre></details>
			</div>`},research:e=>stir.templates.search.auto(e),cura:e=>e.messageHtml?`<div class="c-search-result-curated" data-result-type=curated-message>
					${e.messageHtml}
				</div>`:`<div class="c-search-result" data-result-type=curated>
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${s()+e.linkUrl}" title="${e.displayUrl}">${e.titleHtml}</a><br>
							<small class="c-search-result__breadcrumb">${e.displayUrl}</small>
						</strong></p>
						<p>${e.descriptionHtml}</p>
					</div>
				</div>`,facet:t=>`<fieldset data-facet="${t.name}">
				<legend class="show-for-sr">Filter by ${t.name}</legend>
				<div data-behaviour=accordion>
					<accordion-summary>${t.name}</accordion-summary>
					<div>
						<ul>${t.allValues.filter(e=>f(t.name,e.label)).map(stir.templates.search.labelledFacetItems(t)).join("")}</ul>
					</div>
				</div>
			</fieldset>`,labelledFacetItems:stir.curry((e,t)=>`
	<li>
		<label>
			<input type=${p[e.guessedDisplayType]||"text"} name="${t.queryStringParamName}" value="${t.queryStringParamValue}" ${t.selected?"checked":""}>
			${f(e.name,t.label)}
			<!-- <span>${t.count||"0"}</span> -->
		</label>
	</li>`)}})(),"undefined"!=typeof window&&!("onscrollend"in window)){const lb=new Event("scrollend"),mb=new Set;document.addEventListener("touchstart",e=>{for(var t of e.changedTouches)mb.add(t.identifier)},{passive:!0}),document.addEventListener("touchend",e=>{for(var t of e.changedTouches)mb.delete(t.identifier)},{passive:!0}),document.addEventListener("touchcancel",e=>{for(var t of e.changedTouches)mb.delete(t.identifier)},{passive:!0});let a=new WeakMap;function e(e,t,s){let r=e[t];e[t]=function(){var e=Array.prototype.slice.apply(arguments,[0]);r.apply(this,e),e.unshift(r),s.apply(this,e)}}function t(e,t,s,r){if("scroll"==t||"scrollend"==t){let s=this,r=a.get(s);if(void 0===r){let t=0;r={scrollListener:e=>{clearTimeout(t),t=setTimeout(()=>{mb.size?setTimeout(r.scrollListener,100):(s&&s.dispatchEvent(lb),t=0)},100)},listeners:0},e.apply(s,["scroll",r.scrollListener]),a.set(s,r)}r.listeners++}}function n(e,t,s){"scroll"!=t&&"scrollend"!=t||void 0===(t=a.get(this))||0<--t.listeners||(e.apply(this,["scroll",t.scrollListener]),a.delete(this))}e(Element.prototype,"addEventListener",t),e(window,"addEventListener",t),e(document,"addEventListener",t),e(Element.prototype,"removeEventListener",n),e(window,"removeEventListener",n),e(document,"removeEventListener",n)}var scrollend={__proto__:null};!function(){const r=(t,s)=>{let r;return(...e)=>{clearTimeout(r),r=setTimeout(()=>t.apply(this,e),s)}},t=e=>{const a=e.querySelector(".carousel-slides"),i=e.querySelector(".carousel-slides h2:first-of-type button"),l=e.querySelector(".carousel-slides h2:last-of-type button"),c=e.querySelector(".slide-arrow-prev"),o=e.querySelector(".slide-arrow-next"),n=e=>{e.setAttribute("disabled","disabled"),e.querySelector("span")?.classList.add("u-opacity-0")},u=e=>{e.removeAttribute("disabled"),e.querySelector("span")?.classList.remove("u-opacity-0")},d=e=>{e?a.classList.add("align-center"):a.classList.remove("align-center"),e?c.classList.remove("u-border-right-solid"):c.classList.add("u-border-right-solid"),e?o.classList.remove("u-border-left-solid"):o.classList.add("u-border-left-solid")};e=()=>{let e=!1,t=!1;u(c),u(o);var s=i.getBoundingClientRect(),r=a.getBoundingClientRect(),s=(s.left>=r.left&&(n(c),e=!0),l.getBoundingClientRect());s.right<=r.right&&(n(o),t=!0),e&&t?d(!0):d(!1)};const s=r(e,250),t=e=>{var t=a.clientWidth+10;a.scrollLeft+="prev"===e?-t:t,a.addEventListener("scrollend",s)};e();["wheel","touchend"].forEach(e=>{a.addEventListener(e,s)}),c.addEventListener("click",()=>t("prev")),o.addEventListener("click",()=>t("next")),window.addEventListener("resize",s)},s=l=>{if(l){l.classList.remove("hide");var e=l.querySelector("nav#nav-slider");const c=e&&e.querySelectorAll("button"),o=l.querySelectorAll("#mySlider1 > div");c&&c.forEach(e=>{e.addEventListener("click",e=>{var t,s,r,a,i=e.target.closest("button[data-open]");i&&(i=i.getAttribute("data-open")||"all",t=i,s=o,r=c,a=l,s.forEach(e=>{e.setAttribute("aria-hidden","true"),e.classList.add("hide")}),r&&r.forEach(e=>{e&&e.classList.remove("u-white","u-bg-heritage-green")}),(s=a.querySelector(`[data-panel="${t}"]`))&&(s.classList.remove("hide"),s.removeAttribute("aria-hidden")),(r=a.querySelector(`[data-open="${t}"]`))&&r.classList.add("u-white","u-bg-heritage-green"),e.isTrusted)&&QueryParams.set("tab",i)})}),o&&1<o.length&&(o.forEach(e=>{var t=e.getAttribute("data-panel");e.setAttribute("role","tabpanel"),e.setAttribute("tabindex","0"),e.setAttribute("id","search_results_panel_"+t),e.setAttribute("aria-labelledby","searchtab_"+t)}),e=QueryParams.get("tab")||"all",e=l.querySelector(`[data-open="${e}"]`))&&(e.click(),e.scrollIntoView({block:"end"}))}};void 0!==window.URLSearchParams&&(stir.nodes(".c-search-results-area").forEach(e=>s(e)),stir.nodes(".carousel").forEach(e=>t(e)))}(),stir.courses=(()=>{const t="dev"===UoS_env.name||"qa"===UoS_env.name;return t&&console.info("[Search] Clearing is closed"),{clearing:!1,getCombos:()=>{var e;if(!stir.courses.combos)return e={dev:"combo.json",qa:"combo.json",preview:stir?.t4Globals?.search?.combos||"",prod:"https://www.stir.ac.uk/media/stirling/feeds/combo.json"},t&&console.info(`[Search] Getting combo data for ${UoS_env.name} environment (${e[UoS_env.name]})`),stir.getJSON(e[UoS_env.name],e=>stir.courses.combos=e&&!e.error?e.slice(0,-1):[])},showCombosFor:e=>{if(!e||!stir.courses.combos)return[];for(var t=isNaN(e)&&new URL(e).pathname,s=[],r=0;r<stir.courses.combos.length;r++)for(var a=0;a<stir.courses.combos[r].courses.length;a++)if(t&&t===stir.courses.combos[r].courses[a].url||stir.courses.combos[r].courses[a].url.split("/").slice(-1)==e){var i=stir.clone(stir.courses.combos[r]);i.courses.splice(a,1),i.courses=i.courses.filter(e=>e.text),s.push(i);break}return s},favsUrl:function(){switch(UoS_env.name){case"dev":return"/pages/search/course-favs/index.html";case"qa":return"/stirling/pages/search/course-favs/";default:return'<t4 type="navigation" name="Helper: Path to Courses Favourites" id="5195" />'}}()}})(),stir.courses.startdates=function(){var e=Array.prototype.slice.call(document.querySelectorAll('[name="f.Start date|startval"]'));if(e&&0!==e.length){const a=[,"January","February","March","April","May","June","July","August","September","October","November","December"],i={other:"Other","1st-every-month":"First day of any month"},l=new RegExp(/\d{4}-\d{2}ay\d{4}\D\d{2}/i),c=new RegExp(/\d{4}/),o=new RegExp(/ay\d{4}\D\d{2}/i),n=new RegExp(/ay/i),u=e.filter(e=>e.value.match(l)).map(e=>({data:e.value,date:e.value.replace(o,""),month:-1<e.value.indexOf("-")&&a[parseInt(e.value.split("-")[1])]||"",year:e.value.match(c)?e.value.match(c).shift():"",acyear:e.value.match(o)?e.value.match(o).shift().replace(n,""):"",checked:e.checked}));var t=e.filter(e=>!e.value.match(l)).map(e=>({label:i[e.value]||e.value,value:e.value,checked:e.checked})),s=u.map(e=>e.acyear.replace(n,"")).filter((e,t,s)=>s.indexOf(e)===t&&e),r=e[0].parentElement.parentElement.parentElement;if(0!==s.length+t.length){e.forEach(e=>{e.parentElement.parentElement.remove()});const d=(e,t,s)=>{a="radio",i="f.Start date|startval",t=""+t,s=s,(r=document.createElement("input")).type=a,r.name=i,r.value=t,r.checked=s;var r,a=r,i=document.createElement("label");return i.appendChild(a),i.appendChild(document.createTextNode(e)),i},m=(e,t=[])=>{var s=document.createElement("fieldset"),r=document.createElement("legend");return r.classList.add("u-mb-tiny","text-xsm"),s.appendChild(r),s.classList.add("u-mb-1","c-search-filters-subgroup"),r.innerText=e,s.append(...t),s},p=document.createElement("li");s.forEach(t=>{var e=u.filter(e=>e.acyear===t).filter(e=>e.acyear===t).map(e=>d(e.month+" "+e.year,e.data,e.checked));p.append(m("Academic year "+t,e))}),t.length&&p.append(m("Other",t.map(e=>d(e.label,e.value,e.checked)))),r.appendChild(p)}}},(stir=stir||{}).funnelback=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const e=UoS_env.search,t=`https://${e}/s/`;return{getHostname:()=>e,getJsonEndpoint:()=>new URL("search.json",t),getScaleEndpoint:()=>new URL("scale",t),getCroppedImageElement:e=>{return e.url?`<img src="${(e={src:e.url,alt:e.alt,width:Math.floor(e.width/2),height:Math.floor(e.height/2),original:e.url}).src}" alt="${e.alt}" height="${e.height}" width="${e.width}" loading=lazy data-original=${e.original}>`:"\x3c!-- no image --\x3e"},getTags:e=>{e=e&&e.split(";");return e&&e.map(stir.templates.search.tagGroup).join("")},imgError:e=>{e.target.getAttribute("data-original")&&e.target.getAttribute("src")!=e.target.getAttribute("data-original")?e.target.src=e.target.getAttribute("data-original"):(e.target.parentElement.parentElement?.classList?.remove("c-search-result__with-thumbnail"),e.target.parentElement.parentElement.removeChild(e.target.parentElement))}}})(),stir.addSearch=(()=>{const r="dbe6bc5995c4296d93d74b99ab0ad7de",a="https://api.addsearch.com";return{getJsonEndpoint:()=>new URL("/v1/search/"+r,a),getCompletions:(e,t)=>{"function"==typeof t&&(t=new URL("/v1/autocomplete/document-field/"+r,a),e=new URLSearchParams(e),t.search=e,stir.getJSON(t,e=>console.info("getCompletions",e)))},getSuggestions:(e,t)=>{var s;"function"==typeof t&&((s=new URL("/v1/suggest/"+r,a)).search="term="+e,stir.getJSON(s,t))},getRecommendations:(e,t)=>{"function"==typeof t&&stir.getJSON((e=e,new URL(`/v1/recommendations/index/${r}/block/`+e,a)),t)}}})(),stir.search=()=>{if(void 0===window.URLSearchParams)return void((e=document.querySelector(stir.templates.search.selector.results))&&e.parentElement.removeChild(e));const u="dev"===UoS_env.name||"qa"===UoS_env.name;u&&console.info("[Search] initialising…");var e="small"===stir.MediaQuery.current?5:10;const a=256;stir.courses.clearing;var t=stir.curry((e,t)=>(e.search=new URLSearchParams(t),e));const i={url:stir.addSearch.getJsonEndpoint(),form:document.querySelector(stir.templates.search.selector.form),input:document.querySelector(stir.templates.search.selector.query),parameters:{any:{term:"University of Stirling",limit:e},news:{customField:"type=news",sort:"custom_fields.d"},event:{filter:JSON.stringify({and:[{"custom_fields.type":"event"},{or:[{range:{"custom_fields.e":{gt:"2025-10-19",lt:"2025-10-27"}}},{range:{"custom_fields.d":{gt:"2025-10-19",lt:"2025-10-27"}}},{and:[{range:{"custom_fields.d":{lt:"2025-10-19"}}},{range:{"custom_fields.e":{gt:"2025-10-27"}}}]}]}]})},gallery:{customField:"type=gallery"},course:{sort:"custom_fields.name",order:"asc",customField:"type=course"},coursemini:{customField:"type=course",limit:5},person:{customField:"type=profile",sort:"custom_fields.sort",order:"desc"},research:{categories:"2xhub"},internal:{categories:"1xinternal-staff"},clearing:{limit:e}},noquery:{course:{}}};if(!i.form||!i.form.term)return;u&&console.info("[Search] initialised with host:",i.url.hostname);const r=stir.curry((e,t)=>stir.Object.extend({},e,t)),l=(e,t)=>{var s,r,a=new URLSearchParams(e.search);for([s,r]of new URLSearchParams(t))"sort"===s?a.set(s,r):a.append(s,r);return e.search=a,e},c=e=>i.form.term.value||QueryParams.get("term")||i.parameters[e].term||"*",s=()=>i.form.term.value?QueryParams.set("term",i.form.term.value):QueryParams.remove("term"),d=e=>e.getAttribute("data-type")||e.parentElement.getAttribute("data-type"),m=e=>QueryParams.set(e,parseInt(QueryParams.get(e)||1)+1),p=()=>Object.keys(i.parameters).forEach(e=>QueryParams.remove(e)),o=e=>{var t,e=document.querySelector(stir.templates.search.selector.results+` form[data-filters="${e}"]`),s=e?new FormData(e):new FormData;for(t of s.keys())0!==t.indexOf("f.")&&s.getAll(t).length;return s},h=stir.curry((e,t)=>e.insertAdjacentHTML("beforeend",t)),f=stir.curry((e,t)=>e.innerHTML=t),g=stir.curry((e,t)=>(e&&t&&0<t.total_hits&&e.removeAttribute("disabled"),t)),n=e=>new stir.accord(e,!1),v=stir.curry((e,t)=>{var s;e.closest&&(s=(e=e.closest("[data-panel]")).querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)'),e.querySelectorAll("img"),Array.prototype.forEach.call(s,n))}),b=stir.curry((e,t)=>{var s=1+t.page*t.hits-t.hits,r=t.total_hits,a=e.parentElement.parentElement.querySelector(stir.templates.search.selector.summary);return e.setAttribute("data-page",Math.floor(s/r+1)),a&&(a.innerHTML="",a.append(stir.templates.search.summary(t))),t}),y={string:{urlDecode:e=>decodeURIComponent(e.replace(/\+/g," "))}},_=stir.curry((e,t)=>{return t}),$=stir.curry((e,t)=>{return(t?C[e](t.hits).join(""):"NO DATA")+stir.templates.search.pagination({currEnd:(e=t.page,s=t.hits.length,(e-1)*s+1+s-1),totalMatching:t.total_hits,progress:10/t.total_hits*100});var s}),w=e=>{var t;return!(!e||!e.hasAttribute("data-fallback")||(t=(t=document.getElementById(e.getAttribute("data-fallback")))&&(t.innerHTML||""),e.innerHTML=t,0))},S=t(i.url);{let r=document.getElementById("courseSubjectFilters");if(r&&stir.t4Globals.search.facets.Subject&&stir.t4Globals.search.facets.Subject.forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="subject=${e}">${e}</label>`,r.appendChild(t)}),(r=document.querySelector('[data-facet="Faculty"] ul'))&&stir.t4Globals.search.facets.Faculty){r.innerHTML="";let s=stir.t4Globals.search.facets.Faculty;Object.keys(s).forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="faculty=${s[e]}">${s[e]}</label>`,r.appendChild(t)})}if((r=document.querySelector('[data-facet="Start date"] ul'))&&stir.t4Globals.search.facets["Start date"]){r.innerHTML="";let s=stir.t4Globals.search.facets["Start date"];Object.keys(s).forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="start=${e}">${s[e]}</label>`,r.appendChild(t)})}if((r=document.querySelector('[data-facet="Topic"] ul'))&&stir.t4Globals.search.facets.Topic){r.innerHTML="";let s=stir.t4Globals.search.facets.Topic;Object.keys(s).forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="tag=${e}">${s[e]}</label>`,r.appendChild(t)})}if((r=document.querySelector('[data-facet="SDGs"] ul'))&&stir.t4Globals.search.facets.SDGs){r.innerHTML="";let s=stir.t4Globals.search.facets.SDGs;Object.keys(s).forEach(e=>{var t=document.createElement("li");t.innerHTML=`<label><input name=customField type=checkbox value="sdg=${s[e]}">${s[e]}</label>`,r.appendChild(t)})}}e=stir.curry((e,t)=>{var s=r(i.parameters[e])(stir.Object.extend({},{page:parseInt(QueryParams.get(e)||1),term:c(e)},(s=e,i.form.term.value?{}:i.noquery[s]),(()=>{let s=QueryParams.getAll();return Object.keys(s).filter(e=>0===e.indexOf("f.")).reduce((e,t)=>({...e,[t]:y.string.urlDecode(s[t]).toLowerCase()}),{})})())),s=l(S(s),o(e));stir.getJSON(s,t)}),t=stir.curry((e,t)=>{var s=c(e).trim(),s=r(i.parameters[e])({term:`[t:${s} c:${s} subject:${s}]`}),s=l(S(s),o(e));stir.getJSON(s,t)});const x=(t,e)=>{const s=d(t);if(A[s]){var r=_(s),a=b(t),e=g(e),i=f(t),l=$(s),c=v(t);const o=stir.compose(c,i,l,e,a,r),n=e=>t&&t.parentElement?!e||e.error||0===e.total_hits&&w(t)?void 0:o(e):u&&console.error("[Search] late callback, element no longer on DOM");if(p(),T[s])return T[s](e=>A[s](n));A[s](n)}},E=()=>k.forEach(L),L=e=>{if(e.innerHTML="",e.hasAttribute("data-infinite")){const o=document.createElement("div");var t=document.createElement("div");(s=document.createElement("button")).innerText=stir.templates.search.strings.buttons.more,s.setAttribute("class",stir.templates.search.classes.buttons.more);const n=s;n.setAttribute("disabled",!0),n.addEventListener("click",e=>{var t=o,s=n,r=d(t);if(A[r]){var a=b(t),i=h(t),l=$(r),t=v(t);const c=stir.compose(t,i,l,g(s),a);m(r),A[r](e=>e&&!e.error?c(e):new Function)}}),e.appendChild(o),e.appendChild(t),t.appendChild(n),t.setAttribute("class",stir.templates.search.classes.buttons.wrapper),x(o,n)}else x(e);var s},k=Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]")),A={any:e("any"),news:e("news"),event:e("event"),gallery:e("gallery"),course:e("course"),coursemini:t("coursemini"),person:e("person"),research:e("research"),internal:e("internal"),clearing:e("clearing")},C={any:e=>e.map(stir.templates.search.auto),news:e=>e.map(stir.templates.search.news),event:e=>e.map(stir.templates.search.event),gallery:e=>e.map(stir.templates.search.gallery),course:e=>e.map(stir.templates.search.course),coursemini:e=>e.map(stir.templates.search.coursemini),person:e=>e.map(stir.templates.search.person),research:e=>e.map(stir.templates.search.research),cura:e=>e.map(stir.templates.search.cura),internal:e=>e.map(stir.templates.search.auto),clearing:e=>e.map(stir.templates.search.auto)};const T={course:e=>{stir.coursefavs&&stir.coursefavs.attachEventHandlers();var t=stir.courses.getCombos();t?t.addEventListener("loadend",e):e.call()}},O=(Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-area form[data-filters]"),t=>{var e=t.getAttribute("data-filters");const s=document.querySelector(`.c-search-results[data-type="${e}"]`);t.addEventListener("reset",e=>{Array.prototype.forEach.call(t.querySelectorAll("input"),e=>e.checked=!1),L(s)}),t.addEventListener("change",e=>{d(s),L(s)}),t.addEventListener("submit",e=>{L(s),e.preventDefault()})}),e=>{var t;e&&e.target&&(t=`input[name="${e.target.getAttribute("data-name")}"][value="${e.target.getAttribute("data-value")}"]`,(t=(e.target.closest("[data-panel]")||document).querySelector(t))?(t.checked=!t.checked,e.target.parentElement.removeChild(e.target),E()):(t=`select[name="${e.target.getAttribute("data-name")}"]`,(t=document.querySelector(t))&&(t.selectedIndex=0,e.target.parentElement.removeChild(e.target),E())))}),U=(Array.prototype.forEach.call(document.querySelectorAll(stir.templates.search.selector.summary),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-suggest")?(e.preventDefault(),i.input.value=e.target.innerText,s(),E()):e.target.hasAttribute("data-value")&&O(e)})}),Array.prototype.forEach.call(document.querySelectorAll(".c-search-results"),e=>{e.addEventListener("click",e=>{e.target.hasAttribute("data-value")&&O(e)})}),e=>{s(),E(),e.preventDefault()});t=e=>{void 0!==QueryParams.get("term")&&(i.form.term.value=QueryParams.get("term").substring(0,a));var t=QueryParams.getAll();for(const r in t){var s=document.querySelector(`input[name="${encodeURIComponent(r)}"][value="${encodeURIComponent(t[r])}"]`);s&&(s.checked=!0)}i.form.addEventListener("submit",U),E()};t(),window.addEventListener("popstate",t)},stir.search();