var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../input/input.component').default;

class Controller extends inputComponent.controller{
	
	setValueToElement()
	{
		this.modifyStyle(this.value)
	}
	$onInit()
	{
		super.$onInit();
		this.loadOptions();
		
	}
	loadOptions()
	{
		var csstag = styleSheet.csstag;
		var style = this.style;
		this.items = [];
		if(style){
			for(var i in csstag){
				var tag = csstag[i];
				
				if(tag[0] == style && tag[1] == 'select')
				{
					this.items = tag[2];
				}
			}
		}
	}
	updateNgValue(currentValue)
	{
		if(currentValue != undefined){
			
			this.value = currentValue;
		}
	}
	
}

export default {
  template: require('./select.component.html'),
  controller: Controller,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
  })
}
