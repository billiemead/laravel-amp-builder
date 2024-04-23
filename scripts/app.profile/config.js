var controllers = require.context("./controllers", true, /^\.\/.*\.js$/);

export default function($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {
	"ngInject";
	
	$mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('YYYY-MM-DD');
    };
	require('../app.common/config/router.config').default($stateProvider, $urlRouterProvider, controllers);
	return;
	
}