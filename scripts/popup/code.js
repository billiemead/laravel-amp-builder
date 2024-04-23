(function () { "use strict";
angular.module('ui.popup')
.service('popup_code',function(communication, $controller, popup)
{
	this.open = function(opt)
	{
		opt = opt || {};
		var that = this;
		return popup.open(
		{
			name:'code',
			data:opt.data,
			controller: function($scope,$modalInstance)
			{
				"ngInject";
				$scope.error = "";
				
				$scope.data = opt.data;
				$scope.mode = opt.mode ||'html';
				$scope.aceOption = {useWrapMode : true, theme:'twilight', mode: $scope.mode,
					onLoad: function (_ace) {
						$scope.ace = _ace;
					}
				};
				$scope.refresh = true;
				$scope.aceChanged = function(e) {
					$(window).trigger('resize');
				};
				$scope.ok = function()
				{
					$modalInstance.close($scope.data);
				}
				if(angular.isDefined(opt.controller))
				{
					$controller(opt.controller, {$scope:$scope, $modalInstance:$modalInstance});
				}
			},
			size:'lg',
		});
	}
});
}());