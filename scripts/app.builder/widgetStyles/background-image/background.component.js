var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../margin/margin.component').default;
function isBackgroundGradientEnabled(backgroundGradient)
{
	var gradient =  backgroundGradient;
	var isValid = (gradient && gradient.colorStops && gradient.colorStops.length > 0);
	return isValid;
}
function panelController($scope, $file_manager, value, controller)
{
	"ngInject";
	$scope.vm = this;
	this.value = value;
	this.value.type = this.value.type || "image";
	this.updateType = function(value)
	{
		this.value.type = value;
		this.value.data = {};	
	}
	this.updateData = function(type, value){
		if(type != undefined && type.length){
			this.value.data = this.value.data || {};
			this.value.data[type] = value;
		}
		else
			this.value.data = value;
		controller.updateCurrentValue(this.value);
	}
	this.browserBgImage = function()
	{
		var that = this;
		return $file_manager.open({onlyImage: true}).result.then(function(images)
		{
			if(images.length == 0){
				return;
			}
			var image = images[0];
			that.updateData('src', image.full_url);
			controller.updateCSS();
			
		});
	}
	
	this.updateImage = function(type, value)
	{
		this.updateData(type, value);
		controller.updateCSS();
	}
	this.changeBackgroundGradient = function(backgroundGradient)
	{
		var gradient = this.value.data;
		
		var isValid = isBackgroundGradientEnabled(gradient);
		if(isValid){
			this.updateData('', gradient);
			
			controller.updateCSS();
		}
	}
	this.updateColor = function(value)
	{
		value.opacity == value.opacity || 100;
		this.updateData('', value);
		//(value.opacity == undefined) && this.updateData('opacity', 100);
		controller.updateCSS();
	}
	this.updateColorOpacity = function(value)
	{
		this.updateData('opacity', value);
		controller.updateCSS();
	}
}
class Controller extends inputComponent.controller{
	constructor($dialog, $mdPanel, commonUtils)
	{
		"ngInject";
		super();
		this.$dialog = $dialog;
		this.$mdPanel = $mdPanel;
		this.commonUtils = commonUtils;
		this.style = 'background-image';
	}
	doAddShadowItem(item)
	{
		this.images.push(item);
	}
	updateCSS()
	{
		this.modifyStyle(this.images);
	}
	moveUpImage(index)
	{
		this.commonUtils.array_move(this.images,index, index - 1);
		this.updateCSS();
	}
	moveDownImage(index)
	{
		this.commonUtils.array_move(this.images,index, index + 1);
		this.updateCSS();
	}
	removeImage(index, $event)
	{
		this.images.splice(index, 1);
		this.updateCSS();
	}
	updateCurrentValue(data)
	{
		if(this.currentEditIndex != undefined)
			this.images[this.currentEditIndex] = data;
	}
	editImage(index, $event)
	{
		var position = this.$mdPanel.newPanelPosition()
		  .relativeTo($event.target || $event.currentTarget)
		  .addPanelPosition(this.$mdPanel.xPosition.ALIGN_START, this.$mdPanel.yPosition.BELOW);
		var that = this;
		var value = this.images[index];
		this.currentEditIndex = index;
		this.$dialog.openPanel({
			position: position,
			template: require('./panel.html'),
			controller: function($scope, $controller)
			{
				"ngInject";
				$controller(panelController, {$scope:$scope, value:that.images[index], controller:that})
				
			},
		});
	}
	addImage($event)
	{
		var value = {
			type:'image'
		};
		this.doAddShadowItem(value);
		var index = this.images.length - 1;
		return this.editImage(index, $event);
	}
	refresh()
	{
		super.refresh();
		this.setBackgroundValue();
		
	}
	setBackgroundValue()
	{
		this.images = [];
		if($.isArray(this.value))
			this.images = this.value;
		else if(this.value != undefined)
			this.images.push(this.value);
	}
	onSelfUpdate(value, name)
	{
		super.onSelfUpdate(value);
		this.setBackgroundValue();
	}
	bindEvent()
	{
		super.bindEvent();
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
  template: require('./background.component.html'),
  controller: Controller,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
  })
}
