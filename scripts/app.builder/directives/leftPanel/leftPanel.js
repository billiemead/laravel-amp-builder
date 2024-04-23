var widgetFunc = require('../../../utils/widget');
export default function($window, safeApply, API, popup, pageEdit_layout)
{
	"ngInject";
	return {
		template: require('./template.tmpl'),
		replace:true,
		link: function(scope,element, attrs)
		{
			scope.tools = widgetFunc.getWidgetCategories();
			scope.basePath = window.basePath;
			
		}
	}
}
