export default function() {
	"ngInject";
	return {
		controller: function($scope)
		{
			"ngInject";
			this.changed = function()
			{
				$scope.changed = true;
				$scope.tab.changed = true;;
			}
			this.unchanged = function()
			{
				$scope.changed = false;
				$scope.tab.changed = false;
			}
		},
		link: function(scope, element, attrs) {
		}
	};
}