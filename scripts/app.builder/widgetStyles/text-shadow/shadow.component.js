var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../margin/margin.component').default;
class Controller extends inputComponent.controller{
	constructor($dialog, $mdPanel, commonUtils)
	{
		"ngInject";
		super();
		this.$dialog = $dialog;
		this.$mdPanel = $mdPanel;
		this.commonUtils = commonUtils;
		
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
	updateCSS()
	{
		if(this.shadows.length)
			this.modifyStyle(this.shadows);
		else
			this.modifyStyle();
	}
	setElStyle()
	{
		this.style = 'text-shadow';
	}
	removeShadow(index, $event)
	{
		this.shadows.splice(index, 1);
		this.updateCSS();
	}
	moveUpShadow(index)
	{
		this.commonUtils.array_move(this.shadows,index, index - 1);
		this.updateCSS();
	}
	moveDownShadow(index)
	{
		this.commonUtils.array_move(this.shadows,index, index + 1);
		this.updateCSS();
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
	addShadow($event)
	{
		this.doAddShadowItem();
		var index = this.shadows.length - 1;
		return this.editShadow(index, $event);
	
	}
	setShadowsValue()
	{
		this.shadows = [];
		if($.isArray(this.value))
			this.shadows = this.value;
		else if(this.value != undefined)
			this.shadows.push(this.value);
	}
	refresh()
	{
		
		super.refresh();
		this.setShadowsValue();
		
		
	}
	onSelfUpdate(value)
	{
		super.onSelfUpdate(value);
		this.setShadowsValue();
	}
	changeMode(value)
	{
	}
	
	getSystemStyle()
	{
		return this.getSelectedModule().getShadowCSSValue(this.style);
	}
}

export default {
  template: require('./shadow.component.html'),
  controller: Controller,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
  })
}
