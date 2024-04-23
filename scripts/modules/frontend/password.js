var input = require('./input').default;
class password_field extends input{
	
	getInputValue()
	{
		return this.getElement().children('input').val();
	}
}
module.exports = {
	
	default: password_field
}