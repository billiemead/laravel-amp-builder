export default function($stateProvider, $urlRouterProvider) {
	"ngInject";
	
	$urlRouterProvider
	.otherwise('/content');
	function registerState(name, params){
		var path = 'content/' + params.path;
		var template;
		if(window.getTemplate){
			template = window.getTemplate(path);
		}
		var templateOption = {};
		if(template != undefined)
			templateOption.template = template;
		else{
			templateOption.templateUrl = getViewPath(path);
		}
		params = $.extend({}, params, templateOption);
		$stateProvider.state(name, params);
	}
	
	
}
