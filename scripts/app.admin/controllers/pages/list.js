export default function($scope, $dialog, API) {
	"ngInject";
	$scope.gridInstance = {};
	$scope.deleteSite = function(id) {
		$dialog.confirm({
			title: window.t("remove_record_title"),
			message: window.t("remove_record_message"),
		})
		.result.then(function(result){
			API.one('site', id).remove().then(function(json) {
				if(json == 1) {
					$scope.gridInstance.instance.reloadData();
				}
				else {
					$dialog.message({title:'Error',message:json});
				}
			});
		});
	}
}