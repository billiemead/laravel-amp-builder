var base = require('./base').default;
var Mustache = require('mustache');
var base_structure = require('./base_structure').default;
var base_template = require('./base_template').default;

var widgetFunction = require('../../app.builder/directives/widgetModule');

export default createModuleDefinition([base, base_structure, base_template], function($window, $dialog,popup,$controller,pageEdit,pageEdit_event,pageEdit_layout,pageEdit_ddManager,communication,pageEdit_function, pageEdit_float_editor_button, API, pageEdit_widgets, popup_section_list) 
{
	"ngInject";
	this.htmlMode = false;
	this.subModules = [];
	this.draggable = false;
	this.tab_editor = ['margin', 'template','border', 'text', 'background'];
	
	this.recognize_class = pageEdit_layout.zone_class;
	this.setPosition = function(top, left)
	{
		this.offset.top = top;
		this.offset.left = left;
	};
	this.setSize = function(width, height)
	{
	}
	this.canDropTo = function(module)
	{
		return module && module.getType() == 'page';
	}
	this.setDefaultSize = function()
	{
		
	}
	this.checkInnerDrop = function()
	{
		return true;
	}
	this.translate = function(distanceY, distanceX, temporary = false )
	{
		
	};
	
	this.removeFontFamily = function(font)
	{
		this.__call('removeFontFamily', font);
		var modules = this.getChildModules();
		for(var i in modules){
			modules[i].removeFontFamily(font);
		}
		
	}
	
	this.checkcanPastea = function(module)
	{
		var type = module.getType();
		
		return type != 'popup';
	}
	this.insertModule = function(module){
		if(this.isContainModule(module)){
			return;
		}
		var offset = this.getElement().children('.container').offset();
		var module_offset = module.getElement().offset();
		
		var relative_offset = {left: module_offset.left - offset.left, top: module_offset.top - offset.top};
		this.getElement().children('.container').append(module.getElement());
		module.setOffsets({desktop:relative_offset});
	}
	

	
	this.offEvent = function()
	{
		this._offEvent();
	};
	this._offEvent = function()
	{
		this.unhover();
		if(this.dragHandleElement != undefined)
		{
			this.dragHandleElement.remove();
			delete this.dragHandleElement;
		}
		this.getElement().off();
	};
	
	
	this.contextMenu_edit = function()
	{
		this.select();
	}
	
	this.contextMenu_copy = function()
	{
		this.clone();
		$(window).trigger('sectionCreated');
	}
	this.contextMenu_up = function()
	{
		this.moveUp();
	}
	this.contextMenu_down = function()
	{
		this.moveDown();
	}
	this.softDelete = function(){
		if(!this.getIsDeleted()){
			var pre_zone = pageEdit_layout.getPrevZone(this.getElement());
			var next_zone = pageEdit_layout.getNextZone(this.getElement());
			if(!pre_zone && !next_zone)
			{
				alert(window.t("Can't remove this last section"));
				return;
			}
		}
		
		return this.__callSuper('softDelete');
	}
	this.moveUp = function()
	{
		var zone = pageEdit_layout.getPrevZone(this.getElement());
		if(zone != undefined)
		{
			
			jQuery_iframe(zone).before(this.getElement());
			this.getElement().trigger('resize');
			$(window).trigger('sectionReorder', [this, 'up']);
		}
			
		else {
			alert(window.t("Can't move this section up"));
		}
	}
	this.moveDown = function()
	{
		var zone = pageEdit_layout.getNextZone(this.getElement());
		if(zone!=undefined)
		{
			jQuery_iframe(zone).after(this.getElement());
			this.getElement().trigger('resize');
			$(window).trigger('sectionReorder', [this, 'down']);
		}
			
		else {
			alert(window.t("Can't move this section down"));
		}
	}
	this.widgetControlController = function($scope, $moduleInstance, $controller, pageEdit_clipboard)
	{
		"ngInject";
		$controller($moduleInstance.bases[0].widgetControlController,{$scope:$scope, $moduleInstance:$moduleInstance});
		$scope.paste = function()
		{
			if(pageEdit_clipboard.isEmpty())
				return;
			var module = pageEdit_clipboard.get();
			if(module.getType() != 'section')
				$moduleInstance.appendClonedModule(module);
			else{
				module.cloneAfter($moduleInstance);
			}
			pageEdit_clipboard.clear();
			$scope.pasteable = false;
		}
	}
	this.appendClonedModule = function(module)
	{
		var clonedModule = module._clone();
		if(clonedModule){
			this.getElement().children('.container').append(clonedModule.getElement());
			clonedModule.resetOffsets();
			pageEdit_event.fire(pageEdit_event.MODULE_COPIED,{module:clonedModule, parent_module:this});
		}
	}
	this.cloneAfter = function(module)
	{
		var clonedModule = this._clone();
		if(clonedModule){
			module.getElement().after(clonedModule.getElement());
			pageEdit_event.fire(pageEdit_event.MODULE_COPIED,{module:clonedModule, previous_module:this});
		}
	}
	this.getWidgetControlTemplate = function()
	{
		return require('../templates/section_control.tmpl');
	}
	this.contextMenu_delete = function()
	{
		this.delete();
		$(window).trigger('sectionRemoved');
	}
	
	
	this.setModuleData = function(name, value) {
		
	}

	this.bindEvent =  function()
	{
		this.__call('bindEvent');
		this.initFloatModules();
	};
	
	
	this.moduleInfoButtons =
	{
		
	};
	this.isInViewport = function()
	{
		var scrollTop = widgetFunction.iframeScrollTop();
		var viewport = {
			top:scrollTop,
			width: $('#edit_page').width(),
			height: $('#edit_page').height(),
		}
		viewport.bottom = viewport.top * 1 + viewport.height * 1;
		var offset = this.getSnapOffset();
		offset.bottom = offset.top * 1 + offset.height * 1;
		var isOutside = (offset.top < viewport.top && offset.bottom < viewport.top) || 
		(offset.top > viewport.bottom);
		return !isOutside;
	}
	this.insertHtml = function(html)
	{
		var newsection = jQuery_iframe(html);
		pageEdit_event.getChilrenIframe().insertSection(this.getElement(),newsection);
	}
	
	this.addNew = function()
	{
		var use_template = pageEdit_widgets.checkModuleExists(this.getType() + '_template');
		if(!use_template){
			pageEdit_layout.create_section_helper(this.getElement());
			return;
		}
		var that = this;
		popup_section_list.open({
			type:'section',
			controller: function($scope, $modalInstance){
				"ngInject";
				
			}
		}).result.then(function(template){
			if(template == 'blank'){
				pageEdit_layout.create_section_helper(that.getElement());
			}
			else{
				API.service('template/structure/').get(template.id).then(function(structure){
					if(structure.pageContent != undefined){
						that.insertHtml(structure.pageContent);
					}
				});
			}
		});
		
	}
	
	this.moveByDistance = function(y,x){}
	
	
	this.getTypess = function()
	{
		return 'section';
	};

	
	
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
		this.getElement().children('.container').children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var module = pageEdit.getFloatModule(this);
			if(module != undefined){
				s.push(module);
			}
		});
		return s;
	}
	this.initFloatModules = function()
	{
		var that = this;
		this.getElement().children('.container').children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var moduleInstance = pageEdit_layout.createFloatModule(this);
			if(!moduleInstance)
			{
				return;
			}
		});
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
	this.getFloatModuleStructure= function(module)
	{
		var moduleInstance = pageEdit.getModule(module);
		if(!moduleInstance)
		{
			return;
		}
		
		return moduleInstance.getStructure();
	};
	this.getHeightOffset = function()
	{
		var offsets = this.frontend_module.getHeightOffset();
		return offsets;
		
	}
	this.getData = function()
	{
		return {};//this.getStructure();

	};
	this.getStructure = function()
	{
		var s = this.__call('getStructure');
		var data = this.getFloatModule();
		s.data = data;
		return s;
	};
	
	
	this.initializeData={};
	this.getContainer = function(el)
	{
		var element = this.getElement();
		if(el != undefined)
			element = jQuery_iframe(el);
		
		var container = element.children('.'+pageEdit_layout.container_class);
		if(container.length == 0)
			container = element.children('.'+pageEdit_layout.container_fluid_class);
		return container;
	};
	this._design = function($scope, $modalInstance, $moduleInstance, $controller)
	{
		"ngInject";
		$controller($moduleInstance.bases[0]._design, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
		$scope.overlay_styles = $moduleInstance.getCurrentItemStyles('> .overlay') || {};
		$scope.changeOverlayStyle = function(name, value)
		{
			$scope.changeItemStyle(name, value, '> .overlay')
		}
	}
	this.controller = function($scope, $modalInstance, $moduleInstance)
	{
		"ngInject";
		var element = $moduleInstance.getElement();
		var win = pageEdit_event.iframe.getWindow();
		$scope.data = $scope.data || {};
		$scope.options = [];
		$scope.arrange = function()
		{
			$moduleInstance.arrange();
		}
		$scope.arrangeAll = function()
		{
			pageEdit.getBodyModule().arrange();
		}
		
		$scope.range = function(n) {
			return new Array(n);
		};
		
		
			
	}
	
	
	this.insertFloatModulePlaceholder = function(placeholder)
	{
		this.getElement().children('.container').append(placeholder);
	};
	this.getDropOffset = function()
	{
		return pageEdit_ddManager.getCoordinate(this.getElement().children('.container'));
	}

	
	this.delete = function($modalInstance)
	{
		var that = this;
		$dialog.confirm({
			title:window.t("delete_section_title"),
			message: window.t("delete_section_message"),
		}).result.then(function()
		{
			if($modalInstance != undefined)
				$modalInstance.dismiss('cancel');
			return that._delete();
		});
		
	};
	
	
});