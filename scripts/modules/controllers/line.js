var base = require('./base').default;


export default createModuleDefinition([base], function($window) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'line'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		
	};
})