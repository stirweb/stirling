!function(){const r=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],n=t=>{var e;return t.startDate?(e=new Date(t.startDate),`
			<tr>
				<th data-day=${t.day}>${stir.Date.swimTimetable(e)}</th>
				<td><strong>Time</strong>: ${t.startTime}–${t.endTime}</td>
				<td><strong>Activity</strong>: ${t.description?t.description.replace(" Pool",""):""}</td>
				<td><strong>No. of Lanes</strong>: ${t.noOfProducts}</td>
				<td><strong>Depth</strong>: ${t.webComments?t.webComments.replace(/Depth /g,"").replace("\n","<br>"):""}</td>
				<!-- <td><a href="${t.deepLink}" class="button tiny energy-pink">Book&nbsp;now</a></td> -->
			</tr>
		`):""},e=(t,e)=>{var a;void 0!==e&&void 0!==e.map&&((a=document.createElement("table")).setAttribute("class","c-activity-timetable alt"),a.innerHTML=`<caption>${t}</caption>`+e.map(n).join("\n"),i.appendChild((t=>{for(var e in r){var a=Array.prototype.slice.call(t.querySelectorAll(`th[data-day="${r[e]}"]`));if(a.length){a[0].setAttribute("rowspan",a.length),a.shift();for(let t=0;t<a.length;t++)a[t].parentElement.removeChild(a[t])}}return t})(a)))},i=document.querySelector("#gs-target"),a=new stir.Spinner(i),o=(a.element.classList.remove("show-for-medium"),a.show(),window.swimtt=function(t){i&&(a.hide(),t.map,e("Pool timetable",t))},window.recswimtt=swimtt,t=>{a.hide()}),d=t=>{a.hide(),i.appendChild(document.createTextNode("Error: Data could not be loaded. Please try again later."))};try{var s=i.getAttribute("data-activity");let t=i.getAttribute("data-jsonp");(t=s&&"RECSWIM"===s?i.getAttribute("data-recswim"):t)?(t+="?v="+(new Date).getTime(),stir.getJSONp(t,o,d)):d()}catch(t){console.error(t),a.hide()}}();