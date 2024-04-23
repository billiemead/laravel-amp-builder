export default function() 
{
	"ngInject";
	this.canDropTo = function(module)
	{
		var parentForm = this.getParentModule();
		if(parentForm){
			return module.getType() == 'link_block';
		}
		return module.getType() == 'link_block';
	}
	
};
