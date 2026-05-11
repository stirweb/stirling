(()=>{console.info(window.location.search);var e=new URL(window.location);const t=document.querySelector("main#content > .grid-container"),a=new stir.Spinner(t),r=window.location.hostname,s="/data/pd-api-dev/";var i=e.searchParams.has("route")?e.searchParams.get("route"):"UCX12-BUSLAW";const n=e.searchParams.has("session")?e.searchParams.get("session"):"2024/5",o=e.searchParams.has("semester")?e.searchParams.get("semester"):"SPR",l=`programme=${i}/${n}/`+o;e=(()=>{switch(UoS_env.name){case"dev":return`https://www.stir.ac.uk${s}?`+l;case"qa":return"/stirling/pages/data/akari/course.json";case"preview":case"appdev-preview":return`https://${r}/terminalfour/preview/1/en/35030?`+l;case"pub":return`https://${r}${s}?`+l}})();console.info("[Main] apiUrl",e);const u=["programmeOverview","careerAvenues"],c=["programmeTitle","versionNumber","dateOfApproval","dateOfIntroduction","award","programmeCode","owningFaculty","owningDivision","ucasCode","creditPoints","ectsCredits","programmeLevel"].concat(u,["learningOutcomes","programmeAvailabilities","programmeStructure","qaaBenchmarks"]);const d=e=>-1===c.indexOf(e),p={assessmentApproach:"Approach to assessment",awardBodies:"Awarding bodies",careerAvenues:"Career avenues",learnTeachApproach:"Approach to learning and teaching",partnerInstitutions:"Partner institutions",programmeOverview:"Overview",qaaBenchmarks:"QAA benchmarks"},m={FT:"Full time",PTO:"Part time",SW:"Sandwich"},g=e=>`
		<tr>
			<td><a target=_blank href="https://www.stir.ac.uk/courses/module/?code=${e.code||e.moduleCode}&session=${n}&semester=${o}" data-notused="occurrence=A">${e.title}</a> <span class="c-course-modules__module-code">(${e.code||e.moduleCode})</span></td>
			<td>${e.credits||"XX"} credits</td></tr>
		`,h=e=>0<e.collectionElements.length?`
		<p>Collections</p>
		<details>
			<summary style="cursor:pointer">${e.title}</summary>
			<table class=c-course-modules__table>
				${e.collectionElements.map(g).join("")}
			</table>
		</details>
	`:"\x3c!-- no collections for this semester --\x3e",b=e=>`
		<details class="u-border-bottom-solid u-pb-1 u-mb-1">
			<summary style="cursor:pointer" class="text-md u-font-bold">${e.semesterDescription}</summary>
			<div class="u-mx-1 u-mb-1">
				<p>Modules</p>
				<table class=c-course-modules__table>
					${e.items.modules.map(g).join("")}
				</table>
				${e.items.collections.map(h).join("")}
			</div>
		</details>`,v=e=>`<li>${e.year} ${e.location}, ${e.deliveryMode} ${m[e.loadCategory]||e.loadCategory} [${e.prospectiveStartDate}]${"Y"===e.isActive?"":" (Inactive)"}</li>`,$=e=>`<li>${e}</li>`,w=e=>`<p>${e.entryPointDescription}</p> `+e.years.map(e=>""+e.semesters.map(b).join("")).join("");if(!t)return console.warn("[Course API] no DOM");a.show(),console.info("[Module]",e),fetch(e).then(e=>{if(e.ok)return e.json();console.error("Response status: "+e.status)}).then(r=>{!r||r.error?(a.hide(),t.insertAdjacentHTML("beforeend","<p><strong>Error</strong>: No data!</p>")):(console.info(r),t.insertAdjacentHTML("beforeend",`<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class="cell u-padding-y">
							<h1 class="c-course-heading c-course-title__heading u-heritage-green">${r.programmeTitle}</h1>
							<div class="u-bg-heritage-green--10 u-p-1 u-mb-2" style="column-count:2">
								<p><strong>Faculty</strong> ${r.owningFaculty}</p>
								<p><strong>Division</strong> ${r.owningDivision}</p>
								<p><strong>Award</strong> ${r.award}</p>
								<p><strong>Programme route code</strong> ${r.programmeCode}</p>
								<p><strong>Level</strong> ${r.programmeLevel&&r.programmeLevel.replace("Level ","")}</p>
								<p><strong>Credits</strong> ${r.creditPoints}</p>
								<p><strong>ECTS</strong> ${r.ectsCredits}</p>
								<p><strong>UCAS</strong> ${r.ucasCode}</p>
							</div>

							${u.filter(e=>("string"==typeof r[e]||"number"==typeof r[e])&&0<r[e].length).map(e=>`<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">${p[e]||e}</h3><p>${r[e]} [${typeof r[e]}] [${r[e].length}]</p><br>`).join("")}

							<!-- AUTO -->
							${Object.keys(r).filter(d).filter(e=>("string"==typeof r[e]||"number"==typeof r[e])&&0<r[e].length||(console.info(e,typeof r[e],r[e]),!1)).map(e=>`<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">${p[e]||e}</h3><p>${r[e]}</p></div>`).join("")}
							<!-- AUTO -->
							
							${0<r.qaaBenchmarks.length?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">QAA benchmarks</h3><ul>':""}
							${r.qaaBenchmarks.map($).join("")}
							${0<r.qaaBenchmarks.length?"</ul></div>":""}

							${0<r.learningOutcomes.length?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Learning outcomes and graduate attributes</h3><ul>':""}
							${r.learningOutcomes.map(r=>`	<li class="u-initcap u-mb-1">${r.description} <br><span class="text-xsm">Graduate attributes: ${Object.keys(r.graduateAttributes).map(e=>`<a class=x-tag-link href="https://www.stir.ac.uk/student-life/careers/careers-advice-for-students/graduate-attributes/#:~:text=${r.graduateAttributes[e]}">${r.graduateAttributes[e]}</a>`).join(", ")}</li>`).join("")}
							${0<r.learningOutcomes.length?"</ul></div>":""}

							${0<r.programmeAvailabilities.length?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Programme availabilities</h3><ul>':""}
							${r.programmeAvailabilities.map(v).join("")}
							${0<r.programmeAvailabilities.length?"</ul></div>":""}

							<div class=u-mb-2>
								<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Programme structure</h3>
								<p>The programme structures contained within the programme specifications are full-time structures. Where a student is taking the programme on a part-time basis the modules may be taken in an alternative sequence.</p>
								<div class="u-p-2 u-mb-2" style="background: #f6f5f4">
									${0<r.programmeStructure.length?r.programmeStructure.map(w).join(""):"<p>No data available.</p>"}
								</div>
							</div>

						</div>
					</div>
				</div>`),a.hide())})})();