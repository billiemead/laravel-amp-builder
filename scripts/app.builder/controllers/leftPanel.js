export default function($scope, $rootScope,pageEdit, safeApply)
{
	"ngInject";
	$scope.resolution = 'desktop';
	$rootScope.$on('changeResolution', function(){
		$scope.resolution = pageEdit.getCurrentResolution();
		safeApply($scope);
	});
}