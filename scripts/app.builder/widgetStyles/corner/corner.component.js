var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../input/input.component').default;
class Controller extends inputComponent.controller{
	constructor()
	{
		"ngInject";
		super();
		this.style = 'border-radius';
	}
	refresh()
	{
		super.refresh();
		this.checkAllMode();
	}
	getStyle()
	{
		return;
		return super.getStyle()
	}
	getSystemStyle()
	{
		return this.getSelectedModule().getCornerValue();
	}
	updateNgValue(currentValue)
	{
		if(currentValue != undefined){
			this.value = currentValue;
		}
	}
	checkAllMode()
	{
		if(!this.value)
			return;
		var compare_value;
		var flag;
		for(var i in this.value){
			if(!compare_value){
				compare_value = this.value[i];
				continue;
			}
			if(this.value[i] != compare_value)
			{
				flag = true;
				break;
			}
		}
		this.allMode = !flag;
		this.value_all = compare_value || 0;
		this.value_all_number = styleSheet.stripUnits(this.value_all);
	}
	updateMode(value)
	{
		this.allMode = (value == 1);
	}
	updateItem(direction, value)
	{
		this.value[direction] = value;
		this.onchange();
	}
	updateItems(value)
	{
		this.value = this.value || {};
		var directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
		for(var i in directions){
			var direction = directions[i];
			this.value[direction] = value;
		}
		this.value_all_number = styleSheet.stripUnits(this.value_all);
		this.onchange();
	}
	updateSlider()
	{
	}
	
}

export default {
  template: require('./corner.component.html'),
  controller: Controller,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
  })
}
