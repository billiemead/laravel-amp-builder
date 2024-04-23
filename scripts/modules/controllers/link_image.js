var base = require('./base').default;
var image = require('./image').default;
var link_block = require('./base_linkblock').default;


export default createModuleDefinition([base,image, link_block], function($file_manager,$dialog, $cacheFactory) 
{
	"ngInject";
	this.resizable = true;
	
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		
	};
	this.canDropTo = function(module)
	{
		var parentForm = this.getParentModule();
		if(parentForm){
			return module.getType() == 'link_block';
		}
		return module.getType() == 'link_block';
	}
});