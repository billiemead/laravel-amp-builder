export default function($scope,API,$state, $stateParams, $filter, $dialog) {
	"ngInject";
	$scope.isNew = false;
	
	$scope.data = {};
	$scope.data.permissions = {};
	API.service('role').get('').then(function(json)
	{
		$scope.roles = angular.copy(json);
		refreshPermission();
	});
	
	API.one('user', $stateParams.id).get().then(function(json) {
		$scope.data = $.extend({}, $scope.data, json);
		refreshPermission();
		delete $scope.data.password;
	});
	function refreshPermission()
	{
		if(!$scope.roles)	return;
		for(var i in $scope.roles){
			$scope.data.permissions[$scope.roles[i].id] = false; 
		}
		if(!$scope.data.roles)	return;
		for(var i in $scope.data.roles){
			$scope.data.permissions[$scope.data.roles[i].id] = true; 
		}
	}
	$scope.submit = function() {
		var data = angular.copy($scope.data);
		if(typeof(data.expire_at) == 'object'){
			data.expire_at = $filter('date')(data.expire_at,'yyyy-MM-dd');
		}
		var user = API.restangularizeElement('', data, 'user');
		user.put().then(function(json)
		{
			if(json == 1) {
				//$state.go("users.list");
				$dialog.message({
					title:window.t('record_save_successful_title'),
					message:window.t('record_save_successful_message')
				});
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
}