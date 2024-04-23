var controllers = require.context("./controllers", true, /^\.\/.*\.js$/);

export default function($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {
	"ngInject";
	//return;
	require('../app.common/config/router.config').default($stateProvider, $urlRouterProvider, controllers);
	return;
	
}