export default function() {
	"ngInject";
	return {
		restrict: 'E',
		transclude: true,
		//replace: true,
		scope: {
		  hide: '@',
		},
		controller: 'uiTabsetController',
		templateUrl: function(elem,attrs) {
			
			return attrs.templateUrl || 'template/tabs/uiTabset.html';
		}
	
	};
}