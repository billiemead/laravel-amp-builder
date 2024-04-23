export default function() {
	"ngInject";
	return {
		restrict: 'A',
		require: '^uiPaneltabItem',
		link: function(scope, elm, attrs, tabCtrl) {
			scope.$watch('headingElement', function updateHeadingElement(heading) {
				if (heading) {
					elm.html('');
				elm.append(heading);
				}
			});
		}
	};
}