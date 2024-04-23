var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../input/input.component').default;

class InputController extends inputComponent.controller {
	updateColorOpacity(opacity)
	{
		this.value = this.addOpacity(opacity);
		this.onchange();
	}
	addOpacity(opacity)
	{
		var value = this.value;
		if(value.name != undefined)
			value.opacity = opacity;
		else{
			value = this.toRgba(value,opacity);
		}
		return value;
	}
	toRgba(color, opacity)
	{
		if(color == 'transparent')
			return color;
		opacity = parseInt(opacity, 10) / 100;
		var v = new window.edit_page.Color(color);
		v.a = opacity;
		return v.toString();
	}
	onchangeColor()
	{
		this.onchange();
		this.opacity = this.extractOpacity(this.value);
	}
	extractOpacity(value)
	{
		if(value != undefined && value.name != undefined)
			return value.opacity || 100;
		var v = new window.edit_page.Color(value);
		return (v.a || 1) * 100;
	}
	updateNgValue(currentValue)
	{
		super.updateNgValue(currentValue);
		this.opacity = this.extractOpacity(this.value);
	}
}

export default {
  template: require('./color.component.html'),
  controller: InputController,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
	  'withOpacity': "@?"
  })
}
