module.exports =	
{
	name:'integration/activecampaign',
	controller: function($scope,$modalInstance, $dialog, popupParams, communication)
	{
		"ngInject";
		$scope.hasAccount = false;
		$scope.list = [];
		$scope.data = $scope.data || {};
		$scope.data.fields = {};
		var parentForm = popupParams.parentForm;
		$scope.fieldList = parentForm.getFieldList();
		$scope.custom_fields = [];
		$scope.refresh = function()
		{
			communication.api('getIntegrationAccount', {name:'activecampaign'}).then(function(json)
			{
				$scope.hasAccount = json.length > 0;
			});
			communication.api('getActiveCampaignList').then(function(json)
			{
				$scope.list = json.list;
				$scope.custom_fields = json.custom_fields;
			});
		}
		$scope.refresh();
		$scope.authorize = function()
		{
			communication.api('authorizeActiveCampaignAccount', {api_url:$scope.api_url, api_key:$scope.api_key}).then(function(json)
			{
				if($.isArray(json)){
					$scope.hasAccount = true;
					$scope.list = json.list;
					$scope.custom_fields = json.custom_fields;
				}
				else
					$dialog.message({
						title:'Error',
						message:json
					});
			});
		}
		
		$scope.ok = function()
		{
			if ($scope.form.$valid) {
				$modalInstance.close($scope.data);
			}
		}
	},
}