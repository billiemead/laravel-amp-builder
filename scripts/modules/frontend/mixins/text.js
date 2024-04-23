var base = require('../base').default;
var Selection = require('../../selection');
var Util = require('../../util');
var PasteHandler = require('../../paste');
var mx = require('mixwith');

let MyMixin = mx.Mixin((superclass) => class extends superclass{
	
	getEditorOptions()
	{
		return {
			
		}
	}
	
	loadElement(element)
	{
		super.loadElement(element);
		this.initContents();
	}
	initContents()
	{
		var that = this;
		var textNodes = this.getEditorElement().contents();
		textNodes.each(function(){
			if(this.nodeType == 1)
				that.createTextNode(this);
		});
	}
	getEditorElement()
	{
		return this.getElement();
	}
	getChildModules()
	{
		var rs = [];
		var that = this;
		var textNodes = this.getEditorElement().contents();
		textNodes.each(function(){
			if(this.nodeType == 1){
				var module = pageEdit.getModule(this);
				if(module){
					rs.push(module);
				}
			}
		});
		return rs;
	}
	copyDataTo(new_element, newID = true)
	{
		var modules = this.getChildModules();
		for(var i in modules){
			var copiedElement = $(new_element).find('#' +modules[i].getPage_id() );
			copiedElement.length && modules[i].copyDataTo(copiedElement, newID);
		}
		$(new_element).removeAttr('contenteditable');
		return super.copyDataTo(new_element, newID);
		
	}
	getContents()
	{
		var that = this;
		var textNodes = this.getEditorElement().html();
		return textNodes;
	}
	clearRangeTag(tag)
	{
		
	}
	removeSingleRangeFormat(range)
	{
		var p = Selection.getParentElement(range.startContainer);
		if(p && p != this.getElement()[0]){
			var module = pageEdit.getModule(p);
			return module.removeFormat(range);
		}
	}
	wrapSingleRangeByTag(range, tag, parentRange)
	{
		if(range.startContainer != range.endContainer)
			return;
		!parentRange && (parentRange = Selection.getSelectionRange());
		
		var p = Selection.getParentElement(range.startContainer);
		var p1 = Selection.getParentElement(range.startContainer, tag);
		var isFullWrapped = this.isRangeFullyHighlight(range, p, range.startContainer);
		var unwrapSelection = !isFullWrapped && (parentRange == range);
		
		if((p1 || p) && (p1 || p).tagName.toLowerCase() == tag.toLowerCase()){
			if(unwrapSelection){
				var module = pageEdit.getModule(p);
				return module.splitByRange(range);
				
			}
			return (p1 || p);
		}
		var checkMergeale = function(sibling)
		{
			return sibling != null && Selection.rangeIntersectsNode(parentRange, sibling) && sibling.tagName.toLowerCase() == tag.toLowerCase() && (!sibling.id || sibling.id == "");
		}
		if(checkMergeale(range.startContainer.nextElementSibling)){
			var siblingElement = range.startContainer.nextElementSibling;
			if(siblingElement.childNodes.length)
				siblingElement.insertBefore(range.extractContents(), siblingElement.childNodes[0]);
			else
				siblingElement.appendChild(range.extractContents());
			return siblingElement;
			
		}
		else if(checkMergeale(range.startContainer.previousElementSibling)){
			var siblingElement = range.startContainer.previousElementSibling;
			siblingElement.appendChild(range.extractContents());
			return siblingElement;
		}
		//console.log(range, p);return;
		if(p){
			var module = pageEdit.getModule(p);
			if(module)
				return module.surroundRangeContents(range, tag);
		}
		else{
			var wrapper = document.createElement(tag);
			range.surroundContents(wrapper);
		}
		
		return wrapper;
	}
	surroundRangeContents(range, tag)
	{
		var wrapper = document.createElement(tag);
		range.surroundContents(wrapper);
		return wrapper;
	}
	removeFormat(range)
	{
		!range && (range = Selection.getSelectionRange());
		if(range.collapsed)
			return;
		var textNodes = Selection.getRangeTextNodes(range);
		var ranges = Selection.getRangesFromTextNodes(range, textNodes);
		for(var i = ranges.length - 1;i >=0;i--){
			var wrap = this.removeSingleRangeFormat(ranges[i]);
			
		}
		
	}
	wrapRangeByTag(range, tag)
	{
		!range && (range = Selection.getSelectionRange());
		if(range.collapsed)
			return;
		var rs = []
		if(range.startContainer == range.endContainer){
			var wrap = this.wrapSingleRangeByTag(range, tag);
			if(wrap != undefined){
				this.createTextNode(wrap);
				rs.push(wrap);
			}
			return rs;
		}
		if(range.commonAncestorContainer.tagName && range.commonAncestorContainer.tagName.toLowerCase() == tag.toLowerCase()){
			var module = pageEdit.getModule(range.commonAncestorContainer);
			return module && module.splitByRange(range);
		}
		var textNodes = Selection.getRangeTextNodes(range);
		var ranges = Selection.getRangesFromTextNodes(range, textNodes);
		for(var i = ranges.length - 1;i >=0;i--){
			var wrap = this.wrapSingleRangeByTag(ranges[i], tag);
			if(wrap != undefined){
				this.createTextNode(wrap);
				rs.push(wrap);
			}
		}
		return rs;
		
	}
	isRangeFullyHighlight(range, element, node){
		//if(node.nodeType == 3)
			//return false;
		var nodeHighlighted = (range.endContainer == range.startContainer) && ((range.endOffset - range.startOffset) == range.commonAncestorContainer.length);
		if(!nodeHighlighted)
			return false;
		if(element.childNodes.length > 1)
			return false;
		return true;
	}
	changeRangeStyle(range, style)
	{
		!range && (range = Selection.getSelectionRange());
		
		var textNodes = Selection.getRangeTextNodes(range);
	}
	createTextNode(node)
	{
		if(!node || !node.tagName || this.isEmptyNode(node))
			//node.remove();
			return;
		
		var isHeader = /h\d/i;
		var tagName = node.tagName.toLowerCase();
		if(tagName == 'script'){
			node.remove();
			return;
		}
		if(isHeader.test(tagName))
		{
			return pageEdit.createModule(node, 'textnode_heading', true);
		}
		else if(pageEdit.moduleDefinitionExist('textnode_' + tagName)){
			return pageEdit.createModule(node, 'textnode_' + tagName, true);
		}
		else
			return pageEdit.createModule(node, 'textnode', true);
	}
	setRangeStyle(range, name, style)
	{
		
	}
	initEditor()
	{
		if(!this.inlineEditor){
			this.inlineEditor = new InlineEditable(this);
		}
		this.inlineEditor.init();
		//this.initMutationObserver();
	}
	isEmptyNode(node)
	{
		var isEmpty = /^(\s+|<br\/?>)?$/i;
		return isEmpty.test(node.innerHTML);
	}
	destroyEditor()
	{
		if(this.inlineEditor){
			this.inlineEditor.destroy();
		}
	}
	getInlineEditor()
	{
		return this.inlineEditor;
	}
	handleKeydownDelete(event)
	{
		if (Util.isKey(event, Util.keyCode.ENTER)){
			document.execCommand('insertHTML', false, '<br/>');
			event.preventDefault();
		}
	}
	initMutationObserver()
	{
		if(!this.mutationObject){
			const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
			
			var that = this;
			this.mutationObject = new MutationObserver(function(mutations) {
				if (mutations.length === 1 && mutations[0].type === 'characterData'){
				//	console.log(mutations);
					
				}
			//	return;
				mutations.forEach(function(mutation) {
					var needRelayout = false;
					if(mutation.type == 'childList'){
						var addedNodes = mutation.addedNodes;
						
						for(var i in addedNodes){
							
							if(addedNodes[i].nodeType && addedNodes[i].nodeType == 1)
							{
								//console.log('addedNodes', addedNodes[i]);
								if(addedNodes[i].nodeType == 1)
									that.createTextNode(addedNodes[i]);
								break;
							}
						}
						
					}
				});
				
			});
			const config = {
				//attributes: true,
				childList: true,
				characterData: true,
				subtree: true,
				characterDataOldValue: true
			};
			this.mutationObject.observe(this.element[0] || this.element, config);
			
		}
	}
})
var InlineEditable = function(module, options)
{
	this.init = function()
	{
		var editable = module.getEditorElement();
		editable.attr('contenteditable', true);
		this.element = editable;
		module.initContents();
		this.module = module;
		this.bindEvents();
		this.options = module.getEditorOptions();
		//setTimeout(function(){console.log('focus',editable);editable.focus()}, 10);
		this.focus();
	}
	this.focus = function()
	{
		this.element.focus();
		if(!this.element[0].childNodes.length){
			var emptyTextNode = document.createTextNode("");
			this.element[0].appendChild(emptyTextNode);
		}
		Selection.moveCursor(false, this.element[0].childNodes[0], 0);
	}
	this.execCommand = function()
	{
		document.execCommand();
	}
	this.getEditorId = function()
	{
		return this.module.getPage_id();
	}
	this.bindEvents = function()
	{
		var that = this;
		$(document).off('selectionchange.InlineEditable');
		
		$(document).on('selectionchange.InlineEditable', function(event){
			Events.selectionchange.call(that, event)
		});
		module.getEditorElement().off('keydown.InlineEditable');
		module.getEditorElement().on('keydown.InlineEditable', function(event)
		{
			Events.keydown.call(that, event);
		});
		module.getEditorElement().off('keyup.InlineEditable');
		module.getEditorElement().on('keyup.InlineEditable', function(event)
		{
			Events.keyup.call(that, event);
		});
		module.getEditorElement().off('paste.InlineEditable');
		module.getEditorElement().on('paste.InlineEditable', function(event)
		{
			Events.paste.call(that, event);
		});
	}
	
	this.unbindEvents = function()
	{
		//module.getEditorElement().off('click');
		$(document).off('selectionchange.InlineEditable');
		module.getEditorElement().off('keydown.InlineEditable');
		module.getEditorElement().off('keyup.InlineEditable');
		module.getEditorElement().off('paste.InlineEditable');
	}
	this.destroy = function()
	{
		var editable = module.getEditorElement();
		editable.removeAttr('contenteditable');
		Selection.clearSelection();
		this.unbindEvents();
	}
	this.Util = Util;
	this.Selection = Selection;
	this.init();
}
var Events = {
	selectionchange: function(event)
	{
		this.element.trigger('editableSelectionChange', [event]);
	},
	paste: function(event)
	{
		var pasteHandler = new PasteHandler;
		pasteHandler.handlePaste(event, this.element[0])
	},
	DocumentExecCommand : function(execInfo)
	{
		
	},
	keyup: function(event)
	{
		event.stopPropagation();
	},
	keydown: function(event)
	{
		event.stopPropagation();
		if (Util.isKey(event, Util.keyCode.SPACE)) {
			return Events.handleKeydownSpace.call(this, event);
		}
		if (Util.isKey(event, Util.keyCode.ENTER) || (event.ctrlKey && Util.isKey(event, Util.keyCode.M))) {
			return Events.handleKeydownEnter.call(this, event);
		}

		if (Util.isKey(event, Util.keyCode.TAB)) {
			return Events.handleKeydownTab.call(this, event, event.currentTarget);
		}

		if (Util.isKey(event, [Util.keyCode.DELETE, Util.keyCode.BACKSPACE])) {
			return Events.handleKeydownDelete.call(this, event, event.currentTarget);
		}
		if ((Util.isKey(event, Util.keyCode.V) && Util.isMetaCtrlKey(event))) {
			//return Events.paste.call(this, event, event.currentTarget);;
		}
		
	},
	handleKeydownSpace : function(event)
	{
		
	},
	handleKeydownEnter : function(event)
	{
		Events.handleKeydownDelete.call(this, event, event.currentTarget);
	
	},
	handleKeydownTab : function(event)
	{
		
	},
	
	handleKeydownDelete : function(event)
	{
		var node = Selection.getSelectionStart(document);
		var module = pageEdit.getModule(node);
		console.log(node, module);
		if(module)
			module.handleKeydownDelete(event);
		return;
	}
}

module.exports = {
	
	default: MyMixin,
	InlineEditable: InlineEditable,
	Selection:Selection,
	Util:Util
}