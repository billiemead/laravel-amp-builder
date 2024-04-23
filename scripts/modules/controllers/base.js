var StyleSheet = require('../../utils/ssultils').StyleSheet;
var templates = require.context('../templates', true, /^\.\/.*\.tmpl$/);
var tab_templates = require.context('../templates/tabs', true, /^\.\/.*\.tmpl$/);

var widgetFunction = require('../../app.builder/directives/widgetModule');
var widgetFunc = require('../../utils/widget');
var NanoEvents = require('../../utils/event');

export default function($dialog, $controller, $timeout, $compile, pageEdit_layout,pageEdit_ddManager,pageEdit_function, $file_manager,$q,communication, popup,pageEdit,pageEdit_event, $rootScope, $window, $mdPanel, commonUtils, pageEdit_float_editor_button, pageEdit_undoManager, safeApply,API){
	"ngInject";
	this.property = {};
	this.styles = {};
	this.offset = {
	};
	this.cloneable = true;
	this.draggable = true;
	this.resizable = false;
	this.removable = true;
	this.disabled = false;
	this.tab_editor = ['advance', 'offset', 'border','background'];
	this.sharedControllerCode = '$controllerScope';
	this.constructor = function()
	{
		if(this.constructed)
			return;
		this.constructed = true;
		var type = this.type;
		var info = widgetFunc.getWidgetInfomation(type);
		if(info != undefined){
			this.setProperty(info);
		}
	}
	this.canClick = function()
	{
		return true;
	}
	this.canHover = function()
	{
		return true;
	}
	this.isDisabled = function()
	{
		return this.disabled;
	}
	this.setDisabled = function(t)
	{
		this.disabled = t;
	}
	
	this.getWidgetDisplayName = function()
	{
		var type = this.type;
		var info = widgetFunc.getWidgetInfomation(type);
		if(info != undefined) {
			return info.name;
		}
		return type;
	}
	this.isResizable = function()
	{
		return this.property != undefined && ((this.property.width != undefined && this.property.width != 'auto') || (this.property.height != undefined && this.property.height != 'auto'));
	}
	this.getResizableHandles = function()
	{
		if(!this.isResizable())	return;
		var resizeHandles = [];
		if(this.property.width != undefined && this.property.width != 'auto')
			resizeHandles.push('e'),resizeHandles.push('w')
		if(this.property.height != undefined && this.property.height != 'auto')
			resizeHandles.push('n'),resizeHandles.push('s')
		return resizeHandles.join(',');
	}
	this.getPreviousModule = function()
	{
		var before = this.getElement().prevAll(':visible');
		if(before.length)
			before = before[0];
		before = pageEdit.getModule(before);
		return before;
	}
	this.getNextModule = function()
	{
		var next = this.getElement().nextAll(':visible');
		if(next.length)
			next = next[0];
		next = pageEdit.getModule(next);
		return next;
	}
	this.moveUp = function()
	{
		var module = this.getPreviousModule();
		if(module != undefined)
		{
			this.move({direction:'top', element: module, dropInfo:{}});
		}
			
		else {
			this.moveToParent('top');
		}
	}
	
	this.moveDown = function()
	{
		var module = this.getNextModule();
		if(module != undefined)
		{
			this.move({direction:'bottom', element: module, dropInfo:{}});
		}
			
		else {
			this.moveToParent('bottom');
		}
	}
	this.moveToParent = function(direction)
	{
		var module = this.getParentModule();
		if(module != undefined)
		{
			var parentModule = module.getParentModule();
			if(parentModule != undefined) {
				if(module.checkcanPaste(this)) {
					this.move({direction:direction, element: module, dropInfo:{}});
					return;
				}
				
			}
			
		}
		alert(window.t("Can't move this element " + direction));
		
	}
	this.getSaveOffset = function()
	{
		var offset;
		if(this.frontend_module != undefined)
			offset = this.frontend_module.getOffset();
		if(!(this.property.width != undefined && this.property.width != 'auto'))
			delete offset.width;
		if(!(this.property.height != undefined && this.property.height != 'auto'))
			delete offset.height;
		return offset;
	}
	this.buildWidgetControl = function()
	{
		var template = this.getWidgetControlTemplate();
		var scope = $rootScope.$new();
		$controller(this.widgetControlController, {$scope: scope,  $moduleInstance:this});
		template = $compile(template)(scope);
		return template;
	}
	this.getDragHelper = function()
	{
		return '<div class="ww_widget_drag_helper">' +
					'<span class="ww_widget_drag_helper_image">'+
					'</span>' +
					'</div>';
	}
	this.getCurrentDropInfo = function()
	{
		var dropInfo = {};
		var parentModule = this.getParentModule();
		var prevElement = this.getElement().prev();
		var nextElement = this.getElement().next();
		if(prevElement.length)
		{
			dropInfo.direction = 'bottom';
			dropInfo.element = prevElement;
		}
		else if(parentModule)
		{
			dropInfo.direction = 'top';
			dropInfo.inner = true;
			dropInfo.element = parentModule.getElement(); 
		}
		dropInfo.dropInfo = {
			node:dropInfo.element,
			inner:dropInfo.inner,
			direction:dropInfo.direction
		}
		return dropInfo;
	}
	this.isInsertedByDragDrop = function()
	{
		if(this.frontend_module != undefined)
		return this.frontend_module.isInsertedByDragDrop();
	}
	this.moveTo = function(dropInfo)
	{
		var oldDropInfo = this.getCurrentDropInfo();
		var rs = this.move(dropInfo);
		
		pageEdit_undoManager.manager.registerUndoAction(this, this.moveTo, [oldDropInfo]);
	}
	this.move = function(dropInfo, trigger = true)
	{
		var oldParent = this.getParentModule();
		var insert_point = dropInfo.element;
		var pos = dropInfo.direction;
		var module = pageEdit.getModule(insert_point);
		if(module){
			module.insertBlock(this, dropInfo);
			trigger && $(window).trigger('widget_change_parent', [this, oldParent, module, dropInfo]);
			return true;
		}
	};
	this.insertBlock = function(module, dropInfo)
	{
		var pos = dropInfo.direction;
		
		(pos == 'top' || pos=='left') && this.getElement().before(module.getElement());
		(pos == 'bottom' || pos=='right') && this.getElement().after(module.getElement());
	}
	
	this.checkcanPaste = function(module)
	{
		var parent = this.getParentModule();
		var ev = false;
		var ui = {helper: {module: module} };
		if(parent){
			
			if(parent.isDropTarget(ev, ui) && module.canDropTo(parent))
				return true;
		}
	
		//return type != 'section' && type != 'popup';
	}
	this.handleDragEvent = function(event, ui)
	{
		return this._handleDragEvent(event, ui);
	};
	this._handleDragEvent = function(event, ui)
	{
		if(jQuery_iframe(ui.helper).hasClass('ww_widget_drag_zone_helper'))
		{
			return;
		}
		var dropped = pageEdit_ddManager.isDropping(this, event, ui);
		if(dropped)
		{
			var canDropInto = pageEdit_ddManager.canDropTo(this, event, ui);
			pageEdit_ddManager.handleInnerOver(event, this, ui, canDropInto );	
			return true;
		}
	};
	this.isFlexBox = function()
	{
		var display = this.getElement().css('display');
		return display == 'flex';
	}
	this.isFlexibleElement = function()
	{
		var parentElement = this.getElement().parent();
		var display = parentElement.css('display');
		return display == 'flex';
		//var parentModule = this.getParentModule();
		//return parentModule && parentModule.isFlexBox();
	}
	this.getSelfFlexDirection = function()
	{
		var direction =  this.getElement().css('flex-direction');
		return direction;
	}
	this.getFlexDirection = function()
	{
		var parentModule = this.getParentModule();
		if(parentModule && parentModule.isFlexBox())
			return parentModule.getSelfFlexDirection();
	}
	this.widgetControlController = function($scope, $moduleInstance, pageEdit_clipboard, ToastService)
	{
		"ngInject";
		$scope.$moduleInstance = $moduleInstance;
		function canPaste()
		{
			if(pageEdit_clipboard.isEmpty())
				return false;
			var module = pageEdit_clipboard.get();
			return $moduleInstance.checkcanPaste(module);
		}
		$scope.pasteable = canPaste();
		$scope.parents = $moduleInstance.getParentModules().filter(module => module.getType() != 'page');
		$scope.clone = function()
		{
			$moduleInstance.doclone();
		}
		$scope.remove = function()
		{
			$moduleInstance.softDelete();
		}
		$scope.copy = function()
		{
			pageEdit_clipboard.copy($moduleInstance);
			ToastService.showSimpleToast('Widget Copied')
			$scope.pasteable = canPaste();
		}
		$scope.paste = function()
		{
			if(pageEdit_clipboard.isEmpty())
				return;
			var module = pageEdit_clipboard.get();
			module.copyTo($moduleInstance);
			pageEdit_clipboard.clear();
			$scope.pasteable = false;
			ToastService.showSimpleToast('Widget Pasted')
		}
	}
	this.getWidgetControlTemplate = function()
	{
		return templates('./control.tmpl');
	}
	
	this.setProperty = function(property){
		this.property = property;
		this.data = this.data || {};
		if(this.property.properties){
			
			for(var i in this.property.properties){
				this.data[i] = this.property.properties[i].default || "";
			}
		}
		if(this.property.children){
			this.items = this.property.children;
		}
	}
	this.getDropOffset = function()
	{
		return pageEdit_ddManager.getCoordinate(this.getElement());
	}
	this.getSnapOffset = function()
	{
		return $.extend(this.getElement().offset(), {width:this.getElement().width(), height:this.getElement().height()} );
	}
	this.getRealOffset = function()
	{
		return this.frontend_module.getRealOffset();
	}
	this.getVisibility = function(mode)
	{
		return true;
	}
	this.getCurrentVisibility = function()
	{
		return this.getElement().css('display') != 'none';
	}
	this.setVisibility = function(visibility, trigger)
	{
		return this.frontend_module.setVisibility(visibility, trigger);
	}
	this.resetOffsets = function(top = 0, left = 0){
		if(this.frontend_module != undefined)
			return this.frontend_module.resetOffsets(top, left);
	}
	this.getOffset = function(mode)
	{
		if(this.frontend_module != undefined)
			return this.frontend_module.getOffset(mode);
	}
	this.getCurrentOffset = function()
	{
		var offset = {
			width: this.getElement().width(),
			height: this.getElement().height()
		};
		if(!(this.property.width != undefined && this.property.width != 'auto'))
			delete offset.width;
		if(!(this.property.height != undefined && this.property.height != 'auto'))
			delete offset.height;
		return offset;
	}
	this.setOffsets = function(offsets)
	{
		this.frontend_module.setOffsets(offsets);
	}
	this._setOffset = function(offset)
	{
		this.frontend_module.setOffset(offset);
	}
	
	this.setOffset = function(offset, newParent)
	{
		var oldOffset = this.frontend_module.getOffset();
		var oldParent;
		if(newParent != undefined){
			
			oldParent = this.getParentModule();
		}
		this._setOffset(offset);
		for(var i in offset){
			this.__triggerStyleChanged(i, offset[i]);	
		}
		
	
		pageEdit_undoManager.manager.registerUndoAction(this, this.revertOffset, [oldOffset, oldParent]);
	}
	this.revertOffset = function(offset, newParent)
	{
		var oldParent;
		if(newParent != undefined){
			oldParent = this.getParentModule();
		}
			
		if(!newParent)
			this.setOffset(offset);
		else{
			newParent.insertModule(this);
			this.setOffset(offset, oldParent);
		}
		this.getElement().trigger('resize');
	}
	

	this.setSize = function(width, height)
	{
		this.setOffset({width:width * 1, height:height * 1});
	}
	this.startDrag = function()
	{
		this.tempOffset = $.extend(
			{
				width:this.getElement().width(), 
				height:this.getElement().height()
			},
			//this.getOffset()
		);
	}
	this.getParentModule = function()
	{
		var parentElement = this.getElement().parents("." + pageEdit_layout.module_class + ", section.section, .popup-section");
		
		var module = pageEdit.getModule(parentElement);
		return module;
	}
	this.getParentModules = function()
	{
		var rs = [];
		this.getElement().parents().each(function()
		{
			var module = pageEdit.getModule(this);
			if(module)
				rs.push(module);
		});
		return rs;
		
		return module;
	}
	this.removeFontFamily = function(font)
	{
		var styles = this.getStyles();
		if(styles && styles['font-family'] && styles['font-family'] == font){
			this.setStyle('font-family', undefined);
		}
	}
	this.changeResolution = function(mode){
		if(this.getIsDeleted())
			return;
		
		this.currentResolution = mode;
	}
	this.startResize = function(event, ui)
	{
		this.startDrag();
	}
	this.isDropTarget = function(event, ui)
	{
		return false;
	}
	this.handleResizeEvent = function(event, ui)
	{
		var distance = {x: ui.position.left - ui.originalPosition.left, y: ui.position.top - ui.originalPosition.top};
		var sizeChanged = {width: ui.size.width - ui.originalSize.width, height: ui.size.height - ui.originalSize.height};
		this.doResize(sizeChanged.width, sizeChanged.height, true);
	}
	
	this.handleStopResizeEvent = function(event, ui)
	{
		var distance = {x: ui.position.left - ui.originalPosition.left, y: ui.position.top - ui.originalPosition.top};
		var sizeChanged = {width: ui.size.width - ui.originalSize.width, height: ui.size.height - ui.originalSize.height};
		this.doResize(sizeChanged.width, sizeChanged.height);
	}
	
	this.doDrag = function(distanceY, distanceX, temporary = false )
	{
		var top = this.tempOffset.top * 1 + distanceY * 1;
		var left = this.tempOffset.left * 1 + distanceX * 1;
		
		if(!temporary){
			this.moveTo(top, left);
			if(!this.is_resizing)
				this.getElement().trigger("dragStop", [ top, left ]);
		}
		else{
			this.getElement()[0].style.top = top + "px";
			this.getElement()[0].style.left = left + "px";
			if(!this.is_resizing)
				this.getElement().trigger("dragging", [ top, left, distanceY, distanceX]);
		}
	};
	this.doResize = function(dwidth, dheight, temporary = false )
	{
		var width = this.tempOffset.width * 1 + dwidth * 1;
		var height = this.tempOffset.height * 1 + dheight * 1;
		if(!temporary){
			this.scaleTo(width, height)
		}
		else{
			this.getElement().trigger("resizing", [ width, height ]);
			this.getElement().css({'width':width + 'px', 'height':height + 'px'});
		}
	};
	this.align = function(hoffset, voffset)
	{
		var newOffset = this.frontend_module.align(hoffset, voffset, false);
		if(newOffset != undefined){
			this.setOffset(newOffset);
			this.getElement().trigger("resize");
		}
	}
	
	this.getContainerModule = function()
	{
		var newContainer = pageEdit_layout.getContainerModule(this);
		var module = pageEdit_layout.getFloatModule(newContainer) || pageEdit_layout.getModule(newContainer);
	}
	
	this.scaleTo = function(width, height)
	{
		var offset = {width:width, height:height};
		if(!(this.property.width != undefined && this.property.width != 'auto'))
			offset.width = undefined;
		if(!(this.property.height != undefined && this.property.height != 'auto'))
			offset.height = undefined;
		this.setOffset(offset);
	}

	this.onSelect = function()
	{
	}
	this.onDeselect = function()
	{
		this.getElement().trigger('deselected', [this]);
		this.getElement().off('resizing.offsetCtrl');
		this.getElement().off('dragging.offsetCtrl');
		this.getElement().off('changeResolution.offsetCtrl');
	}
	this.canDropTo = function(module)
	{
		return module && module.getType() != 'row';
	}
	this.isChildrenOf = function(module){
		if(module.contains)
			return module.contains(this);
	}
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.$ctrl = this;
	
		$scope.resolution = pageEdit.resolution;
		$scope.data = {};
		$scope.data = $moduleInstance.getData();
		$scope.$moduleInstance = $moduleInstance;
		$scope.display_name = $moduleInstance.getWidgetDisplayName();
		$scope.data = $.extend({}, $moduleInstance.initializeData, $scope.data);
		$moduleInstance.module_data = $scope, $scope.data;
		$scope.extra_data = {};
		$scope.extra_data.parents = $moduleInstance.getParentModules().filter(module => module.getType() != 'page');
		$controller($moduleInstance._design, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
		$controller($moduleInstance._offsetController, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
		$controller($moduleInstance.tabController, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
		$scope.changeData = function(updateView = true)
		{
			$scope._changeData($scope.data, updateView);
		}
		$scope._changeData = function(data, updateView)
		{
			var oldData = $moduleInstance.getData();
			$moduleInstance.setData(data, updateView);
			if(pageEdit_undoManager.isDoing()){
				$scope.data = data;
				safeApply($scope);
			}
			pageEdit_undoManager.manager.registerUndoAction($scope, $scope._changeData, [oldData]);
		}
		
	};
	this.tabs = {
		'data':['column', 'button', 'carousel', 'click_action', 'countdown', 'dropdown', 'form', 'form_fields', 'additional_fields','form_integration', 'global_block', 'heading', 'hidden_field',
		'image', 'images', 'input', 'input_validation', 'input_mask', 'input_autocomplete', 'line', 'list', 'popup', 'rows', 'slides', 'svg', 'template', 'video'],
		'design':['offset','margin', 'background', 'border', 'border_image', 'border_input','text', 'flex_items', 'flex_layout', 'button_hover', 'countdown_design'],

		'advance':['advance']
	}
	this.getControllerTabs = function()
	{
		return this.tabs;
	}
	this.tabController = function($scope, $moduleInstance)
	{
		"ngInject";
		var ctrl = this;
		$scope.splitTabs = $moduleInstance.getControllerTabs();
		$scope.selectedTabIndex == undefined && ($scope.selectedTabIndex = 0);
		
		$scope.onSelectTab = function(name){
			if(!$scope.enabled_tabs)
				return;
			var showTabs = $scope.splitTabs[name];
			
			for(var i in $scope.enabled_tabs){
				$scope.enabled_tabs[i] = false;
			}
			for(var i in showTabs){
				if($scope.enabled_tabs[showTabs[i]] != undefined)
				$scope.enabled_tabs[showTabs[i]] = true;
			}
			$scope.currentTab = name;
			safeApply($scope);
		}
		if($scope.currentTab)
			$scope.onSelectTab($scope.currentTab);
		else{
			$scope.onSelectTab('data');
		}
	}
	this.delete = function()
	{
		var that = this;
		$dialog.confirm({
			title:window.t("LBL_DELETE_WIDGET"),
			message: window.t("LBL_DELETE_WIDGET_MESSAGE"),
		}).result.then(function()
		{
			that._delete();
		});
	};
	this.is_deleted = false;
	this.getIsDeleted = function()
	{
		return this.is_deleted;
	}
	this.recognize_class = pageEdit_layout.module_class;
	this._delete = function()
	{
		if(this.shadowElement)
			this.shadowElement.remove();
		this.getElement().remove();
		
	};
	
	this.cachePosition = function()
	{
		this.prevElement = this.getElement().prev();
		this.parentElement = this.getElement().parent();
	}
	this.softDelete = function()
	{
		this.is_deleted = !this.is_deleted;
		
		this.frontend_module.setIsDeleted(this.is_deleted);
		if(this.is_deleted)
		{
			var parentModule = this.getParentModule();
			this.cachePosition();
			if(!this.isSyncAction(arguments))
				$(window).trigger('widget_removed', [this]);
			this.getElement().detach();
			
			this.removeAllShadowElements();
			pageEdit_float_editor_button.removeModuleInfo(this);
			parentModule && parentModule.doSelect();
		}
			
		else{
			
			if(this.prevElement && this.prevElement.length)
				this.prevElement.after(this.getElement());
			else if(this.parentElement && this.parentElement.length){
				this.parentElement.prepend(this.getElement());
			}
			
			
			if(!this.isSyncAction(arguments))
				$(window).trigger('widget_unremoved', [this]);
		}
		if(!this.isSyncAction(arguments)){
			pageEdit_undoManager.manager.registerUndoAction(this, this.softDelete, []);
		}
			
	}
	
	this.afterDelete = function(){};
	this.beforeDelete = function(){}
	
	this.unbindEvent = function()
	{
		this._unbindEvent();
	};
	this._unbindEvent = function()
	{
		this.unhover();
		
		this.getElement().unbind();
	};
	this.getHoverable = function()
	{
		return true;
	};
	this._bindEvent =  function()
	{
		pageEdit_float_editor_button.init(this);
	};
	
	this.getDisplay_name = function()
	{
		return this.display_name;
	}
	this.contextMenu_edit = function()
	{
		this.select();
	}
	this.contextMenu_copy = function()
	{
		this.clone();
	}
	
	this.contextMenu_delete = function()
	{
		this.delete();
	}
	this.bindEvent =  function()
	{
		return this._bindEvent();
	};
	

	
	this.moduleInfoButtons ={};
	this.checkButtonVisible = function(btn){
		var visible = true;
		var visibility = btn.visibility;
		if(!visibility)	return visible;
		if(typeof visibility == 'function'){
			visible = visibility.apply(this);
		}
		else if(typeof visibility == 'string'){
			var newScope = $rootScope.$new();
			newScope.module_data = this.module_data;
			visible = newScope.$eval(visibility);
			
			
		}
		else if(typeof visibility == 'boolean'){
			visible = visibility;
		}
		return visible;
	}
	
	this._offsetController = function($scope, $moduleInstance, $controller, safeApply){
		"ngInject";
		$scope.offset = angular.copy($moduleInstance.getCurrentOffset());
		$scope.isResizable = $moduleInstance.isResizable();
		$scope.isFlexibleElement = $moduleInstance.isFlexibleElement();
		if($scope.isResizable){
			var handlers = $moduleInstance.getResizableHandles();
			$scope.resizableHandlers = {
				width: handlers.indexOf('e') >= 0 || handlers.indexOf('w') >= 0,
				height:handlers.indexOf('s') >= 0 || handlers.indexOf('n') >= 0,
			}
		}
		var element = $moduleInstance.getElement();
		var eventUnique = "offsetCtrl__" + $moduleInstance.sharedControllerCode;
		element.off("resizing." + eventUnique);
		element.on("resizing." + eventUnique, function(event, width, height){
			$scope.offset.width = width;
			$scope.offset.height = height;
			safeApply($scope);
		});
		
		$scope.changeOffset = function(type, value){
			var v = parseFloat(value);
			if(!isNaN(v)){
				var oldOffset = $scope.offset[type];
				$scope.offset[type] = value;
				var offset = {};
				pageEdit_undoManager.beginGrouping();
				offset[type] = value;
				$moduleInstance.setOffset(offset);
				$moduleInstance.getElement().trigger('resize');
				pageEdit_undoManager.registerUndoAction($scope, $scope.changeOffset, [type, oldOffset]);
				pageEdit_undoManager.endGrouping();
			}
		}
		$controller($moduleInstance._ampLayoutController, {$scope: $scope,  $moduleInstance:$moduleInstance});
		
		$(window).off("changeResolution." + eventUnique);
		$(window).on("changeResolution." + eventUnique, function(event){
			event.stopPropagation();
			
			var offset = $moduleInstance.getCurrentOffset();
			$scope.offset = angular.copy(offset);
			$controller($moduleInstance._design, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
			safeApply($scope);
		});
		
	}
	this._ampLayoutController = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.isAMPElement = $moduleInstance.isAMPElement()
		$scope.amp_layout = $.extend({}, $moduleInstance.getAMPLayout());
		$scope.changeAMPLayout = function()
		{
			$moduleInstance.changeAMPLayout($scope.amp_layout);
		}
	}
	this.isAMPElement = function()
	{
		if(this.frontend_module) return this.frontend_module.isAMPElement();
	}
	this.getAMPLayout = function()
	{
		if(this.frontend_module) return this.frontend_module.getAMPLayout();
	}
	this.changeAMPLayout = function(amp_layout)
	{
		if(this.frontend_module) return this.frontend_module.changeAMPLayout(amp_layout);
		
	}
	this.getBodyFonts = function()
	{
		var fonts = [];
		var bodyModule = pageEdit.getBodyModule();
		if(bodyModule)
		{
			var pageFonts = bodyModule.getFonts();
			for(var i in pageFonts){
				(fonts.indexOf(pageFonts[i]) < 0) && fonts.push(pageFonts[i]);
			}
		}
		if(window.siteInfo.structure && window.siteInfo.structure.fonts){
			var theme_fonts = window.siteInfo.structure.fonts;
			for(var i in theme_fonts){
				(fonts.indexOf(theme_fonts[i]) < 0) && fonts.push(theme_fonts[i]);
			}
		}
		fonts = fonts.concat(StyleSheet.fonts);
		return fonts;
	}
	this._initStyle = function($scope, css_property)
	{
		var name = commonUtils.toCamelCase(css_property);
		if($scope.styles[name] != undefined)	return;
		$scope.styles[name] = $scope.styles[css_property] || this.getElement().css(css_property);
		if(StyleSheet.isNumberValue(css_property)){
			$scope.styles[name] = $scope.styles[name] || StyleSheet.stripUnits($scope.styles[name]);
		}
	}
	this.getShadowElement = function()
	{
		if(!this.getElement().length)
			return;
		if(this.shadowElement)
			return this.shadowElement;
		var element = jQuery_iframe('<div/>');
		element.attr('id', this.getPage_id());
		element.attr('class', this.getElement().attr('class'));
		element.attr('shadow', 1);
		this.getElement().after(element);
		//jQuery_iframe('body').append(element);
		this.shadowElement = element;
		element.css('display', 'none');
		return element;
	}
	this.getSystemStyle = function(css_property){
		var shadowElement = this.getShadowElement();
		if(shadowElement){
			var style = shadowElement.css(css_property);
			return style;
		}
	}
	this.getStyle = function(css_property, with_unit)
	{
		var currentStyles = this.getCurrentStyles() || {};
		var name = commonUtils.toCamelCase(css_property);
		var style = currentStyles[css_property];
		if(style == undefined)
			return;
		if(!with_unit && StyleSheet.isNumberValue(css_property)){
			return StyleSheet.stripUnits(style);
		}
		return style;
	}
	this._initStyles = function($scope, properties)
	{
		if(!$scope.styles)
			return;
		for(var i in properties){
			this._initStyle($scope, properties[i]);
		}
	}
	
	this.getCurrentStyles = function()
	{
		var styles = this.frontend_module.getCurrentStyles();
		styles = angular.copy(styles);
		return styles;
		/*for(var i in styles){
			var name = commonUtils.toCamelCase(i);
			styles[name] = styles[i];
		}
		return styles;
		*/
	}
	this.getCurrentItemStyles = function(selector)
	{
		var styles = this.frontend_module.getCurrentItemStyles(selector);
		styles =  angular.copy(styles);
		return styles;
		for(var i in styles){
			var name = commonUtils.toCamelCase(i);
			styles[name] = styles[i];
		}
		return styles;
	}
	this.getItemModule = function(name)
	{
		var items = this.items;
		if(!items || !items[name])	return;
		if(this.itemModules && this.itemModules[name])
			return this.itemModules[name];
		this.itemModules = this.itemModules || {};
		
		this.itemModules[name] = this.createItemModule(items[name]);
		return this.itemModules[name];
	}
	this.removeAllShadowElements = function()
	{
		if(this.shadowElement){
			this.shadowElement.remove();
			delete this.shadowElement;
		}
			
		if(!this.itemModules)
			return;
		for(var i in this.itemModules) {
			this.itemModules[i].delete()
		//	delete this.itemModules[i] 
		}
	}
	this.createItemModule = function(selector)
	{
		var rs = pageEdit_layout.createItemModule(this, selector);
		return rs;
	}
	this.getPaddingValue = function(type = 'padding')
	{
		var padding = StyleSheet.getMarginValue(this.getElement(), type);
		var values = ['top', 'left', 'bottom', 'right'];
		var rs = {};
		for(var i in values){
			rs[values[i]] = padding[values[i]];
		}
		return rs;
	}
	this.getCornerValue = function()
	{
		var corners = StyleSheet.getCornerValue(this.getShadowElement(), true);
		return corners;
	}
	this.getBorderValue = function()
	{
		var borders = StyleSheet.getBorderValue(this.getShadowElement(), true);
		borders['all'] = StyleSheet.getMainBorderValue(this.getShadowElement(),true);
		return borders;
	}
	this._design = function($scope, $modalInstance, $moduleInstance)
	{
		"ngInject";
		$scope.extra_data.classAttribute = $moduleInstance.getClassAttribute();
		$scope.extra_data.classes = $moduleInstance.getAllClasses();
		$scope.removeStyleTemplate = function()
		{
			delete $scope.extra_data.classAttribute;
			$moduleInstance.applyClass($scope.extra_data.classAttribute);
		}
		$scope.applyStyleTemplate = function()
		{
			if($scope.extra_data.classAttribute == '')
			{
				$scope.removeStyleTemplate();
			}
			else
				$moduleInstance.applyClass($scope.extra_data.classAttribute);
			
		}
		$scope.createStyleTemplate = function()
		{
			return popup.open(
			{
				template:require('../templates/createStyleTemplate.tmpl'),
				controller: function($scope, $modalInstance)
				{
					"ngInject";
					$scope.data = {};
					$scope.ok = function()
					{
						$moduleInstance.applyClass($scope.data.name);
						
						$modalInstance.close();
					}
				}
			}).result.then(function(){
				$scope.extra_data.classAttribute = $moduleInstance.getClassAttribute();
				$scope.extra_data.classes = $moduleInstance.getAllClasses();
			});
		}
		$controller($moduleInstance._visibilityController, {$scope:$scope, $moduleInstance:$moduleInstance})
	}
	this.applyClass = function(name)
	{
		this.frontend_module.setClass(name);
		this.fireEvent('class_changed', [name]);
	}
	this.getAllClasses = function()
	{
		if(this.frontend_module)
			return this.frontend_module.getAllClasses();
	}
	this.getClassAttribute = function()
	{
		if(this.frontend_module)
			return this.frontend_module.getClassAttribute();
	}
	this.getShadowCSSValue = function(type = 'text-shadow')
	{
		var shadows = StyleSheet.getBoxShadowValue(this.getShadowElement(), type);
		return shadows;
	}
	this._visibilityController = function($scope, $moduleInstance){
		"ngInject";
		function refresh(){
			$scope.extra_data = $scope.extra_data || {};
			var oldValue = $scope.extra_data.visibility;
			$scope.extra_data.visibility = $moduleInstance.getCurrentVisibility();
			
		}
		refresh()
		$scope.setVisibility = function(visibility)
		{
			$moduleInstance.setVisibility(visibility);
			$(window).trigger('widget_visibility_changed', [$moduleInstance]);
		}
		$moduleInstance.getElement().off('widget_visibility_changed');
		$moduleInstance.getElement().on('widget_visibility_changed', function()
		{
			refresh();
		});
	}
	this.setStyles = function(styles){
		this.frontend_module.setStyles(styles);
	}
	this.getItemStyles = function(selector)
	{
		return this.frontend_module.getItemStyles(selector);
	}
	this.getItemsStyles = function()
	{
		var items = this.items;
		if(!items)	return;
		var rs = {};
		for(var i in items){
			rs[i]  = {};
			rs[i].main = this.getItemStyles(items[i]);
			rs[i].override = this.frontend_module.getStyleOverride(undefined, items[i]);
		}
		return rs;
	}
	
	this.getControlIcons = function()
	{
		return this.moduleInfoButtons;
	}
	
	this.doclone = function()
	{
		this.clone();
	}
	this.copyTo = function(module){
		if(this.frontend_module && module.frontend_module){
			var new_module = this.frontend_module.copyTo(module.frontend_module);
			if(new_module){
				var module = pageEdit_layout.createFloatModule(new_module.getElement(), new_module.getType());
				if(module)
				{
					pageEdit_event.fire(pageEdit_event.MODULE_COPIED,{module:module, previous_module:this});
					return module;
				}
			}
		}
	}
	this.clone = function()
	{
		var module = this._clone();
		if(module){
			pageEdit_event.fire(pageEdit_event.MODULE_COPIED,{module:module, previous_module:this});
			return module;
		}
			
		
	}
	this.cloneGlobal = function()
	{
		var module = this._clone(false);
		if(module){
			return module;
		}
	}
	this._clone = function(newID)
	{
		if(this.frontend_module){
			var new_module = this.frontend_module.clone(newID);
			if(new_module){
				var module = pageEdit_layout.createFloatModule(new_module.getElement());
				if(module)
				{
					return module;
				}
			}
		}
		
	}
	
	this.reloadElement = function()
	{
		this.element = jQuery_iframe("#" + this.page_id);
		return this.loadElement(this.element);
	};
	
	this._loadElement = function(element)
	{
		this.constructor();
		this.element = element;
		this.system_id = this.system_id || jQuery_iframe(element).attr('rel') || 0;
		this.page_id = this.page_id || jQuery_iframe(element).attr('id');
		this.frontend_module = pageEdit.getChilrenIframe().getModule(element);
		var that = this;
		this.bindEvent();
		this.is_new_inserted_element = jQuery_iframe(element).attr('new_inserted_element');
		this.is_new_element = false;
		if(this.getElement()[0].draggable){
			this.getElement()[0].draggable = false;
		}
		
		
	};
	this.getElement = function()
	{
		return jQuery_iframe(this.element);
	};
	this.getType = function()
	{
		return this.type;
	};
	this.getPage_id = function()
	{
		if(this.frontend_module != undefined)
			return this.frontend_module.getPage_id();
		return this.page_id || jQuery_iframe(this.getElement() ).attr('id');
	};
	
	this.getData = function()
	{
		if(this.frontend_module != undefined)
			return this.frontend_module.getData();
	};
	this.setData = function(data, updateView)
	{
		return this.frontend_module.setData(data, updateView, true);
	};
	this.syncActionWithGlobal = function(action ,params)
	{
		
	}
	this.getSyncModules = function()
	{
		var rs = [];
		var modules = this.frontend_module.getSyncModules();
		for(var i in modules){
			var module = pageEdit.getModule(modules[i].getElement());
			if(module != undefined)
				rs.push(module);
		}
		
		return rs;
	}
	this.syncWithGlobalModule = function(action, params)
	{
		var modules = this.getSyncModules();
		
		for(var i in modules)
		{
			var p = params;
			if(typeof params == 'function'){
				p = params();
			}
			p.push({sync: true});
			modules[i][action].apply(modules[i], p);
		}
	}
	this.isSyncAction = function(args)
	{
		if(args && args.length){
			var last = args[args.length - 1];
			return last && last.sync;
		}
	}
	this.setDataByKey = function(name, data, updateView)
	{
		return this.frontend_module.setDataByKey(name, data, updateView, true);
	};
	this.getStyles = function()
	{
		if(this.frontend_module != undefined)
			return this.frontend_module.getStyles();
	};
	this.fireEvent = function(name, data)
	{
		if(!this.eventEmitter)
			this.eventEmitter = new NanoEvents();
		this.eventEmitter.emit(name, data)
	}
	this.addEventHandler = function(name, func)
	{
		if(!this.eventEmitter)
			this.eventEmitter = new NanoEvents();
		this.eventEmitter.on(name, func);
	}
	this.removeEventHandler = function(name)
	{
		if(!this.eventEmitter)
			return
		delete this.eventEmitter.events[name];
	}
	this.__triggerStyleChanged = function(name, value)
	{
		this.fireEvent('style_changed-' + name, [name, value]);
		
	}
	this.modifyStyle = function(name, value, state)
	{
		var oldValue = this.getStyle(name, true);
		this.setStyle(name, value, state);
		this.getElement().trigger('resize');
		
		//if(pageEdit_undoManager.isDoing()){
		this.__triggerStyleChanged(name, value);	
		//}
		pageEdit_undoManager.manager.registerUndoAction(this, this.modifyStyle, [name, oldValue]);
		
	}
	this.setStyle = function(name, value, element)
	{
		return this.frontend_module.setStyle(name, value, element);
	};
	this.changeZIndex = function(zIndex)
	{
		return this.frontend_module.setStyle('z-index', zIndex);
	}
	
	this._hover = function()
	{
		pageEdit_layout.hightlight(this.getElement());
		this.createModuleHoverInfo();

	};
	this.hover = function()
	{
		if(this.selected || this.hovered)
			return;
		if(window.hover_element != undefined)
		{
		}
		window.hover_element = this;
		this._hover();
		
		this.hovered = true;
	};
	this._unhover = function()
	{
		pageEdit_layout.unhightlight(this.getElement());
	};
	this.unhover = function()
	{
		var t = this.getElement();
		this._unhover();
		delete this.hovered
		delete window.hover_element;
	};
	
	this._select = function()
	{
		return this.openEditor();
	};
	this.select = function()
	{
		return this._select();
	};
	this.isSelecting = function()
	{
		return (pageEdit_float_editor_button.activeModule && pageEdit_float_editor_button.activeModule == this);
	}
	this.doSelect = function()
	{
		var element = this.getElement();
		element.trigger('click');
	}
	this.isOutOfViewport = function()
	{
		var offset = this.getElement().offset();
		var top_of_element = offset.top;
		var win = jQuery_iframe(pageEdit_event.iframe.getWindow());
		var bottom_of_element = offset.top + this.getElement().outerHeight();
		var bottom_of_screen = win.scrollTop() + win.innerHeight();
		var top_of_screen = win.scrollTop();
		return !((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element));

	}
	this.getViewPortPosition = function()
	{
		var offset = this.getElement().offset();
		var scrollTop = jQuery_iframe(pageEdit_event.iframe.getWindow()).scrollTop();
		return {left:offset.left, top: offset.top -scrollTop + 60 };
	}
	this.getSmallEditorPanelPosition = function()
	{
		
		var position = this.getViewPortPosition();
		var panelPosition = $mdPanel.newPanelPosition();
		
		var alignElement = this.moduleInfoBlock;
		if(this.moduleInfoBlock != undefined && this.moduleInfoBlock.length)
		{
			panelPosition = panelPosition.relativeTo(alignElement)
			.addPanelPosition(
				$mdPanel.xPosition.ALIGN_START,
				$mdPanel.yPosition.ALIGN_TOPS
			);
		}
		else{
			panelPosition = panelPosition.left(position.left + 'px');
			panelPosition = panelPosition.top(position.top + 'px');
		}
		return panelPosition;
		
	}
	this.getEditorPanelPosition = function()
	{
		var position = this.getViewPortPosition();
		var panelPosition = $mdPanel.newPanelPosition();
		panelPosition = panelPosition.absolute();
		
		var top = position.top;
		var left = position.left;
		var distanceToTop = position.top;
		var distanceToBottom = $(window).height() - (position.top + this.getElement().height());
		if(distanceToTop > distanceToBottom){
			
		}
		top = 80;
		var distanceToLeft = position.left;
		var distanceToRight = $(window).width() - (position.left + this.getElement().width());
		if(distanceToTop > distanceToBottom){
			left = 30;
			panelPosition = panelPosition.left(left + 'px');
		}
		else{
			left = 30;
			panelPosition = panelPosition.right(left + 'px');
		}
			
		if(distanceToTop > distanceToBottom){
			
		}
		
		panelPosition = panelPosition.top(top + 'px');
		return panelPosition;
	}
	
	this.getBaseTemplate = function()
	{
		return templates('./common.tmpl');
	}
	this.preloadAllEditorTabs = function()
	{
		var template = this.getBaseTemplate();
		
		var templatekeys = tab_templates.keys();
		var tab_template = "";
		var tab_contents = "";
		for(var j in templatekeys){
			var n  = templatekeys[j];
			tab_template = tab_templates(n);
			if(tab_template.length){
				var tab_name = n.substring(2, n.length - 5);
				tab_contents += '<div tab-name="' + tab_name + '" custom-ng-if="enabled_tabs[\'' + tab_name + '\']" class="editor-tab ' + tab_name + '">' + tab_template + '</div>';
			}
		}
		template = template.replace("{{tabs}}", tab_contents);
		return template;
	}
	this.getEditorTabs = function()
	{
		return this.tab_editor;
	}
	this.sortEditorTabs = function()
	{
		var scope = this.getSharedScope();
		scope.$moduleInstance = this;
		scope.enabled_tabs = {};
		var that = this;
		this.getEditorTabs().map(function(item){
			scope.enabled_tabs[item] = true;
		});
		
		safeApply(scope);
		return scope;
	}
	this.getEditorTemplate = function()
	{
		if(!window[this.sharedControllerCode]){
			var template = this.preloadAllEditorTabs();
			return template;
		}
	}
	this.getEditorHolder = function()
	{
		return $('#module-edit-container');
	}
	this.getSharedScope = function()
	{
		var variableName = this.sharedControllerCode;
		window.share_scopes = window.share_scopes  || {};
		return window.share_scopes[variableName];
	}
	this.initController = function()
	{
		var variableName = this.sharedControllerCode;
		window.share_scopes = window.share_scopes  || {};
		if(!window.share_scopes[variableName]){
			window.share_scopes[variableName] = $rootScope.$new();
		}
		var t1 = performance.now() 
		if(this.bases)
		{
			for(var i in this.bases)
			{
				if(!this.bases.hasOwnProperty(i))	continue;
				if(this.bases[i].controller != undefined)
				{
					try
					{
						$controller(this.bases[i].controller, {$scope: window.share_scopes[variableName], $modalInstance:{}, $moduleInstance:this});
						
					}
					catch(e)
					{
						console.log(e);
					}
				}
			}
		}
		if(this.controller != undefined){
			try
			{
					
				$controller(this.controller, {$scope: window.share_scopes[variableName], $modalInstance:{}, $moduleInstance:this});
			}
			catch(e)
			{
				console.log(e);
			}
		}
		safeApply(window.share_scopes[variableName]);
		var t2 = performance.now();
		console.log('Init controller ' + (t2 - t1));
		return window.share_scopes[variableName];
	}
	this.isTemplateCompiled = function()
	{
		var variableName = this.sharedControllerCode;
		return (window.share_scopes && window.share_scopes[variableName] != undefined);
	}
	this.lazyloadEditorTemplate = function()
	{
		var editorContainer = this.getEditorHolder();
		if(editorContainer.children().length == 0){
			var scope = this.initController();
			
			var template = this.getEditorTemplate();
			window.shareLinker = window.shareLinker || {};
			var t1 = performance.now();
			window.shareLinker[this.sharedControllerCode] = $compile(template);
			var content = window.shareLinker[this.sharedControllerCode](scope);
			editorContainer.append(content);
			var t2 = performance.now();
			console.log('lazyloadEditorTemplate ' + (t2 - t1));
		}
	}
	this.openEditor = function()
	{
		var editorContainer = this.getEditorHolder();
		if(!editorContainer.length)
			return;
		if(this.isTemplateCompiled()){
			
			var that = this;
			var scope = that.sortEditorTabs();
			var that = this;
			
			$timeout(function () {
				
				that.initController();
			});
			return;
		}
		var that = this;
		var name = this.type;
		
		var template = this.getEditorTemplate();
		
		var div = $('<div/>');
		div.html(template);
		
		var scope = this.initController();
		var that = this;
		
		window.shareLinker = window.shareLinker || {};
		var t1 = performance.now();
		window.shareLinker[this.sharedControllerCode] = $compile(div);
		
		var content = window.shareLinker[this.sharedControllerCode](scope);
		var t2 = performance.now();
		console.log('compile ' + (t2 - t1));
		editorContainer.append(content);
		$timeout(function () {
			that.sortEditorTabs();
		});
		
	};
	this.loadElement = function(el)
	{
		return this._loadElement(el);
	};
	this._getStructure = function()
	{
		var s = {};
		s.id = this.getPage_id();
		s.type = this.getType();
		if(this.isResizable())
			s.offset = this.getSaveOffset();
		s.styles = this.getStyles();
		s.override_style = this.getStyleOverride();
		s.classAttribute = this.getClassAttribute();
		if($.isEmptyObject(s.override_style))
			delete s.override_style;
		var data = this.getData();
		
		s.item_styles = this.getItemsStyles();
		s.data = data;
		if(this.isAMPElement())
			s.amp_layout = this.getAMPLayout();
		return s;
	};
	this.applyStyleOverride = function(resolution)
	{
		return this.frontend_module.applyStyleOverride(resolution);
	}
	this.setStyleOverride = function(name, value)
	{
		return this.frontend_module.setStyleOverride(name, value);
	}
	this.getStyleOverride = function(resolution)
	{
		var rs = this.frontend_module.getStyleOverride(resolution);
		return rs;
	}
	this.getStructure = function()
	{
		var s = this._getStructure();
		return s;
	};
	this.getBoundingByChildren = function()
	{
		var offset;
		if(this.frontend_module)
			return this.frontend_module.getBoundingByChildren();
		return offset;
	}
	
	this.getBoundingRect = function()
	{
		var offset = this.getRealOffset();
		offset.right = offset.left + offset.width;
		offset.bottom = offset.top + offset.height;
		return offset;
	}
	this.getModulesInfo = function(modules)
	{
		return modules.map(function(module){
			var offset = module.getSnapOffset();
			offset.right = offset.left +offset.width;
			offset.bottom = offset.top +offset.height;
			return $.extend({
				'module': module,
			}, offset)
		})
	}
	this.unlinkFromGlobal = function()
	{
		var frontend_module = this.frontend_module;
		if(frontend_module){
			frontend_module.changePageId();
			frontend_module.setCloneData(frontend_module.module_data);
		}
	}
	this.reLayout = function(gap)
	{
		
		
	}
	this.getVisibleChildModules = function(orderBy)
	{
		if(this.getChildModules == undefined)
			return [];
		var s = this.getChildModules();
		if(!orderBy)	return s;
		if(orderBy == 'position'){
			s = this.getModulesInfo(s);
			s = this.sortElementsByVisual(s);
		}
		
		return s;
	}
	this.escapeWhitespace = function(string)
	{
		var rs = string;
		if(string[string.length - 1] == ' ')
			rs = string.substring(0, string.length - 1) + '&nbsp;';

		if(rs[0] == ' ')
			rs = '&nbsp;' + rs.substring(1);
		return rs;
	}
	this.toTreeNode = function(depth = 0)
	{
		return {
			type: this.getType(),
			label: this.getWidgetDisplayName(),
			id: this.getTreeNodeId(),
			deleted : this.getIsDeleted(),
			visible: this.getCurrentVisibility(),
			depth: depth
		}
	}
	this.getTreeNodeId = function()
	{
		return (this.getElement()[0] ? this.getElement()[0].widget_id: "");
	}
	this.__callSuper = function(name, ...args)
	{
		var non_recursive;
		for(var i = this.bases.length - 1;i >= 0;i--){
			if(typeof this.bases[i][name] == 'function'){
				non_recursive = this.__checkRecursionCall(name, this.bases[i][name]);
				if(non_recursive){
					return this.bases[i][name].apply(this, args);
				}
				
			}
		}
	}
	this.__checkRecursionCall = function (name, func) {
		if (this[name] == func) {
			return false;
		}
		return true;
	};
	this.__getSuper = function(name, ...args)
	{
		for(var i = this.bases.length - 1;i >= 0;i--){
			if(this.bases[i][name] != undefined){
				
				return this.bases[i][name];
			}
		}
	}
	this.__call = function(name, ...args){
	
		for(var i = 0;i <= this.bases.length - 1;i++){
			if(this.bases[i][name] != undefined){
				return this.bases[i][name].apply(this, args);
			}
		}
	}
	this.initializeData={};
}
