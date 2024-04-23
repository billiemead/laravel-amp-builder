var base = require('./base').default;
var input = require('./input').default;

export default createModuleDefinition([base, input], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
	};
	this.resizeByDistance = function(dwidth, dheight){}
	this.moveByDistance =  function(distanceY, distanceX){}
	this.tab_editor = ['hidden_field'];
});