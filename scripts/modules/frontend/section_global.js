var base = require('./section').default;
var global_block = require('./global_block').default;
var mx = require('mixwith');

class section extends mx.mix(base).with(global_block){
	
}
module.exports = {
	
	default: section
}