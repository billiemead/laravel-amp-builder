'use strict';

var sass = window.globalSass;//require('node-sass');
//var cssmin = require('cssmin');

function wrapValue(value) {
  return '.test { content: ' + value + ' };';
}

function unwrapValue(value) {
  return value.replace('.test{content:', '').replace('}', '');
}

var Compile = {
  fromString: function(value) {
	  return value;
    var wrappedValue = wrapValue(value);
    var s = sass.compile(wrappedValue, function(result){
	});
    var compiled = String(s.css);
    var minifiedCompiled = compiled;//cssmin(compiled);
    return unwrapValue(minifiedCompiled);
  }
};
/*
if (process.env.NODE_ENV === 'test') {
  Compile.wrapValue = wrapValue;
  Compile.unwrapValue = unwrapValue;
}
*/
module.exports = Compile;
