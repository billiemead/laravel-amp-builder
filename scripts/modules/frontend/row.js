var base = require('./box').default;
var pageEdit = require('../../utils/pagemanager.iframe/pageEdit_front');
var splitJs = require('split.js');
class box extends base{
	insertCompleted()
	{
		this.insertColumn(6);
		this.insertColumn(6);
	}
	insertColumn(size)
	{
		var dropInfo = {
			node: this.getElement(),
			direction: 'bottom',
			inner:true,
			data:{size:6},
		};
		return pageEdit.insertModule(this.getElement(), 'column', dropInfo);
	}
	calculateColumnSize()
	{
		var columns = this.getChildModules();

		var size = 12;
		if(columns.length){
			size /= columns.length;
			size = parseInt(size);
		}
		for(var i in columns){
			columns[i].setColumnSize(size);
		}
	}
}
module.exports = {
	
	default: box
}