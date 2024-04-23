var base = require('./base').default;
var texteditor = require('./mixins/text').default;
var mx = require('mixwith');


class button extends mx.mix(base).with(texteditor){
	
}
module.exports = {
	
	default: button
}