!function(){var e="prod"!==UoS_env.name;const t=document.querySelector("main#content"),a=window.location.hostname,r="dev"===UoS_env.name?"course.html":'<t4 type="navigation" name="Helper: Path to programme specification" id="5300" />';var s=(()=>{switch(UoS_env.name){case"dev":return"/pages/data/akari/menu.json";case"qa":return"/stirling/pages/data/akari/menu.json";case"preview":case"appdev-preview":return`https://${a}/terminalfour/preview/1/en/35030?menu`;case"pub":case"prod":return`https://${a}/data/pd-api-dev/?menu`}})();e&&console.info("[Menu API] apiUrl:",s);const n={menu:s=>{if(s&&s.academicYears)return`
				<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class=cell>
							<p>${Object.keys(s.academicYears).map(a=>{var e=Object.keys(s.academicYears[a].faculties);return`<details class=u-accordion>
									<summary>${a}</summary>
									<div class=u-px-1>
										${e.map(t=>{var e=Object.keys(s.academicYears[a].faculties[t].divisions);return`<details>
											<summary>${t}</summary>
											<div class=u-px-1>
												${e.map(e=>`
												<details>
													<summary>${e}</summary>
													<div class=u-px-1>
														<table>
															<thead>
																<tr>
																	<th>Route code</th><th>Course name</th><th>Partner institution</th>
																</tr>
															</thead>
															<caption>${t} (${e}) routes for ${a}:</caption>
															<tbody>
															${s.academicYears[a].faculties[t].divisions[e].routes.map(e=>`
															<tr>
																<td><small>${e.routeCode}</small></td>
																<td><a href="${r}?session=${a}&route=${e.routeCode}&semester=AUT" target=_blank>${e.routeName}</a></td>
																<td>
																<!-- <a href="${r}?session=${a}&route=${e.routeCode}&semester=AUT" target=_blank>Autumn</a> | 
																<a href="${r}?session=${a}&route=${e.routeCode}&semester=SPR" target=_blank>Spring</a> | 
																<a href="${r}?session=${a}&route=${e.routeCode}&semester=SUM" target=_blank>Summer</a> -->
																${e.partnerInstitution.join(", ")}
																</td>
															</tr>
														`).join("")}
															</tbody>
														</table>
													</div>
												</details>
												`).join("")}
											</div>
										</details>`}).join("")}
									</div>
								</details>`}).join("")}</p>
						</div>
					</div>
				</div>`}};e&&((e=document.getElementById("debug"))&&e.classList&&e.classList.add("cell","u-bg-heritage-green--10","u-heritage-green-line-left","u-p-1","u-mb-2"),e)&&(e.innerText="💡Using data from: "+s),fetch(s).then(e=>e.json()).then(e=>t.insertAdjacentHTML("beforeend",n.menu(e)))}();