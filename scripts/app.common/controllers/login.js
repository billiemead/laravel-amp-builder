export default function($location,$rootScope,$scope, communication)
{
	"ngInject";
	$scope.currentMenu = 'dashboard';
	function getCurrentMenu(name) {
		if(name != undefined){
			var path = name.split('.');
			if(path.length) {
				return path[0];
			}
			
		}
		return name;
	}
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		$scope.currentMenu = getCurrentMenu(toState.name);
	});
}