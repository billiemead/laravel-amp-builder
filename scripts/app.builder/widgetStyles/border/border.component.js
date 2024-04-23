var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../margin/margin.component').default;
function borderEventList()
{
	var directions = ['', 'top', 'left', 'bottom', 'right'];
	var directions = directions.map(function(item)
	{
		return 'style_changed-border' + (item.length ? '-' + item: '');
	});
	return directions.join(' ');

}
class Controller extends inputComponent.controller{
	
	refresh()
	{
		super.refresh();
		this.mode = this.mode  || 'all';
		this.currentProperty = 'border';
		this.currentEditValue = this.getValueFromElement();
		
	}
	updateItem(direction, value)
	{
		if(this.currentEditValue){
			var updateValue = angular.copy(this.currentEditValue);
			this.currentEditValue[direction] = value;
			this.modifyStyle(this.currentEditValue);
		}
	}
	modifyStyle(value)
	{
		this.style = this.getCurrentBorderProperty();
		super.modifyStyle(value)
	}
	getStyle()
	{
		this.style = this.getCurrentBorderProperty();
		var style = super.getStyle();
		return style;
	}
	getSystemStyle()
	{
		var borders = this.getSelectedModule().getBorderValue();
		var mode = this.mode || 'all';
		return borders[mode];
	}
	getCurrentBorderProperty()
	{
		return 'border' + (this.mode != 'all' ? ('-' + this.mode) : '')
	}
	onSelfUpdate(value, name)
	{
		super.onSelfUpdate(value);
		if(value != undefined){
			this.mode = (name == 'border' ? 'all': name.replace('border-', ''));
			this.currentEditValue = value;
		}
		else
			this.currentEditValue = this.getValueFromElement();
	}
	bindEvent()
	{
		if(!this.isEmptyModule()){
			var that = this;
			this.getSelectedModule().addEventHandler(borderEventList(), function( name, value){
				that.onSelfUpdate(value, name);
					
			});
			this.getSelectedModule().addEventHandler('class_changed', function(name){
				that.onSelfUpdate();
			});
		}
	}
	unbindEvent()
	{
		if(this.previousWidget && this.previousWidget.getElement().length){
			this.previousWidget.removeEventHandler(borderEventList());
			this.previousWidget.removeEventHandler('class_changed');
		}
	}
	changeMode(value)
	{
		this.mode = value;
		this.currentProperty = this.getCurrentBorderProperty()
		this.currentEditValue = this.getValueFromElement();
		console.log('changeMode',this.currentEditValue);
	}
	
	
	
}

export default {
  template: require('./border.component.html'),
  controller: Controller,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
  })
}
