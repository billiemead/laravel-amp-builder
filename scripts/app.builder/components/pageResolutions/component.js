var resolutionFunc = require('../../../utils/resolution')
function getBreakpoints()
{
	return resolutionFunc.getBreakpointList(false);
}
function getDefaultBreakpoint()
{
	return resolutionFunc.getDefaultBreakpoint();
}
class Controller {
	
	constructor(pageEdit){
		"ngInject";
		this.pageEdit = pageEdit;
	}
	doResponsive(name) {
		for(var i in this.responsiveIcons)
			$('#frameWrapper').removeClass(this.responsiveIcons[i]);
		$('#frameWrapper').addClass(name);
		this.currentResponsiveMode = name;
		var bodyModule = this.pageEdit.getBodyModule();
		if(bodyModule)
			bodyModule.changeResolution(name);
		
	}
	$onInit () {
		this.responsiveIcons = getBreakpoints();
		this.currentResponsiveMode = getDefaultBreakpoint();
	}
}

export default {
  template: require('./component.html'),
  controller: Controller,
  controllerAs: 'vm',
  bindings: {
	
  }
}
