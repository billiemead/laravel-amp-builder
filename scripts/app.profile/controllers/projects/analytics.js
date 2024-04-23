export default function($scope, $state, $stateParams,$rootScope, $dialog, API, popup)
{
	"ngInject";
	$rootScope.site_id = $stateParams.id;
	$scope.site_id = $stateParams.id;
	$scope.data= {'startDate':moment().subtract(1,'months'), 'endDate':moment()};
	$scope.data.options = {
		opens: "left",
		eventHandlers: {
			"apply.daterangepicker": function(ev, picker){
				$rootScope.date = $scope.data.date;
				$rootScope.$broadcast('dateChanged');
			}
		}
	};
	$scope.changeData = function()
	{
		$rootScope.date = $scope.data;
		$rootScope.$broadcast('dateChanged');
	}
	$scope.setSelectLabel = function(label)
	{
		$scope.data.select_label = label;
	}
	$scope.clearData = function()
	{
		$dialog.confirm({
			title: window.t("delete_site_analytic"),
			message: window.t("delete_site_analytic_message")
		})
		.result.then(function()
		{
			API.service('page/clearAnalytic').post({id: $stateParams.id}).then(function(json){
				$scope.changeData()
			});
		});
		
	}
}