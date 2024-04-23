var base = require('./base').default;
var resolutionFunc = require('../../utils/resolution')

class section extends base{
	loadElement(element){
		this.data = this._getDataFromElement(false);
		if(this.data.fonts){
			this.loadFonts(this.data.fonts)
		}
		this.initModules();
		this.initResponsive();
		//AMP.setLogLevel(4);
	}
	populateData(data)
	{
		
	}
	addCustomBreakpoint(data)
	{
		this.custom_breakpoints = this.custom_breakpoints || {};
		if(data.name)
		{
			this.custom_breakpoints[data.name] = data;
		}
	}
	getCustomBreakpoint(name)
	{
		this.custom_breakpoints = this.custom_breakpoints || {};
		if(name != undefined && this.custom_breakpoints[name] != undefined)
		{
			return this.custom_breakpoints[data.name];
		}
		else if(name == undefined)
			return this.custom_breakpoints;
	}
	loadFonts(fonts)
	{
		pageEdit.webFontLoad(fonts)
	}
	_getDataFromElement(remove = true)
	{
		var dataDiv = $('script[type="text/json"]#body_data');
		var dataString = dataDiv.html();
		var data = {}
		try
		{
			data = $.parseJSON(unescape(dataString));
			data = $.extend({},true,data);
		}
		catch(e)
		{
		}
		if(remove)
			dataDiv.remove();
		return data;
	}
	
	initModules(t){
		
		var section_elements = $('body > #main_sections').children("section.section");
		section_elements.each(function()
		{
			pageEdit.createModule(this);
		});
	
		var section_elements = $('body > #popup-container').children(".popup-section");
		section_elements.each(function()
		{
			pageEdit.createModule(this);
		});
	}
	getResolution(name)
	{
		if(name != undefined)
			return resolutionFunc.getBreakpointInfo(name);
		return resolutionFunc.getBreakpointList(true);
		
	}
	isFullyResponsive()
	{
		var desktop = this.getResolution('desktop');
		if(desktop && desktop.responsive)
			return true;
		return false;
	}
	createColumnClass(resolution, prefix)
	{
		var css = "";
		var column_size = resolution['columns'] * 1;
		var column_alias = resolution['column-alias'];
		for(var i = 1;i <= column_size;i++){
			var class_name = prefix + ' .' + column_alias + i;
			css += class_name + '{';
			css += 'width:' + (i/column_size) * 100 + '%';
			css += '}';
		}
		return css;
	}
	refreshResponsiveStyle(resolutions)
	{
		if(!resolutions)
			return;
		var style = "";
		for(var i in resolutions)
		{
			var resolution = resolutions[i];
			var css = '';
			var prefix = "";
			if(!resolution.default){
				prefix = 'html[mode="' + i + '"] ';
			}
			
			css += prefix + 'section .container {';
			var container_size = resolution.editting_container_size || resolution.container_size;
			if(window.isNumber(container_size))
				container_size += 'px';
			css += 'width:' + container_size;
			css += '}';
			
			css += prefix + 'div.popup-section {';
			var popup_size = resolution.popup_size
			if(window.isNumber(popup_size))
				popup_size += 'px';
			css += 'width:' + popup_size;
			css += '}';
			css += this.createColumnClass(resolution, prefix);
			style += css;
		}
		var styleElement = $('style#responsive_screens');
		if(!styleElement.length){
			styleElement = $('<style id="responsive_screens"></style>');
			$('head').append(styleElement);
		}
		styleElement.html(style);
	}
	initResponsive(){
		var resolutions = this.getResolution();
		this.refreshResponsiveStyle(resolutions);
	}
	onChangeResolution(newResolution)
	{
		if(window.modules){
			for(var i in window.modules){
				if(window.modules[i] != this)
					window.modules[i].changeResolution(newResolution);
			}
		}
	}
	registerResponsiveResizeEvent()
	{
		var that = this;
		var sections = $('#main_sections').children('section.section');
		$(window).resize(function(event){
			var width = $(window).width();
			sections.each(function(i)
			{
				
				var module = pageEdit.getModule(this);
				if(module != undefined)
					module.resizeWidth(width);
			});
		})
	}
}
module.exports = {
	
	default: section
}