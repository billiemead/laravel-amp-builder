var Grapick = require('./grapick').default;
export default function($scope, $colorpalettepicker, safeApply)
{
	"ngInject";
	$scope.data =  $.extend(true, {}, {
		colorStops : [],
		type:'linear',
		direction:'right'
	}, $scope.ngModelData);
	
	var grapick = new Grapick;
	
	function updatePreview(first = false){
		$scope.preview = grapick.getSafeValue('linear', 'right');
		if(!first)
		$scope.model_data = $.extend({
			colorStops : grapick.getHandlersJson()
		}, $scope.data);
		
		safeApply($scope);
	}
	function refresh(){
		grapick.clear();
		if($scope.data && $scope.data.colorStops && $scope.data.colorStops.length){
			var colorStops = $scope.data.colorStops;
			for(var i = 0; i < colorStops.length;i++){
				grapick.addHandler(colorStops[i].position, colorStops[i].color);
			}
		}
		updatePreview(true);
	}
	
	$scope.$watch('ngModelData', function(n,o){
		if(n == undefined){
			$scope.data =  $.extend(true, {}, {
				colorStops : [],
				type:'linear',
				direction:'right'
			});
		}
		else
			$scope.data =  $.extend(true, $scope.data, n);
		refresh()
	});
	
	$scope.onDragCallback = function(index, ui, event){
		
		var target = angular.element(event.target);
		var previewElement = ui.helper.parents('.grp-preview');
		var currentPosition = ui.position.left;
		var position = currentPosition / previewElement.width();
		position = parseInt(position * 100, 10) ;
		var handler = grapick.getHandler(index);
		if(handler)
		{
			handler.setPosition(position);
			$scope.data.colorStops[index].position = position;
			updatePreview();
		}
	}
	$scope.changeType = function()
	{
		updatePreview();
	}
	
	$scope.selectHandler = function(index, event)
	{
		$scope.selectedHandler = index;
		event.stopPropagation();
	}
	$scope.addStop = function(event){
		var currentTarget = event.currentTarget;
		var targetOffset = $(currentTarget).offset();
		var targetWidth  = $(currentTarget).width();
		var changed = ((event.clientX - targetOffset.left) / targetWidth) * 100;
		
		var position = parseInt(changed, 10);
		$colorpalettepicker.openDialog().then(function(color)
		{
			grapick.addHandler(position, color);
			$scope.data.colorStops.push({
				color:color,
				position: position
			});
			updatePreview();
			
		});
	}
	$scope.removeHander = function(index, event)
	{
		var handler = grapick.getHandler(index);
		if(handler != undefined){
			$scope.data.colorStops.splice(index, 1);
			handler.remove();
			updatePreview();
		}
		event.stopPropagation();
	}
	$scope.updateHanderColor = function(index)
	{
		var handler = grapick.getHandler(index);
		
		$colorpalettepicker.openDialog().then(function(color)
		{
			if(handler != undefined)
			{
				handler.setColor(color);
				$scope.data.colorStops[index].color = color;
				updatePreview();
			}			
		});
	}
}

