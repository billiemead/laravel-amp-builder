var input = require('./input').default;
class checkbox extends input{
	getInputValue()
	{
		var inputs = this.getElement().find('input');
		var rs;
		if(inputs.length > 1){
			rs = [];
			inputs.each(function(){
				if($(this).is(':checked'))
					rs.push($(this).val());
			})
		}
		else{
			if(inputs.is(':checked'))
				rs = true;
		}
		return rs;
	}

	getValidateInputElement()
	{
		var inputs = this.getElement().children('label').children('input[type="checkbox"]');
		if(inputs.length)
			return inputs[0];
	}
}
module.exports = {
	
	default: checkbox
}