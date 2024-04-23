export default function(pageEdit_function,pageEdit_modules,pageEdit_layout, pageEdit,$window,$q)
{
	"ngInject";
	this.bounder_class = 'ww_drag_helper_bounder';
	this.header_pagezone_id = 'header_wrapper';
	this.main_pagezone_id = 'main_wrapper';
	this.footer_pagezone_id = 'footer_wrapper';
	this.border_class = 'ww_drag_helper_border';
	this.bounder_zone_class = 'ww_drag_helper_bounder_zone';
	this.bounder_column_class = 'ww_drag_helper_bounder_column';
	this.bounder_row_class = 'ww_drag_helper_bounder_row';
	this.bounder_module_class = 'ww_drag_helper_bounder_module';
	this.bounder_size = 10;
	this.drop_class = 'ww_drop';
	this.none_create_bounder_element_class = 'no_bound';
	
	this.getCoordinate = function(e)
	{
		var t = jQuery_iframe(e);
		var offset = {top: 0, left: 0};
		if(typeof t['offset'] == 'function')
			offset = jQuery_iframe(e).offset();
		if(offset == null)
			return {top: 0, left: 0, right:0, bottom:0, width:0, height:0};
		var height = jQuery_iframe(e).outerHeight();
		var width = jQuery_iframe(e).outerWidth();
		return {top:offset.top, left:offset.left, right: offset.left + width, bottom: offset.top+ height, width: width, height: height};
	};
	this.elementFromPoint = function(x,y)
	{
		var check=false, isRelative=true;
		if(!this.pageObj.getDocument().elementFromPoint) return null;
		
		if(!check)
		{
		  var sl;
		  if((sl = jQuery_iframe(this.pageObj.getDocument()).scrollTop()) >0)
		  {
		   isRelative = (this.pageObj.getDocument().elementFromPoint(0, sl + jQuery_iframe(window).height() -1) == null);
		  }
		  else if((sl = jQuery_iframe(this.pageObj.getDocument()).scrollLeft()) >0)
		  {
		   isRelative = (this.pageObj.getDocument().elementFromPoint(sl + jQuery_iframe(window).width() -1, 0) == null);
		  }
		  check = (sl>0);
		}
	
		if(!isRelative)
		{
		  x += jQuery_iframe(this.pageObj.getDocument()).scrollLeft();
		  y += jQuery_iframe(this.pageObj.getDocument()).scrollTop();
		}
		return this.pageObj.getDocument().elementFromPoint(x,y);
	};
	
	this.checkPointIn = function(x,y, element)
	{
		var coord = this.getCoordinate(element);
		return x <= coord.right && x >= coord.left && y <= coord.bottom && y >=coord.top;
	};
	
	
	this.init = function(event, ui)
	{
		var that = this;
		jQuery_iframe('body').addClass("dragging");
		pageEdit_layout.unhightlightAll();
		this.dropBlockInfo = 
		{
			moduleNode: null,
			ancestors: null,
			parentLayout: null
		};
		delete this.dropInfo;
		this.inDragRegionModules = [];
		this.outDragRegionModules = [];
		$window.dragging = true;
		this.initModule(event, ui);
	};
	this.getDropTargets = function(event, ui, modules)
	{
		var rs = [];
		//console.log('dragModule', ui.helper.module.canDropTo);
		for(var i in modules)
		{
			if(!modules.hasOwnProperty(i))	continue;
		
			if(!modules[i].isDisabled() && modules[i].isDropTarget(event, ui)){
								

				var isTarget = true;
				var dragModule = ui.helper.module;
				
				if(dragModule != undefined){
					
					isTarget = dragModule.canDropTo(modules[i]);
				}
				if(isTarget){
					
					rs.push(modules[i]);
				}
			
			}
				
		}
		return rs;
	}
	this.initModule = function(event, ui)
	{
		var modules = pageEdit_layout.getModules(true);
		for(var i in modules){
			if(modules[i].onDragStart)
				modules[i].onDragStart(event, ui)
		}
		this.dropTargets = this.getDropTargets(event, ui, modules);
		
		this.ingoreTargets = [];
		
	
	};
	this.destroy = function()
	{
		pageEdit.getDocument().onmousemove = null;
		jQuery_iframe('#dump_element').hide();
		jQuery_iframe('.droppable').removeClass('droppable');
		jQuery_iframe('.dropping').removeClass('dropping');
		jQuery_iframe('.selecting').removeClass('selecting');
		jQuery_iframe('body').removeClass("dragging");
		this.currentDropTarget = null;
		jQuery_iframe('#dropping-highlight').remove();
		delete this.oldDropTarget;
		var modules = pageEdit_layout.getModules(true);
		for(var i in modules){
			if(modules[i].onDragStop)
				modules[i].onDragStop()
		}
		//delete this.dropInfo;
	};
	this._dragStart = function(event, ui)
	{
		
	};
	this._dropOver = function(event, ui)
	{
	};

	
	this.dropModuleInfo = {};
	this._fidDropTarget = function(event, ui, modules)
	{
		var arr = [];
		for(var i in modules)
		{
			if(modules[i].isDropping != undefined){
				var dropped = modules[i].isDropping(event, ui);
				if(dropped)
				{
					arr.push(modules[i]);
				}
			}
		}
		arr.sort(function(l,m)
		{
			if(jQuery_iframe.contains(l.getElement()[0],m.getElement()[0])){
				return 1;
			}
			return -1;
		});
		var e=arr[0];
		return e;
	}
	this.findDropTarget = function(event, ui, modules)
	{
		var arr = [];
		if(!modules)
			modules = this.dropTargets;
		for(var i in modules)
		{
			if(modules[i].isDropping != undefined){
				
				var dropped = modules[i].isDropping(event, ui);
				if(dropped)
				{
					arr.push(modules[i]);
				}
			}
		}
		
		arr.sort(function(l,m)
		{
			if(jQuery_iframe.contains(l.getElement()[0],m.getElement()[0])){
				return 1;
			}
			return -1;
		});
		var e=arr[0];
		return e;
	}
	
	this.getDropElementInfo = function(event, ui){
			
		var node = this.findDropTarget(event, ui);
		if(!node){
			return;
		}
		var node_element = node.getElement();
		var coord = node.getDropOffset();
		var info = {
			node:node_element, 
			x: this.mouseX - coord.left,
			y: this.mouseY - coord.top,
		};
		var type = this.getType(node);
		return {
			node: node_element,
			info: info,
			type: type,
			region: coord,
		};
	}
	this._dragDrag = function(event, ui)
	{
		if(!$window.dragging)
			return;
			
		this.mouseX = event.pageX;
		this.mouseY = event.pageY;
		
		var that = this;
		var arr = [];
		var node = this.findDropTarget(event, ui);
		node && node.handleDropEvent(event, ui);
		if(node && this.oldDropTarget != node){
			this.currentDropTarget = node;
			if(this.oldDropTarget && this.oldDropTarget.dragLeave){
				this.oldDropTarget.dragLeave(event, ui);
			}
			if(node.dragEnter){
				node.dragEnter(event, ui);
			}
			this.oldDropTarget = node;
		}
		else if(node && node.dragOver){
			node.dragOver(event, ui);
		}	
		return;
	};
	this.canDropTo = function(module,event, ui)
	{
		var dropTarget;
		if(module.isDropTarget(event, ui)){
			dropTarget = module;
		}
		if(!dropTarget)
			return false;
					

		var dragModule = ui.helper.module;
		if(dragModule != undefined){
			if(!dragModule.canDropTo(dropTarget))
				return false;
		}
		return true;
	}
	this.checkCanDrag = function(module,event, ui)
	{
		if(this.inDragRegionModules.indexOf(module) >=0)
			return true;
		//if(this.outDragRegionModules.indexOf(module) >=0)
		//	return false;
		//this.outDragRegionModules.push(module);
		var valid = false;
		var dropTarget;
		if(module.isDropTarget(event, ui)){
			dropTarget = module;
		}
			
		if(!dropTarget){
			var parentModule = module.getParentModule();
			if(parentModule.isDropTarget(event, ui))
				dropTarget = parentModule;
		}
		if(!dropTarget)
			return false;
		var dragModule = ui.helper.module;
		if(dragModule != undefined){
			if(!dragModule.canDropTo(dropTarget))
				return false;
		}
		this.inDragRegionModules.push(module);
		return true;
	}
	this.isDropping = function(module,event, ui)
	{
		if(module == undefined)
			return false;
		var coord = this.getCoordinate(module.element);
		return (this.mouseX >= coord.left && this.mouseY > coord.top && this.mouseX <= coord.right && this.mouseY < coord.bottom);
		
		
	};
	this.inDragHandlerRegion = function(module,event, ui)
	{
		if(module == undefined)
			return false;
		var coord = this.getCoordinate(module.element);
		if(!(this.mouseX >= coord.left && this.mouseY > coord.top && this.mouseX <= coord.right && this.mouseY < coord.bottom))
			return false;
		
		return true;
		return this.checkCanDrag(module,event, ui);
	};
	
	this.getType = function(element)
	{
		var e = jQuery_iframe(element);
		var module = pageEdit.getModule(element);
		if(module)	return module.getType();
		return 'module';
	};
	
	this.getEdgeInfo = function(event, module)
	{
		var c = null;
		var coord = this.getCoordinate(module.element);
		var flexDirection = module.getFlexDirection();
		var quad = {
                    x: this.mouseX < coord.left + coord.width / 2 ? "left" : "right",
                    y: this.mouseY < coord.top + coord.height / 2 ? "top" : "bottom"
                };
		var left = "left" === quad.x ? this.mouseX - coord.left : coord.left + coord.width - this.mouseX;
        var top = "top" === quad.y ? this.mouseY - coord.top : coord.top + coord.height - this.mouseY,
        l = Math.min(coord.width, coord.height),
		k = 100 * (left / coord.width),
		p = 100 * (top / l),
		direction = (flexDirection == 'row' && k < p) ? quad.x : quad.y;
		var distance = k < p ? left : top;
		
		isNaN(distance) || (c = {
                node: module.getElement(),
                direction: direction,
                distance: distance,
                quad: quad,
                region: coord
            });
		
        return c;
	};
	this.processedEdgeInfo = {};
	this.processEdgeInfo = function(event, info, ui, canDropTo)
	{
		var originNode = info.node;
		var e = this.dropModuleInfo,
			node = info.node,
			g = e.ancestors,
			h = e.parentLayout,
			k = this.isAdjacentToBlockEdge(node),
			direction = info.direction,
			p = info.region;
		var type = this.getType(node);
		if (!e.moduleNode ) 
		{
			g = jQuery_iframe(node).parents("." + pageEdit_layout.float_module_class );
			g = g.toArray();
			h = jQuery_iframe(node).parents("." + pageEdit_layout.zone_class);
			this.dropModuleInfo = {
				parentLayout: h,
				ancestors: g
			};
		}
		var parent = g = jQuery_iframe(node).parents("." + pageEdit_layout.float_module_class + ':first');
		if(parent.length){
			var fdirection = parent.css('flex-direction');
			if(fdirection == 'column'){
				direction = info.quad.y;
			}
		}
		if (node.is('.' + pageEdit_layout.zone_class))
			direction = info.quad.y;
		if(this.isTraversableDirection(direction,k) )
		{
			var dnode = this.getTraversedDropNode(node, direction, info);
			if(dnode)
			{
				node = dnode;
				type = this.getType(node);
			}
		}
		

		!jQuery_iframe(node).is( info.node) && (p = this.getCoordinate(node));
		var isself = jQuery_iframe(node).hasClass('ww_dragging');
		
		this.dropInfo = {
			node: node,
			direction: direction,
			shouldFloat: e,
			type: type,
			region: p,
			isSelf:isself,
			inner:(originNode != node || canDropTo) && this.checkInnerDrop(event, ui, node, direction, info)
		};
		//console.log('dropInfo',originNode != node, canDropTo);
		
	};
	
	this.isTraversableDirection = function(direction, adjacent)
	{
		//return true;
		var rs = !0;
        adjacent && void 0 !== adjacent[direction] && (rs = adjacent[direction]);
        return rs
	};
	this.getTraversableDepth = function (element, direction, parents) 
	{
		var h = 0;
		for (var g = -1; element && this.canTraverseToParent(element, direction) &&g < parents.length-1;h++,g++, element = parents[g]) 
		{
		}
		return h
	};
	this.canTraverseToParent = function (element, direction) 
	{
		return true;
		var d = jQuery_iframe(element).hasClass(pageEdit_layout.column_class),
			g = !this.forceSingleColumn;
		return d && this.isVerticalDirection(direction) || g && this.canTraverseHorizontallyFromColumn(direction, element) || !d && g && !jQuery_iframe(element).parent().hasClass(pageEdit_layout.zone_class) && this.isHorizontalDirection(direction) || this.canTraverseVerticallyFromModule(direction, element) || this.canTraverseVerticallyFromContent(direction, element)
	};
	this.canTraverseHorizontallyFromColumn = function(direction, element) 
	{
		return jQuery_iframe(element).hasClass(pageEdit_layout.column_class) && ("left" === direction && !jQuery_iframe(element).prev().length > 0 || "right" === direction && !jQuery_iframe(element).next().length > 0);
	};
	this.canTraverseVerticallyFromModule = function(direction, element) 
	{
		return jQuery_iframe(element).hasClass(pageEdit_layout.module_class) && ("top" === direction && !jQuery_iframe(element).prev("." + pageEdit_layout.module_class).length > 0 || "bottom" === direction && !jQuery_iframe(element).next("." + pageEdit_layout.module_class).length > 0);
	};
	this.canTraverseVerticallyFromContent = function(direction, element) 
	{
		return jQuery_iframe(element).is(pageEdit_layout.module_split_droppable_selector) && ("top" === direction && !jQuery_iframe(element).prev(pageEdit_layout.module_split_droppable_selector).length > 0 || "bottom" === direction && !jQuery_iframe(element).next(pageEdit_layout.module_split_droppable_selector).length > 0);
	};
	this.canTraverseVerticallyFromRow = function(direction, element) 
	{
		var rs = jQuery_iframe(element).hasClass(pageEdit_layout.row_class) &&("top" === direction && !jQuery_iframe(element).prev("." + pageEdit_layout.row_class).length > 0 || "bottom" === direction && !jQuery_iframe(element).next("." + pageEdit_layout.row_class).length > 0);
		if(rs)
		{
			var a ="";
		}
		return rs;
	};
	this.getParentModule = function(node)
	{
		var module = pageEdit.getModule(node);
		if(module)
			return module.getParentModule();
	}
	this.checkInnerDrop = function(event, ui, node, direction, info)
	{
		var module = pageEdit.getModule(node);
		if(ui.helper.module && !ui.helper.module.canDropTo(module))
			return false;
		var parentModule = 	module.getParentModule();
		if(ui.helper.module && !ui.helper.module.canDropTo(parentModule))
			return true;
		return (module && module.checkInnerDrop != undefined && module.checkInnerDrop(direction, info, ui));
	}
	this.getTraversedDropNode = function (node, direction, info) {
		var ancestors = this.dropModuleInfo.ancestors;
		if(jQuery_iframe(ancestors[0]).is(node))
		{
			ancestors.shift();
		}
		var g = this.getTraversableDepth(node, direction, ancestors);
		
		if (g) {
			var d = ancestors.length;
			var h = Math.min(info.region.width, info.region.height) / 3;
			var f = Math.floor(g * info.distance / h);
			f = g - f -1;
			var c = Math.min(g-1, Math.min(g, f));
			return ancestors.hasOwnProperty(c) ? ancestors[c] : node;
		}
		return node
	};
	this.isHorizontalDirection = function (b) 
	{
		return "left" === b || "right" === b
	};
	this.isVerticalDirection = function (b) 
	{
		return "top" === b || "bottom" === b
	}; 
	this.isFloatingModule = function(e)
	{
		return false;
	};
	this.isModuleFloatable = function(e)
	{
		return false;
	};
	this.isAdjacentToBlockEdge = function(element)
	{
		var parent = jQuery_iframe(element).parent();
		var boundRect = this.getBoundingClientRect(element);
		var parentBound =  this.getBoundingClientRect(parent);
		return {
			top: jQuery_iframe(element).is(':first-child') && (parentBound.top - boundRect.top) <=5,
			bottom: jQuery_iframe(element).is(':last-child') && (parentBound.bottom - boundRect.bottom) <=5
		};
	};
	this.getBoundingClientRect = function(element)
	{
		return (element[0] || element).getBoundingClientRect();
	}
	this.handleInnerOver = function(event, module,ui, canDropTo)
	{
		if(!$window.dragging)
			return;
		var edgeInfo = this.getEdgeInfo(event, module, ui);
		this.processEdgeInfo(event, edgeInfo,ui, canDropTo);
		this.alignInsertionMarker();
	};
	
	this.alignInsertionMarker = function()
	{
		var dropInfo = this.dropInfo;
		var scope = dropInfo.type;
		if(scope == undefined)
			return;
		var b = jQuery_iframe('#dump_element');
		if(b.length == 0)
		{
			var b = jQuery_iframe('<div id="dump_element" class="ww_insertion_marker"></div>');
			b.append('<div class="ww_insertion_marker_label"/>');
			jQuery_iframe('body').append(b);
		}
		
		var element = jQuery_iframe(dropInfo.node);
		var coord = dropInfo.region;
		var f = dropInfo.direction;
		var width = "";
		var height = "";
		
		jQuery_iframe('.ww_insertion_marker_label', b).html('');
		
		jQuery_iframe('.ww_insertion_marker_label', b).html(scope);
		
		if(f == 'top' || f == 'bottom' )
		{
			
			height = '';
			width = coord.width;
			
		}
		else 
		{
			width = '';
			height =  coord.height;
		}
		b.css( {width: width, height: height} );
		b.show();
		var helper_width = b.width();
		var helper_height = b.height();
		var left,top;
		if(f == 'top')
		{
			left = coord.left;
			top = coord.top;
			if(dropInfo.inner){
				//top += coord.height / 2;
			}
		}
		else if(f == 'bottom')
		{
			left = coord.left;
			top = coord.bottom - helper_height;
			if(dropInfo.inner){
				//top -= coord.height / 2;
			}
		}
		else if(f == 'right')
		{
			left = coord.right - helper_width;
			top = coord.top;
			if(dropInfo.inner){
				//left += coord.width / 2;
			}
		}
		else if(f == 'left')
		{
			left = coord.left;
			top = coord.top;
			if(dropInfo.inner){
				//left -= coord.width / 2;
			}
		}
		if(dropInfo.inner){
			b.addClass('inner');
		}
		else
			b.removeClass('inner')
		b.css( { left: left, top: top} );
	};
	this._drop = function(event, ui)
	{
		var that = this;
		var d = this.dropInfo;
		
		if(d)
		{
			var type = ui.helper.attr('type');
			type = type.substring(0,1).toUpperCase() + type.substring(1);
			
			var pos = d.direction;
			var element_id = jQuery_iframe(d.node).attr('id');
			var element = d.node;
			return pageEdit.insertModule(element,type, d);
		}
		return false;
	};
	this._drop_inner = function()
	{
		$window.dragging = false;
		var defered = $q.defer();
		var d = this.dropInfo;
		if(d)
		{
			var scope = d.type;
			if(scope == undefined)
			{
				defered.reject(0);
				return defered.promise;
			}
			var pos = d.direction;
			var element = jQuery_iframe(d.node);
			defered.resolve({element:element, direction:pos,dropInfo:this.dropInfo});
			
		}
		else
			defered.reject(0);
		return defered.promise;
	};
	this._drop_float_inner = function(event, ui)
	{
		$window.dragging = false;
		var defered = $q.defer();
		
		var d = this.dropInfo;
		if(d)
		{
			var scope = d.type;
			var pos = d.direction;
			var element = jQuery_iframe(d.node);
			
			defered.resolve({element:element, direction:pos,dropInfo:d});
			
		}
		else
			defered.reject(0);
		return defered.promise;
	};
}