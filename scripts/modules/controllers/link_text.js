var base = require('./base').default;
var texteditor = require('./base_texteditor').default;
var base_button = require('./base_button').default;
var base_structure = require('./base_structure').default;
var link_block = require('./base_linkblock').default;

export default createModuleDefinition([base, base_structure, base_button, texteditor, link_block], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.controlIcons = false;
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
	};
	
	this.loadElement = function(element)
	{
		this.__callSuper('loadElement', element);
		jQuery_iframe(element).on('click', function(event)
		{
			event.preventDefault();
		})
	}
	this.registerKeydownEvent = function(focus)
	{
		this.__callSuper('registerKeydownEvent', focus);
		
	}
});