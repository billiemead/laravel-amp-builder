var base = require('./base').default;
var structure = require('./base_structure').default;
var template = require('./base_template').default;

var templates = require.context('../templates', true, /^\.\/.*\.tmpl$/);
var base_page = require('./base_page').default;
var section = require('./section').default;
var popup = require('./popup').default;

export default createModuleDefinition([base, section, base_page, structure, template, popup], function($window, $dialog,popup,$controller,pageEdit,pageEdit_event,pageEdit_layout,pageEdit_modules,pageEdit_function, $timeout) 
{
	"ngInject";
	this.controller = function($scope, $moduleInstance){
		"ngInject";
		$scope.delete = function()
		{
			
		}
	}
});