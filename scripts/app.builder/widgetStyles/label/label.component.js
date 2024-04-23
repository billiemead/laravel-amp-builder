var inputComponent = require('../input/input.component').default;

class InputController  extends inputComponent.controller{
	constructor($dialog, $mdPanel, commonUtils)
	{
		"ngInject";
		super();
		this.$dialog = $dialog;
		this.$mdPanel = $mdPanel;
		this.commonUtils = commonUtils;
		
	}
	remove()
	{
		this.modifyStyle(undefined);
	}
	
	checkRemoveable()
	{
		if(this.isEmptyModule())
			return false;
		var style = this.getStyle();
		return style != undefined;
	}
	updateNgValue(currentValue)
	{
		this.removable = this.checkRemoveable();
	}
	openPanelInfo($event)
	{
		var position = this.$mdPanel.newPanelPosition()
		  .relativeTo($event.target || $event.currentTarget)
		  .addPanelPosition(this.$mdPanel.xPosition.ALIGN_START, this.$mdPanel.yPosition.BELOW);
		var that = this;
		this.$dialog.openPanel({
			position: position,
			template: require('./panel.html'),
			controller: function($scope)
			{
				"ngInject";
			
				$scope.remove = function()
				{
					that.remove();
					$scope.$close();
				}
				
			},
		});
	}
}

export default {
  template: require('./input.component.html'),
  controller: InputController,
  controllerAs: 'vm',
  transclude:true,
  bindings: $.extend(inputComponent.bindings,{
  })
}
