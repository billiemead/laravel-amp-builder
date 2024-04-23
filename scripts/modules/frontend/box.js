var pageEdit = require('../../utils/pagemanager.iframe/pageEdit_front');
var base = require('./base').default;
class box extends base{
	loadElement(element)
	{
		super.loadElement(element);
		this.initModules();
	}
	initModules()
	{
		var that = this;
		this.getContainer().children('.' + this.getDefaultClass()).each(function(i)
		{
			var moduleInstance = pageEdit.createModule(this);
			if(!moduleInstance)
			{
				return;
			}
			
		});
	}

	getChildModules()
	{
		var s = [];
		var that = this;
		this.getContainer().children('.' + this.getDefaultClass()).each(function(i)
		{
			var module = pageEdit.getModule(this);
			if(module != undefined){
				s.push(module);
			}
		});
		return s;
	}
	copyDataTo(new_element, newID = true)
	{
		var modules = this.getChildModules();
		for(var i in modules){
			var copiedElement = $(new_element).find('#' +modules[i].getPage_id() );
			if(copiedElement.length > 1)
			{
				copiedElement.each(function(){
					if($(this).attr('shadow') != undefined)
						$(this).remove();
				});
			}
			copiedElement.length && modules[i].copyDataTo(copiedElement[0], newID);
		}
		return super.copyDataTo(new_element, newID);
	
	}

	
	getContainer()
	{
		return this.getElement();
	}
	
}
module.exports = {
	
	default: box
}