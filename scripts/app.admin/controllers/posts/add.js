export default function($scope,communication,$state, $file_manager) {
	"ngInject";
	$scope.data = {};
	$scope.save = function() {
		communication.api("addPost", $scope.data).then(function(json)
		{
			if(json == 1) {
				communication.removeList('posts');
				$state.go("posts.list", {}, { reload: true });
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
}