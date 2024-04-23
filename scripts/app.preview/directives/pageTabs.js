var widgetFunction = require('../../app.builder/directives/widgetModule');

export default function($rootScope, API, safeApply)
{
	"ngInject";
	return {
		template:'<md-select ng-change="changeVariant(currentVariant)" ng-model="currentVariant" style="margin:0">' +
					'<md-option ng-value="variant.id" ng-repeat="variant in variants">{{variant.name}}</md-option>'+
				'</md-select>',
		controller: function($scope, $element, $attrs){
			"ngInject";
			$scope.variants = [];
			$scope.currentVariant = window.variantId;;
			API.service('api/site/' + window.variantId).get('variants').then(function(json){
				$scope.variants = json;
				if($scope.variants.length <= 1)
					$element.hide();
			});
			$scope.changeVariant = function(id)
			{
				for(var i in $scope.variants){
					if($scope.variants[i].id == id)
						$('iframe#edit_page').attr('src', $scope.variants[i].view_url);
				}
			}
		}
	}
}
