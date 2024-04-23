var context = require('../../utils/native');
export default function($stateProvider, $urlRouterProvider, controllers) {
	if(window.routes == undefined || controllers == undefined)
		return;
	
	
	function loadRoute(item)
	{
		var controller = context.checkExists(item.controller, controllers);
		
		var state = {
			url:item.url,
			controller: context.g_loadModule(item.controller, controllers)
		}
		if(item.templateUrl)
			state.templateUrl = getViewPath(item.templateUrl);
		if(item.template)
			state.template = item.template;
		if(item.abstract){
			state.abstract = true;
			state.template = state.template || "<ui-view/>";
			state.controller = function($scope){
				"ngInject";
			}
		}
		$stateProvider
		.state(item.name, state);
		if(item.redirectTo != undefined){
			$urlRouterProvider.when(item.url, item.redirectTo);
		}
			
		if(item.default)
			$urlRouterProvider.otherwise(item.url);
	}
	for(var i in routes){
		var route = routes[i];
		loadRoute(route);
	}
}
