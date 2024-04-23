export default function($location,$rootScope,$scope, communication)
{
	"ngInject";
	$scope.currentMenu = 'dashboard';
	$scope.currentMenuPath = ['dashboard'];
	function getCurrentMenu(name) {
		if(name != undefined){
			var path = name.split('.');
			if(path.length) {
				return path[0];
			}
			
		}
		return name;
	}
	function getMenuPath(name) {
		if(name != undefined){
			var path = name.split('.');
			if(path.length) {
				return path;
			}
			
		}
		return [];
	}
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		$scope.currentMenu = getCurrentMenu(toState.name);
		$scope.currentMenuPath = getMenuPath(toState.name);
	});
}