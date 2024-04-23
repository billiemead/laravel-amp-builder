(function () { "use strict";
angular.module('ui.popup')
.service('popup_particle', ['popup', 'pageEdit_event', '$colorpalettepicker', function(popup, pageEdit_event, $colorpalettepicker)
{
	this.open = function(background_element)
	{
		return popup.open({
			hasBackdrop:false,
			name:'particle',
			//size:'sm',
			controller: function($scope, $modalInstance,communication, $file_manager)
			{
				var element = jQuery_iframe(background_element);
				var dotColor = element.attr('particle-dotColor') || '#000';
				var lineColor = element.attr('particle-lineColor') || '#000';
				$scope.data = {
					enable : element.attr('particle-enabled') != undefined,
					dotColor: dotColor || '#fff',
					lineColor: lineColor || '#fff'
				}
				$scope.toggleParticle = function()
				{
					if(!$scope.data.enable){
						element.removeAttr('particle-enabled');
						pageEdit_event.iframe.getWindow().destroyParticleBackground(element);
					}
						 
					else
					{
						element.attr('particle-enabled', '');
						element.attr('particle-dotColor', $scope.data.dotColor);
						element.attr('particle-lineColor', $scope.data.lineColor);
						pageEdit_event.iframe.getWindow().initParticleBackground(element);
					}
				}
				$scope.changeColor = function(type)
				{
					$colorpalettepicker.openDialog(function(item){
						$scope.data[type] = item;
						StyleSheet.setStyle(element, type, item);
						pageEdit_event.iframe.getWindow().refreshParticleBackground(element);
					});
					
				}
			}
		});
	}
}]);
}());