export default function($scope, API,$rootScope, $window, popup, pageEdit_event, pageEdit, $state, safeApply, $moduleInstance)
{
   "ngInject";

	$scope.colorSchemes = {};
	
		
	$scope.currentScheme = window.siteInfo.variant || 'default';
	function compileScheme(apply)
	{
		var colorList = $moduleInstance.getColorFromConfig();
		if(!pageEdit.preprocessor || !colorList)
			return;
		var schemes = pageEdit.preprocessor.compileSchemes(colorList);
		$scope.colorSchemes = schemes;
		safeApply($scope);
	}
	
	$rootScope.$on('cssPreprocessorReady', function()
	{
		compileScheme();
		if(window.siteInfo.variant == ':pageColors'){
			var colors = $moduleInstance.getDataByKey('colors');
			$moduleInstance.applyPageColorScheme(colors);
		}
			
	});
	compileScheme();
	$scope.applyScheme = function(name, colorScheme)
	{
		$moduleInstance.applyColorScheme(name, colorScheme).then(function()
		{
			$scope.currentScheme = window.siteInfo.variant;
			safeApply($scope);
		});
	}

	function applyCustomScheme(colors)
	{
		$moduleInstance.applyPageColorScheme(colors).then(function()
		{
			$scope.currentScheme = window.siteInfo.variant;
			safeApply($scope);
		});;
		
		return;
	}
	$scope.customColorscheme = [];
	$scope.customizeColorscheme = function()
	{
		var parentScope = $scope;
		popup.open({
			name:'color',
			controller: function($scope, $modalInstance, pageEdit, $colorpicker)
			{
				"ngInject";
				var main_colors = ['info-color', 'secondary-color', 'primary-color', 'danger-color', 'warning-color'];
				$scope.main_colors = pageEdit.preprocessor._getRealColor(main_colors);
				
				$scope.changeColor = function(item)
				{
					$colorpicker.openDialog(item.value).result.then(function(color)
					{
						if(color != undefined)
						{
							item.value = color;
						}
					});
				}
				$scope.OK = function()
				{
					applyCustomScheme($scope.main_colors);
					$modalInstance.close(1);
				}
				$scope.getColorName = function(item)
				{
					var color = new window.Color(item.value);
					for(var i in window.Color.named){
						if(color.r == window.Color.named[i][0]
						&& color.g == window.Color.named[i][1]
						&& color.b == window.Color.named[i][2]){
							return i;
						}
					}
					return '';
				}
			}
		});
	}
	$scope.loadColorscheme = function()
	{
		var parentScope = $scope;
		popup.open({
			name:'colorlist',
			controller: function($scope, $modalInstance, pageEdit, $colorpicker)
			{
				"ngInject";
				$scope.applyScheme = function(colors)
				{
					applyCustomScheme(colors);
				}
				var main_colors = ['info-color', 'secondary-color', 'primary-color', 'danger-color', 'warning-color'];
				API.service('site').get('color').then(function(json){
					var colors = [];
					for(var i =0; i < json.length;i++)
					{
						var rs = [];
						for(var j = 1; j <= main_colors.length;j++){
							var value = '#' + json[i]['color' + j];
							rs.push({name:'$' + main_colors[j - 1], value:value});
						}
						colors.push(rs);
					}
					$scope.colorSchemes = colors;
				});
			}
		});
	}
}
  