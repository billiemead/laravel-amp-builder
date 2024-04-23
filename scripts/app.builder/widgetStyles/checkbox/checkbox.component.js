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
		if(this.value){
			this.checkActiveItem();
		}
	}
	onSelfUpdate(value)
	{
		super.onSelfUpdate(value);
		if(this.value){
			this.checkActiveItem();
		}
	}
	checkActiveItem()
	{
		var value = this.value;
		var that = this;
		angular.forEach(this.items, function(item) {
			item.value == value && that.select(item, true);
		});
	}
	select(item, is_default)
	{
		!is_default && this.modifyStyle(item.value);
		angular.forEach(this.items, function(item) {
			item.selected = false;
		});
		item.selected = true;
		
	}
	
	addItem(item)
	{
		this.items.push(item);
	}
	updateNgValue(currentValue)
	{
		if(currentValue != undefined){
			this.value = currentValue;
		}
			
	}
}

export default {
  template: require('./checkbox.component.html'),
  controller: InputController,
  transclude: true,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
	  toogleStyle:'@'
  })
}
