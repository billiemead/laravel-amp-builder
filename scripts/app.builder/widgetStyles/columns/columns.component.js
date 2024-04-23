var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../number/input.component').default;

class InputController extends inputComponent.controller{
	constaaructor ($attrs) {
		'ngInject';
		
	}
	updateInput(value)
	{
		this.updateNgValue(value);
		this.onUpdate({value:this.getFullValue()})
	}
	updateSlider()
	{
		this.value = this.value_number;
		this.onUpdate({value: this.getFullValue()})
	}
	updateNgValue(currentValue)
	{
		super.updateNgValue(currentValue);
		currentValue != undefined && (this.value_number = styleSheet.stripUnits(currentValue));
	}
}

export default {
  template: require('./columns.component.html'),
  controller: InputController,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
	  'min':'@?',
	  'max':'@?',
  })
}
