var base = require('./base').default;
var base_structure = require('./base_structure').default;
var box = require('./box').default;
var form_element = require('./form_element').default;
var widgetFunc = require('../../utils/widget');

export default createModuleDefinition([base,base_structure, box, form_element], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
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
	this.isDropTarget = function(event, ui)
	{
		var form_fields = widgetFunc.getFormFields();
		if(ui.helper.module != undefined){
			var type = ui.helper.module.getType();
			return form_fields[type] != undefined;
		}
		return false;
	}
});