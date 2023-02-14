/**
 * Generate an avatar image from letters
 */
(function (w, d) {

  function AvatarImage(letters, color, size) {
    var canvas = d.createElement('canvas');
    var context = canvas.getContext("2d");
    var size = size || 60;

    // // Generate a random color every time function is called
    // var color =  "#" + (Math.random() * 0xFFFFFF << 0).toString(16);

    // Set canvas with & height
    canvas.width = size;
    canvas.height = size;

    // Select a font family to support different language characters
    // like Arial
    context.font = Math.round(canvas.width / 2) + "px Arial";
    context.textAlign = "center";

    // Setup background and front color
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFF";
    context.fillText(letters, size / 2, size / 1.5);

    // Set image representation in default format (png)
    dataURI = canvas.toDataURL();

    // Dispose canvas element
    canvas = null;

    return dataURI;
  }

  w.AvatarImage = AvatarImage;

})(window, document);

(function(w, d) {

  function generateAvatars() {
    var images = d.querySelectorAll('img[data-letters]');

    for (var i = 0, len = images.length; i < len; i++) {
      var img = images[i];
      img.src = AvatarImage(img.getAttribute('data-letters'), img.getAttribute('data-color'), img.getAttribute('width'));
      img.removeAttribute('data-letters');
    }
  }

  d.addEventListener('DOMContentLoaded', function (event) {
      generateAvatars();
  });

})(window, document);
