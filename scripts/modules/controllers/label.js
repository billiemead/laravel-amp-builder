var base = require('./base').default;
var form_element = require('./form_element').default;
var button = require('./base_button').default;
var texteditor = require('./base_texteditor').default;
export default createModuleDefinition([base, button, texteditor, form_element], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'text', 'text-shadow', 'border', 'background'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		
	};
});