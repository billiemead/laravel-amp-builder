export default function($sce, $templateCache, pageEdit)
{
	"ngInject";
	return {
		template: require('./template.tmpl'),
		//require: '?ngModel',
		scope: {
			
			//selected: "=?"
		},
		link: function(scope, element, attrs, ngModel)
		{
			$(window).on('widget_selected', function(event, module){
				var template = module.buildWidgetControl();
				if(template)
					element.html(template);
				else
					element.html('');
			});
			$(window).on('widget_deselected', function(event, module){
				element.html('');
			});
			$(window).on('widget_removed', function(event, module){
				element.html('');
			});
		},
		controller: function($scope)
		{
			"ngInject";
			
		}
	}
}
