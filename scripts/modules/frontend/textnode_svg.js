var base = require('./svg').default;
var textnode = require('./mixins/textnode').default;
var mx = require('mixwith');

class node extends mx.mix(base).with(textnode){
	loadElement(element)
	{
		super.loadElement(element);
		if(this.getElement().attr('url') != undefined){
			this.data = {src : this.getElement().attr('url')}
			this.parseSVGFile(this.data.src);
			this.getElement().removeAttr('url')
		}
	}
	updateView()
	{
		var code = this.data.code;
		var div = $('<div></div>');
		div.html(code);
		var svg = div.find('svg');
		if(svg.length)
		{
			this.getElement().html(svg.html())
			var element = this.getElement()[0];
			for (var i = 0, atts = svg[0].attributes, n = atts.length, arr = []; i < n; i++){
				element.setAttribute(atts[i].nodeName, atts[i].nodeValue);
			}
		}
	}
	
}
module.exports = {
	
	default: node
}