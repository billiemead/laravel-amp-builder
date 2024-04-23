require('./utils/ui.sidenav/index');

import common_app from './app.common';
import './popup/section_list';

var injector =  [common_app, 'ui.Sidenav'];
var getAnalyticViewPath = function(path, site_id)
{
	return decodeURIComponent(window.analyticviewPath).format2({viewPath: path, site_id:site_id});
}
window.getAnalyticViewPath = getAnalyticViewPath;
angular.module('admin_app', injector)

.controller('profileController', require('./app.profile/controllers/profile').default)
.controller('menuController', require('./app.profile/controllers/menu').default)

.controller('searchController', require('./app.profile/controllers/search').default)
.controller('addPageController', require('./app.profile/controllers/projects/add').default)
.controller('loginController',require('./app.profile/controllers/login/login').default)

.directive('ldWidgets', require('./app.profile/directives/ldWidgets').default )

.directive('analyticWidgets',require('./app.profile/directives/analyticWidgets').default )
.config(require('./app.profile/config').default)
.run(function($rootScope) 
{
	"ngInject";
});
