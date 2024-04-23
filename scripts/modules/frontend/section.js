var base = require('./box').default;
var pageEdit = require('../../utils/pagemanager.iframe/pageEdit_front');
var template = require('./template').default;
var mx = require('mixwith');
class section extends mx.mix(base).with(template){
	loadElement(element)
	{
		super.loadElement(element);
		var data = this.module_data;
		if(data && data.fonts){
			this.loadFonts(data.fonts)
		}
	}
	loadFonts(fonts)
	{
		pageEdit.webFontLoad(fonts)
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
	
	loadOffsets(offset)
	{
		
	}
	setOffsets(offset)
	{
		
	}
	getResponsiveOffset(mode)
	{
		var offset = this.getHeightOffset();
		if(offset[mode])
			return {height:offset[mode]};
		return {height:this.getElement().outerHeight()};
	}
	
	getHeightOffset()
	{
		
	}
	getCloneData()
	{
		var rs = super.getCloneData();
		delete rs.offset;
		return rs;
		
	}
	
	getContainer()
	{
		return this.getElement().children('.container');
	}
	getContainerSize(mode = 'desktop')
	{
		var bodyModule = pageEdit.getModule($('body'));
		var resolution = bodyModule.getResolution(mode);
		if(resolution)
			return resolution.container_size;
		if(mode == this.getCurrentResolution())
		{
			return this.getContainer().width();
		}
		return 0;
	}
	isVisibleOnScreen()
	{
		var element = this.getElement();
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();

		var elemTop = element.offset().top;
		var elemBottom = elemTop + element.height();

		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}
}
module.exports = {
	
	default: section
}