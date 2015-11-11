# gulp-jade-jst-translator

Transform this:

```javascript
  // templates/panel_body
  function template(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;

    var jade_indent = [];
    buf.push("\n<div class=\"panel-body\"></div>");;return buf.join("");
  }
```

Into this

```javascript
(function() {
  window['JST'] = window['JST'] || {};
  window['JST']['templates/panel_body'] = function (locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;

    var jade_indent = [];
    buf.push("\n<div class=\"panel-body\"></div>");;return buf.join("");
  };
});
```

# How to use

```javascript
  var GulpJade          = require("gulp-jade"),
      JadeJstTranslator = require("gulp-jade-jst-translator")
  ;

  gulp.task("jade:jst:translator", function () {
    return gulp.src(["file.jade"])
      .pipe(gulpJade({
        pretty: true,
        client: true
      }))
      .pipe(concatJST("jade-templates.js", {
        templateFolder: "./app/assets/javascripts/templates"
      }))
      .pipe(gulp.dest("./vendor/assets/javascripts"))
      //.pipe(gulp.dest("./tmp"));
  });
```

## Parameters

- dest-file `[string]` : destination file
- options `{ }` : list of options

## Options

- templateFolder `[string]` : relative path to Jade template folder.

# TODO

- Add new options like `gulp-template-compile`

# Thanks and please colaborate
