var base = require('./base').default;
var form_element = require('./form_element').default;

var dropdown = require('./dropdown').default;
export default createModuleDefinition([base, dropdown, form_element], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
	}
});