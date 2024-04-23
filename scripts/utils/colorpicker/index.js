require('../colorutils');
function picker_controller($scope,$modalInstance, ngModel)
{
	"ngInject";
	var color = angular.copy($scope.color);
	$scope.changeHueInput = function($event)
	{
		var alpha = $scope.color.a || 1;
		$scope.color = Color.fromHsv($scope.colorHSB);
		$scope.color.a = alpha;
		$scope.color_hex = $scope.color.toHex();
		$scope.color_hex_x = $scope.color_hex.substring(1);
		previewColor();
		updateCursor();
		
		//if(ngModel)
			//ngModel.$setViewValue(color_toString($scope.color));
	};
	$scope.changeHexInput = function($event)
	{
		var alpha = $scope.color.a || 1;
		var color = Color.fromHex('#' + $scope.color_hex_x);
		if(color == null)
			return;
		$scope.color = color;
		console.log($scope.color, $scope.color_hex_x);
		$scope.color.a = alpha;
		$scope.colorHSB = $scope.color.toHsv();
		previewColor();
		updateCursor();
		
		//if(ngModel)
			//ngModel.$setViewValue(color_toString($scope.color));
	};
	$scope.choosePickerColor = function()
	{
		if(ngModel)
			ngModel.$setViewValue(color_toString($scope.color));
		$modalInstance.close(color_toString($scope.color));
	}
	function previewColor()
	{
		var value = $scope.color.toHsv();
		$scope.saturation_color_hex = Color.fromHsv($scope.colorHSB.h,100,100).toHex();
	
	}
	function updateCursor()
	{
		var value = $scope.color.toHsv();
		$scope.cursors_saturation = {left: value.s + 'px', top: 100 - value.v + 'px'};
		$scope.cursors_hue = {left: Math.round((100 *value.h)/ 360) + 'px'};
		$scope.cursors_alpha = {left: Math.round(100 * (1 - value.a || 1))  + 'px'};
	}
	function color_toString(color) {
		if(color.a == 1) {
			return color.toHex();
		}
		else {
			var value = color.toRgba();
			return 'rgba(' + value.join(',') + ')';
			
		}
	}
	
	$scope.color = new Color(color || '#000' );
	$scope.colorHSB = $scope.color.toHsv();
	$scope.color_hex = $scope.color.toHex();
	$scope.model_color = color_toString($scope.color);
	$scope.color_hex_x = $scope.color_hex.substring(1);
	$scope.saturation_color_hex = Color.fromHsv($scope.colorHSB.h,100,100).toHex();
	previewColor();
	updateCursor();
	var maxSize = 200;
	var sliders = 
	{
		saturation: {
			maxLeft: maxSize,
			cursor:'saturation',
			maxTop: maxSize,
			callLeft: 'setSaturation',
			callTop: 'setLightness'
		},
		
		hue: {
			maxLeft: maxSize,
			maxTop: 0,
			cursor:'hue',
			callLeft: 'setHue',
			callTop: false
		},
		
		alpha: {
			maxLeft: maxSize,
			maxTop: 0,
			cursor:'alpha',
			callLeft: 'setAlpha',
			callTop: false
		}
	};
	function onmousemove(e,type)
	{
		type = type||0;
		
		e.stopPropagation();
		e.preventDefault();
		var left = Math.max(
			0,
			Math.min(
				$scope.slider.maxLeft,
				$scope.slider.left + ((e.pageX||$scope.pointer.left) - $scope.pointer.left)
			)
		);
		var top = Math.max(
			0,
			Math.min(
				$scope.slider.maxTop,
				$scope.slider.top + ((e.pageY||$scope.pointer.top) - $scope.pointer.top)
			)
		);
		$scope['cursors_' + $scope.slider.cursor] = {left: left + 'px', top: top + 'px'};
		
		if ($scope.slider.callLeft && $scope.slider.maxLeft) {
			var percent = left / $scope.slider.maxLeft;
			$scope.color[$scope.slider.callLeft].call($scope.color, percent/*left/100*/);
			$scope.colorHSB = $scope.color.toHsv();
			$scope.color_hex = $scope.color.toHex();
			$scope.color_hex_x = $scope.color_hex.substring(1);
			$scope.color.color_hex = $scope.color_hex;
			if($scope.slider.cursor=='hue')
				previewColor();
				//$scope.saturation_color_hex = $scope.color_hex;
			
		}
		if ($scope.slider.callTop && $scope.slider.maxTop) {
			var percent = top / $scope.slider.maxTop;
			$scope.color[$scope.slider.callTop].call($scope.color, percent/*top/100*/);
			$scope.colorHSB = $scope.color.toHsv();
			$scope.color_hex = $scope.color.toHex();
			$scope.color_hex_x = $scope.color_hex.substring(1);
			$scope.color.color_hex = $scope.color_hex;
			if($scope.slider.cursor=='hue')
			{
				previewColor();
				//$scope.saturation_color_hex = Color.fromHsv($scope.colorHSB.h,100,100).toHex();
			}
			
		}
		
		previewColor();
		return false;
	}
	
	function onmouseup(e)
	{
		e.stopPropagation();
		e.preventDefault();
		$(document).off('mousemove.ColorPicker');
		$(document).off('mouseup.ColorPicker');
		
		return false;
	}
	$scope.onHSBMousedown = function($event,type)
	{
		
		var target = $($event.currentTarget);
		var zone = target.closest('div');
		if (!zone.is('.colorpicker')) {
			if (zone.is('.colorpicker-saturation')) {
				$scope.slider = $.extend({}, sliders['saturation']);
			} 
			else if (zone.is('.colorpicker-hue')) {
				$scope.slider = $.extend({}, sliders['hue']);
			}
			else if (zone.is('.colorpicker-alpha')) {
				$scope.slider = $.extend({}, sliders['alpha']);
			}
			var offset = zone.offset();
			$scope.slider.left = $event.pageX - offset.left;
			$scope.slider.top = $event.pageY - offset.top;
			$scope.pointer = {
				left: $event.clientX,
				top: $event.clientY
			};
			$(document).on('mousemove.ColorPicker', function(e)
			{
				onmousemove(e);
			});
			
			$(document).on('mouseup.ColorPicker', function(e)
			{
				onmouseup(e);
			});
			onmousemove($event,type);
		}
	}
}
export default angular.module('ui.colorpicker',['ui.dialog'])
.service('$colorpicker', function($dialog, $controller, $window, pageEdit, pageEdit_less, $q)
{
	"ngInject";
	this.openDialog = function(initColor)
	{
		return $dialog.open({
			hasBackdrop:false,
			template:require('./template_picker.tmpl'),
			controller: function($scope, $modalInstance)
			{
				"ngInject";
				$scope.color = initColor || '#000';
				$controller(picker_controller, {ngModel:null, $scope:$scope, $modalInstance:$modalInstance});
			}
		});
		return defered.promise;
	}
})
.service('$colorpalettepicker', function($dialog, $controller, $window, pageEdit, pageEdit_less, $q)
{
	"ngInject";
	this.openDialog = function(ngModel)
	{
		var defered = $q.defer();
		$dialog.open({
			hasBackdrop:false,
			template:require('./template.tmpl'),
			controller: function($scope, $modalInstance)
			{
				"ngInject";
				$scope.automatic = false;
				$scope.column = (window.siteInfo.themeConfig.palette_column) || 5;
				$scope.color = $scope.color || '#000';
				$controller(picker_controller, {ngModel:ngModel, $scope:$scope, $modalInstance:$modalInstance});
				$scope.colors = [];
				var colorCompiled = (pageEdit.preprocessor.getColorPalette(window.siteInfo.theme, window.siteInfo.variant || 'default'));
				
				if(colorCompiled != undefined)
				{
					if(!colorCompiled.then){
						var colors = angular.copy(colorCompiled);
						while (colors.length > 0)
							$scope.colors.push(colors.splice(0, $scope.column));
					}
					else {
						colorCompiled.then(function(rs){
							var colors = angular.copy(rs);
							while (colors.length > 0)
								$scope.colors.push(colors.splice(0, $scope.column));
						})
					}
					
				}	
				$scope.changeColor = function(item)
				{
					if(item == undefined)
					{
						$modalInstance.close();
						return;
					}
					if(ngModel && ngModel.$setViewValue)
						ngModel.$setViewValue(item);
					defered.resolve(item);
					if(typeof ngModel == 'function')
					{
						ngModel(item);
					}
					$modalInstance.close();
				}
				$scope.getColorName = function(item)
				{
					
					var color = new window.Color(item.value);
					//console.log(color);
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
		return defered.promise;
	}
})
.directive('colorpalettepicker', function($dialog, $compile, $window, pageEdit, pageEdit_less, $colorpalettepicker)
{
/*
*angular color picker module
*colorpalettepicker directive apply to any element
*/
	"ngInject";
	return {
		require: '?ngModel',
		scope: { color:'=ngModel' },
		link:function(scope,element, attrs,ngModel)
		{
			
			var e = $(element);
			if(scope.color && !scope.color.value){
				var c = new Color(scope.color);
				scope.color = c.toHex();
			}
			
			if(e.is('input')){
				
			}
			else
				e.click(function()
				{
					$colorpalettepicker.openDialog(ngModel);
				});
		
		}
	}
})

.directive('colorpaletteinput', function($dialog, $compile, $window, pageEdit, pageEdit_less, $colorpalettepicker)
{

	"ngInject";
	return {
		require: '?ngModel',
		scope: { color:'=ngModel' },
		link:function(scope,element, attrs,ngModel)
		{
			scope.$watch('color', function(newValue) {
				if(newValue != undefined && newValue.value){
					$(element).val(newValue.value);
				}
				ngModel.$setViewValue(newValue);
			})
			
		
		}
	}
})
.directive('colorpicker', function($dialog, $compile, $window)
{
	"ngInject";
	function link(scope, element, attrs,ngModel) {
		
	}
	return {
		require: '?ngModel',
		scope: { color:'=ngModel' },
		link:link
	};
})
.directive('gradientGenerator', require('./gradient/directive').default)
.name;
