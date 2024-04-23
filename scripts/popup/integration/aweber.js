module.exports =	
{
	name:'integration/aweber',
	controller: function($scope,$modalInstance, $dialog, popupParams, communication)
	{
		"ngInject";
		$scope.accounts = [];
		$scope.list = [];
		$scope.data = $scope.data || {};
		$scope.data.fields = {custom_fields:[]};
		var parentForm = popupParams.parentForm;
		$scope.fieldList = parentForm.getFieldList();
		$scope.refresh = function()
		{
			communication.api('getIntegrationAccount', {name:'aweber'}).then(function(json)
			{
				$scope.accounts = json;
			});
			communication.api('getAweberList').then(function(json)
			{
				$scope.list = json;
			});
		}
		$scope.refresh();
		$scope.openOauthDialog = function()
		{
			var url = window.basePath + "auth/integration/aweber";
			var popup = window.open(url);
			window.integration_completed = function()
			{
				popup.close();
				window.focus();  
				$scope.refresh();
			}
		}
		$scope.custom_fields = [];
		$scope.changeList = function(index)
		{
			var list = $scope.data.list[index];
			console.log(list);
			if(!list)	return;
			$scope.custom_fields = list.custom_fields;
		}
		$scope.ok = function()
		{
			if ($scope.form.$valid) {
				$modalInstance.close($scope.data);
			}
		}
	},
}