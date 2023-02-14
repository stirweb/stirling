(function() {

    /**
     * Category heading
     */
    var category = document.head.querySelector('meta[name="category"]');
    var heading = document.querySelector("h1.c-automatic-page-heading");
    if(category && heading) {
        category = category.getAttribute("content");
        heading.insertAdjacentHTML("afterend", '<p class="c-category-label" data-category="'+category+'">'+category+'</p>');
    }

    /**
     * Inline Pullquotes
     */
    var pullquotes = Array.prototype.slice.call(document.querySelectorAll('blockquote.c-pullquote[data-element-anchor]'));

    for(var i=0; i<pullquotes.length; i++) {
        var alignWith, pqParent, destinationContainer, destination;
        var pq = pullquotes[i];
        
        alignWith = pq.getAttribute("data-element-anchor");
        pqParent  = pq.parentElement;
        destinationContainer = pqParent.previousElementSibling;

        if(destinationContainer) {

            if(alignWith && Number.parseInt(alignWith) > 0) {
                destination = destinationContainer.querySelector(".c-wysiwyg-content > :nth-child("+alignWith+")");
                destination && destination.insertAdjacentElement("beforebegin", pq);
            } else {
                destination = destinationContainer.querySelector(".c-wysiwyg-content");
                destination && destination.insertAdjacentElement("beforeend", pq);
            }
    
            destination && pqParent.parentNode.removeChild(pqParent);
        }
    }
})();