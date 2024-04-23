var input = require('./input').default;
class textarea extends input{
	setTabIndex(value)
	{
		$('textarea', this.getElement()).attr('tabindex', value);
	}
	getInputValue()
	{
		return this.getElement().children('textarea').val();
	}
	getValidateInputElement()
	{
		return this.getElement().children('textarea');
	}
}
module.exports = {
	
	default: textarea
}