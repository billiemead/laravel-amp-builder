(function () { "use strict";
angular.module('ui.popup')
.service('popup_zone', ['communication','popup_form','$templateCache','$filter',function(communication,popup_form,$templateCache,$filter)
{
	this.open = function(opt)
	{
		opt = opt || {};
		return popup_form.open(
		{
			name:'zone',
			controller: function($scope)
			{
				communication.getList('country',{}).then(function(json)
				{
					$scope.countries = json;
				});
				communication.getList('zone',{}).then(function(json)
				{
					$scope.zones = json;
				});
				$scope.data.zones = $scope.data.zones || [];
				$scope.add = function()
				{
					$scope.data.zones.push({country_code:'AD', zone_code:1});
				}
				$scope.changeZone = function(zone)
				{
					console.log(zone);
				}
				$scope.deleteZone = function(index)
				{
					$scope.data.zones.splice(index,1)
				}
			},
			data:opt.data,
			execute_path:'ecommerce.configuration.zone',
			form_name:'ZoneForm'
		});
	}
}]);
}());