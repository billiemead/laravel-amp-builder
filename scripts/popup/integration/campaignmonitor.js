module.exports =	
{
	name:'integration/campaignmonitor',
	controller: function($scope,$modalInstance, $dialog, popupParams, communication)
	{
		"ngInject";
		$scope.hasAccount = false;
		$scope.list = [];
		$scope.data = $scope.data || {};
		$scope.data.fields = {};
		var parentForm = popupParams.parentForm;
		$scope.fieldList = parentForm.getFieldList();
		$scope.refresh = function()
		{
			communication.api('getIntegrationAccount', {name:'campaignmonitor'}).then(function(json)
			{
				$scope.hasAccount = json.length > 0;
			});
			communication.api('getCampaignMonitorList').then(function(json)
			{
				$scope.list = json;
			});
		}
		$scope.refresh();
		$scope.authorize = function()
		{
			communication.api('authorizeCampaignMonitorAccount', {key:$scope.api, client_id:$scope.client_id}).then(function(json)
			{
				if($.isArray(json)){
					$scope.hasAccount = true;
					$scope.list = json;
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