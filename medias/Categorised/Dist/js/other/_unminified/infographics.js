/**
 * Scripts for the /study/ landing page
 * 2019-08-19 4.43 pm
 * r.w.morrison@stir.ac.uk
 */

/**
 * Donut animation
 */
(function () {
  var circles,
      donut = document.querySelector('.progress');
  if (donut) circles = donut.querySelectorAll(".circle");else return;
  var study = stir.createIntersectionObserver({
    element: donut,
    threshold: 0.7,
    callback: function callback(entry) {
      if (entry.intersectionRatio === -1 || entry.intersectionRatio > 0) {
        for (var i = 0; i < circles.length; i++) {
          var progress = circles[i].getAttribute("stroke-dasharray");
          if (progress) circles[i].style.strokeDasharray = progress.replace(",", "");
        }

        study.observer.unobserve(this);
      }
    }
  });
})();
/**
 * Simple animations
 */


(function () {
  var infographic = document.querySelector('[data-animation="bounceIn"]');
  stir.createIntersectionObserver({
    element: infographic,
    threshold: [0.7]
  }).setClassAdd('bounceIn').setClassRemove('init');
  stir.createIntersectionObserver({
    element: infographic,
    threshold: [0]
  }).setClassRemove('bounceIn');
  var top150 = document.querySelector('.c-top-150-stat');
  var partners = document.querySelector('.c-partners-stat');
  var alumni = document.querySelector('.c-alumni-stat');
  var teaching = document.querySelector('.c-teaching-stat');
  var campus = document.querySelector('.c-campus');
  stir.createIntersectionObserver({
    element: top150,
    threshold: [0.5]
  }).setClassAdd('animate');
  stir.createIntersectionObserver({
    element: partners,
    threshold: [0.5]
  }).setClassAdd('animate');
  stir.createIntersectionObserver({
    element: alumni,
    threshold: [0.5]
  }).setClassAdd('animate');
  stir.createIntersectionObserver({
    element: teaching,
    threshold: [0.5]
  }).setClassAdd('animate');
  stir.createIntersectionObserver({
    element: campus,
    threshold: [0.5]
  }).setClassAdd('animate');
})();
/**
 * Number count-up animation
 * requires the TweenMax library
 */


(function () {
  var numbers = document.querySelector('.number-stats');
  if (!numbers) return;
  var rollup = stir.createIntersectionObserver({
    element: numbers,
    threshold: 0.9,
    callback: function callback(entry) {
      if (entry.intersectionRatio === -1 || entry.intersectionRatio > 0) {
        /**
         * First, fade in the stats in staggered order:
         * @todo replace this with a CSS animation instead
         */
        (function (numberStats) {
          for (var i = 0; i < numberStats.length; i++) {
            (function (numberStat) {
              setTimeout(function () {
                numberStat.classList.add("fade-in");
              }, 300 * i);
            })(numberStats[i]);
          }
        })(Array.prototype.slice.call(document.querySelectorAll(".number-statistic")));
        /**
         * If no animation, just quit now that the stats have faded-in.
         */


        if (!window.requestAnimationFrame) return;

        (function (values) {
          var max = values.length;
          var done = [];
          var stats = [];

          for (var i = 0; i < max; i++) {
            (function (item) {
              value = parseInt(item.textContent);
              stats.push({
                el: item,
                //DOM element to animate
                val: value,
                //total value we animate up to
                current: 0,
                //current value during the animation runtime
                step: value / (59 * 3) //how much to increase by each loop (bigger totals will take bigger steps)

              });
              done.push(false); //flag to represent when the item reaches its total
            })(values[i]);
          }

          var updateNumbers = function updateNumbers() {
            /* iterare each item until current==val */
            for (var i = 0; i < stats.length; i++) {
              (function (item) {
                if (item.current < item.val) return item.el.textContent = stir.Number.clamp(Math.ceil(item.current += item.step), 0, item.val);
                done[i] = true;
              })(stats[i]);
            }
            /* keep requesting loops until all items are flagged as 'done' */


            if (done.indexOf(false) > -1) {
              window.requestAnimationFrame(updateNumbers);
            }
          };

          window.requestAnimationFrame(updateNumbers);
        })(document.getElementsByClassName("value"));
        /**
         * Stop observing (the element's scroll-position) once the animation has been triggered
         */


        rollup.observer.unobserve(this);
      }
    }
  });
})();