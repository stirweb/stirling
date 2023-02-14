var stir = stir || {};
/**
 * JSONp callback
 * @param data an array of news items
 */

stir.latestnews = function (data) {
  if (!data) return;
  var element = document.querySelector("[data-latest]");
  data.pop(); // last one is always empty!

  var html = [];

  for (var x = 0; x < data.length; x++) {
    html.push("<li><a href=\"" + data[x].url + "\">" + data[x].title + "</a></li>");
  }

  element && element.insertAdjacentHTML("beforeend", "<ul>" + html.join('') + "</ul>");
}; //$(document).ready(function () {

/***   N E W S    I M A G E S   ***/
//var appendme = false;

/* if (typeof (imgdata) !== 'undefined') {
    for (var x = 0; x < imgdata.length; x++) {
        var regexp = /<img [^>]*src="([^"]+)"/g;
        var h = regexp.exec(imgdata[x].img) || '';
        $imgs.append('<figure data-fullsize="' + h[1] + '" data-open="img' + imgdata[x].id + '">' + imgdata[x].thumb + "<figcaption>" + imgdata[x].caption + "</figcaption></figure>");
    }
    appendme = true;
} */

/* var landscape, aside, figure, image;
figure = document.querySelector("figure")
figure && (image = figure.querySelector("img"));
if(figure && image) {
    landscape = image.height < image.width;
    aside = figure.getAttribute("data-aside") ? true : false;
    console.info("landscape", landscape? 'yes': 'no');
    console.info("aside", aside? 'yes': 'no');
     if(!landscape || aside){
        appendme = true;
        figure.setAttribute("data-fullsize", image.getAttribute('src'));
    }
}
 if (appendme === true) {
    var nis = document.createElement("div");
    nis.setAttribute("data-news-image-sidebar", "");
    nis.style.cssFloat = "right";
    nis.style.maxWidth = "33%";
    nis.style.marginLeft = "3%";
    nis.insertAdjacentElement("afterbegin", figure);
     var newsParagraphTwo = document.querySelector(".c-wysiwyg-content p:nth-child(2)");
    if(newsParagraphTwo) {
        newsParagraphTwo.insertAdjacentElement("beforebegin", nis);
    }
}
 console.info("appendme: ", appendme);
 if (typeof magnificPopup !== 'undefined' && $.isFunction(magnificPopup)) {
    $(".ta-da").magnificPopup({
        type: 'image',
        image: {
            titleSrc: function (item) {
                return item.el.next('figcaption').html();
            }
        }
    })
} else {
     $("figure[data-open]").on("click", function (e) {
        //e.preventDefault();
        var $modal = $('#imagemodal');
        var url = $(this).data('fullsize');
console.log('image modal');
        $modal.children("#lightbox").html('<figure><img src="' + url + '"><figcaption>' + $(this).children("figcaption").html() + "</figcaption></figure>");
        $modal.foundation('open');
    });
  } */
//});