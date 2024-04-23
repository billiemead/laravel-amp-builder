export default function() {
	"ngInject";
	return {
		restrict: 'E',
		transclude: true,
		//replace: true,
		scope: {
		  hide: '@',
		  size:'@'
		},
		controller: 'uiPaneltabController',
		templateUrl: function(elem,attrs) {
			
			return attrs.templateUrl || 'template/tabs/uiPaneltab.html';
		}
	
	};
}