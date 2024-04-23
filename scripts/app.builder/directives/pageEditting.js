var colorController = require('../controllers/colors').default;
var pageController = require('../controllers/page').default;

export default function($window, pageEdit_ddManager, pageEdit_layout, $controller)
{
	"ngInject";
	return {
		//template: require('../../float_modules/templates/page.tmpl'),
		link: function(scope, element, attrs)
		{
		},
		controller: function($scope){
			"ngInject";
			//$controller(colorController, {$scope: $scope});
			//$controller(pageController, {$scope: $scope});
		}
	}
}
