var box = require('./box').default;
var pageEdit = require('../../utils/pagemanager.iframe/pageEdit_front');
class form extends box{
	insertCompleted()
	{
		if(this.is_clone_element)
		{
			return;
		}
		for(var i in this.property.fields){
			var field = this.property.fields[i];
			var module = this.insertField(field);
		}
	}
	insertNewDataField(field)
	{
		this.insertField(field);
		
	}
	
	_getInputFieldModules(modules, filters){
		var rs = [];
		for(var i = modules.length - 1;i >=0;i--){
			var type = modules[i].type;
			if(type == 'form_group'){
				var child_modules = modules[i].getChildModules();
				var child_fields = this._getInputFieldModules(child_modules, filters);
				rs = rs.concat(child_fields);
				continue;
			}
			if(filters.indexOf(type) >=0)
				rs.push(modules[i]);
		}
		return rs;
	}
	getInputFieldModules()
	{
		var modules = this.getChildModules();
		var input_modules = ['email', 'input', 'number', 'text_area', 'dropdown', 'multi_dropdown', 'radio', 'checkbox', 'phone', 'password'];
		var rs = this._getInputFieldModules(modules, input_modules);
		if($.isArray(rs))
			rs = rs.reverse();
		return rs;
	}
	getHiddenInputs()
	{
		if(this.getChildModules == undefined)
			return [];
		var modules = this.getChildModules();
		return this._getInputFieldModules(modules, ['hidden']);
	
	}
	getFieldList()
	{
		var list = [];
		var input_modules = this.getInputFieldModules();
		for(var i in  input_modules){
			var name = input_modules[i].getPage_id();
			var display_name = input_modules[i].getPlaceholderName();
			list.push({name:name, display_name:display_name});
		}
		var hiddens = this.getHiddenInputs();
		for(var i in  hiddens){
			var name = hiddens[i].getPage_id();
			var display_name = hiddens[i].getPlaceholderName();
			list.push({name:name, display_name:display_name});
		}
		return list;
		
	}
	
	insertField(field)
	{
		var formElement = this.getElement();
		var dropInfo = {
			node: field.node || formElement,
			direction: 'bottom',
			inner:true,
			data:field.data,
			info: field.info,
			insert_after: field.insert_after
		};
		
		return pageEdit.insertModule(formElement, field.type, dropInfo);
	}
	getContainer()
	{
		return this.getElement().children('form');
	}
	
}
module.exports = {
	
	default: form
}