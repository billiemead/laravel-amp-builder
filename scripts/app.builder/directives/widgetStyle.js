
export default function(pageEdit, pageEdit_event, $rootScope, API, safeApply)
{
	"ngInject";
	return {
		scope: {
			selectedWidget: "="
		},
		link: function(scope, element, attrs)
		{
			//console.log('widgetStyle', scope.selectedWidget);
			function refresh()
			{
				var style = attrs.widgetStyle;
				console.log('widgetStyle', scope.selectedWidget.getStyle(style));
			}
			scope.$watch('selectedWidget', function(newValue, oldValue) {
				
				if(newValue)
				{
					console.log('widgetStyle', newValue);
					refresh();
				}
				
			});
			
		}
	}
}
