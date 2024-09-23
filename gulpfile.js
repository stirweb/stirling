/*
 * gulp-autoprefixer: Adds vendor prefixes to CSS rules
 * gulp-clean: Clears the build directory and deletes everything in it
 * gulp-clean-css: Minifies CSS
 * gulp-concat: Merges several CSS or several JS files
 * gulp-expect-file: Expectation on generated files
 * gulp-imagemin: Minifies images
 * gulp-plumber: Prevent pipe breaking caused by errors from gulp plugins
 * gulp-rename: Provides simple file renaming methods.
 * gulp-sass: Transform Sass into CSS
 * node-sass: Transform Sass into CSS
 * gulp-uglify: Minifies JS
 * browser-sync: provides a simple web server and auto-reloads pages in all browsers on all devices
 *
 * `gulp watch` to kick everything off
 */

// Import gulp
const { src, dest, watch, series, parallel } = require("gulp");

// Import Gulp plugins.
//const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const concatCss = require("gulp-concat-css");
const expect = require("gulp-expect-file");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("node-sass"));
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

// Clean assets - NOT actually in use
function clear() {
  return src("assets/*", {
    read: false,
  }).pipe(clean());
}

/*
 * JavaScript Tasks
 */

// JS function
function js() {
  const source = [
    "node_modules/what-input/dist/what-input.js",
    //"node_modules/foundation-sites/dist/js/foundation.js",
    //"node_modules/tiny-slider/dist/min/tiny-slider.js", // 32KB !!! - CSS scroll-snap-type?
    //"node_modules/aos/dist/aos.js", // 15KB !!!
    "node_modules/js-cookie/src/js.cookie.js", // IN USE?
    //"node_modules/imagesloaded/imagesloaded.pkgd.js", // IN USE?
    "node_modules/@vimeo/player/dist/player.min.js",
    "src/js/jsExtensions.js", // Polyfills
    "src/vendor/avatarimage/AvatarImage.js", // TODO can this be replaced with svg one?
    "src/vendor/avatarimagesvg/AvatarImageSVG.js",
    "src/vendor/queryparams/QueryParams.js",
    //"src/vendor/serviceq/src/serviceq.js",
    //"src/vendor/awd/src/awd.js",
    //"src/vendor/utils/src/utils.js",
    "src/vendor/stickywidget/stickywidget.js",
    "src/vendor/stir/stir.js", // 31KB !!!
    "src/js/app.js",
    "src/js-impl/*.js",
  ];
  return (
    src(source)
      .pipe(expect(source)) // ensure all files exist
      .pipe(plumber())
      .pipe(concat("app.js"))
      // .pipe(
      //   babel({
      //     presets: [
      //       [
      //         "@babel/env",
      //         {
      //           modules: false,
      //         },
      //       ],
      //     ],
      //   })
      // )
      .pipe(dest("medias/Categorised/Dist/js"))
      .pipe(browserSync.stream())
  );
}

// JS Production ready function
function jsProd() {
  const source = "medias/Categorised/Dist/js/app.js";
  return src(source).pipe(concat("app.min.js")).pipe(uglify()).pipe(dest("medias/Categorised/Dist/js")).pipe(browserSync.stream());
}

// JS Course standalone script
function jsCourses() {
  const source = "src/js-course/*.js";
  return (
    src(source)
      .pipe(expect(source))
      .pipe(plumber())
      // .pipe(
      //   babel({
      //     presets: [
      //       [
      //         "@babel/env",
      //         {
      //           modules: false,
      //         },
      //       ],
      //     ],
      //   })
      // )
      .pipe(concat("course.js")) // combine js files unminified
      .pipe(dest("medias/Categorised/Dist/js/other"))
      .pipe(uglify())
      .pipe(concat("course-min.js")) // combine js files
      .pipe(dest("medias/Categorised/Dist/js/other"))
      .pipe(browserSync.stream())
  );
}

// JS standalone scripts
function jsOther() {
  const source = "src/js-other/*.js";
  return (
    src(source)
      .pipe(plumber())
      // .pipe(
      //   babel({
      //     presets: [
      //       [
      //         "@babel/env",
      //         {
      //           modules: false,
      //         },
      //       ],
      //     ],
      //   })
      // )
      .pipe(dest("medias/Categorised/Dist/js/other/_unminified")) // unminified version
      .pipe(uglify())
      //.pipe(rename({ extname: ".min.js" }))
      .pipe(dest("medias/Categorised/Dist/js/other"))
      .pipe(browserSync.stream())
  );
}

// JS standalone scripts
function jsOther2() {
  const source = "src/js-other-2/*.js";
  return (
    src(source)
      .pipe(plumber())
      // .pipe(
      //   babel({
      //     presets: [
      //       [
      //         "@babel/env",
      //         {
      //           modules: false,
      //         },
      //       ],
      //     ],
      //   })
      // )
      .pipe(dest("medias/Categorised/Dist/js/other/_unminified")) // unminified version
      .pipe(uglify())
      //.pipe(rename({ extname: ".min.js" }))
      .pipe(dest("medias/Categorised/Dist/js/other"))
      .pipe(browserSync.stream())
  );
}

// JS search scripts
function jsSearch() {
  const source = ["src/js-search/*.js"];
  return (
    src(source)
      .pipe(expect(source))
      .pipe(plumber())
      // .pipe(
      //   babel({
      //     presets: [
      //       [
      //         "@babel/env",
      //         {
      //           modules: false,
      //         },
      //       ],
      //     ],
      //   })
      // )
      .pipe(concat("search.js")) // combine js files unminified
      .pipe(dest("medias/Categorised/Dist/js/search"))
      .pipe(uglify())
      .pipe(concat("search-min.js")) // combine js files
      .pipe(dest("medias/Categorised/Dist/js/search"))
      .pipe(browserSync.stream())
  );
}

