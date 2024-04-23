var base = require('./base').default;

var line = require('./line').default;

export default createModuleDefinition([base, line], function($window) 
{
	"ngInject";
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		
	};
})