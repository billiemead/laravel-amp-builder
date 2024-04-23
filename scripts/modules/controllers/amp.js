export default function(pageEdit){
	"ngInject";
	this.isResizable = function()
	{
		var rs = this.isAMPElement();
		return rs;
	}
	
};
