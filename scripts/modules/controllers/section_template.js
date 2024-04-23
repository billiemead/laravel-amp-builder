var base = require('./base').default;
var Mustache = require('mustache');
var section = require('./section').default;

var base_structure = require('./base_structure').default;
var base_template = require('./base_template').default;

export default createModuleDefinition([base, base_structure, section, base_template], function($window, $dialog,popup,$controller,pageEdit,pageEdit_event,pageEdit_layout,pageEdit_modules,pageEdit_function, $timeout) 
{
	"ngInject";
	this.controller = function($scope, $moduleInstance){
		"ngInject";
	}
});