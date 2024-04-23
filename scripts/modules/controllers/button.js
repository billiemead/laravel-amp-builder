var base = require('./base').default;
var texteditor = require('./base_texteditor').default;
var base_button = require('./base_button').default;
var base_structure = require('./base_structure').default;


export default createModuleDefinition([base, base_structure, base_button, texteditor], function($file_manager,$dialog, safeApply, pageEdit, pageEdit_layout) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'click_action', 'text', 'text-shadow', 'border', 'background', 'button_hover'];
	this.loadElement = function(element)
	{
		this.__callSuper('loadElement', element);
		this.getElement().attr('href', 'javascript:void(0);');
	}
	this.getStructure = function(){
		var structure = this.__call('getStructure');
		structure.contents = this.getContents();
		return structure;
	}
	
});
