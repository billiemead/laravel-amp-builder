module.exports =	
{
	name:'integration/mail',
	controller: function($scope,$modalInstance, $dialog, popupParams, communication)
	{
		"ngInject";
		$scope.data = $scope.data || {};
		
		$scope.ok = function()
		{
			if ($scope.form.$valid) {
				$modalInstance.close($scope.data);
			}
		}
	},
}