var base = require('./base').default;
var texteditor = require('./base_texteditor').default;
var structure = require('./base_structure').default;

export default createModuleDefinition([base, structure, texteditor], function(pageEdit, commonUtils, pageEdit_layout,pageEdit_event, $colorpalettepicker, $controller, $compile, pageEdit_undoManager, $rootScope, safeApply, popup_link, pageEdit_float_editor_button) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'text', 'text-shadow', 'border', 'background'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		
	};
	this.controlIcons = {
		'color':{'title':'Text Color', 'onclick':'changeColor', 'icon':'fa fa-font'},
		'background':{'title':'Background', 'onclick':'changeBackground', 'icon':'fa fa-fill'},
	};
	this.getData = function()
	{
		var data =  this.data || this.module_data || {};
		var t = this.getEditorElement();
		return {text:t.html() || data.text};
	};
	
	this.removeFontFamily = function(font)
	{
		this.__call('removeFontFamily', font);
		
	}
});