export default function($scope, communication,$rootScope, $window,popup, pageEdit_event, pageEdit, $state, pageEdit_less, safeApply)
{
	"ngInject";
	$scope.active = 1;
	$scope.disabled = true;
	$(window).on('widget_selected', function(event)
	{
		$scope.active = 0;
		$scope.disabled = false;
		safeApply($scope);
	});
	$(window).on('widget_deselected', function(event)
	{
		var type = $scope.currentEditPage;
		$scope.active = 1;
		if(type == 'popup')
			$scope.active = 2;
		if(type == 'main')
			$scope.active = 1;
		$scope.disabled = true;
		safeApply($scope);
	});
	$scope.currentEditPage = 'main';
	$(window).on('changePageTab', function(event)
	{
		var type = jQuery_iframe('html').attr('edit-type');
		if(type != undefined){
			$scope.currentEditPage = type;
			if(type == 'popup')
				$scope.active = 2;
			if(type == 'main')
				$scope.active = 1;
		}
		safeApply($scope);
	});
	function getHiddenLayers(){
		var hiddenLayers = [] ;
		$scope.hiddenLayers = []
		if($scope.currentEditPage == 'main')
			hiddenLayers = pageEdit.getHiddenLayers('#main_sections');
		for(var i in hiddenLayers){
			$scope.hiddenLayers.push({
				name: hiddenLayers[i].getWidgetDisplayName(),
				id: hiddenLayers[i].getPage_id()
			});
		}
		safeApply($scope);
	}
	$scope.showLayer = function(layer)
	{
		var module = pageEdit.getModuleById(layer.id);
		if(module){
			module.setVisibility(true);
			getHiddenLayers();
		}
	}
	$rootScope.$on('iframeLoaded', function(e, n){
		getHiddenLayers();
	});
	$(window).on('widget_visibility_changed', function(event){
		getHiddenLayers();
	});
	
}
  