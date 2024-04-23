export default function($scope,API,$state, $stateParams,$file_manager) {
	"ngInject";
	API.one("theme_category", $stateParams.id).get().then(function(json) {
		$scope.data = json;
	});
	$scope.submit = function() {
		var api = API.restangularizeElement('', $scope.data, 'theme_category');
		api.put().then(function(json)
		{console.log('response data ', json);
			if(json == 1) {
				$state.go("templates_categories.list", {}, { reload: true });
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
}