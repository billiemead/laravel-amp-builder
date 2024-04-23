export default function($scope,communication,$state, $stateParams,$file_manager) {
	"ngInject";
	communication.api("getPost", {id:$stateParams.id}).then(function(json) {
		$scope.data = json;
	});
	
	
	$scope.save = function() {
		communication.api("updatePost", $scope.data).then(function(json)
		{
			if(json == 1) {
				communication.removeList('posts');
				$state.go("posts.list");
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
}