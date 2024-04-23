(function () { "use strict";
angular.module('ui.popup')
.service('popup_pagehistory', function(API,popup, $dialog)
{
	"ngInject";
	this.open = function(opt)
	{
		return popup.open(
		{
			name:'pagehistory',
			controller: function($scope)
			{
				"ngInject";
				$scope.page_list = [];
				API.all("page_history").getList().then(function(json) {
					$scope.page_list = angular.copy(json);
				});
				$scope.revert = function(item)
				{
					$dialog.confirm({
						message: window.t("Are you sure"),
					})
					.result.then(function(result){
						API.service("page_history/revert").post(item).then(function(json) {
							location.reload()
						});
					});
					
				}
				$scope.delete = function(item)
				{
					$dialog.confirm({
						message: window.t("Are you sure"),
					})
					.result.then(function(result){
						API.one("page_history", item.id).remove().then(function(json) {
							var index = $scope.page_list.indexOf(item)
							$scope.page_list.splice(index, 1)
						});
					});
					
				}
				$scope.converDate = function(date)
				{
					var date = new Date(date);
					return date.toLocaleString();
				}
			},
		});
	}
})
}());