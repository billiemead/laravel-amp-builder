var base = require('./base').default;
export default createModuleDefinition([base], function($window) 
{
	"ngInject";
	this.initializeData =
	{
		src:'http://google.com.vn'
	};
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.updateIframe = function()
		{
			$moduleInstance.getModuleTemplate().then(function(template)
			{
				$moduleInstance.getElement().html(template);
			});
		}
	};
});