var base = require('./base');
module.exports =	
{
	name:'integration/mailchimp',
	controller: function($scope,$modalInstance, $dialog, popupParams, communication, $controller)
	{
		"ngInject";
		$scope.integration_type = 'mailchimp';
		$controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
		$scope.accounts = [];
		$scope.list = [];
		$scope.data = $scope.data || {};
		$scope.data.fields = {};
		var parentForm = popupParams.parentForm;
		var providerInfo = popupParams.providerInfo;
		$scope.fieldList = parentForm.getFieldList();
		$scope.refresh = function()
		{
			communication.api('getIntegrationAccount', {name:'mailchimp'}).then(function(json)
			{
				$scope.accounts = json;
			});
			communication.api('getMailchimpList').then(function(json)
			{
				$scope.list = json;
			});
		}
		$scope.refresh();
		
	},
}