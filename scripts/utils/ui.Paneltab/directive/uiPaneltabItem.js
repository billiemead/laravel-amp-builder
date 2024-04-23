export default function($parse,$controller,communication,$compile,$state) {
	"ngInject";
	return {
		require: '^uiPaneltab',
		restrict: 'E',
		replace: true,
		templateUrl: 'template/tabs/uiPaneltabItem.html',
		transclude: true,
		scope: {
		  active: '=?',
		  heading: '@',
		  label: '@',
		  headingIcon: '@',
		  onSelect: '&select', //This callback is called in contentHeadingTransclude
							  //once it inserts the tab's content into the dom
		  onDeselect: '&deselect',
		  url:'@templateUrl',
		  hide:'@'
		},
		controller: function($scope)
		{
			"ngInject";
		},
		compile: function(elm, attrs, transclude) {
			return function postLink(scope, elm, attrs, uiTabsetCtrl, $state) {
				scope.changed = false;
				scope.$watch('active', function(active) {
					if (active) {
						uiTabsetCtrl.select(scope);
					}
				});
				scope.disabled = false;
				if ( attrs.disabled ) {
					scope.$parent.$watch($parse(attrs.disabled), function(value) {
						scope.disabled = !! value;
					});
				}
				scope.select = function() {
					scope.active = true;
				};
				
				uiTabsetCtrl.addTab(scope, elm.next().length==0);
				scope.$on('$destroy', function() {
					uiTabsetCtrl.removeTab(scope);
				});
				scope.$transcludeFn = transclude;
			};
		}
	};
}