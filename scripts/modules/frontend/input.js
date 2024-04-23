var base = require('./base').default;
class input extends base{

	getFieldType()
	{
		return $('input', this.getElement()).attr('type');
	}
	
	getValidateInputElement()
	{
		return this.getElement().children('input');
	}
	getFormData(named)
	{
		return {
			name: (named ? this.getInputName() :this.getPage_id()),
			value: this.getInputValue()
		};
	}
	getInputName()
	{
		return this.data.name;
	}
	getPlaceholderName()
	{
		return this.data.name || this.data.placeholder || this.getType();
	}
	getInputValue()
	{
		return getValue(this.getElement().children('input'));
	}
	loadElement(element)
	{
		super.loadElement(element);
		
		
	}
}
module.exports = {
	
	default: input
}