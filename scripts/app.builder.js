require('./utils/pagemanager.modules');
require('./utils/pagemanager.iframe');
require('./popup/page');
require('./popup/page_history');

require('./popup/saveTemplate');
require('./popup/section_list');

require('./popup/link');

import colorpicker from './utils/colorpicker/index';

require('./popup/google_font_browser');
require('angular-tree-control');
require('angular-tree-control/context-menu');

import common_app from './app.common';
import widgetStyleComponents from './app.builder/widgetStyleComponents';
require('./app.builder/templates');
var injects = [common_app, colorpicker, 'ngLocale','pageEdit.widgets','pagemanager.iframe', 'treeControl', widgetStyleComponents];
angular.module('content_app', injects)

// Controller function for the builder top header
.controller('headerController', require('./app.builder/controllers/header').default)
.controller('editingContainerController', require('./app.builder/controllers/editingContainer').default)
.controller('leftPanelController', require('./app.builder/controllers/leftPanel').default)
.directive('leftPanel', require('./app.builder/directives/leftPanel/leftPanel').default)
.directive('widgetControl', require('./app.builder/directives/widgetControl/widgetControl').default)
//.directive('dynamicTextInput', require('./app.builder/directives/dynamicTextInput/dynamicTextInput').default)
//.directive('splitRow', require('./app.builder/directives/splitRow').default)

.directive('customNgIf', require('./app.builder/directives/customNgIf').default)
.directive('editorTabs', require('./app.builder/directives/editorTabs').default)
.directive('pageTabs', require('./app.builder/directives/pageTabs').default)
.component('pageResolutions', require('./app.builder/components/pageResolutions/component').default)


.directive('floatWidgetModule', require('./app.builder/directives/floatWidgetModule').default)
.directive('templateWidget', require('./app.builder/directives/floatWidgetModule').templateWidget)

.service('childService', require('./app.builder/services/childService').default)
.service('handlerService', require('./app.builder/services/handlerService').default)
//.service('tourService', require('./app.builder/services/tour').default)

.directive('treeView', require('./app.builder/directives/treeview/treeview').default)

.config(require('./app.builder/config').default)
.config(require('./app.builder/API.config').default)
.config(require('./app.builder/icon.config').default)

//factory contain all function needed to init current editor
.factory('setupFactory', function(handlerService)
{
	"ngInject";
	return {
		//load
		loadEditor: function()
		{
			handlerService.init();
			handlerService._attachHandler();
			handlerService.loadCompleted();
				
		},
		run:function()
		{
			return this.loadEditor();
		}
	}
	
})
.run(function(setupFactory, $timeout, ContextService, $rootScope) 
{
	"ngInject";
	$timeout(function () {
		ContextService.getContext()
		.then((response) => {
			$rootScope.me = response;
		})
	})
	setupFactory.run();
});

$(function()
{
	var inFormOrLink;
	
	$(window).on("beforeunload", function() {
		if(window.is_reload)
			return;
		return confirm("Do you need to reload?"); 
	})

});