export default function($parse,$controller,communication,$compile) {
	"ngInject";
	return {
		require: '^uiTabPane',
		controller: function($scope)
		{
			$scope.changed = false;
			this.changed = function()
			{
				$scope.uiTabPaneCtrl.changed();
			}
			this.unchanged = function()
			{
				$scope.uiTabPaneCtrl.unchanged();
			}
		},
		compile: function(elm, attrs, transclude) {
			return function postLink(scope, elm, attrs, uiTabPaneCtrl) {
				scope.uiTabPaneCtrl = uiTabPaneCtrl;
			}
		}
	}
}