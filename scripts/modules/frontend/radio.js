var input = require('./input').default;
class radio extends input{
	getInputValue()
	{
		var rs;
		
		var selected = this.getElement().find('input:checked');
		if(selected.length == 1){
			rs = selected.val();
		}
		return rs;
	}
	getValidateInputElement()
	{
		var inputs = this.getElement().children('label').children('input[type="radio"]');
		if(inputs.length)
			return inputs[0];
	}
}
module.exports = {
	
	default: radio
}