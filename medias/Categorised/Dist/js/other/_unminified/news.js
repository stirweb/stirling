(function estimateReadingTime(newstextEls) {
  var words = 0,
    images = 0,
    time = 0,
    elem;

  // count masthead image(s)
  if (elem = document.querySelectorAll('.c-masthead__image')) images += elem.length;

  //count words and in-article images
  for (var elem = newstextEls.shift(); elem; elem = newstextEls.shift()) {
    words += elem.textContent.replace(/\s+/g, ' ').trim().split(" ").length;
    images += elem.querySelectorAll('img').length;
  }
  ;

  // calculate reading time (à la Medium.com)
  // average adult English reading speed: 275 words per minute, plus 12 seconds per image;
  time = Math.round(words / 275 + images * 0.2);

  // display reading time on the page
  (function output(elem) {
    if (elem) {
      elem.innerText = time.toString() + ' minute read';
      elem.setAttribute('title', "There are " + words.toString() + ' words and ' + (images ? images.toString() : 'no') + ' images in this article.');
    }
  })(document.querySelector('[data-readtime]'));
})(Array.prototype.slice.call(document.querySelectorAll(".c-wysiwyg-content,.c-testimonial")));