var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../text-shadow/shadow.component').default;
class Controller extends inputComponent.controller{
	
	updateCSS()
	{
		this.modifyStyle(this.shadows);
	}
	
	editShadow(index, $event)
	{
		var position = this.$mdPanel.newPanelPosition()
		  .relativeTo($event.target || $event.currentTarget)
		  .addPanelPosition(this.$mdPanel.xPosition.ALIGN_START, this.$mdPanel.yPosition.BELOW);
		var that = this;
		var value = this.shadows[index];
		this.$dialog.openPanel({
			position: position,
			template: require('./panel.html'),
			controller: function($scope)
			{
				"ngInject";
				$scope.vm = this;
				this.min = -20;
				this.max = 20;
				this.value = value;
				this.updateItem = function(direction, value)
				{
					$scope.vm.value[direction] = value;
					that.shadows[index] = $scope.vm.value;
					that.updateCSS();
				}
				
			},
		});
	}
	
	doAddShadowItem(item)
	{
		item = item ||  {
			distance:1,
			angle:0,
			blurRadius:'5px'
		};
		this.shadows.push(item);
	}
	calculate(angle, distance)
	{
		return {
			x: Math.sin(angle) * distance,
			y: Math.cos(angle) * distance
		}
	}
	setElStyle()
	{
		this.style = 'box-shadow';
	}
	
	
	
}

export default {
  template: require('../text-shadow/shadow.component.html'),
  controller: Controller,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
  })
}
