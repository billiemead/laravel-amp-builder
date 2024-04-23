export default function($scope,API, $dialog, popup, safeApply) {
	"ngInject";
	API.service('page').getList().then(function(json) {
		$scope.pages = json;
	});
	$scope.deleteSite = function(index)
	{
		$dialog.confirm({
			title: window.t("delete_site_title"),
			message: window.t("delete_site_message")
		})
		.result.then(function()
		{
			API.one('page', $scope.pages[index].id).remove().then(function(json) {
				if(json == 1) {
					$scope.pages.splice(index, 1);
				}
				else {
					$dialog.message({title:'Error',message:json});
				}
			});
		});
	}
	
}