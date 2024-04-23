var base = require('./base').default;
var button = require('./base_button').default;

export default createModuleDefinition([base, button], function($file_manager,$dialog, commonUtils, pageEdit_undoManager) 
{
	"ngInject";
	var getDay = function(elaps)
	{
		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate()+elaps);
		return tomorrow;
	};
	this.tab_editor = ['advance', 'offset', 'margin', 'countdown', 'countdown_design'];
	this.initializeData = 
	{
		end_now:0,
		start_now:1,
		end:{
		date:getDay(1).getDate(),
		month:getDay(1).getMonth() + 1,
		year:getDay(1).getFullYear(),
		hour:getDay(1).getHours(),
		minute:getDay(1).getMinutes(),
		second:getDay(1).getSeconds(),
		},
		units:{'8':'1','4':'1','2':'1'}
		
	};
	this.getResizableHandles = function()
	{
		return "e,w";
	}
	this.getCountdownInstance = function()
	{
		
	}
	this._design = function($scope, $modalInstance, $moduleInstance, $controller)
	{
		"ngInject";
		$controller($moduleInstance.bases[0]._design, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
		$scope.unit_styles = $moduleInstance.getCurrentItemStyles('.unit') || {};
		$scope.number_styles = $moduleInstance.getCurrentItemStyles('.count') || {};
		$scope.section_styles = $moduleInstance.getCurrentItemStyles('.countdown-section') || {};
	}
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		
		$scope.picker = {
			end_utc : $moduleInstance.frontend_module.convertToDateObject($scope.data.end)
		};
		
		$scope.time = {
			hour:$scope.data.end.hour,
			minute:$scope.data.end.minute,
			offset:$scope.data.end.offset + ""
		}
		var that = this;
		$scope.changeDate = function()
		{
			$scope.data.end = $.extend($scope.data.end, {
				date:$scope.picker.end_utc.getDate(),
				month:$scope.picker.end_utc.getMonth() + 1,
				year:$scope.picker.end_utc.getFullYear(),
			});
			
			resetCountdown();
		}
		$scope.changeTime = function()
		{
			$scope.data.end = $.extend($scope.data.end, $scope.time);
			resetCountdown();
		}
		function resetCountdown()
		{
			$scope.changeData(true);
		}
		
		$scope.changeNumberStyle = function(name, value)
		{
			$scope.changeItemStyle(name, value, '.count')
		}
		$scope.changeSectionStyle = function(name, value)
		{
			$scope.changeItemStyle(name, value, '.countdown-section')
		}
		$scope.changeUnitStyle = function(name, value)
		{
			$scope.changeItemStyle(name, value, '.unit')
		}
	};
	this.setStyle = function(name, value, opacity, element)
	{
		return this.frontend_module.setStyle(name, value, opacity, element);
	};
});
