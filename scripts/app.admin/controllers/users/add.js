export default function($scope,API,$state, $stateParams, $filter) {
	"ngInject";
	$scope.isNew = true;
	$scope.data = {};
	$scope.data.permissions = {};
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
	
	API.service('role').get('').then(function(json)
	{
		$scope.roles = angular.copy(json);
		refreshPermission();
	});
	
	$scope.submit = function() {
		var data = angular.copy($scope.data);
		if(typeof(data.expire_at) == 'object'){
			data.expire_at = $filter('date')(data.expire_at,'yyyy-MM-dd');
		}
		var user = API.restangularizeElement('', data, 'user');
		user.post().then(function(json)
		{
			if(json == 1) {
				$state.go('users.list', {reload:true});
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
}