// this is the half n half
(function() {

    if (!AOS) return; 
    var containers, element;
    var left      = 'fade-left',
        right     = 'fade-right',
        offset    = 100,
        duration  = 600;
    var image     = '.c-half-n-half__image',
        content   = '.c-half-n-half__content',
        container = '.c-half-n-half.js-animation';

    var setAnimationAttrs = function(goLeft) {
        if(!typeof(this.setAttribute) == "function") return;
        this.setAttribute('data-aos', goLeft ? left : right);
        this.setAttribute('data-aos-offset', offset);
        this.setAttribute('data-aos-duration', duration);
    }, isOdd = function(num) { return num % 2;}

    /**
     * Alternate left/right animations for each container on the page
     */
    containers = Array.prototype.slice.call(document.querySelectorAll(container));
    for(var i=0; i<containers.length; i++) {
        if(element = containers[i].querySelector(image)) setAnimationAttrs.call(element, isOdd(i));
        if(element && isOdd(i)) element.setAttribute("data-aos__initialized", "true"); // is this actually used for anything?
        if(element = containers[i].querySelector(content)) setAnimationAttrs.call(element, !isOdd(i));
    }

    AOS.init({
        once: true,
        disable: 'phone'
    });

})();
