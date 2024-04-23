var base = require('./box').default;
var resolutionFunc = require('../../utils/resolution')

class box extends base{
	insertCompleted()
	{
		var size = this.data.size;
		
		if(size != undefined)
			this.getElement().addClass('col-' + size);
		else{
			var row = this.getParentModule();
			if(row){
				row.calculateColumnSize();
			}
		}
	}
	setColumnSize(size)
	{
		var currentBreakpoint = this.getCurrentResolution();
		var info = resolutionFunc.getBreakpointInfo(currentBreakpoint);
		if(info){
			var alias = info['column-alias'];
			var max_size = info['columns'] * 1;
			for(var i = 1;i <= max_size;i++)
				this.getElement().removeClass(alias + i);
			this.getElement().addClass(alias + size);
			this.data.sizes = this.data.sizes || {};
			if($.isArray(this.data.sizes)){
				this.data.sizes = {};
			}
			this.data.sizes[currentBreakpoint] = size;
			if(resolutionFunc.isDefaultBreakpoint(currentBreakpoint))
				this.data.size = size;
		}
		
	}
	getColumnSize()
	{
		var currentBreakpoint = this.getCurrentResolution();
	//	if(resolutionFunc.isDefaultBreakpoint(currentBreakpoint))
		//	return this.data.size;
		if(this.data.sizes && this.data.sizes[currentBreakpoint])
			return this.data.sizes[currentBreakpoint];
		return this.data.size;
	}
}
module.exports = {
	
	default: box
}