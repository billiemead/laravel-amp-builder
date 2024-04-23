var styleSheet = require('../../../utils/ssultils').StyleSheet;

class InputController {
	constructor ($attrs) {
		'ngInject';
		this.unit_list = [
		]
		if($attrs && $attrs.style)
			this.unit_list = this.getUnitList($attrs.style)
	}
	getUnitList(style)
	{
		return styleSheet.getValidUnitList(style);
	}
	getValueFromElement()
	{
		if(!this.selectedWidget)
			return;
		var style = this.style;
		var value = this.selectedWidget.getStyle(style, true);
		if(!value)
			value = this.selectedWidget.getSystemStyle(style);
		return value;
	}
	setValueToElement()
	{
		if(!this.selectedWidget)
			return;
		if(this.unit == 'auto'){
			this.value = "";
			this.selectedWidget.setStyle(this.style, 'auto');
		}
		else this.selectedWidget.setStyle(this.style, this.value + ((this.unit != undefined) ? this.unit: ''))
	}
	refresh()
	{
		if(this.selectedWidget && this.selectedWidget.getElement().length){
			var value = this.getValueFromElement();
			this.updateNgValue(value);
		}
			
	}
	onchange()
	{
		this.onUpdate({value:this});
		this.setValueToElement();
	}
	$onInit () {
		super.$onInit();
	}
	$onChanges(changesObj)
	{
		changesObj.selectedWidget && this.refresh();
		changesObj.ngValue && (this.updateNgValue(changesObj.ngValue.currentValue));
	}
	updateNgValue(currentValue)
	{
		if(currentValue != undefined){
			this.value = styleSheet.stripUnits(currentValue);
			this.unit = styleSheet.getUnits(currentValue);
		}
	}
}

export default {
  template: require('./input.component.html'),
  controller: InputController,
  //require: inputComponent.require,
  controllerAs: 'vm',
  bindings: {
	  selectedWidget: '<',
	  ngValue: '<',
	  style: '@?',
	  onUpdate: '&',
	  'selector': '@?'
  }
}
