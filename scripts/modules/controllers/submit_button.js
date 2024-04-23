var base = require('./base').default;
var form_element = require('./form_element').default;
var button = require('./base_button').default;
var texteditor = require('./base_texteditor').default;
var base_structure = require('./base_structure').default;

export default createModuleDefinition([base, base_structure, button, texteditor, form_element], function($file_manager,$dialog, safeApply, pageEdit_layout) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'text', 'text-shadow', 'border', 'background', 'button_hover'];
	this.loadElement = function(element)
	{
		this.__callSuper('loadElement', element);
		this.getElement().attr('type', 'button');
		this.getElement().on('click', function(event)
		{
			event.preventDefault();
		})
	}
	this.controller = function($scope, $moduleInstance){
		"ngInject";
	}
});
