var input = require('./input').default;
class textarea extends input{
	getInputValue()
	{
		return this.getElement().children('select').val();
	}
	getValidateInputElement()
	{
		return this.getElement().children('select');
	}
}
module.exports = {
	
	default: textarea
}