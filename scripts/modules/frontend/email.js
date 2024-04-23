var input = require('./input').default;
class email_field extends input{
	
	getInputValue()
	{
		return this.getElement().children('input').val();
	}
}
module.exports = {
	
	default: email_field
}