var Selection = require('../../selection');
var Util = require('../../util');
var mx = require('mixwith');
var tagScores = {
	'span':3,
	'strong':2,
	'em':1
}
let MyMixin = mx.Mixin((superclass) => class extends superclass{
	changeTagName(newTag) {
		var element = this.getElement();
		var originalElement = element[0]
		, originalTag = originalElement.tagName
		, startRX = new RegExp('^<'+originalTag, 'i')
		, endRX = new RegExp(originalTag+'>$', 'i')
		, startSubst = '<'+newTag
		, endSubst = newTag+'>'
		, newHTML = originalElement.outerHTML
		.replace(startRX, startSubst)
		.replace(endRX, endSubst);
		
		var newElement = $(newHTML);
		newElement[0].widget_id  = originalElement.widget_id;
		element.replaceWith(newElement);
		this.element = newElement;
		return newElement;
	}
	wrapTextNodesByRange(currentRange)
	{
		var container = range.commonAncestorContainer
	}
	wrapRangeByTag(currentRange, tag)
	{
		
	}
	cloneNode()
	{
		var clone = this.clone();
		if(!this.hasPageId())
			clone.removePageId();
		return clone;
	}
	removeFormat(range)
	{
		var block = this.getElement().css('display') == 'block';
		if(block)	return;
		var rs = this.splitByRange(range);
		
		return rs;
	}
	surroundRangeContents(range, tag)
	{
		var tagName = this.getElement()[0].tagName.toLowerCase();
		if(tagScores[tagName] && tagScores[tag] && tagScores[tagName] < tagScores[tag]){
			var rs = this.splitByRange(range);
			var wrapper = document.createElement(tag);
			var nrange = document.createRange();
			var clone = this.cloneNode();
			this.getElement().after(clone.getElement());
			clone.getElement().html('');
			
			for(var i in rs){
				clone.getElement()[0].appendChild(rs[i]);
			}
			nrange.selectNode(clone.getElement()[0]);
			nrange.surroundContents(wrapper);
			return wrapper;
			return rs;
			var clone = this.cloneNode();
			this.getElement().before(clone.getElement());
			clone.getElement().html(range.extractContents());
			
			var nrange = document.createRange();
			nrange.selectNode(clone.getElement()[0]);
			Selection.selectRange(false, nrange);
			var wrapper = document.createElement(tag);
			nrange.surroundContents(wrapper);
			return wrapper;
		}
		else{
			var wrapper = document.createElement(tag);
			range.surroundContents(wrapper);
			return wrapper;
		}
	}
	splitByRange(range)
	{
		var ranges = this.getSiblingRanges(range);
		if(!ranges || !ranges.length)
			return;
	
		var clone = this.cloneNode();
		clone.getElement().html(ranges[1].extractContents());
		var html = range.extractContents();
		clone.getElement().before(html);
		var rs = [];
		var node = clone.getElement()[0].previousSibling;
		while(node != this.getElement()[0])
		{
			rs.push(node);
			node = node.previousSibling;
		}
		ranges[1].collapsed && clone.getElement().remove();
		ranges[0].collapsed && this.getElement().remove();
		//console.log('splitByRange', ranges);
		return rs;
	}
	isEmptyNode(node){
		var isEmpty = /^(\s+|<br\/?>)?$/i;
		return isEmpty.test(node.innerHTML);
	}
	
	hasPageId()
	{
		return this.getElement().attr('id') != undefined;
	}
	removePageId()
	{
		this.getElement().removeAttr('id');
		delete this.page_id;
	}
	getSiblingRanges(range)
	{
		var element = this.getElement()[0];
		var node = range.startContainer;
		if(node.parentNode == element){
			node = range.endContainer;
			if(node.parentNode == element)
				node = false;
		}
			
		var leftRange, rightRange;
		var startOffset = range.startOffset
		  , endOffset = range.endOffset;
		leftRange = document.createRange();
		rightRange = document.createRange();
		leftRange.selectNodeContents(range.startContainer), rightRange.selectNodeContents(range.endContainer);
		leftRange.setEnd(range.startContainer, startOffset);
		rightRange.setStart(range.endContainer, endOffset);
		var childNodes = element.childNodes;
		if(childNodes.length){
			leftRange.setStart(childNodes[0], 0);
			var endOffset = (childNodes[childNodes.length - 1].length || childNodes[childNodes.length - 1].childNodes.length);
			rightRange.setEnd(childNodes[childNodes.length - 1], endOffset);
		}
		
		
		
		return [leftRange, rightRange];
	}
	__getDataElement()
	{
		return this.getElement().next('script[type="text/json"]');
	}
	removeEmptyTextNode(){}
	getEditorElement()
	{
		return this.getElement();
	}
	setStyle(name, value, opacity, selector)
	{
		if(this.getElement().attr('id') == undefined)
			this.changePageId();
		super.setStyle(name, value, opacity, selector);
	}
	handleKeydownDelete(){
		var node = Selection.getSelectionStart(document)
		var disableDoubleReturn = this.getEditorOptions().disableDoubleReturn;
		var isEmpty = /^(\s+|<br\/?>)?$/i;
		if (Util.isKey(event, Util.keyCode.BACKSPACE) &&
				Util.isEditorElement(node.parentElement) &&
				!node.previousElementSibling &&
				node.nextElementSibling &&
				isEmpty.test(node.innerHTML)) {

			// when cursor is in the first element, it's empty and user presses backspace,
			// do delete action instead to get rid of the first element and move caret to 2nd
			event.preventDefault();
			Selection.moveCursor(document, node.nextSibling);
			node.parentElement.removeChild(node);
		}
		if (Util.isKey(event, Util.keyCode.ENTER)){
			document.execCommand('insertHTML', false, '<br/>');
			event.preventDefault();
		}
		setTimeout(this.checkNewNode.bind(this), 500);
	}
	
	checkNewNode()
	{
	}
	getParentEditorModule()
	{
		var parentElement = this.getElement().parents("." + this.getDefaultClass());
		var module = pageEdit.getModule(parentElement);
		return module;
	}
	getEditorOptions()
	{
		var module = this.getParentEditorModule();
		if(module)
			return module.getEditorOptions();
		return {};
	}
	getSyncModules()
	{
		var rs = [];
		if(!this.isGlobalModule())
			return [];
		var module = this.getParentEditorModule();
		if(!module)
			return [];
		var parentSyncModule = module.getSyncModules();
		return rs;
	}
});

module.exports = {
	
	default: MyMixin,
}