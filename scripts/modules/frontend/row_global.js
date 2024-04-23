var base = require('./row').default;
var global_block = require('./global_block').default;
var mx = require('mixwith');

class section extends mx.mix(base).with(global_block){
	insertCompleted()
	{
		//this.insertColumn(6);
		//this.insertColumn(6);
	}
}
module.exports = {
	
	default: section
}