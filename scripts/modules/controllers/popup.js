var base = require('./base').default;
var structure = require('./base_structure').default;
var template = require('./base_template').default;

var templates = require.context('../templates', true, /^\.\/.*\.tmpl$/);
var base_page = require('./base_page').default;
var section = require('./section').default;
var section_function = require('../../app.theme/content/sections');
export default createModuleDefinition([base, section, base_page, structure, template], function($window, $dialog,popup,$controller,pageEdit,pageEdit_event,pageEdit_layout,pageEdit_ddManager,communication, pageEdit_float_editor_button) 
{
	"ngInject";
	this.draggable = false;
	this.resizable = false;
	this.type = "popup";
	this.tab_editor = [ 'popup', 'template','text', 'background'];
	this.sharedControllerCode = '$popupcontrollerScope';
	this.delete = function()
	{
		var element = this.getElement();
		pageEdit_layout.remove_module(element);
		pageEdit.deleteModule(element);
		this.afterDelete();
	}
	this.getLayerTrees = function()
	{	
		var root = this.toTreeNode(0);
		var tree_layers = this.__callSuper('getLayerTrees.call', 1);
		root.children = tree_layers;
		return [root];
	}
	
	this.getEditorHolder = function()
	{
		return $('#popup-edit-container');
	}
	this.getPopupType = function()
	{
		return this.getData().popup_type;
	}
	this.getPopupName = function()
	{
		return this.getData().popup_name;
	}
	this.getDisplayName = function()
	{
		var type = this.getPopupType();
		var types = window.t('popupmodule.types', true);
		if(types[type] != undefined)
			type = types[type];
		var name = this.getPopupName();
		if(!(name != undefined && typeof name == 'string'))
		{
			
			var id = this.getPage_id();
			var l = (pageEdit_layout.module_class + '-').length;
			id = id.substring(l);
			name = id;
		}
		name = type + '#' + name;
		
		
		return name;
	}
	this.setData = function(data, updateView)
	{
		return this.frontend_module.setData(data, updateView);
	};
	this.getShadowElement = function()
	{
		return jQuery_iframe(this.element);
	}
	this.getData = function()
	{
		return this.__call('getData');
	};
	this.checkcanPaste = function(module)
	{
		var type = module.getType();
		return type != 'section';
	}
	this.startEditMode = function()
	{
		$('html').attr('edit-type', 'popup');
		jQuery_iframe('html').attr('edit-type', 'popup');
		this.getElement().show();
		var emptyImage = $('<amp-img layout="responsive" width="1" height="1"></amp-img>');
		this.getElement().append(emptyImage);
		this.getElement().siblings().hide();
		var t0 = performance.now();
		this.openEditor();
		
		emptyImage.remove();
		this.buildLeftPanel();
		this.createPermanentResizableLayer();
		var t1 = performance.now();
	}
	this.loadElement = function(el)
	{
		this._loadElement(el);
		var module_data = this.frontend_module.module_data;
		if(module_data && module_data.fonts){
			var body = pageEdit.getBodyModule();
			body.addFonts(module_data.fonts)
		}
	};
	this._bindEvent =  function()
	{
		var that = this;
		
		this.initFloatModules();
	};

	this.reloadElement = function(el)
	{
		return this.loadElement(this.element);
	};
	
	this.getBaseTemplate = function()
	{
		return templates('./common_popup.tmpl');
	}
	
	this.getSnapOffset = function()
	{
		var element = this.getElement().children('.container');
		return $.extend(element.offset(), {width:element.width(), height:element.height()} );
	}
	this.getFloatModule = function(order)
	{
		var s = [];
		var that = this;
		this.getElement().children('.container').children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var structure = that.getFloatModuleStructure(this);
			if(structure != undefined){
				s.push(structure);
			}
		});
		return s;
	}
	this.getChildModules = function()
	{
		var s = [];
		var that = this;
		this.getElement().children('.container').children('.'+pageEdit_layout.module_class).each(function(i)
		{
			var module = pageEdit.getFloatModule(this);
			
			if(module != undefined){
				s.push(module);
			}
		});
		return s;
	}
	this._offsetController = function($scope, $modalInstance, $moduleInstance, safeApply){
		"ngInject";
		var parent = $moduleInstance.bases[0];
		$controller(parent._offsetController, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
		var element = $moduleInstance.getElement();
		var eventUnique = "offsetCtrl__" + $moduleInstance.sharedControllerCode;
		element.off("resizing."+ eventUnique);
		element.off("dragging." + eventUnique);
		$(window).off("changeResolution." + eventUnique);
		$(window).on("changeResolution." + eventUnique, function(event){
			event.stopPropagation();
			$scope.offset = {
				width:$moduleInstance.getElement().width(), 
				height:$moduleInstance.getElement().height()
			}
			safeApply($scope);
		});
	}
	
	this.initFloatModules = function()
	{
		var that = this;
		this.getElement().children('.container').children('.'+pageEdit_layout.module_class).each(function(i)
		{
			var moduleInstance = pageEdit_layout.createFloatModule(this);
			if(!moduleInstance)
			{
				return;
			}
			
		});
	}
	this.getFloatModuleStructure = function(module)
	{
		var s = {};
		var moduleInstance = pageEdit.getFloatModule(module);
		if(!moduleInstance)
		{
			return;
		}
		
		return moduleInstance.getStructure();
	};
	this.getHeightOffset = function()
	{
		return {'desktop': this.offset.height || this.getElement().height(), 'mobile':this.mobile_offset.height}
		
	}
	this.getOffset = function(mode)
	{
		return this.__call('getOffset', mode);
	};
	this.getStructure = function()
	{
		var s = this.__call('getStructure');

		var data = this.getFloatModule();
		s.modules = data;
		
		return s;
	};
	
	this.getTransformLayer = function()
	{
		var div = jQuery_iframe('#popup-resize');
		if(div.length)
			return div;
	}
	this.createTransformLayer = function()
	{
		var div = jQuery_iframe('#popup-resize');
		if(div.length == 0){
			div = pageEdit_float_editor_button.createPlaceholder('popup-resize');
			jQuery_iframe('body').append(div);
		}
		pageEdit_float_editor_button.positionHoverBlock(this, div);
		
		return div;
	}
	this.createPermanentResizableLayer = function()
	{
		if(!this.isResizable())	return;
		var module = this;
		var resizeHandles = "e";
		if(this.getResizableHandles)
			resizeHandles = module.getResizableHandles();
		var element = this.getElement();
		if(element.resizable( "instance" ) != undefined){
			return;
		}
		element.resizable({
			handles:  resizeHandles,
			start: function(event, ui)
			{
				window.dragging = true;
				module.is_resizing = true;
				module.startResize(event, ui);
			},
			resize: function( event, ui ) {
				module.handleResizeEvent(event, ui);
			},
			stop: function(event, ui){
				
				module.handleStopResizeEvent(event, ui);
				module.is_resizing = false;
				window.dragging = false;
			}
		});
	}
	this.startDrag = function()
	{
		this.tempOffset = $.extend({},
		{
			width:this.getElement().width(), 
			height:this.getElement().height()
		});
	}
	this.doDrag = function(distanceY, distanceX, temporary = false ){}
	this.controller = function($scope, $modalInstance, $moduleInstance)
	{
		"ngInject";
				
		$scope.data = $moduleInstance.getData();
		$scope.data.trigger_types = $scope.data.trigger_types || {};
		if($.isArray($scope.data.trigger_types))
			$scope.data.trigger_types = {};
		$scope.data.conditions = $scope.data.conditions || {};
		$scope.delete = function()
		{
			$dialog.confirm({
				title:window.t("delete_popup_title"),
				message: window.t("delete_popup_message"),
			}).result.then(function()
			{
				$moduleInstance.delete();
			});
		}
		var sectionList = pageEdit.getSectionList();
		$scope.sectionList = [];
		if(sectionList != undefined && $.isArray(sectionList['main'])){
			for(var i in sectionList['main'])
				$scope.sectionList.push(
					sectionList['main'][i].getPage_id()
				);
		}
		
			
	}
	this.getDropOffset = function()
	{
		return pageEdit_ddManager.getCoordinate(this.getElement().children('.container'));
	}
	

	
});