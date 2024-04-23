var base = require('./base').default;
var base_structure = require('./base_structure').default;
export default createModuleDefinition([base,base_structure], function($q,pageEdit,pageEdit_layout, pageEdit_undoManager) 
{
	"ngInject";
	this.tab_editor = ['group'];
	this.resizable = false;
	this.getWidgetDisplayName = function(){
		return 'Group';
	}
	this.isChildrenOf = function(module){
		for(var i in this.modules){
			if(this.modules[i].isChildrenOf && this.modules[i].isChildrenOf(module)){
				return true;
			}
		}
	}
	this.contains = function(module){
		if(this.modules && this.modules[module.getPage_id()] != undefined)
			return true;
		for(var i in this.modules){
			if(this.modules[i].contains && this.modules[i].contains(module)){
				return true;
			}
		}
	}
	this.addModule = function(module)
	{
		if(!this.isModuleGroupable(module))
			return;
		if(module.frontend_module){
			this.modules = this.modules || {};
			if(this.modules[module.getPage_id()])
				return;
			this.modules[module.getPage_id()] = module;
			this.frontend_module.addModule(module.frontend_module);
			if(!this.parent)
				this.parent = module.getParentModule();
			var that = this;
			module.getElement().on('resize', function()
			{
				that.getElement().trigger('resize');
				that.frontend_module.update();
			})
		}
	}
	this.isModuleGroupable = function(module)
	{
		if(!module)
			return false;
		if(!module.draggable)
			return false;
		if(!this.isGrouping())
			return true;
		if(!this.parent)
			return true;
		var parent = module.getParentModule();
		if(parent && parent.getPage_id() != this.parent.getPage_id())
			return false;
		return true;
	}
	this.doDrag = function(distanceY, distanceX, temporary = false )
	{
		var top = this.tempOffset.top * 1 + distanceY * 1;
		var left = this.tempOffset.left * 1 + distanceX * 1;
		if(!temporary){
			pageEdit_undoManager.manager.beginGrouping();
			var t0 = performance.now();
			for(var i in this.modules){
				this.modules[i].doDrag(distanceY, distanceX, temporary);
			}
			var t1 = performance.now();
			console.log('dragging took ' + (t1 - t0));
			this.getElement().trigger("dragStop", [ top, left ]);
			this.frontend_module.update();
			pageEdit_undoManager.manager.endGrouping();
		}
		else{
			for(var i in this.modules){
				this.modules[i].doDrag(distanceY, distanceX, temporary);
			}
			if(!this.is_resizing)
				this.getElement().trigger("dragging", [ top, left, distanceY, distanceX]);
		}
	};
	
	this.startDrag = function()
	{
		var bounding = this.getBoundingByChildren();
		this.tempOffset = bounding;
		for(var i in this.modules){
			this.modules[i].startDrag();
		}
	}
	this.align = function(hoffset, voffset)
	{
		var distance = this.frontend_module.align(hoffset, voffset, false);
		if(distance != undefined){
			pageEdit_undoManager.beginGrouping();
			for(var i in this.modules){
				this.modules[i].moveByDistance(distance.top, distance.left);
			}
			pageEdit_undoManager.endGrouping();
			this.frontend_module.update();
			this.getElement().trigger("resize");
		}
	}
	this.onDeselect = function(){
		for(var i in this.modules){
			this.modules[i].onDeselect();
		}
	}
	this.isGrouping = function()
	{
		return this.frontend_module.modules && this.frontend_module.modules && this.frontend_module.modules.length;
	}
	this.clear = function()
	{
		this.modules = {};
		delete this.parent;
		this.frontend_module.clear();
	}
	this.getDragHandler = function()
	{
		return ".group-drag-handler";
	}
	
	this.align_inline = function(hoffset, voffset)
	{
		pageEdit_undoManager.manager.beginGrouping();
		var group_elements;
		var justify_d;
		if(hoffset == 'justify'){
			group_elements = this.frontend_module.getElementsByVisual('left');
			justify_d = 'horizontal';
		}
		else if(voffset == 'justify'){
			group_elements = this.frontend_module.getElementsByVisual('top');
			justify_d = 'vertical';
		}
		var bounding = this.frontend_module.getBoundingByChildren(true);
		var parentWidth = bounding.right - bounding.left;
		var parentHeight = bounding.bottom - bounding.top;
		if(group_elements != undefined){
			var c = 0;
			for(var i in group_elements){
				var module = group_elements[i];
				var offset = module._getInlineOffset();
				c += (justify_d == 'horizontal' ? offset.width * 1 : offset.height * 1);
			}
			var m = !0;
			var ratio = ((justify_d == 'horizontal' ? parentWidth * 1 : parentHeight * 1) - c) / (group_elements.length - 1);
			var start = (justify_d == 'horizontal' ? bounding.left * 1 : bounding.top * 1);
			for(var i in group_elements){
				var module = group_elements[i];
				var offset = module._getInlineOffset();
				var newOffset = {};
				var b = (justify_d == 'horizontal' ? offset.width * 1 : offset.height * 1) + ratio;
				if((0 > b && (m = !1), m)){
					newOffset[(justify_d == 'horizontal' ? 'left' : 'top')] = start;
				}
				start += b
				var parentModule = pageEdit.getModuleById(module.getPage_id());
				parentModule && parentModule.setOffset(newOffset);
			}
		}
		else{
			for(var i in this.modules)
			{
				var module = this.modules[i];
				var offset = module.frontend_module._getInlineOffset();
				var newOffset = {};
				switch(hoffset){
					case 'left':
					newOffset.left = bounding.left;;
					break;
					case 'center':
					newOffset.left = bounding.left + Math.round((parentWidth - offset.width) / 2);
					break;
					case 'right':
					newOffset.left = Math.round((bounding.right - offset.width));
					break;
				}
				switch(voffset){
					case 'top':
					newOffset.top = bounding.top;
					break;
					case 'center':
					newOffset.top = bounding.top + Math.round((parentHeight - offset.height) / 2);
					break;
					case 'bottom':
					newOffset.top = Math.round((bounding.bottom - offset.height));
					break;
				}
			
				module.setOffset(newOffset);
			}
		}
		
		this.frontend_module.update();
		this.getElement().trigger('resize');
		pageEdit_undoManager.manager.endGrouping();
	}

	this.widgetControlController = function($scope, $moduleInstance, $controller)
	{
		"ngInject";
		$controller($moduleInstance.bases[0].widgetControlController,{$scope:$scope, $moduleInstance:$moduleInstance});
		
	}
	this.getWidgetControlTemplate = function()
	{
		return require('../templates/group_control.tmpl');
	}
	this.toTreeNode = function(depth = 0){
		return;
	}
	this.changeDirection = function(direction)
	{
		var s = this.frontend_module.getModulesInfo(this.frontend_module.modules);
		s = this.frontend_module._sortElementsByTop(s);
	}
});