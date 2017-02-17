/*global require */

"use strict";

// include plug-ins
var gulp = require("gulp"),
  connect = require('gulp-connect');

gulp.task('startLocalWebServer', function () {
  connect.server({
    port: 8888,
    root: '',
    livereload: true
  });
});

//Set a default tasks
gulp.task("default", ["startLocalWebServer"]);