class InputController {
	constructor ($rootScope) {
		'ngInject';
	}
	toggle()
	{
		this.getParentComponent().select(this);
		
	}
	getParentComponent()
	{
		return this.widgetCheckbox || this.widgetRadio;;
	}
	$onInit () {
		
		this.getParentComponent().addItem(this);
	}
	$onChanges(changesObj)
	{
		this.getParentComponent().refresh();
	}
}

export default {
	require: {
		widgetCheckbox:'?^widgetCheckbox',
		widgetRadio:'?^widgetRadio'
	},
	template: require('./checkboxItem.component.html'),
	controller: InputController,
	controllerAs: 'vm',
	bindings: {
		value: '@?',
		icon: '@?',
		text: '@?',
		tooltip:'@?'
	}
}
