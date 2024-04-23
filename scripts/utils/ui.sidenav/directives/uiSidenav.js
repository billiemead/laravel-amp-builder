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
		controller: 'uiSidenavController',
		templateUrl: function(elem,attrs) {
			return attrs.templateUrl || 'template/tabs/uiSidenav.html';
		},
		link: function(scope, element, attrs) {
		},
	};
}