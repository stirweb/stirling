(()=>{var e=new URL(window.location);const a=document.querySelector("main#content > .grid-container"),r=new stir.Spinner(a),t=window.location.hostname,s="/data/pd-akari/";var i=e.searchParams.has("route")?e.searchParams.get("route"):"UCX12-BUSLAW";const o=e.searchParams.has("session")?e.searchParams.get("session"):"2024/5",n=e.searchParams.has("semester")?e.searchParams.get("semester"):"SPR",l=`programme=${i}/${o}/`+n,c=["January","February","March","April","May","June","July","August","September","October","November","December"];e=(()=>{switch(UoS_env.name){case"dev":return`https://www.stir.ac.uk${s}?`+l;case"qa":return"/stirling/pages/data/akari/course.json";case"preview":case"appdev-preview":return`https://${t}/terminalfour/preview/1/en/35030?`+l;case"prod":return`https://${t}${s}?`+l}})();console.info("[Main] apiUrl",e);const d=["programmeOverview"],u=["careerAvenues","assessmentApproach","learnTeachApproach","programmeTitle","versionNumber","dateOfApproval","dateOfIntroduction","award","programmeCode","owningFaculty","owningDivision","ucasCode","creditPoints","ectsCredits","programmeLevel"].concat(d,["learningOutcomes","programmeAvailabilities","programmeStructure","qaaBenchmarks"]);const m=e=>-1===u.indexOf(e),p={assessmentApproach:"Approach to assessment",awardBodies:"Awarding bodies",careerAvenues:"My future",learnTeachApproach:"Approach to learning and teaching",partnerInstitutions:"Partner institutions",programmeOverview:"Overview",qaaBenchmarks:"QAA benchmarks"},g={FT:"Full time",PTO:"Part time",SW:"Sandwich"},h=e=>`
		<tr>
			<td><a target=_blank href="https://www.stir.ac.uk/courses/module/?code=${e.code||e.moduleCode}&session=${o}&semester=${n}" data-notused="occurrence=A">${e.title}</a> <span class="c-course-modules__module-code">(${e.code||e.moduleCode})</span></td>
			<td>${e.credits?e.credits+" credits":""}</td><td>${e.deliveryType||""}</td></tr>
		`,v=e=>0<e.collectionElements.length?`
		<p class=u-m-0><strong>Collections</strong></p>
		<p>Students will choose one (or as indicated) module/credits from a collection.</p>
		<details>
			<summary style="cursor:pointer">${e.title}</summary>
			<table class=c-course-modules__table>
				${e.collectionElements.map(h).join("")}
			</table>
		</details>
	`:"\x3c!-- no collections for this semester --\x3e",b=e=>`<details class="u-border-bottom-solid u-pb-1 u-mb-1">
					<summary style="cursor:pointer" class="text-md u-font-bold">${e.pathwayDescription}</summary>
					<div class="u-mx-1 u-mb-1 u-py-1">
						${f(e.items)}
					</div>
				</details>`,f=e=>e?(e.modules.length?`<p class=u-m-0><strong>Modules</strong></p><table class=c-course-modules__table>${e.modules.map(h).join("")}</table>`:"")+(e.collections.length?e.collections.map(v).join(""):""):"",y=e=>`
		<details class="u-border-bottom-solid u-pb-1 u-mb-1">
			<summary style="cursor:pointer" class="text-md u-font-bold">${e.semesterDescription}</summary>
			<div class="u-mx-1 u-mb-1 u-py-1">
				${e.pathways.map(b).join("")}
				${f(e.items)}
				<!-- Options: ${e.options.length} -->
			</div>
		</details>`,w=e=>""+e[0]+e.slice(1).toLowerCase(),$=(e,t,a)=>a.indexOf(e)===t,A=(e,t)=>{var a="STIRLING"!==e.location?w(e.location):"",r=e.deliveryMode.replace(", UK",""),s=(g[e.loadCategory]||e.loadCategory).toLowerCase(),i=`${c[parseInt(e.prospectiveStartDate.split("-")[1])]||""} `+e.year,e="Y"===e.isActive?"":" (Inactive)";return""+[a,a?r:w(r),s,t?i:"",e].filter(e=>e.length).join(", ")},k=e=>A(e,!1),j=e=>A(e,!0),C=e=>`<li>${e}</li>`,P=e=>`<p>${e.entryPointDescription}</p> `+e.years.map(e=>""+e.semesters.map(y).join("")).join(""),T=(e,t)=>{return("string"==typeof(a=t)||"number"==typeof a)&&0<a.length?`<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">${p[e]||e}</h3><p>${t}</p></div>`:"";var a};if(!a)return console.warn("[Course API] no DOM");r.show(),fetch(e).then(e=>{if(e.ok)return e.json();console.error("Response status: "+e.status)}).then(t=>{!t||t.error?(r.hide(),a.insertAdjacentHTML("beforeend","<p><strong>Error</strong>: No data!</p>")):(a.insertAdjacentHTML("beforeend",`<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class="cell medium-10 medium-offset-1 u-padding-y">
							<h1 class="c-course-heading c-course-title__heading u-heritage-green">${t.programmeTitle}</h1>
							<div class="u-bg-heritage-green--10 u-p-1 u-mb-2" style="column-count:2">
								${t.owningFaculty?`<p><strong>Faculty</strong> ${t.owningFaculty}</p>`:""}
								${t.owningDivision?`<p><strong>Division</strong> ${t.owningDivision}</p>`:""}
								${t.award?`<p><strong>Award</strong> ${t.award}</p>`:""}
								${t.programmeCode?`<p><strong>Programme route code</strong> ${t.programmeCode}</p>`:""}
								${t.programmeLevel?`<p><strong>SCQF level</strong> ${t.programmeLevel&&t.programmeLevel.replace("Level ","")}</p>`:""}
								${t.creditPoints?`<p><strong>Credits</strong> ${t.creditPoints}</p>`:""}
								${t.ectsCredits?`<p><strong>ECTS</strong> ${t.ectsCredits}</p>`:""}
								${t.ucasCode?`<p><strong>UCAS</strong> ${t.ucasCode}</p>`:""}
							</div>

							${0<t.programmeAvailabilities.length?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Programme availabilities</h3><ul>':""}
							${t.programmeAvailabilities.map(k).filter($).map(C).join("")}
							${0<t.programmeAvailabilities.length?'</ul><details style="margin-left:1.5rem;"><summary>Full list of availabilities</summary><ul>':""}
							${t.programmeAvailabilities.map(j).filter($).map(C).join("")}
							${0<t.programmeAvailabilities.length?"</ul></details></div>":""}

							${d.map(e=>T(e,t[e])).join("")}
							${T("careerAvenues",t.careerAvenues)}
							${0<t.careerAvenues.length?"<p><em>Please note this section highlights potential areas of work</em>.</p>":""}

							<!-- AUTO -->
							${Object.keys(t).filter(m).map(e=>T(e,t.el)).join("")}
							<!-- AUTO -->
							
							${0<t.qaaBenchmarks.length?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">QAA benchmarks</h3><ul>':""}
							${t.qaaBenchmarks.map(C).join("")}
							${0<t.qaaBenchmarks.length?"</ul></div>":""}

							${0<t.learningOutcomes.length?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Learning outcomes and graduate attributes</h3><ul>':""}
							${t.learningOutcomes.map(t=>`	<li class="u-initcap u-mb-1">${t.description} <br><span class="text-xsm">Graduate attributes: ${Object.keys(t.graduateAttributes).map(e=>`<a class=x-tag-link href="https://www.stir.ac.uk/student-life/careers/careers-advice-for-students/graduate-attributes/#:~:text=${t.graduateAttributes[e]}">${t.graduateAttributes[e]}</a>`).join(", ")}</li>`).join("")}
							${0<t.learningOutcomes.length?"</ul></div>":""}

							<div class=u-mb-2>
								<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Programme structure</h3>
								<p>The programme structures contained within the programme specifications are full-time structures. Where a student is taking the programme on a part-time basis the modules may be taken in an alternative sequence.</p>
								<p>The list below shows compulsory and option modules for this programme. Option modules are revised over time and, in some cases, will be dependent upon pre-requisite and/or co-requisites being taken. More information about these requirements can be found in the relevant Module Descriptors. The options available each year can be subject to change due to student demand and availability of teaching staff</p>
								<div class="u-p-2 u-mb-2" style="background: #f6f5f4">
									${0<t.programmeStructure.length?t.programmeStructure.map(P).join(""):"<p>No data available.</p>"}
								</div>
							</div>
							
							${["learnTeachApproach","assessmentApproach"].map(e=>T(e,t[e])).join("")}

							<div>
								<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Assessment and feedback</h3>
								<h4>Academic Integrity</h4>
								<p>The University of Stirling is committed to protecting the quality and standards of its awards. Consequently, the University seeks to promote and nurture academic integrity, support staff academic integrity, and support students to understand and develop good academic skills that facilitate academic integrity. In addition, the University deals decisively with all forms of academic misconduct.</p>
								<p>More information can be found in the <a href="<t4 type="media" id="191162" formatter="path/*" />">University Academic Integrity Policy</a></p>
								<H4>Feedback on assessment</h4>
								<p>The University takes feedback very seriously and, along with the Students’ Union, have developed a <a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/academic-registry/feedback-on-student-work/">feedback policy</a> and student guidance on feedback.</p>

								<h4>Assessment Regulations and Policy</h4>
								<p>The University of Stirling regulations and policy relevant to assessment can be accessed via:</p>
								<ul>
									<li><a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/academic-registry/regulations/undergraduate/">Undergraduate</a></li>
									<li><a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/academic-registry/regulations/postgraduate-taught-regulations/">Postgraduate – Taught</a></li>
									<li><a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/academic-registry/regulations/postgraduate-research-regulations/">Postgraduate - Research</a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>`),r.hide())})})();