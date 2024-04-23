export default function($scope,API, $stateParams, $dialog, $controller) {
	"ngInject";
	$scope.data = {};
	API.one("template", $stateParams.id).get().then(function(json) {
		$scope.name = json.name;
		$scope.data = json;
	});
	$controller(require('./form').default, {$scope:$scope});
	$scope.submit = function() {
		var api = API.restangularizeElement('', $scope.data, 'template');
		api.put().then(function(json)
		{
			if(json == 1) {
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