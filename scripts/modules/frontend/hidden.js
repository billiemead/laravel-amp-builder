var input = require('./input').default;
class hidden_field extends input{
	loadElement(element)
	{
		super.loadElement(element);
	}
	getInputValue()
	{
		
		var source = this.data.source;
		var value = this.data.value;
		if(source == 'get'){
			value = this.getParamFromUrl(value);
		}
		else if(source == 'cookie'){
			value = this.getCookie(value);
		}
		return value;
	}
	getCookie(name) {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length == 2) return parts.pop().split(";").shift();
	}
	getParamFromUrl( name, url ) {
		if (!url) url = location.href;
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		return results == null ? null : results[1];
	}
	getCurrentVisibility()
	{
		return false;
	}
	getPlaceholderName()
	{
		return (this.data ? this.data.name: 'Hidden');
	}
}
module.exports = {
	
	default: hidden_field
}