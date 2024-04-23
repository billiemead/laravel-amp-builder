export default function($scope,popup, $dialog, API) {
	"ngInject";
	
	$scope.gridInstance = {};
	$scope.deleteTemplate = function(id) {
		$dialog.confirm({
			title: window.t("remove_record_title"),
			message: window.t("remove_record_message"),
		}).result.then(function(result){
			if(result == 1) {
				API.one('template', id).remove().then(function(json)
				{
					if(json == 1) {
						$scope.gridInstance.instance.reloadData();
					}
					else {
						$scope.errors = json;
					}
					
				});
				
			}
		});
	}
	API.all("theme_category").getList().then(function(json) {
		$scope.themes_categories = angular.copy(json);
	});
	$scope.cloneTemplate = function(id) {
		API.service('template/clone').get(id).then(function(json)
		{
			if(json == 1) {
				$scope.gridInstance.instance.reloadData();
			}
			else {
				$scope.errors = json;
			}
			
		});
	}
	$scope.startUploadTemplate = function(id) {
		var parentScope = $scope;
		popup.open({
			name:'upload_template',
			controller: function($modalInstance, $scope){
				"ngInject";
				$scope.uploaded_templates = [];
				$scope.uploaded = false;
				$scope.upload_options = {
					url:getApiPath() + '/template/upload',
					multi_selection: true,
					extensions:['template', 'zip'],
					onFileUploaded: function(response)
					{
						var file = response.file.response.info.result;
						if($.isArray(file)){
							for(var i in file){
								$scope.uploaded_templates.push(file[i]);
							}
						}
						else
							$scope.uploaded_templates.push(file);
						
					},
					onUploadComplete: function()
					{
						$scope.uploaded = true;
						parentScope.gridInstance.instance.reloadData();
					},
					onError: function(response){
						var error = response.error;
						$dialog.message({
							title: error.message,
							message: error.response
						});
					}
				}
			}
		});
	}
	
}