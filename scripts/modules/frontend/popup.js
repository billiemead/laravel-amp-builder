var base = require('./base').default;

var template = require('./template').default;
var mx = require('mixwith');

class popup extends mx.mix(base).with(template){
	loadElement(element)
	{
		super.loadElement(element);
		if(this.module_data.fonts){
			this.loadFonts(this.module_data.fonts)
		}
		this.initModules();
	}
	loadFonts(fonts)
	{
		pageEdit.webFontLoad(fonts)
	}
	initModules()
	{
		var that = this;
		this.getElement().children('.container').children('.' + this.getDefaultClass()).each(function(i)
		{
			var moduleInstance = pageEdit.createModule(this);
			if(!moduleInstance)
			{
				return;
			}
			
		});
	}
	setData(data, updateView)
	{
		this.data = data;
	}
	setPopupType(type){
		this.data.popup_type = type;
		this.getElement().attr('popup-type', type);
	}
	setPopupName(name){
		this.data.popup_name = name;
		this.getElement().attr('popup-name', name);
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
	
	getContainer()
	{
		return this.getElement().children('.container');
	}
	createInsertPlacement(type, attributes, dropInfo)
	{
		var new_section_holder = $('<div/>');
		if(attributes != undefined && !$.isArray(attributes)){
			new_section_holder = $('<div ' + attributes + '></div>');
		}
		var id = pageEdit.getUniqueId('popup-');
		var id = dropInfo.element_identifier;
		new_section_holder.attr('id', id);
		new_section_holder.addClass('popup-section');
		new_section_holder.addClass(type);
		new_section_holder.attr('data-type', this.type);
		
		var popup_container = $('#popup-container');
		if(popup_container.length == 0){
			popup_container = $('<div id="popup-container"></div>');
			$('body').append(popup_container);
		}
		popup_container.append(new_section_holder);
		return new_section_holder;
	}
	getContainer()
	{
		return this.getElement().children('.container');
	}
	
	getVisibility()
	{
		return this.getCurrentVisibility();
	}
	changeResolution(newResolution)
	{
		this.getElement().css({width:'', height:''});
		var offset = this.getOffset(newResolution);
		if(offset != undefined){
			for(var i in offset){
				this.getElement().css(i, offset[i] + 'px');
			}
		}
		if(this.getCurrentResolution() != newResolution){
			this.getElement().triggerHandler('changeResolution');
		}
		this.currentResolution = newResolution;
	}
	getOffset(mode)
	{
		var rs;
		if(mode == 'all'){
			rs = this.offsets;
		}
		else if(mode == undefined){
			mode = this.getCurrentResolution();
			if(this.offsets[mode])
				rs = this.offsets[mode]; 
		}
		else if(this.offsets && this.offsets[mode] != undefined){
			rs = this.offsets[mode]
		}
		return rs;
		
	}
	getContainer()
	{
		return this.getElement().children('.container');
	}
	getContainerSize(mode = 'desktop')
	{
		var offset = this.getOffset(mode);
		if(offset && offset.width)
			return offset.width;
		var bodyModule = pageEdit.getModule($('body'));
		var resolution = bodyModule.getResolution(mode);
		if(resolution)
			return resolution.popup_size;
		if(mode == this.getCurrentResolution())
		{
			return this.getContainer().width();
		}
		return 0;
	}
}
module.exports = {
	
	default: popup
}