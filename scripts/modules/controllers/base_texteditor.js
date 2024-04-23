var throttle = require('lodash').throttle;

export default function(pageEdit, commonUtils, pageEdit_layout,pageEdit_event, $colorpalettepicker, $controller, $compile, pageEdit_undoManager, $rootScope, safeApply, popup_link, pageEdit_float_editor_button){
	"ngInject";

	this.getInlineEditor = function()
	{
		return this.frontend_module.getInlineEditor();
	}
	this.getEditorElement = function()
	{
		if(this.frontend_module.getEditorElement)
			return this.frontend_module.getEditorElement();
		return this.getElement();
	}
	
	this.handleDblClick = function(event)
	{
		if(this.inEditMode())
			return;
		this.frontend_module.initEditor();
		this.createEditorToolbar();
		this.doSelect();
		this.registerKeydownEvent(true);
		this.getEditorElement().off('input editableChange');
		var that = this;
		
		function syncChange()
		{
			var content = that.getEditorElement().contents();
			that.syncWithGlobalModule('updateContents', [content]);
		}
		this.getEditorElement().on('input editableChange', throttle(syncChange, 500));
	}
	this.textToolbarController = function($scope, $moduleInstance, $colorpalettepicker, $file_manager)
	{
		"ngInject";
		$moduleInstance.getElement().off('editableSelectionChange');
		$moduleInstance.getElement().on('editableSelectionChange', throttle(onSelectionChange, 500))
		function triggerChange(params){
			$moduleInstance.getEditorElement().trigger('editableChange', params);
		}
		function getSelectedElements()
		{
			var editor = $moduleInstance.getInlineEditor();
			if(!editor)		return;
			return editor.Selection.getSelectedElements();
		}
		function getSelectedTextNode()
		{
			
		}
		function wrap(tag)
		{
			var editor = $moduleInstance.getInlineEditor();
			if(!editor)		return;
			var selectedElements = getSelectedElements();
			var range = editor.Selection.getSelectionRange();
			
		}
		$scope.currentRange = {};
		function onSelectionChange()
		{
			var editor = $moduleInstance.getInlineEditor();
			if(!editor)		return;
			if(!$moduleInstance.inEditMode()){
				return;
			}
			var range = editor.Selection.getSelectionRange();
			$moduleInstance.setModuleInfoPosition();
			
		}
		$scope.wrapSpan = function(tag = 'span'){
			return $moduleInstance.wrapRangeByTag(false, tag);
			
		}
		$scope.changeColor = function()
		{
			return $moduleInstance.wrapRangeByTag(false, {'color': item});
			
		}
		$scope.changeBackground = function()
		{
			var editor = $moduleInstance.getInlineEditor();
			
		}
		$scope.insertIcon = function()
		{
			return $file_manager.open({onlySVG: true, tabs:['myfiles', 'libraries_icon']}).result.then(function(images)
			{
				if(images.length == 0){
					return;
				}
				var image = images[0];
				
				
				$moduleInstance.insertSVG(image.full_url);
			});
		}
		$scope.clearFormat = function()
		{
			return $moduleInstance.clearFormat();
		}
	}
	this.clearFormat = function(range)
	{
		return this.frontend_module.removeFormat(range)
	}
	this.wrapRangeByTag = function(range, tag, style)
	{
		var ranges = this.frontend_module.wrapRangeByTag(range, tag)
		if(ranges && ranges.length) {
			var that = this;
			setTimeout(function(){
				var module = pageEdit.getModule(ranges[0]);
				if(module != undefined)
				{
					that.destroyEditor();
					module.doSelect();
					
				}
			}, 200);
			
		}
	}
	this.insertSVG = function(src)
	{
		var editor = this.getInlineEditor();
		if(!editor)		return;
		var rs = editor.Util.insertHTMLCommand(false, '<svg url="'+ src + '">Code</svg>');
		if(rs){
			//this.findSVG();
			var currentRange = editor.Selection.getSelectionRange();
			var svg = editor.Selection.getSelectedParentElement(currentRange);
			try{
				if(svg && svg.tagName.toLowerCase() == 'svg'){
					var module = this.frontend_module.createTextNode(svg);
				}
			}
			catch(e){
				console.trace(e);
			}
		}
	}
	this.inEditMode = function()
	{
		return this.getEditorElement().attr('contenteditable') != undefined;
	}
	this.createModuleInfo = function()
	{
		var module = this;
		if(module.controlIcons == false)	return;
		if($('#module-text-editor').length == 0){
			var toolbarTemplate = require('../templates/inline_text_toolbar.tmpl');
			var scope = $rootScope.$new();
			$controller(this.textToolbarController, {$scope: scope, $moduleInstance:this});
			var html = $compile(toolbarTemplate)(scope);
			safeApply(scope);
			window.textToolbarScope = scope;
			$('body').append(html);
		}
		else{
			$controller(this.textToolbarController, {$scope: window.textToolbarScope, $moduleInstance:this});
		}
		this.setModuleInfoPosition(module);
		pageEdit_event.off('scroll.text_toolbar');
		var that = this;
		pageEdit_event.on('scroll.text_toolbar', function(){
			that.setModuleInfoPosition(module);
		})
	};
	
	this.setModuleInfoPosition = function()
	{
		var module = this;
		var block = $('#module-text-editor');
		
		if(!block.length)
			return;
		block.show();
		var editor = this.getInlineEditor();
		if(editor){
			var range = editor.Selection.getSelectionRange();
			//return;
		}
		var iframeOffset = $('#edit_page').offset();
		var offset = commonUtils.getElementOffset(module.getElement());
		var top = 0;
		var left = 0;
		var top = offset.top - block.height();
		if(top < iframeOffset.top)
			top = offset.top + module.getElement().height() ;
		var left = offset.left
		
		block[0].style.top = top + "px";
		block[0].style.left = left + 'px';
	};
	this.createEditorToolbar = function()
	{
		this.createModuleInfo();
	}
	this.removeToolbar = function()
	{
		var block = $('#module-text-editor');
		block.hide();
	}
	this.softDelete = function(){
		if(this.quill_editor && this.quill_editor.hasFocus())
			return;
		return this.__call('softDelete');
	}
	
	this.onDeselect = function()
	{
		this.destroyEditor();
		return this.__call('onDeselect');
	}
	this.destroyEditor = function()
	{
		if(!this.inEditMode()){
			return;
		}
		this.frontend_module.destroyEditor();
		this.getEditorElement().off('input');
		this.getElement().off('editableSelectionChange');
		pageEdit_event.off('scroll.text_toolbar');
		this.removeToolbar();
		this.registerKeydownEvent(false);
		
	}
	
	this.updateContents = function(contents)
	{
		this.getEditorElement().html(contents.clone())
	}
	this.getStructure = function(){
		var structure = this.__call('getStructure');
		structure.data = {};
		structure.contents = this.getContents();
		return structure;
	}
	this.getContents = function()
	{
		var textNodes = this.getEditorElement().contents();
		var rs = [];
		var that = this;
		if(textNodes.length){
			textNodes.each(function(){
				if(jQuery_iframe(this).attr('shadow') != undefined)
					return;
				var module = pageEdit_layout.getFloatModule(this);
				if(module)
					rs.push(module.getStructure());
				else{
					rs.push(this.nodeType == 3 ? that.escapeWhitespace(this.nodeValue) : this.outerHTML);
				}
			});
		}
		else{
			rs.push(this.getEditorElement().html());
		}
		return rs;
	}
	this.getChildModules = function()
	{
		var textNodes = this.getEditorElement().contents();
		var rs = [];
		if(textNodes.length){
			textNodes.each(function(){
				if(jQuery_iframe(this).is(':hidden'))
					return;
				var module = pageEdit_layout.getFloatModule(this);
				if(module)
					rs.push(module);
			});
		}
		return rs;
	}
	this.loadElement = function(element)
	{
		this._loadElement(element);
		this.loadContents();
		
		jQuery_iframe(element).on('click', 'a', function(event)
		{
			event.preventDefault();
		})
		
	}
	this.bindEvent = function()
	{
		this.__call('bindEvent');
		this.getElement().off('dblclick');
		var that = this;
		this.getElement().on('dblclick', function(event){
			that.handleDblClick(event);
		});
	}
	this.loadContents = function()
	{
		var textNodes = this.getEditorElement().contents();
		textNodes.each(function(){
			if(this.nodeType == 1)
				pageEdit_layout.createFloatModule(this);
		});
	}
	
	this.registerKeydownEvent = function(focus)
	{
		if(focus){
			function stopPropagation(event)
			{
				event.stopPropagation();
			}
			this.getElement().draggable( "disable" );
			this.getElement().off('mousedown.texteditor');
			this.getElement().on('mousedown.texteditor', stopPropagation);
			this.getElement().off('deselected');
			var that = this;
			this.getElement().on('deselected', function(event, module){
				if(pageEdit_float_editor_button.activeModule == undefined 
				|| that.contains(pageEdit_float_editor_button.activeModule)
				|| pageEdit_float_editor_button.activeModule == that)
					return;
				that.onDeselect();
				that.getElement().off('deselected');
			});
		}
		
		else{
			this.getElement().draggable( "enable" );
			this.getElement().off('deselected');
			this.getElement().off('mousedown.texteditor');
		}
	}
	this.isDropTarget = function()
	{
		return false;
	}
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.range = function(n) {
			return new Array(n);
		};
		
		
	};
};
