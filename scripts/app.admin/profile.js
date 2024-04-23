export default function($scope,$state, $stateParams) {
	"ngInject";
	communication.api("getProfile", {id:$stateParams.id}).then(function(json) {
		
		$scope.data = json;
	});
	communication.getList("profile_subscriptions").then(function(json) {
		$scope.subscriptions = json;
	});
	$scope.changePassword = function() {
		communication.api("changePassword", {old_password:$scope.old_password, new_password:$scope.new_password}).then(function(json)
		{
			if(json == 1) {
				//communication.removeList('users');
				//$state.go("users");
				$scope.changePassword_success = ["Password updated."];
				delete $scope.changePassword_errors;
			}
			else {
				$scope.changePassword_errors = json;
				delete $scope.changePassword_success;
			}
			
		});
	}
	$scope.save = function() {
		communication.api("updateUser", $scope.data).then(function(json)
		{
			if(json == 1) {
				$scope.changeInfo_success = ["Information updated."];
				delete $scope.errors;
			}
			else {
				$scope.errors = json;
				delete $scope.changeInfo_success;
			}
			
		});
	}
}