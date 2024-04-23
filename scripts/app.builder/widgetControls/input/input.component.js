class InputController {
	constructor ($attrs) {
		'ngInject';
	}
	refresh()
	{
		if(this.ngModelCtrl){
			
			this.updateNgValue(this.ngModel);
		}
	}
	onchange()
	{
		if(this.ngModelCtrl){
			this.ngModelCtrl.$setViewValue(this.ngValue);
		}
		
		this.onUpdate({value:this});
	}
	$onInit () {
		this.refresh();
	}
	$onChanges(changesObj)
	{
		changesObj.ngValue && (this.updateNgValue(changesObj.ngValue.currentValue));
	}
	updateNgValue(currentValue)
	{
		if(currentValue){
			this.value = currentValue;
		}
	}
	updateNgModel(currentValue)
	{
		
	}
}

export default {
  template: require('./input.component.html'),
  controller: InputController,
  controllerAs: 'vm',
  require: { ngModelCtrl: '?ngModel' },
  bindings: {
	  ngValue: '<',
	  ngModel: "<",
	  onUpdate: '&',
  }
}
