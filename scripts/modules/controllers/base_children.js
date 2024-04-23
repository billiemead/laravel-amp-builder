var base = require('./base').default;



export default createModuleDefinition([base], function($file_manager,$dialog, safeApply, pageEdit, pageEdit_layout) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'click_action', 'text', 'text-shadow', 'border', 'background'];
	this.loadElement = function(element)
	{
		//this.__callSuper('loadElement', element);
	}
	this.isPseudoElement = function()
	{
		return this.selector[0] == ':'
	}	
	this.getShadowElement = function()
	{
		var element = this.__call('getShadowElement');
		if(element != undefined && element.length && this.isPseudoElement()){
			element.attr('state', this.selector);
		}
		return element;
	}
	this.delete = function()
	{
		if(this.shadowElement){
			this.shadowElement.remove();
			delete this.shadowElement;
		}
		return;
	}
	this.getElement = function()
	{
		if(this.selector[0] != ':')
			return this.parentModule.getElement().find(this.selector);
		return this.parentModule.getElement();
	}
	this.setStyle = function(name, value, element)
	{
		return this.parentModule.setStyle(name, value, this.selector);
	};
	this.getCurrentStyles = function()
	{
		var styles = this.parentModule.getCurrentItemStyles(this.selector);
		return styles;
	}
	
});
