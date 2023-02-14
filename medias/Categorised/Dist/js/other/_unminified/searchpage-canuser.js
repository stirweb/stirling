var stir = stir || {};

(function () {
  stir.getJSON("https://www.stir.ac.uk/webcomponents/dist/php/can-user.php", function (data) {
    console.log(data);
    if (typeof data == "undefined") return;
    var message = document.querySelector('[type="text/html"][data-showfor="canuser"]');

    if (message && data.CANUser) {
      message.insertAdjacentHTML("afterend", message.textContent);
    }
  });
})();