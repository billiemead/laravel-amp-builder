export default function($scope,API, $dialog, popup, safeApply) {
	"ngInject";
	
	$scope.delete = function(index)
	{
		$dialog.confirm({
			title: window.t("delete_integration_title"),
			message: window.t("delete_integration_message")
		})
		.result.then(function()
		{
			API.one('integration', $scope.integrations[index].id).remove().then(function(json) {
				if(json == 1) {
					$scope.integrations.splice(index, 1);
				}
				else {
					$dialog.message({title:'Error',message:json});
				}
			});
		});
	}
	
}