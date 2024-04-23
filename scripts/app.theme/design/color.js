export default function($scope, communication,$window,popup, pageEdit_event, $state,commonUtils, safeApply, $dialog, popup_code, pageEdit)
{
   "ngInject";
	$scope.colorSchemes = {};
	$scope.loadSchemes = [];
	$scope.system_colorSchemes = [];
	$scope.menuOptions = 
	[
		{
			text: 'Edit',
			click: function ($itemScope, $event, modelValue, text, $li) {
				$scope.editScheme($itemScope.name);
			}
		},
		{
			text: 'Remove',
			click: function ($itemScope, $event, modelValue, text, $li) {
				$scope.removeScheme($itemScope.name);
			}
		},
	]
	
	$scope.currentScheme = window.siteInfo.variant || 'default';
	if(!pageEdit.preprocessor){
		return;
	}
	communication.getList('colorSchemes').then( function(json)
	{
		$scope.loadSchemes = json;
		compileScheme();
	});
	function compileScheme()
	{
		var schemes = pageEdit.preprocessor.compileSchemes($scope.loadSchemes);
		$scope.colorSchemes = schemes;
		safeApply($scope);
		
	}
	$scope.applyScheme = function(name, colorScheme)
	{
		window.siteInfo.variant = name;
		$scope.currentScheme = name;
		var rs = pageEdit.preprocessor.applyScheme(name, colorScheme);
		if(rs.then){
			rs.then(function()
			{
				var newPalette = angular.copy(pageEdit.preprocessor.getColorPalette(window.siteInfo.theme, window.siteInfo.variant));
				StyleSheet.onChangePalette(newPalette);
				console.log(newPalette);
				window.siteInfo.variant = name;
				$scope.currentScheme = name;
				safeApply($scope);
			})
		}
		return;
	}
	function checkNewSchemeName(name)
	{
		var index = 0;
		for(var i in $scope.loadSchemes){
			if(name == i){
				return true;
			}
		}
		return false;
	}
	$scope.addScheme = function()
	{
		var parentScope = $scope;
		var content = $scope.loadSchemes['default'];
		popup_code.open({
			data:(content),
			mode:'less'
		}).result.then(function(data)
		{
			var name = 'newscheme';
			var index = 0;
			while(checkNewSchemeName(name) ){
				index++;
				name+= index;
			}
			communication.api('addScheme', {name:name, data:data}).then(function(json)
			{
				parentScope.loadSchemes[name] = data;
				compileScheme();
			});
			
		})
	}
	$scope.removeScheme = function(name){
		communication.api('removeScheme', {name:name}).then(function(json)
		{
			if(json == 1)
				delete $scope.colorSchemes[name];
			else
				$dialog.message({
					title:'Error',
					message:json
				});
		});
		
	}
	$scope.editScheme = function(name, colorScheme)
	{
		var parentScope = $scope;
		var content = $scope.loadSchemes[name];
		popup_code.open({
			data:(content),
			mode:'less'
		}).result.then(function(data)
		{
			parentScope.loadSchemes[name] = data;
			compileScheme();
		})
	}
}