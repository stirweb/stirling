/**
 * TODO remove any unused gulp packages from package.json
 *
 * moment - still in use?
 * waypoints - still in use?
 *
 */

var gulp = require("gulp");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var concatCss = require("gulp-concat-css");
var cleanCSS = require("gulp-clean-css");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var expect = require("gulp-expect-file");
var minimist = require("minimist");

// UNUSED GULP TASKS
// var pxtorem      = require('gulp-pxtorem');
// var rename       = require('gulp-rename');
// var minify       = require('gulp-minify');

//var pxtoremOptions = {
// replace: true,
// propWhiteList: ['font', 'font-size', 'line-height', 'letter-spacing', 'height', 'width', 'margin', 'padding']
//};

//var postcssOptions = { };

/**
 * JavaScripts to be compiled. Add files to the array in order to be compiled.
 */
var scripts = [
  //'node_modules/jquery/dist/jquery.js',
  "node_modules/what-input/dist/what-input.js",
  //'node_modules/foundation-sites/dist/js/foundation.js',
  //'node_modules/slick-carousel/slick/slick.js',
  "node_modules/tiny-slider/dist/min/tiny-slider.js",
  "node_modules/aos/dist/aos.js",
  "node_modules/js-cookie/src/js.cookie.js",
  "node_modules/imagesloaded/imagesloaded.pkgd.js",
  "node_modules/@vimeo/player/dist/player.min.js",
  "src/js/jsExtensions.js",
  //"src/js/jQueryHelpers.js",
  /* 'src/polyfill/classlist.js', */

  "src/vendor/avatarimage/AvatarImage.js", // TODO can this be replaced with svg one?
  "src/vendor/avatarimagesvg/AvatarImageSVG.js",
  "src/vendor/queryparams/QueryParams.js",
  "src/vendor/serviceq/src/serviceq.js",
  "src/vendor/awd/src/awd.js",
  "src/vendor/utils/src/utils.js",
  "src/vendor/stickywidget/stickywidget.js",
  "src/vendor/stir/stir.js",
  "src/js/app.js",
  "src/impl/*.js",
];

/**
 * SearchBox scripts and dependencies
 * Removed from app.js and repackaged as stand alone (rk 16/05/2019)
 */
// var scriptsSearchBox = [
//   "node_modules/masonry-layout/dist/masonry.pkgd.js",
//   "node_modules/isotope-layout/dist/isotope.pkgd.js",
//   "src/vendor/searchbox/js/searchbox.js",
//   "src/js/SearchBox/helpers.js",
//   "src/js/SearchBox/formatters.js",
//   "src/js/SearchBox/filters.js",
//   "src/js/SearchBox/mappers.js",
// ];

/**
 * Course scripts and dependencies
 */
var scriptsCourses = [
  "node_modules/jquery/dist/jquery.js",
  "src/vendor/stirunimodules/js/stirunimodules.js",
  "src/courses/js/*.js",
];

/**
 * Include paths for sass compiler
 */
var sassPaths = [
  "node_modules/foundation-sites/scss",
  "node_modules/motion-ui/src",
  "src/scss",
];

/**
 * Files needed for photo galleries:
 * Photoswipe (3rd party library) + custom University of Stirling skin
 * Grid gallery is our custom photo layout CSS for gallery pages.
 */
var gallery = {
  css: [
    "node_modules/photoswipe/dist/photoswipe.css",
    "src/vendor/photoswipe/uos-skin.css",
    "dist/css/campaigns/grid-gallery.css",
  ],
  js: [
    "node_modules/photoswipe/dist/photoswipe.js",
    "node_modules/photoswipe/dist/photoswipe-ui-default.js",
    "src/other/grid-gallery.js",
  ],
};

/**
 * see http://gulpjs.org/recipes/pass-arguments-from-cli.html
 */
var cliOptions = {
  string: "env",
  default: { env: process.env.NODE_ENV || "production" },
};
var options = minimist(process.argv.slice(2), cliOptions);

/**
 * Task for compiling sass. Run with 'gulp sass'
 */
gulp.task("sass", function () {
  gulp
    .src("src/scss/app.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: sassPaths,
      })
    )
    .on("error", sass.logError)
    .pipe(
      autoprefixer({
        browsers: ["> 1%"],
        cascade: false,
      })
    )
    // .pipe(pxtorem(pxtoremOptions, postcssOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/css"));
});

