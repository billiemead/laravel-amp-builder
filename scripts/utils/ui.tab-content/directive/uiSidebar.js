export default function() {
	"ngInject";
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope: {
			type: '@',
			color: '@',
		},
		controller: 'uiTabsetController',
		templateUrl: 'template/tabs/uiSidebar.html',
		link: function(scope, element, attrs) {
			scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
			scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
		}
	};
}