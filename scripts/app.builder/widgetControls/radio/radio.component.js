var inputComponent = require('../checkbox/checkbox.component').default;

class InputController extends inputComponent.controller{
	select(item, is_default)
	{
		this.value != item.value && (this.value = item.value);
		
		!is_default && this.callUpdate(item.value);
		angular.forEach(this.items, function(item) {
			item.selected = false;
		});
		item.selected = true;
		
	}
	
}

export default {
  template: require('./checkbox.component.html'),
  controller: InputController,
  transclude: true,
  controllerAs: 'vm',
  require: inputComponent.require,
  bindings: inputComponent.bindings
}