gulp.task("sass-campaigns", function () {
  return gulp
    .src("src/campaigns/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/css/campaigns"));
});

gulp.task("sass-infograms", function () {
  return gulp
    .src("src/animation/infographics.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/css/"));
});

/**
 * Make main CSS file ready to production
 */
gulp.task("css-prod", function () {
  return gulp
    .src("dist/css/app.css")
    .pipe(concatCss("app.min.css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/css"));
});

/**
 * Galleries CSS
 */
gulp.task("css-gallery", function () {
  return gulp
    .src(gallery.css)
    .pipe(concatCss("gallery.min.css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("dist/css"));
});

/**
 * Compile all JS scripts into a single script
 */
gulp.task("js", function () {
  return gulp
    .src(scripts)
    .pipe(expect(scripts)) // ensure all files exist
    .pipe(concat("app.js")) // combine js files
    .pipe(gulp.dest("dist/js")); // write to dist/ folder
});

/**
 * Galleries JS
 */
gulp.task("js-gallery", function () {
  return gulp
    .src(gallery.js)
    .pipe(expect(gallery.js)) // ensure all files exist
    .pipe(concat("gallery.min.js")) // combine js files
    .pipe(uglify())
    .pipe(gulp.dest("dist/js")); // write to dist/ folder
});

/**
 * Make main JS file ready to production
 */
gulp.task("js-prod", function () {
  return gulp
    .src("dist/js/app.js")
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

/**
 * Page-specific (or task-specific) JS scripts. e.g. instances of personalisation
 */
gulp.task("js-other", function () {
  return gulp
    .src("src/other/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/other"))
    .pipe(browserSync.stream());
});

/**
 * Martyn's SearchBox scripts
 */
// gulp.task("js-searchbox", function () {
//   return gulp
//     .src(scriptsSearchBox)
//     .pipe(expect(scriptsSearchBox)) // ensure all files exist
//     .pipe(concat("searchBox.js")) // combine js files
//     .pipe(uglify())
//     .pipe(gulp.dest("dist/js/searchbox")); // write to dist/ folder
// });

/**
 * Course scripts
 */
gulp.task("js-courses", function () {
  return gulp
    .src(scriptsCourses)
    .pipe(expect(scriptsCourses)) // ensure all files exist
    .pipe(concat("course-min.js")) // combine js files
    .pipe(uglify())
    .pipe(gulp.dest("dist/js/other")); // write to dist/ folder
});

gulp.task("gallery", ["css-gallery", "js-gallery"]);

/**
 * Search revamp 2021
 */
gulp.task("sass-revamp", function () {
  return gulp
    .src("pages/_search-revamp-2021/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("pages/_search-revamp-2021"));
});

/**
 * Tasks to run after every event
 */
gulp.task("default", function () {
  if (options.browserSync) {
    browserSync.init({
      server: {
        baseDir: "./",
        directory: true,
      },
    });
  }

  gulp.watch(["src/scss/**/*.scss"], ["sass"]);
  gulp.watch(["src/campaigns/scss/**/*.scss"], ["sass-campaigns"]);
  gulp.watch(["src/animation/**/*.scss"], ["sass-infograms"]);

  gulp.watch(
    ["src/js/**/*.js", "src/vendor/**/*.js", "src/impl/**/*.js"],
    ["js"]
  ); //, 'src/polyfill/**/*.js'
  gulp.watch(["src/other/*.js"], ["js-other", "js-gallery"]);
  //gulp.watch(["src/js/SearchBox/*.js"], ["js-searchbox"]);
  gulp.watch(["src/courses/js/*.js"], ["js-courses"]);

  gulp.watch(["src/vendor/photoswipe/*.css"], ["css-gallery"]);

  // these are the production tasks, these are called when the non-minified scripts are called
  gulp.watch(["dist/js/app.js"], ["js-prod"]);
  gulp.watch(["dist/css/app.css"], ["css-prod"]);

  // Search revamp 2021
  gulp.watch(["pages/_search-revamp-2021/*.scss"], ["sass-revamp"]);

  gulp
    .watch(["pages/*.html", "dist/css/app.min.css"])
    .on("change", browserSync.reload);
});
