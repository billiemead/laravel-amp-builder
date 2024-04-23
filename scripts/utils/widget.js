var widgets = window.widgets || window.top.widgets;
function getWidgetCategories()
{
	return widgets.categories;
}
function getFormFields()
{
	return widgets.form_fields;
}
function getWidgetInfomation(type)
{
	var tools = widgets.tools;
	if(type != undefined && tools[type] != undefined){
		return tools[type];
	}
}
function getClass(type)
{
	var classes = widgets.classes;
	if(classes != undefined && classes[type] != undefined){
		return classes[type];
	}
}
module.exports = {
	getWidgetCategories: getWidgetCategories,
	getFormFields: getFormFields,
	getClass: getClass,
	getWidgetInfomation:getWidgetInfomation
	
}