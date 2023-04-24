var stir=stir||{};stir.templates=stir.templates||{},stir.const=stir.const||{},stir.templates.search=(()=>{"dev"!==UoS_env.name&&UoS_env.name;const s=()=>"https://"+stir.funnelback.getHostname(),a=e=>`<p class="u-heritage-berry u-border-solid u-p-1"><span class="uos-lightbulb"></span> ${e}</p>`,r={staff:"University of Stirling staff",students:"current students and staff"},t={staff:["staff","students"],student:["students"]};var e=window[["s","e","i","k","o","o","C"].reverse().join("")];const i=!!e.get("psessv0")?e.get("psessv0").split("|")[0]:"EXTERNAL",n=e=>-1<t[i.toLowerCase()]?.indexOf(e.toLowerCase()),l=(e,t)=>{return n(t)?`<p class=c-search-result__summary>${e}</p>`:(e=t,a(`This page is only available to ${r[e]}. You will be asked to log in before you can view it, but once you are logged in results will be shown automatically.`))},c=e=>{e=e.toUpperCase().split("/").slice(-1).toString().split(".");return 1<e.length&&e[1].match(/PDF|DOCX?/)},o=(e,t)=>document.querySelector(`input[name="${e}"][value="${t}"],select[name="${e}"] option[value="${t}"]`),u=e=>e.map(e=>e.selectedValues.map(e=>{{var t=e.queryStringParamName,a=(e=e.queryStringParamValue,o(t,e));if(a)return m(Array.prototype.slice.call(a.parentElement.childNodes).map(e=>3===e.nodeType?e.textContent:"").join(""),t,e)}}).join(" ")).join(" "),m=(e,t,a)=>`<span class=c-tag data-name="${t}" data-value="${a}">✖️ ${e}</span>`,d=(e,t,a,r)=>{return e?(e=-1<e.indexOf("|")?e.split("|")[1]||e.split("|")[0]:e,`<div class=c-search-result__image>
			${stir.funnelback.getCroppedImageElement({url:e.trim(),alt:t||"",width:a||550,height:r||550})}
			</div>`):""},p=e=>`<a href="${e.href}">${e.text}</a>`,h=e=>stir.courses&&stir.courses.clearing&&Object.values&&e.clearing&&0<=Object.values(e.clearing).join().indexOf("Yes"),g={SINGLE_DRILL_DOWN:void 0,CHECKBOX:"checkbox",RADIO_BUTTON:"radio",TAB:void 0,UNKNOWN:void 0},v={"01":"January","02":"February","05":"May","08":"August","09":"September",10:"October"},y=e=>{return 7===e.indexOf("ay")?(t=e.split("ay").shift(),v[t.split("-").pop()]+" "+t.split("-").shift()):e;var t};return{tag:m,stag:e=>e?`<span class="c-search-tag">${e}</span>`:"",tagGroup:e=>{e=e.split("="),e=e[1]&&e[1].replace(/,([^\s])/gi,"__SPLIT__$&").split("__SPLIT__,");return e?e.map(stir.templates.search.stag).join(""):""},breadcrumb:e=>`<p class="u-m-0">${e}</p>`,trailstring:e=>e.length?e.map(p).join(" > "):"",summary:e=>{var t,a=e.response.resultPacket.resultsSummary["totalMatching"],r=stir.String.htmlEntities(e.question.originalQuery).replace(/^!padrenullquery$/,"").trim(),s=1<r.length?` for <em>${r}</em>`:"";return`<div class="u-py-2"> ${0<a?`	<p class="text-sm">There are <strong>${a.toLocaleString("en")} results</strong>${s}.</p>`:`<p id="search_summary_noresults"><strong>There are no results${s}</strong>.</p>`} ${[(t=e.question.rawInputParameters,Object.keys(t).filter(e=>0===e.indexOf("meta_")&&t[e][0]).map(a=>{var e=o(a,t[a]);return e?m(e.innerText||e.parentElement.innerText,a,t[a]):(e=new RegExp(/\[([^\[^\]]+)\]/),t[a].toString().replace(e,"$1").split(/\s/).map(e=>{var t=o(a,e);return t?m(t.parentElement.innerText,a,e):""}).join(" "))}).join(" ")),u(e.response.facets||[])].join(" ")} ${r&&(a=e.response.resultPacket.spell)?`<p>Did you mean <a href="#" data-suggest>${a.text.split(" ")[0]}</a>?</p>`:""} </div>`},pagination:e=>{var{currEnd:e,totalMatching:t,progress:a}=e;return 0===t?"":`
			<div class="cell text-center u-margin-y">
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
				</div>`},internal:e=>{const a={text:e.metaData?.breadcrumbs?.split(" > ")||[],href:new URL(e.liveUrl).pathname.split("/").filter(e=>e)};var t,r=n(e.metaData.group)?stir.templates.search.trailstring(a.text.map((e,t)=>({text:e,href:"/"+a.href.slice(0,t+1).join("/")+"/"})).slice(0,-1)):`<a href="https://www.stir.ac.uk/${a.href[0]}/">${a.text[0]}</a>`;return`
      <div class="c-search-result${t=e.metaData.group,n(t)?" c-internal-search-result":" c-internal-locked-search-result"}" data-rank=${e.rank}${e.metaData.type?' data-result-type="'+e.metaData.type.toLowerCase()+'"':""} data-access="${e.metaData.access}">
			  <div class="c-search-result__body u-mt-1 flex-container flex-dir-column u-gap">
			    <p class="c-search-result__breadcrumb">${r}</p>
			    <p class="u-text-regular u-m-0"><strong><a href="${stir.funnelback.getJsonEndpoint().origin+e.clickTrackingUrl}">${e.title.split(" | ")[0]}</a></strong></p>
			    ${l(e.summary,e.metaData.group)}
			  </div>
			</div>`},combo:e=>`<li title="${e.prefix} ${e.title}">${e.courses.map(stir.templates.search.comboCourse).join(" and ")}${e?.codes?.ucas?" <small>&hyphen; "+e.codes.ucas+"</small>":""}${h(e)?' <sup class="c-search-result__seasonal">*</sup>':""}</li>`,comboCourse:e=>`<a href="${e.url}">${e.text.replace(/(BAcc \(Hons\))|(BA \(Hons\))|(BSc \(Hons\))|(\/\s)/gi,"")}</a>`,clearing:e=>{if(Object.keys&&e.metaData&&0<=Object.keys(e.metaData).join().indexOf("clearing"))return'<p class="u-m-0"><strong class="u-heritage-berry">Clearing 2022: places may be available on this course.</strong></p>'},combos:e=>0===e.combos.length?"":`
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
				</div>`},courseFact:(e,t,a)=>e&&t?`<div class="cell medium-4"><strong class="u-heritage-green">${e}</strong><p${a?" class=u-text-sentence-case":""}>${t.replace("|",", ")}</p></div>`:"",course:e=>{var t="preview"===UoS_env.name||"dev"===UoS_env.name||"qa"===UoS_env.name,a=e.metaData.subject?e.metaData.subject.split(/,\s?/).slice(0,1):"",a=(stir.String.slug(a),!!(e.metaData.delivery&&-1<e.metaData.delivery.toLowerCase().indexOf("online"))),r=-1<UoS_env.name.indexOf("preview")?(r=e.metaData.sid)?"/terminalfour/preview/1/en/"+r:"#":s()+e.clickTrackingUrl;return e.combos=stir.courses.showCombosFor("preview"==UoS_env.name?e.metaData.sid:e.liveUrl),`
			<div class="c-search-result" data-rank=${e.rank} data-sid=${e.metaData.sid} data-result-type=course${a?" data-delivery=online":""}>
				<div class=" c-search-result__tags">
					<span class="c-search-tag">${(e=>{switch(e){case"module":return"CPD and short courses";case"Postgraduate (taught)":return"Postgraduate";default:return e}})(e.metaData.level||e.metaData.type||"")}</span>
				</div>

        <div class="flex-container flex-dir-column u-gap u-mt-1">
          <p class="u-text-regular u-m-0">
            <strong><a href="${r}" title="${e.liveUrl}">
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
          
          ${t?`<div class="flex-container u-gap u-mb-1 text-xsm">
              <div data-nodeid="coursefavsbtn" class="flex-container u-gap" data-id="${e.metaData.sid}"></div>
              <a href="/courses/favourites/">View favourites</a>
          </div>`:""}
          
          ${stir.templates.search.combos(e)}
          ${stir.templates.search.pathways(e)}
        </div>
			</div>`},coursemini:e=>`
			<div>
				<p><strong><a href="${s()+e.clickTrackingUrl}" title="${e.liveUrl}" class="u-border-none">
					${e.metaData.award||""} ${e.title} ${e.metaData.ucas?" - "+e.metaData.ucas:""} ${e.metaData.code?" - "+e.metaData.code:""}
				</a></strong></p>
				<p>${e.summary}</p>
			</div>`,person:e=>`
			<div class=c-search-result data-result-type=person>
				<div class=c-search-result__tags>
					${stir.templates.search.stag(e.metaData.faculty?stir.research.hub.getFacultyFromOrgUnitName(e.metaData.faculty):"")}
				</div>
				<div class="flex-container flex-dir-column u-gap u-mt-1">
					<p class="u-text-regular u-m-0"><strong>
						<a href="${s()+e.clickTrackingUrl}">${e.title.split(" | ")[0].trim()}</a>
					</strong></p>
					<div>${e.metaData.role||"\x3c!-- Job title --\x3e"}<br>${e.metaData.faculty||""}</div>
					<!-- <p>${e.metaData.c?(e.metaData.c+".").replace(" at the University of Stirling",""):""}</p> -->
				</div>
				${d(e.metaData.image,e.title.split(" | ")[0].trim(),400,400)}
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
							<a href="${s()+e.clickTrackingUrl}">${e.title.split(" | ")[0].trim()}</a>
						</strong></p>
						<p class="u-m-0">${e.metaData.profileCourse1}<br />
						${e.metaData.profileCountry}</p>
						<p>${e.metaData.c}</p>
					</div>
					${d("https://www.stir.ac.uk"+e.metaData.profileImage,e.title.split(" | ")[0].trim(),400,400)}
				</div>`,news:e=>`
				<div class="c-search-result${e.metaData.image?" c-search-result__with-thumbnail":""}" data-rank=${e.rank} data-result-type=news>
					<div class="c-search-result__body flex-container flex-dir-column u-gap u-mt-1">
						<p class="u-text-regular u-m-0">
							<strong>
								<a href="${s()+e.clickTrackingUrl}">${e.metaData.h1||e.title.split(" | ")[0].trim()}</a>
							</strong>
						</p>
						<div>${e.metaData.d?stir.Date.newsDate(new Date(e.metaData.d)):""}</div>
						<p class="text-sm">${e.summary}</p>
					</div>
					${d(e.metaData.image,e.title.split(" | ")[0].trim())}
				</div>`,gallery:e=>{return`
				<div class="c-search-result c-search-result__with-thumbnail" data-rank=${e.rank} data-result-type=news>
					
					<div class=c-search-result__body>
						<p class="u-text-regular u-m-0"><strong>
							<a href="${s()+e.clickTrackingUrl}">${e.metaData.h1||e.title.split(" | ")[0].trim()}</a>
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
				${d(s[0],e.title.split(" | ")[0])}
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
							<a href="${s()+e.linkUrl}" title="${e.displayUrl}">${e.titleHtml}</a>
						</strong></p>
						<p >${e.descriptionHtml}</p>
						<!-- <pre>${JSON.stringify(e,null,"\t")}</pre> -->
					</div>
				</div>`,facet:t=>`<fieldset data-facet="${t.name}">
				<legend class="show-for-sr">Filter by ${t.name}</legend>
				<div data-behaviour=accordion>
					<accordion-summary>${t.name}</accordion-summary>
					<div>
						<ul>${t.allValues.map(e=>`<li><label><input type=${g[t.guessedDisplayType]||"text"} name="${e.queryStringParamName}" value="${e.queryStringParamValue}" ${e.selected?"checked":""}>${y(e.label)} <span>${e.count||"0"}</span></label></li>`).join("")}</ul>
					</div>
				</div>
			</fieldset>`}})(),function(){var e=Array.prototype.slice.call(document.querySelectorAll("[name=meta_startval]"));if(e.length){const r=[,"January",,,,,,,,"September",,,],s=new RegExp(/\d\d\d\d/),i=new RegExp(/AY\d\d\d\d\D\d\d/i),n=new RegExp(/ay/i),l=e.map(e=>({data:e.value,date:e.value.replace(i,""),month:-1<e.value.indexOf("-")&&r[parseInt(e.value.split("-")[1])]||"",year:e.value.match(s)?e.value.match(s).shift():"",acyear:e.value.match(i)?e.value.match(i).shift().replace(n,""):""}));var t=l.map(e=>e.acyear.replace(n,"")).filter((e,t,a)=>a.indexOf(e)===t&&e),a=e[0].parentElement.parentElement.parentElement;if(t.length){e.forEach(e=>{e.parentElement.parentElement.remove()});const c=(e,t)=>{r="radio",s="meta_startval",t=`[1st ${t}]`,(a=document.createElement("input")).type=r,a.name=s,a.value=t;var a,r=a,s=document.createElement("label");return s.appendChild(r),s.appendChild(document.createTextNode(e)),s},o=document.createElement("li");t.forEach(t=>{var e=l.filter(e=>e.acyear===t),a=e.filter(e=>-1===e.date.indexOf("-01")&&-1===e.date.indexOf("-09")).map(e=>e.data).join(" ");const r=document.createElement("fieldset");var s=document.createElement("legend");s.classList.add("u-my-1","text-xsm"),r.appendChild(s),r.setAttribute("class","c-search-filters-subgroup"),s.innerText="Academic year "+t,o.appendChild(r),e.filter(e=>e.acyear===t&&(-1<e.date.indexOf("-01")||-1<e.date.indexOf("-09"))).map(e=>{r.appendChild(c(e.month+" "+e.year,e.data))}),a.length&&r.appendChild(c("Other "+t,""+a))}),a.appendChild(o)}}}(),(stir=stir||{}).searchUI=stir.searchUI||{},stir.searchUI.asideAccordion=(e,t)=>{console.log("hello");var a=e.querySelector("p.c-search-filters-header");const r=e.querySelector("div");if(a&&r){e.setAttribute("data-behaviour","accordion");const s=document.createElement("button");s.innerHTML=a.innerHTML,s.setAttribute("id","filteraccordbtn_"+t),s.setAttribute("aria-controls","filteraccordpanel_"+t),s.setAttribute("aria-expanded","false"),a.innerHTML="",a.appendChild(s),r.setAttribute("id","filteraccordpanel_"+t),r.setAttribute("aria-labelledby","filteraccordbtn_"+t),r.setAttribute("role","region"),r.classList.add("hide"),s.addEventListener("click",e=>{r.classList.toggle("hide"),r.classList.contains("hide")?s.setAttribute("aria-expanded","false"):s.setAttribute("aria-expanded","true")})}},stir.searchUI.verticalSlider=(e,t)=>{const s=()=>{var e=document.createElement("div");return e.classList.add("tns-controls"),e.setAttribute("aria-label","Carousel Navigation"),e.setAttribute("tabindex","0"),e},i=(e,t,a)=>{var r=document.createElement("button");return r.innerHTML='<span class="uos-'+a+' icon--medium "></span>',r.setAttribute("data-controls",t),r.setAttribute("aria-label",t),r.setAttribute("type","button"),r.setAttribute("tabindex","-1"),r.setAttribute("aria-controls",e),r},a=(e,t,a)=>{var r=s(),e=i(e,t,a);return r.insertAdjacentElement("beforeend",e),e.addEventListener("click",e=>{e.preventDefault(),l.goTo(t)}),r};var r,n;const l=tns({container:e,controls:!1,loop:!1,slideBy:7,items:7,axis:"vertical",autoHeight:!1,touch:!0,swipeAngle:30,speed:400});l&&(e=l.getInfo().container)&&(r=a(e.id,"prev","chevron-up"),n=a(e.id,"next","chevron-down"),e.parentElement.parentElement.insertAdjacentElement("afterend",n),e.parentElement.parentElement.insertAdjacentElement("beforebegin",r),t.parentElement.setAttribute("data-inittns",""))},stir.searchUI.sliderArias=a=>{a&&setTimeout(()=>{var e=a.querySelector('[data-controls="prev"]'),t=a.querySelector('[data-controls="next"]');return e&&e.setAttribute("aria-label","Previous"),t&&t.setAttribute("aria-label","Next"),!0},100)},stir.searchUI.slideTab=r=>{if(!r)return;const s={slideBox:r,slideNavBox:r.querySelector("[data-searchbtnstns]"),slideNavBtns:Array.prototype.slice.call(r.querySelectorAll("[data-searchbtnstns] h2 button")),slideResultTabs:Array.prototype.slice.call(r.querySelectorAll("#mySlider1 > div")),accordions:Array.prototype.slice.call(r.querySelectorAll("[data-behaviour=accordion]"))};if(!s.slideNavBox||!s.slideNavBtns||!s.slideResultTabs)return;const t=e=>{var t=tns({container:"#"+e.slideNavBox.id,items:i(stir.MediaQuery.current),loop:!1,slideBy:"page",controls:!0,controlsText:['<span class="uos-chevron-left icon--medium "></span>','<span class="uos-chevron-right icon--medium "></span>'],touch:!0,swipeAngle:30,navPosition:"top",autoHeight:!0,autoplay:!1}),a=(e.slideNavBox.setAttribute("role","tablist"),stir.searchUI.sliderArias(e.slideBox),e.slideNavBtns.forEach(e=>{e.closest("h2").style.width="90px",e.closest("div.tns-item").setAttribute("role","tab"),e.setAttribute("tabindex","-1"),e.setAttribute("type","button"),e.setAttribute("aria-controls","search_results_panel_"+e.getAttribute("data-open")),e.setAttribute("id","searchtab_"+e.getAttribute("data-open"))}),e.slideResultTabs.forEach(e=>{e.setAttribute("role","tabpanel"),e.setAttribute("tabindex","0"),e.setAttribute("id","search_results_panel_"+e.getAttribute("data-panel")),e.setAttribute("aria-labelledby","searchtab_"+e.getAttribute("data-panel"))}),QueryParams.get("tab")?QueryParams.get("tab"):"all"),a=r.querySelector("button[data-open="+a+"]");e.slideNavBox&&e.slideNavBox.classList.contains("hide-no-js")&&e.slideNavBox.classList.remove("hide-no-js"),a&&(a.click(),e.slideNavBtns.indexOf(a)>=i(stir.MediaQuery.current))&&t.goTo(e.slideNavBtns.indexOf(a))},i=e=>"small"===e?3:"medium"===e?4:s.slideNavBtns.length;var e,a,n;document.addEventListener("scroll",(e=()=>{var e=s.slideBox.getBoundingClientRect().top;e<.01&&s.slideBox.classList.add("stuck"),0<e&&s.slideBox.classList.remove("stuck")},n=!(a=200),function(){n||(e.call(),n=!0,setTimeout(function(){n=!1},a))})),s.slideNavBox.addEventListener("click",e=>{var t=e.target.closest("button[data-open]");if(t){const r=t.getAttribute("data-open")||"null";var a=stir.node('[data-panel="'+r+'"]');s.slideNavBtns.forEach(e=>{e.parentElement.classList.remove("slide-tab--active")}),t.closest("h2").classList.add("slide-tab--active"),s.slideResultTabs.forEach(e=>{e.classList.add("hide"),e.setAttribute("aria-hidden","true"),e.getAttribute("data-panel")===r&&(e.classList.remove("hide"),e.removeAttribute("aria-hidden"))}),a.classList.remove("hide"),a.removeAttribute("aria-hidden"),stir.scrollToElement&&stir.scrollToElement(s.slideBox,0),e.isTrusted&&QueryParams.set("tab",r)}}),window.addEventListener("popstate",e=>t(s)),t(s)},function(){if(void 0!==window.URLSearchParams){const t=e=>{var t;""===e.target.parentElement.dataset.containtns&&""!==e.target.parentElement.dataset.inittns&&(t=e.target.parentElement.nextElementSibling.children[0])&&stir.searchUI.verticalSlider(t,e.target)};stir.nodes('[data-containtns=""]').forEach(e=>{e.children[0].addEventListener("click",t)});var e=stir.nodes(".c-search-results-area"),e=(e.length&&e.forEach(e=>stir.searchUI.slideTab(e)),stir.nodes(".c-search-results-filters"));"small"!==stir.MediaQuery.current&&"medium"!==stir.MediaQuery.current||e.length&&e.forEach((e,t)=>stir.searchUI.asideAccordion(e,t))}}(),(stir=stir||{}).funnelback=(()=>{const e="dev"===UoS_env.name||"qa"===UoS_env.name||"preview"===UoS_env.name?"stage-shared-15-24-search.clients.uk.funnelback.com":"search.stir.ac.uk",t=`https://${e}/s/`;const r=()=>new URL("scale",t);return{getHostname:()=>e,getJsonEndpoint:()=>new URL("search.json",t),getScaleEndpoint:r,getCroppedImageElement:e=>{var t,a;return e.url?(t=r(),a=stir.Object.extend({},e,{type:"crop_center",format:"jpeg"}),t.search=new URLSearchParams(a),`<img src="${(a={src:t,alt:e.alt,width:Math.floor(e.width/2),height:Math.floor(e.height/2),original:e.url}).src}" alt="${a.alt}" height="${a.height}" width="${a.width}" loading=lazy data-original=${a.original}>`):"\x3c!-- no image --\x3e"},getTags:e=>{e=e&&e.split(";");return e&&e.map(stir.templates.search.tagGroup).join("")},imgError:e=>{e.target.getAttribute("data-original")&&e.target.getAttribute("src")!=e.target.getAttribute("data-original")?e.target.src=e.target.getAttribute("data-original"):(e.target.parentElement.parentElement?.classList?.remove("c-search-result__with-thumbnail"),e.target.parentElement.parentElement.removeChild(e.target.parentElement))}}})(),stir.courses=(()=>{const t="dev"===UoS_env.name||"qa"===UoS_env.name;return{clearing:!1,getCombos:()=>{var e;if(!stir.courses.combos)return e={dev:"combo.json",qa:"combo.json",preview:stir?.t4Globals?.search?.combos||"",prod:"https://www.stir.ac.uk/media/stirling/feeds/combo.json"},t&&console.info(`[Search] Getting combo data for ${UoS_env.name} environment (${e[UoS_env.name]})`),stir.getJSON(e[UoS_env.name],e=>stir.courses.combos=e&&!e.error?e.slice(0,-1):[])},showCombosFor:e=>{if(!e||!stir.courses.combos)return[];for(var t=isNaN(e)&&new URL(e).pathname,a=[],r=0;r<stir.courses.combos.length;r++)for(var s=0;s<stir.courses.combos[r].courses.length;s++)if(t&&t===stir.courses.combos[r].courses[s].url||stir.courses.combos[r].courses[s].url.split("/").slice(-1)==e){var i=stir.clone(stir.courses.combos[r]);i.courses.splice(s,1),i.courses=i.courses.filter(e=>e.text),a.push(i);break}return a}}})(),stir.search=()=>{if(void 0===window.URLSearchParams)return void((e=document.querySelector(".c-search-results-area"))&&e.parentElement.removeChild(e));const u="dev"===UoS_env.name||"qa"===UoS_env.name;var e="small"===stir.MediaQuery.current?5:10;const s=256;var t=stir.courses.clearing,a=(u&&console.info("[Search] initialising…"),stir.curry((e,t)=>(e.search=new URLSearchParams(t),e)));const r=stir.curry((e,t)=>stir.Object.extend({},e,t)),i=(e,t)=>{var a,r,s=new URLSearchParams(t);for([a,r]of new URLSearchParams(e.search))s.set(a,r);return e.search=s,e};t={main:["c","d","access","award","biogrgaphy","breadcrumbs","category","custom","delivery","faculty","group","h1","image","imagealt","level","modes","online","pathways","role","register","sid","start","startDate","subject","tags","type","ucas","venue","profileCountry","profileCourse1","profileImage"],courses:["c","award","code","delivery","faculty","image","level","modes","pathways","sid","start","subject","ucas"],clearing:t?["clearingEU","clearingInternational","clearingRUK","clearingScotland","clearingSIMD"]:[],scholarships:["value","status","number"]};const n={url:stir.funnelback.getJsonEndpoint(),form:document.querySelector("form.x-search-redevelopment"),input:document.querySelector('form.x-search-redevelopment input[name="query"]'),parameters:{any:{collection:"stir-main",SF:`[${t.main.concat(t.clearing,t.scholarships).join(",")}]`,num_ranks:e,query:"",spelling:!0,explain:!0,sortall:!0,sort:"score_ignoring_tiers","cool.21":.9},news:{collection:"stir-www",meta_type:"News",meta_v_not:"faculty-news",sort:"date",fmo:"true",SF:"[c,d,h1,image,imagealt,tags]",num_ranks:e,SBL:450},event:{collection:"stir-events",fmo:!0,SF:"[c,d,image,imagealt,startDate,venue,online,tags,type,register]",query:"!padrenullquery",num_ranks:e},gallery:{collection:"stir-www",meta_type:"Gallery",sort:"date",fmo:"true",SF:"[c,d,image]",num_ranks:e},course:{collection:"stir-courses",SF:`[${t.courses.concat(t.clearing).join(",")}]`,fmo:"true",num_ranks:e,explain:!0,query:"!padrenullquery",timestamp:+new Date},coursemini:{collection:"stir-courses",SF:"[c,award,code,delivery,faculty,image,level,modes,sid,start,subject,teaser,ucas]",num_ranks:3,curator:"off",query:"!padrenullquery"},person:{collection:"stir-research",meta_type:"profile",fmo:"true",SF:"[c,d,biogrgaphy,category,faculty,groups,image,imagealt,programme,role,themes]",SM:"meta",MBL:350,num_ranks:e},research:{collection:"stir-research",SM:"meta",SF:"[c,d,category,groups,output,programme,themes,type]",MBL:450,num_ranks:e}},noquery:{course:{sort:"title"}}};if(!n.form||!n.form.query)return;u&&console.info("[Search] initialised with host:",n.url.hostname);const l=e=>n.form.query.value||QueryParams.get("query")||n.parameters[e].query||"University of Stirling",c=()=>n.form.query.value?QueryParams.set("query",n.form.query.value):QueryParams.remove("query"),m=e=>e.getAttribute("data-type")||e.parentElement.getAttribute("data-type"),d=e=>QueryParams.set(e,parseInt(QueryParams.get(e)||1)+1),o=e=>{return(parseInt(QueryParams.get(e)||1)-1)*(n.parameters[e].num_ranks||20)+1},p=()=>Object.keys(n.parameters).forEach(e=>QueryParams.remove(e)),h=e=>{var t,e=document.querySelector(".c-search-results-area form[data-filters="+e+"]"),a=e?new FormData(e):new FormData;for(t of a.keys())0!==t.indexOf("f.")&&1<a.getAll(t).length&&a.set(t,"["+a.getAll(t).join(" ")+"]");return a},g=stir.curry((e,t)=>e.insertAdjacentHTML("beforeend",t)),v=stir.curry((e,t)=>e.innerHTML=t),y=stir.curry((e,t)=>(e&&(0<t.response.resultPacket.resultsSummary.totalMatching&&e.removeAttribute("disabled"),t.response.resultPacket.resultsSummary.currEnd===t.response.resultPacket.resultsSummary.totalMatching)&&e.setAttribute("disabled",!0),t)),f=e=>new stir.accord(e,!1),b=e=>e.addEventListener("error",stir.funnelback.imgError),$=stir.curry((e,t)=>{var a;e.closest&&(a=(e=e.closest("[data-panel]")).querySelectorAll('[data-behaviour="accordion"]:not(.stir-accordion)'),e=e.querySelectorAll("img"),Array.prototype.forEach.call(a,f),Array.prototype.forEach.call(e,b))}),x=stir.curry((e,t)=>{var a=t.response.resultPacket.resultsSummary.currStart,r=t.response.resultPacket.resultsSummary.numRanks,s=e.parentElement.parentElement.querySelector(".c-search-results-summary");return e.setAttribute("data-page",Math.floor(a/r+1)),s&&(s.innerHTML=stir.templates.search.summary(t)),t}),D=stir.curry((e,t)=>{if(u){const i=document.querySelector(`form[data-filters="${e}"]`);i&&t.response.facets.forEach(e=>{var t="stir-accordion--active",a=i.querySelector(`[data-facet="${e.name}"]`),r=a&&a.querySelector("[data-behaviour=accordion]"),r=r&&-1<r.getAttribute("class").indexOf(t),e=stir.DOM.frag(stir.String.domify(stir.templates.search.facet(e))),s=e.querySelector("[data-behaviour=accordion]");r&&s&&s.setAttribute("class",t),a?(a.insertAdjacentElement("afterend",e.firstChild),a.parentElement.removeChild(a)):i.insertAdjacentElement("afterbegin",e.firstChild)})}return t}),w=stir.curry((e,t)=>U.cura(t.response.curator.exhibits)+U[e](t.response.resultPacket.results)+stir.templates.search.pagination({currEnd:t.response.resultPacket.resultsSummary.currEnd,totalMatching:t.response.resultPacket.resultsSummary.totalMatching,progress:t.response.resultPacket.resultsSummary.currEnd/t.response.resultPacket.resultsSummary.totalMatching*100})+(L[e]?L[e]():"")),_=e=>{var t;return!(!e||!e.hasAttribute("data-fallback")||(t=(t=document.getElementById(e.getAttribute("data-fallback")))&&(t.innerHTML||""),e.innerHTML=t,0))},S=a(n.url);t=stir.curry((e,t)=>{var a=r(n.parameters[e])(stir.Object.extend({},{start_rank:o(e),query:l(e),curator:!(1<o(e))},(a=e,n.form.query.value?{}:n.noquery[a]))),a=i(S(a),h(e));u?stir.getJSONAuthenticated(a,t):stir.getJSON(a,t)}),e=stir.curry((e,t)=>{var a=l(e).trim(),a=r(n.parameters[e])({start_rank:o(e),query:`[t:${a} c:${a} subject:${a}]`}),a=i(S(a),h(e));u?stir.getJSONAuthenticated(a,t):stir.getJSON(a,t)});const k=e=>{if(e.innerHTML="",e.hasAttribute("data-infinite")){const c=document.createElement("div");var t=document.createElement("div");(a=document.createElement("button")).innerText="Load more results",a.setAttribute("class","button hollow tiny");const o=a;o.setAttribute("disabled",!0),o.addEventListener("click",e=>{{var t=c,a=o,r=m(t);if(E[r]){var s=x(t),i=g(t),n=w(r),t=$(t);const l=stir.compose(t,i,n,y(a),s);d(r),E[r](e=>{return e&&!e.error?(e=e,l(e),void new stir.Favs):new Function})}}}),e.appendChild(c),e.appendChild(t),t.appendChild(o),t.setAttribute("class","c-search-results__loadmore flex-container align-center u-mb-2"),j(c,o)}else j(e);var a},A=Array.prototype.slice.call(document.querySelectorAll(".c-search-results[data-type],[data-type=coursemini]")),E={any:t("any"),news:t("news"),event:t("event"),gallery:t("gallery"),course:t("course"),coursemini:e("coursemini"),person:t("person"),research:t("research")},U={any:e=>e.map(stir.templates.search.auto).join(""),news:e=>e.map(stir.templates.search.news).join(""),event:e=>e.map(stir.templates.search.event).join(""),gallery:e=>e.map(stir.templates.search.gallery).join(""),course:e=>e.map(stir.templates.search.course).join(""),coursemini:e=>e.map(stir.templates.search.coursemini).join(""),person:e=>e.map(stir.templates.search.person).join(""),research:e=>e.map(stir.templates.search.research).join(""),cura:e=>e.map(stir.templates.search.cura).join("")},L={coursemini:()=>`<p class="text-center"><a href="?tab=courses&query=${l("any")}">View all course results</a></p>`},q={course:e=>{var t=stir.courses.getCombos();t?t.addEventListener("loadend",e):e.call()}},j=(t,e)=>{const a=m(t);if(E[a]){var r=D(a),s=x(t),e=y(e),i=v(t),n=w(a),l=$(t);const c=stir.compose(l,i,n,e,s,r),o=e=>{if(!t||!t.parentElement)return u&&console.error("[Search] late callback, element no longer on DOM");if(e&&!e.error&&e.response&&e.response.resultPacket&&(0!==e.response.resultPacket.resultsSummary.totalMatching||!_(t)))return e=c(e),new stir.Favs,e};if(p(),q[a])return q[a](e=>E[a](o));E[a](o)}},T=()=>A.forEach(k),C=(Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-area form[data-filters]"),t=>{var e=t.getAttribute("data-filters");const a=document.querySelector(`.c-search-results[data-type="${e}"]`);t.addEventListener("reset",e=>{Array.prototype.forEach.call(t.querySelectorAll("input"),e=>e.checked=!1),k(a)}),t.addEventListener("change",e=>{m(a),k(a)}),t.addEventListener("submit",e=>{k(a),e.preventDefault()})}),Array.prototype.forEach.call(document.querySelectorAll(".c-search-results-summary"),e=>{e.addEventListener("click",e=>{var t;e.target.hasAttribute("data-suggest")?(e.preventDefault(),n.input.value=e.target.innerText,c(),T()):e.target.hasAttribute("data-value")&&(t=`input[name="${e.target.getAttribute("data-name")}"][value="${e.target.getAttribute("data-value")}"]`,(t=document.querySelector(t))?(t.checked=!t.checked,e.target.parentElement.removeChild(e.target),T()):(t=`select[name="${e.target.getAttribute("data-name")}"]`,(t=document.querySelector(t))&&(t.selectedIndex=0,e.target.parentElement.removeChild(e.target),T())))})}),e=>{c(),T(),e.preventDefault()});a=e=>{void 0!==QueryParams.get("query")&&(n.form.query.value=QueryParams.get("query").substring(0,s));var t=QueryParams.getAll();for(const r in t){var a=document.querySelector(`input[name="${encodeURIComponent(r)}"][value="${encodeURIComponent(t[r])}"]`);a&&(a.checked=!0)}n.form.addEventListener("submit",C),T()};a(),window.addEventListener("popstate",a)},stir.search();