var styleSheet = require('../../../utils/ssultils').StyleSheet;

class InputController {
	
	getUnitList(style)
	{
		return styleSheet.getValidUnitList(style);
	}
	
	getValueFromElement()
	{
		if(this.isEmptyModule())
			return;
		var value = this.getStyle();
		if(!value)
			value = this.getSystemStyle();
		return value;
	}
	getStyle()
	{
		if(this.style)
			return this.getSelectedModule().getStyle(this.style, true);
	}
	getSystemStyle()
	{
		if(this.style)
			return this.getSelectedModule().getSystemStyle(this.style);
	}
	getSelectedModule()
	{
		var children = this.children;
		if(children)
			return this.selectedWidget.getItemModule(children);
		return this.selectedWidget;
	}
	isEmptyModule()
	{
		var widget = this.getSelectedModule();
		return !widget || !widget.getElement().length;
	}
	setValueToElement()
	{
		if(this.isEmptyModule())
			return;
		if(this.unit == 'auto'){
			this.value = "";
			this.modifyStyle('auto');
		}
		else this.modifyStyle(this.getFullValue())
	}
	modifyStyle(value)
	{
		var state = (this.state != undefined ? ':' + this.state : undefined)
		this.getSelectedModule().modifyStyle(this.style, value, state);
	}
	getFullValue()
	{
		return this.value;
	}
	saveHistory()
	{
		this.previousWidget = this.getSelectedModule();
	}
	refresh()
	{
		if(this.previousWidget)
			this.unbindEvent();
		if(!this.isEmptyModule()){
			var value = this.getValueFromElement();
			this.updateNgValue(value);
		}
		this.saveHistory();
		this.bindEvent();
	}
	onSelfUpdate(value)
	{
		if(value == undefined)
			value = this.getValueFromElement();
		this.updateNgValue(value);
	}
	bindEvent()
	{
		if(!this.isEmptyModule()){
			var that = this;
			this.getSelectedModule().addEventHandler('style_changed-' + this.style, function(name, value){
				that.onSelfUpdate(value);
			});
			this.getSelectedModule().addEventHandler('class_changed', function(name){
				that.onSelfUpdate();
			});
		}
	}
	unbindEvent()
	{
		if(this.previousWidget && this.previousWidget.getElement().length){
			this.previousWidget.removeEventHandler('style_changed-' + this.style);
			this.previousWidget.removeEventHandler('class_changed');
		}
	}
	onchange()
	{
		this._onchange();
		
		//_.debounce(this._onchange, 300);
		
	}
	_onchange()
	{
		this.onUpdate({value:this.getFullValue()})
		this.setValueToElement();
	}
	bindResolutionEvent()
	{
		var that = this;
		$(window).on('changeResolution', function()
		{
			that.onSelfUpdate();
		});
	}
	setElStyle()
	{
		if(this.elStyle)
			this.style = this.elStyle;
	}
	$onInit () {
		this.setElStyle();
		this.bindResolutionEvent();
		this.refresh();
	}
	$onChanges(changesObj)
	{
		changesObj.selectedWidget && this.refresh();
		changesObj.ngValue && (this.updateNgValue(changesObj.ngValue.currentValue));
	}
	updateNgValue(currentValue)
	{
		if(currentValue != undefined){
			
			this.value = currentValue;
		}
	}
}

export default {
  template: require('./input.component.html'),
  controller: InputController,
  controllerAs: 'vm',
  bindings: {
	  selectedWidget: '<',
	  ngValue: '<',
	  elStyle: '@?',
	  onUpdate: '&',
	  children: '@?',
	  'selector': '@?',
	  customUnit:'@?',
	  state:'@?'
  }
}
