var gUtil       = require('gulp-util'),
    PluginError = gUtil.PluginError,
    File        = gUtil.File,
    through     = require('through'),
    path        = require("path"),
    _           = require("underscore");


/*
 * Takes the output from gulp-jade and transforms the names of the functions and
 * generate the JST wrapper.
 */


function pluginError (message) {
  return new PluginError('gulp-jade-jst-translator', message)
}


module.exports = function processFiles(fileName, _opts) {
  if (!fileName) throw pluginError('Missing fileName')


  var defaults = { templateFolder: "." },
      opts = _.extend({}, defaults, _opts),
      data = {}
  ;

  function write (file) {
    if (file.isNull()) return
    if (file.isStream()) return this.emit('error', pluginError('Streaming not supported'))

    var basename = path.basename(file.path, ".jst.js"),
        filePath = path.relative(opts.templateFolder, file.path)
                       .replace(".jst.js", "");

    var JSTname = "window['JST']['{{template}}'] = function ".replace("{{template}}", "templates/"+filePath);

    file.contents = new Buffer(
      file.contents
          .toString()
          .replace("function template", JSTname)
    );

    data[basename] = file.contents;
  }

  function end () {
    var concatedData = "(function() {\n window['JST'] = window['JST'] || {};\n";
    var templateList = []
    _.each(data, function(fn, name){
      concatedData += fn.toString() + ";\n";
    })
    concatedData += "})();";


    this.queue(new File({
      path: fileName,
      contents: new Buffer(concatedData)
    }))

    this.queue(null)
  }

  return through(write, end)
}
