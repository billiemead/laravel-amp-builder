var input = require('./input').default;
class textarea extends input{
	getInputValue()
	{
		return this.getElement().children('select').val();
	}
}
module.exports = {
	
	default: textarea
}