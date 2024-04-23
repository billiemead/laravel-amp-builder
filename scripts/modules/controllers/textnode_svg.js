var base = require('./base').default;
var button = require('./button').default;
var textnode = require('./textnode').default;
var svg = require('./svg').default;

export default createModuleDefinition([base, textnode, svg], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.draggable = false;
	this.resizable = true;
	this.tab_editor = ['offset', 'margin', 'svg'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
	};
	
	this.canHover = function()
	{
		return !this.inEditMode();
	}
});