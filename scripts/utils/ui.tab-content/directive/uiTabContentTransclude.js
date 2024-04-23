export default function() {
	"ngInject";
	function isTabHeading(node) {
		return node.tagName &&  (
		node.hasAttribute('tab-heading') ||
		node.hasAttribute('data-tab-heading') ||
		node.tagName.toLowerCase() === 'tab-heading' ||
		node.tagName.toLowerCase() === 'data-tab-heading'
		);
	}
	return {
		restrict: 'A',
		require: '^uiTabset',
		link: function(scope, elm, attrs) {
		  var tab = scope.$eval(attrs.uiTabContentTransclude);
		  tab.$transcludeFn(tab.$parent, function(contents) {
				angular.forEach(contents, function(node) {
					if (isTabHeading(node)) {
					//Let tabHeadingTransclude know.
					tab.headingElement = node;
					} else {
						elm.append(node);
					}
				});
		  });
		}
	};
	
}