export default function($parse,$controller,communication,$compile,$state) {
	"ngInject";
	return {
		require: '^uiSidenav',
		restrict: 'E',
		replace: true,
		templateUrl: 'template/tabs/uiNavItem.html',
		transclude: true,
		scope: {
			active: '=?',
			heading: '@',
			headingIcon: '@',
			onSelect: '&select', 
			onDeselect: '&deselect',
			url:'@url'
		},
		controller: 'uiNavItemController',
		compile: function(elm, attrs, transclude) {
			return function postLink(scope, elm, attrs, uiSidenavCtrl) {
				scope.changed= false;
				scope.$watch('active', function(active) {
					if (active) {
						uiSidenavCtrl.select(scope);
					}
				});
				scope.disabled = false;
				if ( attrs.disabled ) {
					scope.$parent.$watch($parse(attrs.disabled), function(value) {
						scope.disabled = !! value;
					});
				}
				scope.path = scope.url.replace(/\//g,'.');
				scope.select = function() {
				};
				var templateCtrl, templateScope;
				uiSidenavCtrl.addTab(scope, elm.next().length==0);
				scope.$on('$destroy', function() {
					uiSidenavCtrl.removeTab(scope);
				});
				scope.$transcludeFn = transclude;
			};
		}
	};
}