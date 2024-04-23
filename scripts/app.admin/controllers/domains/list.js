export default function($scope,popup, $dialog, API) {
	"ngInject";
	
	$scope.gridInstance = {};
	$scope.deleteTemplate = function(id) {
		$dialog.confirm({
			title: window.t("remove_record_title"),
			message: window.t("remove_record_message"),
		}).result.then(function(result){
			if(result == 1) {
				API.one('domain', id).remove().then(function(json)
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
	
	
}