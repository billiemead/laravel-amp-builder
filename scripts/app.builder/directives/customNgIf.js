var slice = [].slice;
var ngIfDirective = ['$animate', function($animate) {
	return {
		require:'^editorTabs',
		restrict: 'A',
		scope:true,
		link: function($scope, $element, $attr, ctrl) {
			var parent = $element.parent();
			
			$scope.hide = function()
			{
				$element.detach();
			}
			
			$scope.show = function()
			{
				parent.append($element);
			}
			$scope.hideTab = function()
			{
				$element.hide();
			}
			$scope.showTab = function()
			{
				$element.show();
			}
			ctrl.addTab($attr.tabName, $scope);
			$scope.$watch($attr.customNgIf, function(value, oldvalue){
				if(value == false)
					$scope.hideTab();
				else if(value == true)
					$scope.showTab();
			});
		}
	};
}];
export default ngIfDirective;