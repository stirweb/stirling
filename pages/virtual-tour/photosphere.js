import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import groups from "./groups.json" with {type: "json"};
import locations from "./locations.json" with {type: "json"};

console.info("locations",locations);
console.info("groups",groups);
const c=document.getElementById('chooser');

locations.filter(location => groups[1].locations.indexOf(location.id)>=0).forEach(location => {
	const option = document.createElement("option");
	option.textContent = location.panorama;
	option.value = location.id;
	c.append(option);
});


stir.plugins.photosphere.auto = (data) => {
	if (stir.plugins.photosphere.initialised) return;
		
		const id = data && data.getAttribute && data.getAttribute("data-photosphere-id");
		console.info("[Photosphere] auto init",data,id);
		const location = id ? locations.filter(l=>l.id===id)[0]:locations[0];
		const viewer = new Viewer({
			container: document.querySelector('#viewer1'),
			panorama: `./img/${location.panorama}`,
			defaultYaw: (location.options.defaultYaw||Math.PI/2),
			defaultZoomLvl: (location.options.defaultZoomLvl||50),
			mousewheel:false,
			loadingTxt: "STIR it up!",
			caption:location.options.caption,
			navbar: ['zoomOut','zoomIn','move','caption','fullscreen'],
			plugins: [
				MarkersPlugin.withConfig({
					markers: location.markers,
				})
			]
		});
		
		window.publicViewer = viewer;
		
		const markers = viewer.getPlugin(MarkersPlugin);
		
		console.info(("Markers",markers))
		
		markers.addEventListener('select-marker', ({ marker }) => {
			if (marker.id === 'video') {
				if (marker.video.paused) {
					marker.video.play();
				} else {
					marker.video.pause();
				}
			}
			if (marker.data && marker.data.nav) {
				const location = locations.filter(l=>l.id===marker.data.nav);
				if(location.length) warpTo(location[0]);
			}
		});
		
		c.addEventListener("change", e=> {
			const id = e.target.options[e.target.selectedIndex].value;
			const location = locations.filter(l=>l.id===id)[0];
			console.info("Location change:",location.panorama,location.options);
			warpTo(location);
		});
		
		const warpTo = (location) => {
			console.info("Location data", location);
			markers.clearMarkers();
			viewer.setPanorama(`./img/${location.panorama}`, location.options);
			markers.setMarkers(location.markers);
			viewer.rotate({"pitch":0,"yaw":location.options.defaultYaw||0});
			viewer.zoom(location.options.defaultZoomLvl||50);
			console.info("Position:",viewer.getPosition());
		}
	stir.plugins.photosphere.initialised = true;
};
(()=>{
	if(stir.callback) {
		stir.callback.enact("stir.plugins.photosphere.auto",{id:"G008"});
	}
})();