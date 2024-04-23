(function () { "use strict";
angular.module('ui.popup')
.service('popup_section', function(communication,popup_form,$templateCache,popup, pageEdit, $rootScope)
{
	"ngInject";
	this.open = function(opt)
	{
		opt = opt || {};
		var that = this;
		return popup.open(
		{
			name:'section',
			data:opt.data,
			controller: function($scope, $modalInstance, $controller)
			{
				"ngInject";
				$scope.error = false;
				$scope.categories = [];
				if(window.siteInfo.sectionCategories != undefined){
					for(var i in window.siteInfo.sectionCategories){
						$scope.categories.push(i);
					}
				}
				$scope.data = opt.data || {
					html:'',
					css:''
				} ;
				
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