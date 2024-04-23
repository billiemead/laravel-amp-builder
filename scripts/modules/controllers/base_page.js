var tab_templates = require.context('../templates/tabs', true, /^\.\/.*\.tmpl$/);

export default function(pageEdit_event, $rootScope, $dialog,popup,pageEdit,pageEdit_layout,pageEdit_undoManager, pageEdit_function, API, pageEdit_font, pageEdit_less,pageEdit_sass, pageEdit_modules, $controller, $compile, $timeout, safeApply){
	"ngInject";
	this.buildLeftPanel = function()
	{
		if(window.leftPanelBuilt)
		{
			$controller(this._leftPanelController, {$scope:window.leftPanelScope, $moduleInstance: this});
			return;
		}
		window.leftPanelBuilt = true;
		var template = require('../templates/page_left_panel.tmpl');
		var leftPanelElement = $('#leftPanel-container');
		leftPanelElement.html(template);
		window.leftPanelScope = $rootScope.$new();
		$controller(this._leftPanelController, {$scope:window.leftPanelScope, $moduleInstance: this});
		$compile(leftPanelElement)(window.leftPanelScope);
	}
	this._leftPanelController = function($scope, popup, pageEdit, safeApply, $moduleInstance, $templateCache)
	{
		"ngInject";
		
		var that = this;
		$scope.show_layer = false;
		$scope.tree_layers = [];
		function refreshLayers(){
			$scope.tree_layers = $moduleInstance.getLayerTrees();
			safeApply($scope);
		}
		function refreshLayersVisibility(layers)
		{
			for(var i in layers)
			{
				var layer = layers[i];
				var module = pageEdit.getModuleByWidgetId(layer.id);
				if(!module)	continue;
				layer.visible = module.getCurrentVisibility();
				if(layer.children && layer.children.length)
				{
					refreshLayersVisibility(layer.children);
				}
			}
		}
		function removeModuleInTree(id, layers)
		{
			for(var i in layers)
			{
				var layer = layers[i];
				if(layer.id == id)
				{
					layers.splice(i, 1);
					return 1;
				}
					
				if(layer.children && layer.children.length)
				{
					var rs = removeModuleInTree(id, layer.children);
					if(rs != undefined)
						return rs;
				}
			}
		}
		function findModuleInTree(id, layers)
		{
			for(var i in layers)
			{
				var layer = layers[i];
				if(layer.id == id)
					return layer;
				if(layer.children && layer.children.length)
				{
					var rs = findModuleInTree(id, layer.children);
					if(rs != undefined)
						return rs;
				}
			}
		}
		function replaceModuleInTree(id, node, layers)
		{
			for(var i in layers)
			{
				var layer = layers[i];
				if(layer.id == id){
					layers.splice(i, 1, node);
					return true;
				}
					
				if(layer.children && layer.children.length)
				{
					var rs = replaceModuleInTree(id, layer.children);
					if(rs)
						return true;
				}
			}
			return false;
		}
		function moveModuleInTree(id, direction, layers)
		{
			for(var i in layers)
			{
				var layer = layers[i];
				if(layer.id == id){
					var nextIndex = i * 1 + 1;
					if(direction == 'up')
						nextIndex = i * 1 - 1;
					if(!layers[nextIndex])
						return;
					var temp = layers[i];
					layers[i] = layers[nextIndex];
					layers[nextIndex] = temp;
					return;
				}
					
				if(layer.children && layer.children.length)
				{
					var rs = moveModuleInTree(id, direction, layer.children);
					if(rs != undefined)
						return rs;
				}
			}
		}
		function moveModuleToNewContainer(widget, oldParent, layers)
		{
			var parent = widget.getParentModule();
			if(!parent)
				return;
			var node = findModuleInTree(widget.getTreeNodeId(), layers);
			if(!node)
				return;
			var oldParentNode = findModuleInTree(oldParent.getTreeNodeId(), layers);
			if(!oldParentNode || !oldParentNode.children || !oldParentNode.children.length){
				return;
			}
			var oldIndex = oldParentNode.children.indexOf(node);
			var nodes = oldParentNode.children.splice(oldIndex, 1);
			if(!nodes.length)
				return;
			var newParentNode = findModuleInTree(parent.getTreeNodeId(), layers);
			if(!newParentNode){
				return;
			}
			var newIndex = widget.getElement().index();
			newParentNode.children = newParentNode.children || [];
			newParentNode.children.splice(newIndex, 0, nodes[0]);
			
		}
		function toLayerNode(module, depth = 0)
		{
			var node = module.toTreeNode(depth);
			if(node && module.getLayerTrees != undefined){
				node.children = module.getLayerTrees(depth + 1);
			}
			return node;
		}
		function appendModuleToTree(newmodule, previous_module)
		{
			var parentModule = previous_module.getParentModule();
			
			if(parentModule){
				var leaf = findModuleInTree(parentModule.getTreeNodeId(), $scope.tree_layers);
				if(leaf){
					var node = toLayerNode(newmodule, leaf.depth + 1);
					leaf.children = leaf.children || [];
					
					leaf.children.push(node);
				}
			}
			else{
				var node = toLayerNode(newmodule);
				var index = newmodule.getElement().index();
				$scope.tree_layers.splice(index, 0, node)
			}
		}
		function appendModuleToNode(newmodule, parent_module)
		{
			var leaf = findModuleInTree(parent_module.getTreeNodeId(), $scope.tree_layers);
			if(leaf){
				var node = toLayerNode(newmodule, leaf.depth);
				leaf.children = leaf.children || [];
				leaf.children.push(node);
			}
		}
		$rootScope.$on('editorReady', function(e, n){
			refreshLayers();
		});
		$(window).off('changePageTab.treeview');
		$(window).on('changePageTab.treeview', function(e, n){
			refreshLayers();
		});
		$(window).off('changeResolution.treeview');
		$(window).on('changeResolution.treeview', function(e, n){
			refreshLayersVisibility($scope.tree_layers);
		});
		$(window).off('widget_visibility_changed.treeview');
		$(window).on('widget_visibility_changed.treeview', function(event, module){
			
			var leaf = findModuleInTree(module.getTreeNodeId(), $scope.tree_layers);
			
			if(leaf)
				leaf.visible = module.getCurrentVisibility();
		});
		$(window).off('widget_removed.treeview');
		$(window).on('widget_removed.treeview', function(event, module){
			var leaf = findModuleInTree(module.getTreeNodeId(), $scope.tree_layers);
			if(leaf)
				leaf.deleted = true;
		});
		$(window).off('widget_unremoved.treeview');
		$(window).on('widget_unremoved.treeview', function(event, module){
			var leaf = findModuleInTree(module.getTreeNodeId(), $scope.tree_layers);
			if(leaf)
				leaf.deleted = false;
		});
		$(window).off('sectionReorder.treeview');
		$(window).on('sectionReorder.treeview', function(event, section, direction){
			moveModuleInTree(section.getTreeNodeId(), direction,$scope.tree_layers);
		});
		$(window).off('widget_change_parent.treeview');
		$(window).on('widget_change_parent.treeview', function(event, widget, oldParent, parent){
			moveModuleToNewContainer(widget, oldParent, $scope.tree_layers);
		});
		$(window).off('widget_selected.treeview');
		$(window).on('widget_selected.treeview', function(event, module){
			var leaf = findModuleInTree(module.getTreeNodeId(), $scope.tree_layers);
			if(leaf)
				$scope.layer_selected = leaf;
		});
		
		pageEdit_event.off(pageEdit_event.MODULE_CREATING_COMPLETED + '.treeview');
		pageEdit_event.on(pageEdit_event.MODULE_CREATING_COMPLETED + '.treeview', function(event, params)
		{
			var module = params.module;
			var parentModule = module.getParentModule();
			if(parentModule){
				var leaf = findModuleInTree(parentModule.getTreeNodeId(), $scope.tree_layers);
				if(leaf){
					var index = module.getElement().index();
					var node = toLayerNode(module, leaf.depth + 1);
					leaf.children = leaf.children || [];
					if(node)
						leaf.children.splice(index, 0, node)
				}
			}
			else{
				var index = module.getElement().index();
				var node = toLayerNode(module);
				if(node)
				$scope.tree_layers.splice(index, 0, node)
			}
		});
		
		pageEdit_event.off(pageEdit_event.MODULE_COPIED + '.treeview');
		pageEdit_event.on(pageEdit_event.MODULE_COPIED + '.treeview', function(event, params)
		{
			var module = params.module;
			if(params.previous_module){
				appendModuleToTree(module, params.previous_module)
			}
			else if(params.parent_module){
				appendModuleToNode(module, params.parent_module)
			}
		});
	}
	this.buildRightPanel = function()
	{
		if(window.rightPanelBuilt){
			this.openEditor();
			return;
		}
			
		window.rightPanelBuilt = true;
		var template = require('../templates/page_right_panel.tmpl');
		var rightPanelElement = $('#editing-container');
		rightPanelElement.html(template);
		var newScope = $rootScope.$new();
		$controller(this._rightPanelController, {$scope:newScope, $moduleInstance: this});
		$compile(rightPanelElement)(newScope);
		var that = this;
		
		$timeout(function()
		{
			that.openEditor();
			var emptyModule = pageEdit_layout.createEmptyModule();
			emptyModule.lazyloadEditorTemplate();
		});
	}
	
	this._rightPanelController = function($scope, popup, pageEdit, safeApply, $moduleInstance, $rootScope, $mdSidenav)
	{
		"ngInject";
		$scope.data = {};
		$scope.data.selected = 2;
		$scope.data.disabled = true;
		$scope.data.disabled_popup = true;
		$(window).on('widget_selected', function(event, module)
		{
			var editor = module.getEditorHolder();
			if(editor){
				var editor_id = editor.attr('id');
				
				$scope.data.disabled = false;
				$scope.data.selected = 0;
				if(editor_id == "page-edit-container"){
					$scope.data.disabled = true;
					$scope.data.selected = 0;
				}
				$mdSidenav('rightPanel').open();
				safeApply($scope);
				
			}
			
		});
		$(window).on('widget_deselected.float_button, changePageTab.float_button, widget_removed.float_button', function(event)
		{
			var type = $rootScope.currentEditTab;
			$scope.data.selected = 2;
			if(type == 'main'){
				$scope.data.disabled_popup = true;
			}
				
			else{
				$scope.data.selected = 1;
				$scope.data.disabled_popup = false;
			}
			$scope.data.disabled = true;
			safeApply($scope);
		});
	}
	this.preloadAllEditorTabs = function()
	{
		var template = this.getBaseTemplate();
		var tabs = this.getEditorTabs();
		var templatekeys = tab_templates.keys();
		var tab_template = "";
		var tab_contents = "";
		for(var i in tabs){
			for(var j in templatekeys){
				var n  = templatekeys[j];
				tab_template = tab_templates(n);
				if(tab_template.length){
					var tab_name = n.substring(2, n.length - 5);
					if(tabs[i] == tab_name)
						tab_contents += '<div tab-name="' + tab_name + '" custom-ng-if="enabled_tabs[\'' + tab_name + '\']" class="editor-tab ' + tab_name + '">' + tab_template + '</div>';
				}
			}
		}
		
		
		template = template.replace("{{tabs}}", tab_contents);
		return template;
	}
	this.sortEditorTabs = function(){}
};
