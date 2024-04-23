export default function($scope,communication, $state) {
	"ngInject";
	$scope.data = {};
	$scope.errors = {};
	$scope.themes = [];
	communication.getList('themes').then(function(json)
	{
		$scope.themes = json;
	});

	$scope.submit = function() {
		communication.api("addSite", $scope.data).then(function(json)
		{
			if(json == 1) {
				communication.removeList('pages');
				$state.go("pages.list", {}, { reload: true });
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
}