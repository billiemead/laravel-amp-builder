var base = require('./base').default;
var base_structure = require('./base_structure').default;
export default createModuleDefinition([base,base_structure], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.initializeData =
	{
	};
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
	};
	this.tab_editor = ['advance', 'offset', 'margin', 'flex_layout', 'border', 'text', 'background'];
	this.loadElement = function(element)
	{
		this._loadElement(element);
		this.initFloatModules();
	};
	
	this.initFloatModules = function()
	{
		var that = this;
		this.getElement().children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var moduleInstance = pageEdit_layout.createFloatModule(this);
			if(!moduleInstance)
			{
				return;
			}
			
		});
	}

	this.checkEmptyBox = function()
	{
		var element = this.getElement();
	
		if(element.children('.' + pageEdit_layout.module_class).length){
			element.removeClass('empty');
		}
		else
			element.addClass('empty');
	};
	
	this.getStructure = function()
	{
		var s = this._getStructure();
		s.modules = this.getFloatModule();
		return s;
	
	};
	this.getFloatModule = function()
	{
		var s = [];
		var that = this;
		this.getElement().children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var structure = that.getFloatModuleStructure(this);
			if(structure != undefined){
				s.push(structure);
			}
		});
		return s;
	}
	this.getChildModules = function()
	{
		var s = [];
		var that = this;
		this.getElement().children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var module = pageEdit.getFloatModule(this);
			if(module != undefined){
				s.push(module);
			}
		});
		return s;
	}
	this.getFloatModuleStructure = function(module)
	{
		var s = {};
		var moduleInstance = pageEdit.getFloatModule(module);
		if(!moduleInstance)
		{
			return;
		}
		return moduleInstance.getStructure();
	};
	
});