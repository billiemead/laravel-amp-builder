var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../number/input.component').default;

class InputController extends inputComponent.controller{
	
	updateInput(value)
	{
		this.updateNgValue(value);

		this.onUpdate({value:this.getFullValue()})
	}
	$onChanges(changesObj)
	{
		changesObj.selectedWidget && this.refresh();
		changesObj.ngValue && (this.updateNgValue(changesObj.ngValue.currentValue));
	}
	getCurrentUnit()
	{
		if(!this.value)
			return;
		return styleSheet.getUnits(this.value)
	}
	getFullValue()
	{
		var unit = this.getCurrentUnit();
		var unit = unit || this.fixUnit;
		return this.value_number + ((unit != undefined) ? unit: '');
	}
	updateSlider()
	{
		var unit = this.getCurrentUnit();
		this.value = this.value_number + (unit != undefined ? unit : '');
		
		this.onUpdate({value: this.getFullValue()})
	}
	updateNgValue(currentValue)
	{
		if(currentValue != undefined){
			
			this.value = currentValue;
		}
		currentValue != undefined && (this.value_number = styleSheet.stripUnits(currentValue));
	}
}

export default {
  template: require('./input.component.html'),
  controller: InputController,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
	  'min':'@?',
	  'max':'@?',
  })
}
