var inputComponent = require('../input/input.component').default;

class InputController extends inputComponent.controller{
	constructor ($rootScope, ContextService) {
		'ngInject';
		super();
		this.items = this.items || [];

	}
	refresh()
	{
		super.refresh();
		var value = this.value;
		var that = this;
		angular.forEach(this.items, function(item) {
			item.value == value && that.select(item, true);
		});
	}
	select(item, is_default)
	{
		this.value != item.value && (this.value = item.value);
		
		!is_default && this.callUpdate(item.value);
		
		item.selected = !item.selected;
	}
	callUpdate(value)
	{
		this.onUpdate({value:value});
		if(this.ngModelCtrl){
			this.ngModelCtrl.$setViewValue(value);
		}
	}
	$onChanges(changesObj)
	{
		super.$onChanges(changesObj);
		this.refresh();
	}
	addItem(item)
	{
		this.items.push(item);
		(this.value != undefined && item.value == this.value) && (item.selected = true);
	}
	toggleItemByValue(value)
	{
		
		var that = this;
		angular.forEach(this.items, function(item) {
			if(item.value == value)
				item.selected = true;
			else
				item.selected = false;
		});
	}
	updateNgValue(currentValue)
	{
		
		if(currentValue != undefined){
			this.value = currentValue;
			this.toggleItemByValue(currentValue);
		}
		
			
	}
}

export default {
  template: require('./checkbox.component.html'),
  controller: InputController,
  require: inputComponent.require,
  transclude: true,
  controllerAs: 'vm',
  bindings: inputComponent.bindings
}
