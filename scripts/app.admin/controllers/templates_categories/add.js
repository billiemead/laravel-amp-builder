export default function($scope,API,$state, $file_manager) {
	"ngInject";
	$scope.data = {
		page:1,
		section:1,
		popup:1
	};
	$scope.submit = function() {
		var api = API.restangularizeElement('', $scope.data, 'theme_category');
		api.post().then(function(json)
		{
			if(json == 1) {
				$state.go("templates_categories.list", {}, { reload: true });
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
	
	
}