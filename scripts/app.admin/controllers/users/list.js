export default function($scope, API, $dialog) {
	"ngInject";
	$scope.gridInstance = {};
	API.service('role').get('').then(function(json)
	{
		$scope.roles = angular.copy(json);
	});
	$scope.deleteUser = function(id) {
		$dialog.confirm({
			title: window.t("LBL_DELETE_POST_CATEGORIES_TITLE"),
			message: window.t("LBL_DELETE_POST_CATEGORIES_MESSAGE"),
		}).result.then(function(result){
			if(result == 1) {
				API.one('user', id).remove().then(function(json)
				{
					if(json == 1) {
						$scope.gridInstance.instance.reloadData();
					}
					else {
						$scope.errors = json;
					}
					
				});
			}
		});;
	}
}