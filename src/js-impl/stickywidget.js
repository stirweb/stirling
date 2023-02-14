if(self.UoS_StickyWidget)(function(widgets) {
    for(var sticky in widgets) {
        if(widgets.hasOwnProperty(sticky)){
            new UoS_StickyWidget(widgets[sticky]);
        }
    }
})(document.querySelectorAll('.u-sticky'));