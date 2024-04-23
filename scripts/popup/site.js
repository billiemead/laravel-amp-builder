(function () { "use strict";
angular.module('ui.popup')
.service('popup_site', ['popup_form',function(popup_form)
{
	this.open = function()
	{
		return popup_form.open({
			name:'site',
			//size:'sm',
			controller: function($scope, $modalInstance,communication)
			{
				$scope.data = {};
				$scope.save = function() {
					communication.api('addSite', $scope.data);
				}
			}
		});
	}
}]);
}());