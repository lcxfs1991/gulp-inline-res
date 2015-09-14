/**
 *  @project gulp-bigpipe-template
 *  @author heyli
 *  @email lcxfs1991
 *  @github: https://github.com/lcxfs1991
 *  @reference: 
 *  1. https://github.com/Rise-Vision/gulp-html2string
 *  2. https://www.npmjs.com/package/gulp-node-simple 
 **/
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var fs = require('fs');
var path = require('path');
var minify = require('html-minifier').minify;

const PLUGIN_NAME = 'gulp-inline-src';

// path of windows and linux should be consistent
var pathFix = function(path) {
    return path.replace(/\\/g, '/');
};

// learn from gulp-html2string
var escapeContent = function(content, quoteChar, indentString) {
    var bsRegexp = new RegExp('\\\\', 'g');
    var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
    var nlReplace = '\\n' + quoteChar + ' +\n' + indentString + indentString + quoteChar;
    return content.replace(bsRegexp, '\\\\').replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace);
};

var inlineScript = function(regex, content) {
    
    return content.replace(regex, function(script, route) {
        var route = path.resolve(route).replace('?', '');
        if (!fs.existsSync(route)) {
                throw new PluginError(PLUGIN_NAME, route + ' does not exist');
        }
        return '<script>' + String(fs.readFileSync(route)) + '</script>';
    });
};

var inlineStyle = function(regex, content) {
    return content.replace(regex, function(style, route) {
        var route = path.resolve(route).replace('?', '');
        if (!fs.existsSync(route)) {
                throw new PluginError(PLUGIN_NAME, route + ' does not exist');
        }
        return '<style>' + String(fs.readFileSync(route)) + '</style>';
    });
};

var inlineHtml = function(regex, content, quoteChar, indentString) {
    return content.replace(regex, function(html, route) {
        var route = path.resolve(route).replace('?', '');
        if (!fs.existsSync(route)) {
            throw new PluginError(PLUGIN_NAME, route + ' does not exist');
        }

        return escapeContent(minify(String(fs.readFileSync(route)), {collapseWhitespace: true, removeComments: true}), quoteChar, indentString);
        
    });
};

// function for gulp plugin
var inlineSrc = function(opt) {
    var opt = opt || {};
    var scriptInlineRegex = opt.scriptInlineRegex || (new RegExp("<script.*src=[\"|\']*(.+)\?\_\_\_inline.*?<\/script>", "ig"));
    var styleInlineRegex = opt.styleInlineRegex || (new RegExp("<link.*href=[\"|\']*(.+)\?\_\_\_inline.*?>", "ig"));
    var htmlInlineRegex = opt.htmlInlineRegex || (new RegExp("<tpl.*src=[\"|\']*(.+)\?\_\_\_inline.*?<\/tpl>", "ig"));//(new RegExp("tmpl:.*( )*[\(][\"|\']+(.+)[\"|\']+[\)]", "ig"));
    var quoteChar= opt.quoteChar || '"';
    var indentString= opt.indentString || '  ';

    // stream pipe
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            // return null file
            cb(null, file);
        }
        else if (file.isBuffer()) {
            var content = String(file.contents);
            content = inlineScript(scriptInlineRegex, content);
            content = inlineStyle(styleInlineRegex, content);
            content = inlineHtml(htmlInlineRegex, content, quoteChar, indentString);
            // console.log(content);
            file.contents = new Buffer(content);
            
        }
        else if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, 'does not support stream');
        }

        cb(null, file);
    });
};

// export major function of the plugin
module.exports = inlineSrc;