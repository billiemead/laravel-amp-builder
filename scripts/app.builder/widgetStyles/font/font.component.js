var styleSheet = require('../../../utils/ssultils').StyleSheet;
var inputComponent = require('../select/select.component').default;

class Controller extends inputComponent.controller{
	
	$onInit(){
		super.$onInit();
		var that = this;
		$(window).on('page_font_changed', function(){
			that.loadOptions();
		});
	}
	loadOptions()
	{
		super.loadOptions();
		var selectedWidget = this.getSelectedModule();
		if(selectedWidget){
			var fonts = selectedWidget.getBodyFonts();
			if($.isArray(fonts))
				this.items = fonts;
		}
	}
	refresh()
	{
		super.refresh();
		this.loadOptions();
	}
}

export default {
  template: require('./select.component.html'),
  controller: Controller,
  controllerAs: 'vm',
  bindings: $.extend(inputComponent.bindings,{
  })
}
