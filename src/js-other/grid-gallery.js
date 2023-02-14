(function() {
        
    var items = [];
    var galleryEl, galleryTemplate, galleryID, photo, x, url, frag;

    if(!(galleryEl=document.querySelector('[data-gallery]')) || !(galleryTemplate=document.getElementById('template-pswp'))) return;

	const getElement = tagName => tagName && document.querySelector(tagName);
	const getText = node => node && node.innerText;
	const firstText = text => text && text.split("|").shift().trim();

	const genericTitle = firstText(getText(getElement('title'))) || firstText(getText(getElement('h1')));
    
	// Get the photoswipe HTML template and insert it into the DOM:
	//frag = document.createDocumentFragment();
	frag = document.createElement('div');
	frag.insertAdjacentHTML("afterbegin", galleryTemplate.innerHTML);
	document.body.appendChild(frag.firstChild);

    if( !(galleryID = "gallery" + galleryEl.getAttribute('data-gallery')) || !window[galleryID] ) return;

    galleryEl.style.setProperty("--num-rows", Math.ceil(window[galleryID].length/3));        
    for (x=0; x<window[galleryID].length; x++){

        photo = window[galleryID][x];
        var item = document.createElement('li');
        //var link = document.createElement('a');
        var dimensions = getFlickrDimensions(photo.o_width, photo.o_height, 1024);
        var image = new Image(dimensions.w, dimensions.h);
        
        if(dimensions.height > dimensions.width) item.classList.add('portrait');            
        
        url = 'https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret;
        image.setAttribute('data-bgimage', url+'_c.jpg');
        image.setAttribute('width', dimensions.width);
        image.setAttribute('height', dimensions.height);
        image.setAttribute('alt', photo.title||genericTitle||`Image ${x} of ${window[galleryID].length}`);
        image.setAttribute('data-gallery-index', x);

        //link.appendChild(image);
        item.appendChild(image);
        items.push({src: url + "_c.jpg", w: dimensions.width, h: dimensions.height, title: photo.title});

        (function() {
            var observer = stir.createIntersectionObserver({
            element: item,
            threshold: [0.9],
            callback: function(entry) {
                if(entry.intersectionRatio == -1 || entry.intersectionRatio > 0) {
                    var image = this.querySelector('[data-bgimage]');
                    image.src = image.getAttribute('data-bgimage');
                    image.removeAttribute('data-bgimage');
                    observer && observer.observer.unobserve(this);
                }
            }
        });
        })();

        galleryEl.insertAdjacentElement("beforeend", item);
    
    }

    function getFlickrDimensions(width, height, max) {
        var longestSide = width > height ? width : height;
        var factor = longestSide > max ? max/longestSide : 1.0;
        return({
            factor: factor,
            width: Math.round(width*factor),
            height: Math.round(height*factor)
        });
	}
	
	if(typeof PhotoSwipe !== "undefined") {

		
		galleryEl.addEventListener("click", function(event){
			event.preventDefault();
			new PhotoSwipe( document.querySelectorAll('.pswp')[0], PhotoSwipeUI_Default, Array.prototype.slice.call(items), {index: parseInt(event.target.getAttribute('data-gallery-index'))}).init();
		}, true);
		
		galleryEl.addEventListener('load', function(event){
			event.target.parentNode.setAttribute('data-loaded', true)
		}, true);
	} else {
		console.error("PhotoSwipe not available!");
	}
 		
})();