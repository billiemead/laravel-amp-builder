export default function($rootScope)
{
	"ngInject";
	return {
        restrict: 'EA',
        link: function ($scope, elem, iAttrs) {
			var el = angular.element(elem);
			el.hide();
			$rootScope.$on('app_ready', function(){
				console.log(elem);
				
			})
        }
	};
}