class InputController {
	constructor ($rootScope) {
		'ngInject';
	}
	toggle()
	{
		this.parentComp.select(this);
		
	}
	$onInit () {
		this.parentComp.addItem(this);
	}
	
}

export default {
	require: {parentComp:'^widgetStyleCheckbox'},
	template: require('./checkboxItem.component.html'),
	controller: InputController,
	controllerAs: 'vm',
	bindings: {
		value: '@?',
		icon: '@?',
		text: '@?',
	}
}
