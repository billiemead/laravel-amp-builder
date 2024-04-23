angular.module('ui.popup')
.service('popup_link', function(popup, pageEdit_event)
{
	this.open = function(data)
	{
		return popup.open({
			hasBackdrop:false,
			name:'link',
			controller: function($scope, $modalInstance,communication)
			{
				"ngInject";
				$scope.data = data || {};
				
				$scope.ok = function () {
					$modalInstance.close($scope.data);
				};
				
			}
		});
	}
});