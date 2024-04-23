export default function($scope,communication,$state, $uploader, API) {
	"ngInject";
	$scope.data = {};
	$scope.isNew = true;
	API.all("theme_category").getList().then(function(json) {
		$scope.themes_categories = angular.copy(json);
	});
	$scope.submit = function() {
		API.all('template').post($scope.data).then(function(json)
		{
			if(json == 1) {
				$state.go("templates.list", {}, { reload: true });
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
	$scope.upload = function()
	{
		var uploader = new $uploader({
			url: getApiPath('uploadTemplate'),
			multipart_params:$scope.data,
			onError: function(params)
			{
				console.log(params);
			},
			onUploadComplete : function()
			{
				var new_template = params.files[0].response.result;
				communication.removeList('templates');
				$state.go("templates.edit", {id:new_template}, { reload: true });
				//$scope.replace_screenshot_count = ($scope.replace_screenshot_count || 0) + 1;
				//$scope.$apply();
			}
		});
		uploader.start();
	}
	
}