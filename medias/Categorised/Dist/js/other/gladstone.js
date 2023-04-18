!function(){const a=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],n=t=>{var e;return t.StartDate?(e=new Date(t.StartDate),`
			<tr>
				<th data-day=${t.Day}>${stir.Date.swimTimetable(e)}</th>
				<td><strong>Time</strong>: ${t.StartTime}–${t.EndTime}</td>
				<td><strong>Activity</strong>: ${t.Description?t.Description.replace(" Pool",""):""}</td>
				<td><strong>No. of Lanes</strong>: ${t.NoOfProducts}</td>
				<td><strong>Depth</strong>: ${t.WebComments?t.WebComments.replace(/Depth /g,"").replace("\n","<br>"):""}</td>
				<!-- <td><a href="${t.DeepLink}" class="button tiny energy-pink">Book&nbsp;now</a></td> -->
			</tr>
		`):""},e=(t,e)=>{var r;void 0!==e&&void 0!==e.map&&((r=document.createElement("table")).setAttribute("class","c-activity-timetable alt"),r.innerHTML=`<caption>${t}</caption>`+e.map(n).join("\n"),o.appendChild((t=>{for(var e in a){var r=Array.prototype.slice.call(t.querySelectorAll(`th[data-day="${a[e]}"]`));if(r.length){r[0].setAttribute("rowspan",r.length),r.shift();for(let t=0;t<r.length;t++)r[t].parentElement.removeChild(r[t])}}return t})(r)))},o=document.querySelector("#gs-target"),r=new stir.Spinner(o),i=(r.element.classList.remove("show-for-medium"),r.show(),window.swimtt=function(t){o&&(r.hide(),t.map,e("Pool timetable",t))},window.recswimtt=swimtt,t=>{r.hide()}),d=t=>{r.hide(),o.appendChild(document.createTextNode("Error: Data could not be loaded. Please try again later."))};try{var s=o.getAttribute("data-activity");let t=o.getAttribute("data-jsonp");(t=s&&"RECSWIM"===s?o.getAttribute("data-recswim"):t)?stir.getJSONp(t,i,d):d()}catch(t){console.error(t),r.hide()}}();