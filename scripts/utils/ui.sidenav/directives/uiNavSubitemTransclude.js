export default function() {
	"ngInject";
	return {
		restrict: 'A',
		require: '^uiNavItem',
		link: function(scope, elm, attrs, tabCtrl) {
			scope.$watch('childItems', function updateHeadingElement(heading) {
				if (heading && heading.length) {
					console.log(heading);
					tabCtrl.hasChildMenu();
					elm.html('');
					elm.append(heading);
				}
			});
		}
	};
}