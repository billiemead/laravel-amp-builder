module.exports =	
{
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
		$scope.openOauthDialog = function()
		{
			var providerInfo = popupParams.providerInfo;
			var url = providerInfo.authorizeDialogUrl;//window.basePath + "auth/integration/mailchimp";
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