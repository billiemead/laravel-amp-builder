export default function($scope,API, $state, $stateParams) {
	"ngInject";
	API.service("user").get('').then(function(json) {
		$scope.data = json;
	});
	
	$scope.changePassword = function() {
		API.service('user/password').post({old_password:$scope.old_password, new_password:$scope.new_password}).then(function(json)
		{
			if(json == 1) {
				$scope.changePassword_success = ["Password updated."];
				delete $scope.changePassword_errors;
			}
			else {
				$scope.changePassword_errors = json;
				delete $scope.changePassword_success;
			}
			
		});
	}
	$scope.updateUser = function() {
		API.service('user').post($scope.data).then(function(json)
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