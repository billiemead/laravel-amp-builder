(function () { "use strict";
angular.module('ui.popup')
.service('popup_module_options', ['communication','popup_form','$templateCache','popup', 'pageEdit','$rootScope',function(communication,popup_form,$templateCache,popup, pageEdit, $rootScope)
{
	this.open = function(opt)
	{
		opt = opt || {};
		var that = this;
		return popup.open(
		{
			name:'module_option',
			data:opt.data,
			controller: function($scope,$modalInstance)
			{
				$scope.error = false;
				$scope.sections = {};
				if(window.siteInfo.sectionCategories != undefined){
					for(var i in window.siteInfo.sectionCategories){
						for(var j in window.siteInfo.sectionCategories[i]){
							$scope.sections[j] = window.siteInfo.sectionCategories[i][j];
						}
							
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
		
			},
			size:'lg',
		});
	}
}]);
}());