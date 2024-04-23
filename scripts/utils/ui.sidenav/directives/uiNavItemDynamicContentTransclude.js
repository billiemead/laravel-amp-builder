export default function() {
	"ngInject";
	return {
		restrict: 'A',
		require: '^uiSidenav',
		link: function(scope, elm, attrs) {
			var tab = scope.$eval(attrs.uiNavItemDynamicContentTransclude);
			tab.$watch('contentElement', function updateContentlement(content) {
				if (content) {
				  elm.html('');
				  elm.append(content);
				  tab._compile();
				}
			});
		}
	};
}