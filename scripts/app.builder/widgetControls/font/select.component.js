var inputComponent = require('../input/input.component').default;

class Controller extends inputComponent.controller{
	constructor () {
		'ngInject';
		super();
		this.items = this.items || [];

	}
	
	
	addItem(item)
	{
		this.items.push(item);
	}
	
}

export default {
  template: require('./select.component.html'),
  controller: Controller,
  controllerAs: 'vm',
  require: inputComponent.require,
  bindings: inputComponent.bindings
}
