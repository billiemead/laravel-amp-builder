var base = require('./base').default;
export default createModuleDefinition([base], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button, API) 
{
	"ngInject";
	this.cloneable = false;
	
	this.canDropTo = function(module)
	{
		var parentForm = this.getParentForm();
		if(parentForm && module.getPage_id() == parentForm.getPage_id()){
			return true;
		}
		return module.getType() == 'form' || module.getType() == 'form_group';
	}
	this.getParentForm = function()
	{
		var parentElement = this.getElement().parents("." + pageEdit_layout.module_class + '.form');
		var module = pageEdit.getModule(parentElement);
		return module;
	}
	/*this.appendOverlay = function()
	{
		if(this.overlayDiv && this.overlayDiv.length)
			return;
		this.overlayDiv = jQuery_iframe("<div style=\"width:100%;height:100%;z-index:10;top:-100%;left:0;position:relative;\"></div>");//.appendTo(this.element);
	}
	this.loadElement = function(element)
	{
		this._loadElement(element);
		this.appendOverlay();
	};
	*/
	this.setData = function(data, updateView)
	{
		this.frontend_module.setData(data, updateView);
		var that = this;
		if(updateView){
			setTimeout(function(){
				that.appendOverlay();
			}, 500);
			
		}
	};
	this.setDataByKey = function(name, data, updateView)
	{
		this.frontend_module.setDataByKey(name, data, updateView);
		var that = this;
		if(updateView){
			setTimeout(function(){
				that.appendOverlay();
			}, 500);
			
		}
	};
});