// JS Gallery files
function jsGallery() {
  const source = ["node_modules/photoswipe/dist/photoswipe.js", "node_modules/photoswipe/dist/photoswipe-ui-default.js", "src/js-other/grid-gallery.js"];
  return (
    src(source)
      .pipe(expect(source))
      .pipe(plumber())
      // .pipe(
      //   babel({
      //     presets: [
      //       [
      //         "@babel/env",
      //         {
      //           modules: false,
      //         },
      //       ],
      //     ],
      //   })
      // )
      .pipe(concat("gallery.js"))
      .pipe(dest("medias/Categorised/Dist/js/other/_unminified"))
      .pipe(concat("gallery.min.js")) // combine js files
      .pipe(uglify())
      .pipe(dest("medias/Categorised/Dist/js"))
      .pipe(browserSync.stream())
  );
}

/*
 * SASS / CSS Tasks
 */

// SASS App function - Foundation version NOT IN USE
function scss() {
  const source = "src/scss/app.foundation.scss";
  const sassPaths = ["node_modules/foundation-sites/scss", "node_modules/motion-ui/src", "src/scss"];
  return src(source)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: sassPaths,
      })
    )
    .on("error", sass.logError)
    .pipe(
      autoprefixer({
        //browsers: ["> 1%"],
        cascade: false,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest("medias/Categorised/Dist/css"))
    .pipe(concatCss("app.foundation.min.css"))
    .pipe(cleanCSS({ compatibility: "*" }))
    .pipe(dest("medias/Categorised/Dist/css"))
    .pipe(browserSync.stream());
}

// SASS App function - New Foundation Free
function scssNew() {
  const source = "src/scss/app.scss";
  const sassPaths = ["src/scss"];
  return (
    src(source)
      //.pipe(sourcemaps.init())
      .pipe(
        sass({
          includePaths: sassPaths,
        })
      )
      .on("error", sass.logError)
      .pipe(
        autoprefixer({
          //browsers: ["> 1%"],
          cascade: false,
        })
      )
      //.pipe(sourcemaps.write())
      .pipe(dest("medias/Categorised/Dist/css"))
      .pipe(concatCss("app.min.css"))
      .pipe(cleanCSS({ compatibility: "*" }))
      .pipe(dest("medias/Categorised/Dist/css"))
      .pipe(browserSync.stream())
  );
}

// SASS standalone campaign files
function scssCampaigns() {
  const source = "src/campaigns/scss/*.scss";
  return src(source)
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "*" }))
    .pipe(dest("medias/Categorised/Dist/css/campaigns"))
    .pipe(browserSync.stream());
}

// SASS standalone Infographs files
function scssInfographs() {
  const source = "src/scss-animation/infographics.scss";
  return src(source)
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS({ compatibility: "*" }))
    .pipe(dest("medias/Categorised/Dist/css/"))
    .pipe(browserSync.stream());
}

// SASS standalone gallery file
function scssGallery() {
  const source = ["node_modules/photoswipe/dist/photoswipe.css", "src/vendor/photoswipe/uos-skin.css", "medias/Categorised/Dist/css/campaigns/grid-gallery.css"];
  return src(source)
    .pipe(concatCss("gallery.min.css"))
    .pipe(cleanCSS({ compatibility: "*" }))
    .pipe(dest("medias/Categorised/Dist/css"))
    .pipe(browserSync.stream());
}

/*
 * IMAGE Tasks
 */

// Optimize images
function img() {
  return src("src/images/*").pipe(imagemin()).pipe(dest("medias/Categorised/Dist/images"));
}

/*
 * TEMP Tasks
 */

// Watch files for changes
function watchFiles() {
  // watch(["src/scss/*.scss", "src/scss/**/*.scss"]).on("change", scss);
  watch(["src/scss/*.scss", "src/scss/**/*.scss"]).on("change", scssNew);
  watch("src/campaigns/scss/*").on("change", scssCampaigns);
  watch("src/scss-animation/infographics.scss").on("change", scssInfographs);
  watch(["src/vendor/photoswipe/uos-skin.css", "medias/Categorised/Dist/css/campaigns/grid-gallery.css"]).on("change", scssGallery);
  watch("src/js/*").on("change", js);
  watch("src/js-impl/*").on("change", js);
  watch("src/vendor/**/*.js").on("change", js);
  watch("src/js-other/*").on("change", jsOther);
  watch("src/js-other-2/*").on("change", jsOther2);
  watch("src/js-search/*").on("change", jsSearch);
  watch("src/js-course/*").on("change", jsCourses);
  watch("src/js-other/grid-gallery.js").on("change", jsGallery);
  watch("medias/Categorised/Dist/js/app.js").on("change", jsProd);
  watch("src/img/*").on("change", img);
  watch("pages/*/*.html").on("change", browserSync.reload);
}

// BrowserSync
function startBrowserSync() {
  browserSync.init({
    server: {
      baseDir: "./",
      directory: true,
    },
    port: 3000,
  });
}

// Tasks to define the execution of the functions simultaneously or in series
exports.watch = parallel(watchFiles, startBrowserSync);
exports.default = series(clear, parallel(js, jsProd, jsOther, jsOther2, jsCourses, jsSearch, jsGallery, scss, scssCampaigns, scssInfographs, scssGallery, img));
