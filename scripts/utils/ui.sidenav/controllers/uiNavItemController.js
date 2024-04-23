export default function uiSidenavCtrl($scope,$state,$rootScope) 
{
	"ngInject";
	var $ctrl = this;
	$scope.childItems = [];
	$scope.hasChildMenu = false;
	$ctrl.addChildItem = function(item)
	{
		$scope.childItems.push(item);
		
	}
	$ctrl.hasChildMenu = function(){
		$scope.hasChildMenu = true;
	}
}