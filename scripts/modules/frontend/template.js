var mx = require('mixwith');
let MyMixin = mx.Mixin((superclass) => class extends superclass {
	changePageId(copyStyle = false)
	{
		
		this.getContainer().find('.' + this.getDefaultClass()).each(function(i)
		{
			
			var moduleInstance = pageEdit.createModule(this);
			if(!moduleInstance)
			{
				return;
			}
			moduleInstance.changePageId(copyStyle);
			
		});
		super.changePageId(copyStyle);
	}
	shouldChangePageId()
	{
		this.changePageId(true);
		if($('#' + this.getPage_id()).length > 1)
		{
			//console.trace();
			//this.changePageId(true);
		}
	}
  
});
module.exports = {
	
	default: MyMixin
}