var gulp = require("gulp");
 var browserSync = require("browser-sync");
 var sass = require("gulp-sass");
 var cleanCSS = require("gulp-clean-css");
 var autoprefixer = require("gulp-autoprefixer");
 var rename = require("gulp-rename");
 var imagemin = require("gulp-imagemin");
 var htmlmin = require("gulp-htmlmin");
 var minify = require('gulp-minify');
 var concat = require('gulp-concat');
 // var uglify = require("gulp-uglify");
 // var pipeline = require("readable-stream").pipeline;

 gulp.task("server", function () {
   browserSync({
     server: {
       baseDir: "dist",
     },
     browser: "firefox",
     notify: false,
   });

   gulp.watch("src/*.html").on("change", browserSync.reload);
   gulp.watch("src/js/*.js").on("change", browserSync.reload);
 });






 gulp.task("styles", function () {
   return gulp
     .src("src/sass/**/*.+(scss|sass)")
     .pipe(
       sass({
         outputStyle: "compressed",
       }).on("error", sass.logError)
     )
     .pipe(
       rename({
         suffix: ".min",
         prefix: "",
       })
     )
     .pipe(autoprefixer())
     .pipe(
       cleanCSS({
         compatibility: "ie8",
       })
     )
     .pipe(gulp.dest("dist/css"))
     .pipe(browserSync.stream());
 });

 gulp.task('scripts', function () {
   return gulp.src('src/js/*.js')
     .pipe(concat('main.js'))
     .pipe(gulp.dest('src/js/main'));

 });

 gulp.task('min-js', function () {
   return gulp.src('src/js/main/main.js')
     .pipe(minify({
       ext: {
         min: '.min.js'
       },
       ignoreFiles: ['*min.js']
     }))
     .pipe(gulp.dest('dist/js'));
 });

 gulp.task("watch", function () {
   gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
   gulp.watch("src/*.html").on("change", gulp.parallel("html"));
   gulp.watch("src/js/*.js").on("change", gulp.parallel("scripts"));
   gulp.watch("src/js/main/main.js").on("change", gulp.parallel("min-js"));

 });

 gulp.task("html", function () {
   return gulp
     .src("src/*.html")
     .pipe(
       htmlmin({
         collapseWhitespace: true,
       })
     )
     .pipe(gulp.dest("dist/"));
 });

 // gulp.task("scripts", function () {
 //   return gulp.src("src/js/**/*.js").pipe(gulp.dest("dist/js"));
 // });

 gulp.task("fonts", function () {
   return gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
 });

 gulp.task("icons", function () {
   return gulp.src("src/icons/**/*").pipe(gulp.dest("dist/icons"));
 });

 gulp.task("mailer", function () {
   return gulp.src("src/mailer/**/*").pipe(gulp.dest("dist/mailer"));
 });

 gulp.task("images", function () {
   return gulp.src("src/img/**/*").pipe(imagemin()).pipe(gulp.dest("dist/img"));
 });

 gulp.task(
   "default",
   gulp.parallel(
     "watch",
     "server",
     "styles",
     "scripts",
     // "compress",
     "fonts",
     "min-js",
     "icons",
     "mailer",
     "html",
     "images"
     // "js:build"
   )
 );