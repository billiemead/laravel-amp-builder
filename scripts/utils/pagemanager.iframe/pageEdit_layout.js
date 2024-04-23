var _ = require('lodash');
export default function(pageEdit_function,lazyLoadWidget,lazyLoadFloatEditor, pageEdit_modules,pageEdit_event)
{
	"ngInject";
	this.columns =
	[
		5.80111,14.3646, 22.9282, 31.4917, 40.0552, 48.6188, 57.1823, 65.7459, 74.3094, 82.8729, 91.4365,100
	];
	this.margin_columns =
	[
		0, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766, 2.12766,2.12766
	];
	this.margin_left = 2.12766;
	this.row_helper_class = 'ww_row_helper';
	this.pagezone_class = 'page_zone';
	this.zone_class = 'section';
	this.popup_class = 'popup-section';
	this.container_class = 'container';
	this.container_fluid_class = 'container-fluid';
	this.row_class = 'row';
	this.row_locked_class = 'row-locked';
	this.column_class = 'col';
	this.column_desktop_class = 'col-md-';
	this.column_large_desktop_class = 'col-lg-';
	this.column_phone_class = 'col-xs-';
	this.column_tablet_class = 'col-sm-';
	
	this.column_tablet_push_offset_class = 'col-sm-push-';
	this.column_tablet_pull_offset_class = 'col-sm-pull-';
	this.column_phone_push_offset_class = 'col-xs-push-';
	this.column_phone_pull_offset_class = 'col-xs-pull-';
	
	this.column_desktop_push_offset_class = 'col-md-push-';
	this.column_desktop_pull_offset_class = 'col-md-pull-';
	
	this.hidden_large_desktop_class = 'hidden-lg';
	this.hidden_phone_class = 'hidden-xs';
	this.hidden_tablet_class = 'hidden-sm';
	
	this.module_class = 'module';
	this.float_module_class = 'module';
	this.module_locked_class = 'module-locked';
	this.module_split_class = 'module-text';
	this.module_split_droppable_selector = "p,h1,h2,h3,h4,h5,h6";
	this.column_float_class = "column-float-none";
	this.column_float_left_class = "column-float-left";
	this.column_float_right_class = "column-float-right";
	this.module_row_class = "module_row";
	this.insertion_point_class = "page_insertion_button";
	this.hightlight_class = 'hightlight';
	this.overlay_class = 'hightlighting';
	
	this.unoverlay = function(element)
	{
		jQuery_iframe("#hightlight_overlay").hide();
		jQuery_iframe(element).removeClass(this.overlay_class);
	};
	this.unoverlayAll = function()
	{
		jQuery_iframe("#hightlight_overlay").hide();
	};
	this.overlay = function(element, options)
	{
		var overlayElement = jQuery_iframe("#hightlight_overlay");
		if(overlayElement.length == 0){
			overlayElement = jQuery_iframe('<div id="hightlight_overlay"/>');
			jQuery_iframe('body').append(overlayElement);
		}
		
		var element = jQuery_iframe(element);
		var offset = element.offset();
		overlayElement.show();
		overlayElement.css({width:element.outerWidth(), height:element.outerHeight(), top:offset.top, left:offset.left});
	}
	this.bindEvent = function()
	{
		var that = this;
		pageEdit_event.on(pageEdit_event.ZONE_ADDED, function(event, params)
		{
			var zone = params.block;
			that.createZone(zone);
			if(params.insert_point){
				var insert_point = jQuery_iframe(params.insert_point);
				if(insert_point.is('div') && !insert_point.hasClass('section-container')) {
					that.remove_section(insert_point, false);
				}
			}
		});
		pageEdit_event.on(pageEdit_event.BLOCK_ADDED, function(event, params)
		{
			var block = params.block;
			block.attr('new_inserted_element', true);
			that.createModule(block);
		});
		pageEdit_event.on('block_frontend_inited', function(event, params)
		{
			var block = params.block;
			that.createModule(block);
		});
		pageEdit_event.on(pageEdit_event.BLOCK_CLONED, function(event, params)
		{
			var block = params.block;
			that.createCloneModule(block);
		});
		
	};
	this.offEvent = function()
	{
		pageEdit_event.off(pageEdit_event.COLUMN_ADDED, function(event, params)
		{
			
		});
		pageEdit_event.off(pageEdit_event.ROW_ADDED, function(event, params)
		{
			
		});
		pageEdit_event.off(pageEdit_event.ZONE_ADDED, function(event, params)
		{
			
		});
		pageEdit_event.off(pageEdit_event.BLOCK_MOVED, function(event, params)
		{
		});
	}
	
	this.scanEmptyRow = function(zone)
	{
		var that = this;
		
		jQuery_iframe('.' + this.row_class, zone).each(function(i)
		{
			if(that.isRowHelper(this))
			{
				jQuery_iframe(this).remove();
				return;
			}
			that.remove_empty_column(this);
			
				
		});
		
	};
	
	this.isZone = function(element)
	{
		return jQuery_iframe(element).hasClass(this.zone_class);
	};
	this.isContent = function(element)
	{
		return jQuery_iframe(element).is(this.module_split_droppable_selector);
	};
	
	this.getModule = function(el)
	{
		var widget_id = jQuery_iframe(el)[0].widget_id;
		return pageEdit_modules.modules[widget_id];
	};
	this.getFloatModule = function(el)
	{
		var widget_id = jQuery_iframe(el)[0].widget_id;
		return pageEdit_modules.modules[widget_id];
	};
	this.createCloneModule = function(el)
	{
		var instance = this.createModule(el);
		if(instance == undefined)
		{
			return false
		}
		instance.is_clone_element = true;
		pageEdit_event.fire(pageEdit_event.MODULE_CLONE_COMPLETED,{module:instance});
		return instance;
	}
	this.saveModule = function(el, module){
		var widget_id = jQuery_iframe(el)[0].widget_id;
		
		pageEdit_modules.modules[widget_id] = module;
		//if(module.type == 'page')
			//console.log('saveModule', el, module,widget_id, pageEdit_modules.modules)
	}
	this.createModule = function(el, type)
	{
		var module =  this.createFloatModule(el, type);
		return module;
	};
	
	this.createZone = function(el)
	{
		this.createModule(el, 'section');
	}
	this.getPrevZone = function(zone)
	{
		var zone = jQuery_iframe(zone);
		var next_zones = zone.prevAll('.' + this.zone_class);
		if(next_zones.length)	return next_zones[0];
	}
	this.getNextZone = function(zone)
	{
		var zone = jQuery_iframe(zone);
		var next_zones = zone.nextAll('.' + this.zone_class);
		if(next_zones.length)	return next_zones[0];
	}
	this.remove_section = function(section, trigger)
	{
		trigger = trigger||true;
		var parent = section.parent();
		if(trigger)
			pageEdit_event.fire(pageEdit_event.ZONE_REMOVED,{'block':section,'parent': parent});
		section.remove();
		
	};
	this.remove_module = function(module, trigger)
	{
		trigger = trigger||true;
		var column = module.parent().parent();
		module.remove();
		if(trigger)
			pageEdit_event.fire(pageEdit_event.BLOCK_REMOVED,{'block':module,'parent': column});
	};
	
	this.unhightlight = function(element)
	{
		jQuery_iframe(element).removeClass(this.hightlight_class);
	};
	this.unhightlightAll = function()
	{
		jQuery_iframe('.'+this.hightlight_class).removeClass(this.hightlight_class);
	};
	this.hightlight = function(element, options)
	{
		jQuery_iframe(element).addClass(this.hightlight_class);
	}

	
	this.getContainerModule = function(module)
	{
		var offset = module.getElement().offset();
		
		var module_width = module.getElement().width();
		var module_height = module.getElement().height();
		offset.top += module_height/2;
		offset.left += module_width/2;
		var elements = this.getModuleAtPosition(offset.top, offset.left);
		if(elements.length == 0)
			return;
		var rs;
		for(var i = elements.length - 1;i >= 0;i--){
			var element = jQuery_iframe(elements[i]);
			if(element.is(module.getElement()))	continue;
			
			var etop = element.offset().top;
			var eleft = element.offset().left;
			var ewidth = element.width();
			var eheight = element.height();
			var module_bottom = offset.top + module_height;
			var module_right = offset.left + module_width;
			
			var element_bottom = etop + eheight;
			var element_right = eleft + ewidth;
			if(element_bottom >= module_bottom && element_right >= module_right){
				rs = element;
				break;
			}
				
		}
		return rs;
	}
	this.getModuleAtPosition = function(top, left, width, height)
	{
		return jQuery_iframe("." + this.float_module_class + ', body > .section-container > section')
				   .filter(function() {
					   
					   var etop = jQuery_iframe(this).offset().top;
					   var eleft = jQuery_iframe(this).offset().left;
					   var ewidth = jQuery_iframe(this).width();
					   var eheight = jQuery_iframe(this).height();
					   var rs  = etop <= top && eleft <= left
					   && (etop + eheight) >= top 
					   && (eleft + ewidth) >= left;
						return rs;
				   });
	}
	
	this.appendZone = function(type) {
		return lazyLoadWidget(type).then(function(moduleDefinition)
		{
			var module = pageEdit_function.createZoneInstance(moduleDefinition, type);
			if(!module || !module.insertZoneTemplate)
				return;
			module.element = jQuery_iframe('body');
			return module.insertZoneTemplate(type, {direction:'bottom'});
			
		});
	}
	this.insertZoneToContainer = function(type, container, direction) {
		direction = direction || 'bottom';
		var moduleDefinition = lazyLoadWidget(type);
		if(!moduleDefinition) return;
		var module = pageEdit_function.createZoneInstance(moduleDefinition, type);
		if(!module || !module.insertZoneTemplate)
			return;
		module.type = type;
		module.element = jQuery_iframe(container);
		return module.insertZoneTemplate(type, {direction:'bottom'});
			
	}
	this._insertZoneTemplate = function(insert_point, name, dropInfo)
	{
		if(!name)
			return null;
		var zone = this.getModule(insert_point);
		if(zone!= undefined)
			return zone.insertZoneTemplate(name, dropInfo);
		
		
	};
	this.createFloatModulePlaceholder = function()
	{
		var uniqueID = pageEdit_function.getUniqueId('flt-widget-');
		var el = "<div class=\"flt-widget\" id=\"" + uniqueID + "\"></div>";
		
		return jQuery_iframe(el);
	}
	this.createEmptyModule = function(type = 'button')
	{
		var moduleDefinition = lazyLoadFloatEditor(type);
		var module = pageEdit_function.createZoneInstance(moduleDefinition, type);
		return module;
	}

	this.createItemModule = function(el, selector)
	{
		var type = 'base_children';
		var moduleDefinition = lazyLoadFloatEditor(type);
		if(moduleDefinition != undefined)
		{
			var module = pageEdit_function.createZoneInstance(moduleDefinition, type);
			
			if(!module || !module.loadElement)
				return;
			module.type = type;
			module.display_name = type;
			module.parentModule = el;
			module.selector = selector;
			//this.saveModule(el, module);
			module.loadElement();
			return module;
		}
	}
	this.createFloatModule = function(el, type)
	{
		var frontend = pageEdit_event.getChilrenIframe().getModule(el);
		
		if(!frontend)
		{
			
			return;
		}
		var instance = this.getFloatModule(el);
		if(instance != undefined)
		{
			
			instance.loadElement(el);
			return instance;
		}
		if(!type)
		{
			if(frontend != undefined)
				type = frontend.getType();
		}
		jQuery_iframe(el).removeAttr('data-type');		
		var that = this;
		var moduleDefinition = lazyLoadFloatEditor(type);
				

		if(moduleDefinition != undefined)
		{
			var module = pageEdit_function.createZoneInstance(moduleDefinition, type);
			
			if(!module || !module.loadElement)
				return;
			module.type = type;
			module.display_name = type;
			this.saveModule(el, module);
			module.loadElement(el);
			if(module.is_new_inserted_element)
				pageEdit_event.fire(pageEdit_event.MODULE_CREATING_COMPLETED,{module:module});
			return module;
		}
	};
	this._insertFloatModule = function(insert_point, type, dropInfo)
	{
		return pageEdit_event.getChilrenIframe().insertModule(insert_point, type, dropInfo);
	};
	this.create_section_helper = function(el)
	{
		return pageEdit_event.getChilrenIframe().insertSection(el);
	};
	this.create_popup_helper = function(el)
	{
		return pageEdit_event.getChilrenIframe().insertPopup(el);
	};
	this.getSectionList = function()
	{
		
	}
	this.check_mouse_in = function(mouseX, mouseY, el)
	{
		var coord = this.pageObj.ddManager.getCoordinate(el);
		return mouseX >= coord.left && mouseX <= coord.right && mouseY >= coord.top && mouseY <= coord.bottom;
	};
	
	this.resize_float_module_column = function(col)
	{
	};
	
	
	this.getModules = function(visibility)
	{
		return pageEdit_modules.modules;
		
	};
	
}