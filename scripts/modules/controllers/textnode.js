var base = require('./base').default;
var button = require('./base_button').default;
var text = require('./text').default;

export default createModuleDefinition([base, button], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.tab_editor = ['offset', 'margin', 'text', 'text-shadow', 'border', 'background'];
	this.draggable = false;
	this.resizable = false;
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
	};
	this.getWidgetDisplayName = function()
	{
		return this.getElement()[0].nodeName;
	}
	this.loadContents = function()
	{
		var textNodes = this.getElement().contents();
		textNodes.each(function(){
			if(this.nodeType == 1)
				pageEdit_layout.createFloatModule(this, 'textnode');
		});
	}
	this.loadElement = function(element)
	{
		this._loadElement(element);
		this.loadContents();
	}
	this.inEditMode = function()
	{
		var rs = this.getParentModules();
		for(var i in rs){
			if(rs[i].inEditMode != undefined && rs[i].inEditMode())
				return true;
		}
		return false;
	}
	this.registerKeydownEvent = function(){}
	this.getEditorElement = function()
	{
		return this.getElement();
	}
	this.doSelect = function()
	{
		var element = this.getElement();
		element.trigger('click');
		console.log('doSelect', element);
	}
	this.canClick = function()
	{
		return !this.inEditMode();
	}
	this.canHover = function()
	{
		return !this.inEditMode();
	}
	this.getStructure = function(){
		var structure = this.__call('getStructure');
		structure.data = {};
		structure = $.extend(structure, {
			tag: this.getElement()[0].tagName,
			contents: this.getContents()
		});
		return structure;
	}
	this.getContents = function()
	{
		var textNodes = this.getEditorElement().contents();
		var rs = [];
		var that = this;
		if(textNodes.length){
			textNodes.each(function(){
				if(jQuery_iframe(this).attr('shadow') != undefined)
					return;
				var module = pageEdit_layout.getFloatModule(this);
				if(module)
					rs.push(module.getStructure());
				else{
					rs.push(this.nodeType == 3 ? that.escapeWhitespace(this.nodeValue) : this.outerHTML);
				}
			});
		}
		else{
			rs.push(this.getEditorElement().html());
		}
		return rs;
	}
});