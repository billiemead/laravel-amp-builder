export default function($scope, communication,$window,popup, pageEdit_event, $state,commonUtils)
{
	"ngInject";
	communication.getList('themeOptions').then( function(json)
	{
		$scope.options = json;
	});
	$scope.menuOptions = 
	[
		{
			text: 'Edit',
			click: function ($itemScope, $event, modelValue, text, $li) {
				$scope.editOption($itemScope.$index);
			}
		},
		{
			text: 'Remove',
			click: function ($itemScope, $event, modelValue, text, $li) {
				$scope.removeOption($itemScope.$index);
			}
		},
	];
	function checkNewClassName(name)
	{
		var index = 0;
		for(var j in $scope.options)
		if(name == $scope.options[j].class_name){
			return true;
		}
		return false;
	}
	$scope.removeOption = function(index){
		$scope.options.splice(index, 1);
		saveOptions($scope.options);
	}
	$scope.editOption = function(index){
		var parentScope = $scope;
		var option = $scope.options[index];
		popup.open({
			name:'theme_option',
			controller : function($scope, $modalInstance)
			{
				"ngInject";
				$scope.error = false;
				$scope.data = option;
				$scope.refresh = true;
			
				$scope.aceChanged = function(e) {
					$(window).trigger('resize');
				};
				$scope.ok = function()
				{
					$modalInstance.close($scope.data);
				}
			}
		}).result.then(function(data)
		{
			
			parentScope.options[index] = data;
			saveOptions(parentScope.options);
		})
	}
	function saveOptions(options){
		return communication.api('saveThemeOptions', {options:options});
	}
	$scope.addOption = function(){
		var parentScope = $scope;
		popup.open({
			name:'theme_option',
			controller : function($scope, $modalInstance)
			{
				"ngInject";
				$scope.error = false;
				$scope.data = {
					'element':'body'
				};
				$scope.refresh = true;
			
				$scope.aceChanged = function(e) {
					$(window).trigger('resize');
				};
				$scope.ok = function()
				{
					$modalInstance.close($scope.data);
				}
			}
		}).result.then(function(data)
		{
			data.class_name = commonUtils.makeSafeForCSS(data.display_name);
			var i = 0;
			while(checkNewClassName(data.class_name)){
				i++;
				data.class_name  += i;
			}
			parentScope.options.push(data);
			saveOptions(parentScope.options);
		})
	}
}