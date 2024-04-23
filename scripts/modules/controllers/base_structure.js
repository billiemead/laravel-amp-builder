export default function($window, $dialog, $controller,pageEdit_layout,pageEdit_ddManager, pageEdit,pageEdit_float_editor_button, pageEdit_undoManager){
	"ngInject";
	this.isDropTarget = function(event, ui)
	{
		if(this.getElement().is(':hidden'))
			return false;
		return true;
	}
	this.contains = function(module){
		if(module == undefined)
			return false;
		var element = module.getElement();
		if(element && element.length)
			return $.contains(this.getElement()[0], element[0]);
		return false;
	}
	this.isContainModule = function(module)
	{
		if(module == undefined)
			return this.getElement().find('.' + pageEdit_layout.module_class).length > 0;
		return this.contains(module);
	}
	this.dragOver = function(event, ui){
		if(ui.module && !ui.module.isChildrenOf(this))
			pageEdit_float_editor_button.dropHighlight(this);
	}
	this.dragEnter = function(event, ui){
		if(ui.module && !ui.module.isChildrenOf(this))
			pageEdit_float_editor_button.dropHighlight(this);
	}
	this.dragLeave = function(event, ui){
		pageEdit_float_editor_button.removeDropHighlight(this);
	}
	this.isDropping = function(event, ui)
	{
		var dropped = pageEdit_ddManager.isDropping(this,event, ui);
		return dropped;
	}
	this.getLayerTrees = function(depth = 0)
	{
		if(!this.getChildModules)
			return;
		var rs = [];
		var modules = this.getChildModules();
		
		for(var i in modules)
		{
			var module = modules[i];
			var node = module.toTreeNode(depth);
			if(module.getLayerTrees != undefined){
				node.children = module.getLayerTrees(depth + 1);
			}
			rs.push(node);

		}
		return rs;
	}
	this.checkInnerDrop = function(direction, info)
	{
		var h = (direction == 'top' || direction == 'left') ? info.region.height : info.region.width;
		h = h / 3;//Math.min(info.region.width, info.region.height) / 3;
		var f = (info.distance / h);
		return f >= 1;
	}
	this.handleDropEvent = function(event, ui)
	{
		var modules;
		if(this.getChildModules && (modules = this.getChildModules()).length)
		{
			var dropTargets = pageEdit_ddManager.getDropTargets(event, ui, modules);
			
			var dropTarget = pageEdit_ddManager.findDropTarget(event, ui, dropTargets);
			
			if(dropTarget){
				return dropTarget.handleDropEvent(event, ui);
			}
			for(var i in modules){
				if(modules[i].handleDragEvent(event, ui)){
					return;
				}
			}
		}
		return this.handleDragEvent(event, ui);
	};
	this.getContainer = function()
	{
		if(this.frontend_module.getContainer)
			return this.frontend_module.getContainer();
	}
	this.insertBlock = function(module, dropInfo)
	{
		var pos = dropInfo.direction;
		var inner = dropInfo.dropInfo.inner;
		var container = this.getContainer();
		if(!inner || !container){
			this.__call('insertBlock', module,dropInfo);
			return;
		}
		(pos == 'top' || pos=='left') && container.prepend(module.getElement());
		(pos == 'bottom' || pos=='right') && container.append(module.getElement());
	}
	
	this.isStructureWidget = function()
	{
		return true;
	}
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$controller($moduleInstance.flexBoxController, {$scope:$scope, $moduleInstance:$moduleInstance});
	};
	this.flexBoxController = function($scope, $moduleInstance)
	{
		"ngInject";
		var properties = ['width', 'flex-direction', 'align-items', 'flex-wrap', 'justify-content'];
		
		$scope.isFlexBox = $moduleInstance.isFlexBox();
		$moduleInstance._initStyles($scope, properties);
	}
	
};
