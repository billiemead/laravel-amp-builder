var baseComponent = require('../../../app.builder/components/pageResolutions/component').default;
var resolutionFunc = require('../../../utils/resolution')

class Controller  extends baseComponent.controller{
	constructor(API){
		"ngInject";
		super();
	}
	doResponsive(name) {
		this.currentResponsiveMode = name;
		$('#iframelive').attr('class', name);
		var resolution = resolutionFunc.getBreakpointInfo(name);
		var width = resolution.breakpoint * 1 + 30 - 8 * 2;
		$('#frameWrapper').width(width);
	}
	$onInit () {
		super.$onInit();
		this.doResponsive(this.currentResponsiveMode);
	}
}

export default {
  template: baseComponent.template,
  controller: Controller,
  controllerAs: 'vm',
}
