var input = require('./input').default;
class number_field extends input{
	
	getInputValue()
	{
		return this.getElement().children('input').val();
	}
}
module.exports = {
	
	default: number_field
}