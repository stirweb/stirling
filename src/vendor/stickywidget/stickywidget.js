var UoS_StickyWidget = (function() {

    var StickyWidget =  function(element){
        
        if(!element) return;
        this.element  = element;
        this.offset  = element.getAttribute("data-offset");
        this.trigger = this.setTrigger( element.getAttribute( 'data-observe' ) );
        this.offsetRatio = 0;
		this.wrapper = document.createElement('div');
        this.controls = {
            close: element.querySelectorAll('[data-close]')
        };
		var that=this;

		this.offset && element.classList.add("offset" + this.offset);
		recentreOffset();

        this.callback = function(entry) {
            // entry.intersectionRatio -1 means intersection not supported (IE etc):
            if(entry.intersectionRatio < 0)
                return this.element.setAttribute("data-sticky-polyfill", true);

            // we're only interested in intersections above the viewport
            if(entry.boundingClientRect.y > entry.rootBounds.y) {
                this.element.classList.remove("stuck");
                /* this.element.classList.remove("flush"); */
                return;
            }

            if(entry.intersectionRatio >= 0 && entry.intersectionRatio <= this.offsetRatio)
                return this.element.classList.add("stuck");

            this.element.classList.remove("stuck");
        };

        this.observer = stir.createIntersectionObserver({
            element: this.trigger,
            threshold: [0, this.offsetRatio, 0.9],
            callback: this.callback.bind(this)
        });

        function getElementHeight() {
            var height;
			var display = element.style.display || ''
            // temporarily make sure element is displayed:
            element.style.display = 'block';
            // get the height value
            height = Number(element.offsetHeight);
            // reset the style
            element.style.display = display;
            return height;
        }

		function recentreOffset(e) {
			if(!element.getAttribute("data-offset")) return;

			var height = getElementHeight();
			if(height > 0) {
				that.offsetRatio = (height/2)/height
			}

			// set top and bottom margins to balance the overlap with
			// the button's actual height (except on mobile, which has
			// a fixed margin):
			if(window.stir && stir.MediaQuery && stir.MediaQuery.current!=="small") {
				if(element.hasAttribute("data-bg")){
					element.style.marginTop = (0-height-1) + "px";			// -1 to avoid rounding-error pixel gap
				} else {
					element.style.marginTop = (0-height/2) + "px";
				}
				that.wrapper.style.paddingBottom = (height/2) + "px";
			} else {
				that.wrapper.style.paddingBottom = element.style.marginTop = null; 
			}
		}

        this.hideyslidey = function() {
            if(("IntersectionObserver" in window))
                this.element.style.marginBottom = (-1 * (getElementHeight())).toString() + "px";
        };


        {   // Init stuff:
    
            for(var closer in this.controls.close) {
                if(this.controls.close.hasOwnProperty(closer)){
                    this.controls.close[closer].addEventListener("click", function(event) {
                        event.preventDefault();
                        element.parentElement.removeChild(element);
                    });
                }
            }
    
            if(this.element.classList.contains('u-hidey-slidey')) {
                var zIndex = Number(window.getComputedStyle(this.element).getPropertyValue("z-index"));
                this.trigger.style.zIndex = ++zIndex;
                this.hideyslidey();
            }

			this.element.hasAttribute("data-bg") && this.setBGWrapper();

            element.setAttribute("data-initialised", true);
			window.addEventListener("resize", stir.debounce(recentreOffset, 400));
        
        }

    }

    /**
     * Sticky widgets can define the DOM element they want to observe to trigger sticky behaviour
     * or the previous sibling can be used as a default.
     * 
     * @param {String} observe selector that defines the DOM element to observe
     */
    StickyWidget.prototype.setTrigger = function setTrigger(observe) {
        var trigger;
        if(observe){
            trigger = document.querySelector(observe);
        }
        trigger = trigger || this.element.previousElementSibling;
        if(trigger.offsetHeight == 0) {
            // if the previous sibling has zero height, use the previous-previous one instead.
            trigger = trigger.previousElementSibling;
        }
        this.offset && trigger.setAttribute('data-has-overlapper', this.offset);
        return trigger;

    }

	StickyWidget.prototype.setBGWrapper = function setBGWrapper() {
		this.element.previousElementSibling.insertAdjacentElement("beforebegin",this.wrapper)
		this.wrapper.append(this.element.previousElementSibling)
		this.wrapper.classList.add(this.element.getAttribute("data-bg").trim());
    }

    return StickyWidget;
})();