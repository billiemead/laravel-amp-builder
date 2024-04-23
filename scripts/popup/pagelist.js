(function () { "use strict";
angular.module('ui.popup')
.service('popup_pagelist', ['communication','popup_form',function(communication,popup_form)
{
	this.open = function(opt)
	{
		return popup_form.open(
		{
			name:'pagelist',
			controller: function($scope)
			{
				communication.getConfiguration('PAGE_CONFIG_HOME_PAGE').then(function(result)
				{
					if(result == null)
						$scope.homepage = 'index';
					else
						$scope.homepage = result;
				});
				$scope.list = [];
				$scope.relativeUrl = getRelativeUrl();
				communication.getPage_List({}).then( function(json)
				{
					$scope.list = json;
					if(!$scope.$$phase)
						$scope.$digest();
				});
				$scope.cancel = function () {
					return $scope.close();
				}
				$scope.ok = function () {
					return $scope.save();
				}
				$scope.save = function()
				{
				}
				$scope.setClass = function(scope, locals)
				{
					return '{home: item.name == homepage}';
				}
			},
		});
	}
}])
.controller('popup_pagelist_EditPageItemCtrl', function($scope, $rootScope, $dialog,communication)
{
	$scope.addParam = function()
	{
		if(!angular.isDefined($scope.data.parameters))
			$scope.data.parameters = [];
		$scope.data.parameters.push({name:'new menu',value:''});
	}
	
	$scope.deleteParam = function($index)
	{
		$scope.data.parameters.splice($index,1);
	}
});
}());