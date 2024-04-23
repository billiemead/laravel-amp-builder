module.exports =	
{
	name:'integration/infusionsoft',
	controller: function($scope,$modalInstance, $dialog, popupParams, communication)
	{
		"ngInject";
		$scope.accounts = [];
		$scope.list = [];
		$scope.data = $scope.data || {};
		$scope.data.fields = {};
		var parentForm = popupParams.parentForm;
		$scope.fieldList = parentForm.getFieldList();
		$scope.refresh = function()
		{
			communication.api('getIntegrationAccount', {name:'infusionsoft'}).then(function(json)
			{
				$scope.accounts = json;
			});
			/*communication.api('getInfusionSoftList').then(function(json)
			{
				$scope.list = json;
			});*/
		}
		$scope.refresh();
		$scope.openOauthDialog = function()
		{
			var url = window.basePath + "auth/integration/infusionsoft";
			var popup = window.open(url);
			window.integration_completed = function()
			{
				popup.close();
				$scope.refresh();
			}
		}
		$scope.ok = function()
		{
			if ($scope.form.$valid) {
				$modalInstance.close($scope.data);
			}
		}
	},
}