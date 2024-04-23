var mx = require('mixwith');
let MyMixin = mx.Mixin((superclass) => class extends superclass {
	findGlobalBlocks(system_id)
	{
		var modules = pageEdit.getModules();
		var rs = [];
		for(var i in modules){
			if(modules[i].getType() == this.getType() && modules[i].getSystemId() == system_id){
				rs.push(modules[i]);
			}
		}
		return rs;
	}
	getSystemId()
	{
		return this.module_data.system_id;
	}
	createElement(dropInfo)
	{
		var system_id = dropInfo.data.system_id;
		this.module_data = this.initializeData = dropInfo.data;
		var defered = $.Deferred();
		var content = dropInfo.content;
		var compiledTemplate = $(content);
		defered.resolve(compiledTemplate);
		return defered.promise();
	}
	getCloneData()
	{
		var data = super.getCloneData();
		data.system_id = this.getSystemId();
		return data;
	}
	insertModule(module, dropInfo, sync)
	{
		if(dropInfo.inner){
			super.insertModule(module, dropInfo, sync);
		}
		else
			super.insertModule(module, dropInfo, {sync:true});
	}
	isGlobalModule()
	{
		return true;
	}
	
  
});
class section{
	
}
module.exports = {
	
	default: MyMixin
}