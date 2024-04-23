var base = require('./text').default;
class label extends base{
	changeTagName(newTag) {
		var element = this.getElement();
		var originalElement = element[0]
		, originalTag = originalElement.tagName;
		
		var newElement = document.createElement(newTag);
		while(originalElement.childNodes.length){
			newElement.appendChild(originalElement.childNodes[0]);
		}
		for (var i= 0, atts = originalElement.attributes, n = atts.length; i < n; i++){
			var att = atts[i];
			newElement.setAttribute(att.nodeName, att.nodeValue)
		}
		newElement.widget_id  = originalElement.widget_id;
		element.replaceWith(newElement);
		this.element = newElement;
		return newElement;
	};
}
module.exports = {
	
	default: label
}