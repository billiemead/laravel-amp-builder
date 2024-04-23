require('./utils/stEditor');
require('./utils/ui.Paneltab/index');
require('./utils/ui.sidenav/index');
import common_app from './app.common';
angular.module('admin_app', [common_app,'ngLocale', 'ui.popup', 'ngCkeditor', 'ui.paneltab', 'ui.Sidenav'])

// Controller function for the builder top header
.controller('headerController', function($location,$rootScope,$scope)
{
	"ngInject";
})
.controller('adminController',require('./app.admin/adminController').default)
.controller('menuController', require('./app.admin/menuController').default)
.directive('configForm', require('./app.admin/directives/config_form').default)

.config(require('./app.admin/config').default)
.config(require('./app.builder/icon.config').default)
