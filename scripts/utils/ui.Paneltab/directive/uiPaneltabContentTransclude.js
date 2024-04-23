export default function() {
	"ngInject";
	function isTabHeading(node) {
		return node.tagName &&  (
		node.hasAttribute('tab-heading') ||
		node.hasAttribute('data-tab-heading') ||
		node.tagName.toLowerCase() === 'tab-heading' ||
		node.tagName.toLowerCase() === 'data-tab-heading'
		||
		node.hasAttribute('tab-label') ||
		node.hasAttribute('data-tab-label') ||
		node.tagName.toLowerCase() === 'tab-label' ||
		node.tagName.toLowerCase() === 'data-tab-label'
		);
	}
	return {
		restrict: 'A',
		require: '^uiPaneltab',
		link: function(scope, elm, attrs) {
		  var tab = scope.$eval(attrs.uiPaneltabContentTransclude);
		  tab.$transcludeFn(tab.$parent, function(contents) {
				angular.forEach(contents, function(node) {
					if (isTabHeading(node)) {
					tab.headingElement = node;
					} else {
						elm.append(node);
					}
				});
		  });
		}
	};
	
}