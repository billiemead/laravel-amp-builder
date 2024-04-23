var base = require('./textnode').default;
var Selection = require('../selection');
var Util = require('../util');
class node extends base{
	
	handleKeydownDelete(event){
		var node = Selection.getSelectionStart(document)
		var disableDoubleReturn = this.getEditorOptions().disableDoubleReturn;
		var isEmpty = /^(\s+|<br\/?>)?$/i;
		///console.log('getCaretOffsets', Selection.getCaretOffsets(node));
		if (Util.isKey(event, [Util.keyCode.BACKSPACE, Util.keyCode.ENTER]) &&
				// has a preceeding sibling
				node.previousElementSibling &&
				// in a header
				// at the very end of the block
				Selection.getCaretOffsets(node).left === 0) {
				
			if (Util.isKey(event, Util.keyCode.BACKSPACE) && isEmpty.test(node.previousElementSibling.innerHTML)) {
				// backspacing the begining of a header into an empty previous element will
				// change the tagName of the current node to prevent one
				// instead delete previous node and cancel the event.
				node.previousElementSibling.parentNode.removeChild(node.previousElementSibling);
				event.preventDefault();
			} else if (!disableDoubleReturn && Util.isKey(event, Util.keyCode.ENTER)) {
				// hitting return in the begining of a header will create empty header elements before the current one
				// instead, make "<p><br></p>" element, which are what happens if you hit return in an empty paragraph
				var p = document.createElement('p');
				p.innerHTML = '<br>';
				node.previousElementSibling.parentNode.insertBefore(p, node);
				event.preventDefault();
			}
		}
		else{
			//event.preventDefault();
		}
		setTimeout(this.checkNewNode.bind(this), 500);
	}
}
module.exports = {
	
	default: node
}