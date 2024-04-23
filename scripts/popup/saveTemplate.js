(function () { "use strict";
angular.module('ui.popup')
.service('popup_save_template', function(popup, API)
{
	"ngInject";
	this.open = function(opt)
	{
		opt = opt || {};
		var that = this;
		return popup.open(
		{
			name:'saveTemplate',
			data:opt.data,
			controller: function($scope, $modalInstance, $controller)
			{
				"ngInject";
				API.service('theme_categories').getList().then(function(json)
				{
					$scope.theme_categories = json;
				});
				$scope.ok = function()
				{
					$modalInstance.close($scope.data);
				}
				
			},
		});
	}
});
}());