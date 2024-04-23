var resolution = require('../../utils/resolution');

export default function($scope, API, pageEdit_undoManager, safeApply, commonUtils, $moduleInstance)
{
	"ngInject";
	$scope.data = {};
	var resolutions = resolution.getBreakpointList(true);
	$scope.currentResponsiveMode = resolution.getDefaultBreakpoint();
	$scope.currentResolution = resolution.getBreakpointInfo($scope.currentResponsiveMode);
	$scope.$on('changeResolution', function()
	{
	});
	
	
}
  