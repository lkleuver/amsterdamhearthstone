var extname = require('path').extname;
var Metalsmith = require('metalsmith');
var less = require('less');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var mless = require('metalsmith-less');
var concat = require('metalsmith-concat');
var ignore = require('metalsmith-ignore');
var collections = require('metalsmith-collections');
var paths = require('metalsmith-paths');
var fs = require('fs');
var watch             = require('metalsmith-watch');
var metalsmithExpress = require('metalsmith-express');

var metalsmith = Metalsmith(__dirname)
  .use(paths())
  .use(collections({
    newsposts: {
      pattern: 'news/*.html',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(layouts({
      engine: 'swig',
      directory: 'templates'
  }))
  .use(bootstrap)
  .use(mless({pattern: "style/*.less"}))
  .use(concat({
    files: 'style/**/*.css',
    output: 'style/app.css'
  }))
  .use(ignore([
    "**/*.less",
    "**/src/**/*"
  ]))
  .use(metalsmithExpress())
  .use (
    watch({
      paths: {
        '${source}/**/*': "**/*"
      },
      livereload: true
    })
  )
  .build(function(err){
    if (err) throw err;
  });


function bootstrap(files, metalsmith, done) {
  var src = '';
  for (file in files) {
    if (file == "bootstrap_config.less") {
      src = files[file].contents.toString()
      delete files[file];
      break;
    }
  }

  compiled = less.render(src, {
      paths: ['src']
    },
    function(e, output) {
      if (e) console.log(e);
      files['style/bootstrap.css'] = {
        contents: new Buffer(output.css)
      };

      done();
    }
  );
}
