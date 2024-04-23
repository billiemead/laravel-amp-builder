export default function($scope,$state, $controller, API) {
	"ngInject";
	$scope.data = {
		is_active:1,
		type:'page'
	};
	$scope.isNew = true;
	$controller(require('./form').default, {$scope:$scope});
	API.all("theme_category").getList().then(function(json) {
		$scope.themes_categories = angular.copy(json);
	});
	$scope.submit = function() {
		API.all('template').post($scope.data).then(function(json)
		{
			if(json == 1) {
				$state.go("templates.list", {}, { reload: true });
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
	
	
}