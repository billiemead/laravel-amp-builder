export default function() {
	"ngInject";
	function isSubitem(node) {
		return node.tagName &&  (
		node.hasAttribute('ui-nav-subitem') ||
		node.tagName.toLowerCase() === 'ui-nav-subitem' ||
		node.tagName.toLowerCase() === 'ui-nav-subitem'
		);
	}
	function isTabHeading(node) {
		return node.tagName &&  (
		node.hasAttribute('tab-heading') ||
		node.hasAttribute('data-tab-heading') ||
		node.tagName.toLowerCase() === 'tab-heading' ||
		node.tagName.toLowerCase() === 'data-tab-heading'
		);
	};
	return {
		restrict: 'A',
		require: '^uiSidenav',
		link: function(scope, elm, attrs,uiSidenav, uiNavItem) {
			var tab = scope.$eval(attrs.uiNavItemContentTransclude);
				tab.$transcludeFn(tab.$parent, function(contents) {
				angular.forEach(contents, function(node) {
					if (isTabHeading(node)) {
						tab.headingElement = node;
					} else if(isSubitem(node)) {
					  tab.childItems = tab.childItems || [];
					  tab.childItems.push(node);
					}
					else{
						elm.append(node);
					}
				});
			});
		}
	
		
	}
}