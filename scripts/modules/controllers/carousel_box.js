var base = require('./base').default;
var base_structure = require('./base_structure').default;
var box = require('./box').default;

export default createModuleDefinition([base,base_structure, box], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.initializeData =
	{
	};
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
	};
	this.loadElement = function(element)
	{
		this._loadElement(element);
		this.initFloatModules();
	};
	
	this.canDropTo = function(module)
	{
		return module && module.getType() == 'carousel';
	}
	this.checkInnerDrop = function(direction, info)
	{
		return true;
	}
	
});