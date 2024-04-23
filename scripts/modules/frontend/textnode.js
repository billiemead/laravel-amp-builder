var base = require('./text').default;
var Util = require('./text').Util;
var mx = require('mixwith');
var textnode = require('./mixins/textnode').default;

class node extends mx.mix(base).with(textnode){
	
}

module.exports = {
	default: node,
}