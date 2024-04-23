export default function($sce, $templateCache, pageEdit)
{
	"ngInject";
	return {
		template: require('./template.tmpl'),
		require: '?ngModel',
		scope: {
			selected: "=?"
		},
		link: function(scope, element, attrs, ngModel)
		{
			scope.treedata = {};
			scope.expandedNodes = [];
			scope.getDepth = function(node)
			{
				return node.depth;
			}
			scope.$watch('selected', function(newValue, oldValue) {
				
				if(newValue)
				{
					var module = pageEdit.getModuleByWidgetId(newValue.id);	
					if(module && module.isSelecting()){
						var nodeElement = $('#tree-node-' + newValue.id)
						nodeElement.length && nodeElement.get(0).scrollIntoView(false);
					}
					
				}
				
			});
			function addToAllNodes(children) {
				if (!children || typeof (children) == "array" && children.length == 0) {
					return;
				}
				for (var i = 0; i < children.length; i++) {
					if(children[i] && children[i].children && children[i].children.length > 0){
						scope.expandedNodes.push(children[i]);
						addToAllNodes(children[i].children);
					}
				}
			}
			if (!ngModel) return;
			ngModel.$render = function() {
				
				scope.treedata = ngModel.$viewValue;
				scope.expandedNodes = [];
				addToAllNodes(scope.treedata);
				return;
			};
			
		},
		controller: function($scope)
		{
			"ngInject";
			$scope.tree_options = {
				templateUrl:'directives/treeview/treeNode.html'
			}
			$templateCache.put('directives/treeview/treeNode.html', require('./treeNode.tmpl'));
			$scope.basePath = window.basePath;
			$scope.doSelect = function(node)
			{
				setTimeout(function(){
					var module = pageEdit.getModuleByWidgetId(node.id);
					if(module != undefined)
					{
						module.doSelect();
					}
				}, 100);
				
			}
			$scope.toogleVisible = function(node, event)
			{
				event.stopPropagation();
				
				var module = pageEdit.getModuleByWidgetId(node.id);
				if(module != undefined)
				{
					node.visible = !node.visible;
					module.setVisibility(node.visible, true);
				}
				
			}
		}
	}
}
