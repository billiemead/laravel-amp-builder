var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../input/input.component').default;

class InputController extends inputComponent.controller {
	$onInit () {
		super.$onInit();
		if(this.style && !this.fixUnit)
			this.unit_list = this.getUnitList(this.style)
	}
	
	getFullValue()
	{
		this.value = parseFloat(this.value)
		if(isNaN(this.value)) {
			return '';
		}
		var unit = this.unit || this.fixUnit;
		return this.value + ((unit != undefined) ? unit: '');
	}
	updateNgValue(currentValue)
	{
		if(currentValue != undefined){
			
			this.value = styleSheet.stripUnits(currentValue);
			(this.unit_list && this.unit_list.length) && (this.unit = styleSheet.getUnits(currentValue));
		}
	}
}

export default {
  template: require('./input.component.html'),
  controller: InputController,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
	  fixUnit:'@?'
  })
}
