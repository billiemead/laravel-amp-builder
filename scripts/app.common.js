
require('@uirouter/core');

require('@uirouter/angularjs');
require('../node_modules/@uirouter/angularjs/release/stateEvents');

require('angular-sanitize');
require('plupload');
require('angular-messages');
require('angular-aria');
require('angular-material');
require('ngstorage');
require('angular-datatables');


require('./utils/dialog');
require('./utils/popup');

require('./utils/language');
require('./app.common/acl.module');
require('./app.common/functions');
//require('./app.common/directives/icon');
require('./libraries/ngInfiniteScroll/ng-infinite-scroll.js');

require('./utils/pagemanager');
require('./utils/im');

var ms_navigation = require('./utils/ms-navigation');

import stgrid from './utils/stgrid';

import langFilter from './filters/lang';
import ui_accordion from './utils/ui.accordion';
import restangular from './utils/restangular';
import {ngTokenClassComponent} from './app.common/directives/ng-token/ng-token.component';
import { ToastService } from './app.common/services/ToastService';
import { satellizer } from './app.common/services/satellizer';
import { ContextService } from './app.common/services/context.service';
import { SatellizerConfig } from './app.common/config/satellizer.config';
import { RoutesRun } from './app.common/run/routes.run';
import { RouteBodyClassComponent } from './app.common/directives/route-bodyclass/route-bodyclass.component'
import { PageContainerComponent } from './app.common/directives/page-container/page-container.component'
import { FullHeightElementComponent } from './app.common/directives/full-height-element/full-height-element.component';
import { ResponsiveElementComponent } from './app.common/directives/responsive-element/responsive-element.component'
import { APIService } from './utils/services/API.service';
import { APIProvider } from './utils/services/API.provider';
import { PluploadProvider } from './app.common/services/Plupload.provider';

//require('./utils/slider/index');

var injects = [ ui_accordion, 'ui.dialog', 'ui.popup', 'pagemanager.communication', 'pagemanager.file_manager', 'ngStorage', 'ui.router', 'ui.router.state.events', 'ngMessages', 'infinite-scroll', 'ngMaterial','datatables', stgrid, 'ngSanitize', langFilter, restangular, 'satellizer', 'mm.acl', ms_navigation.default];


export default angular.module('app.common', injects)
//.directive('rcDrag', rcDragDirective)
.service('API', APIService)
.service('ToastService', ToastService)
.service('ContextService', ContextService)
.service('commonUtils', require('./app.common/services/utils.service').default)

.controller('loginController', require('./app.common/controllers/login').default)

.provider('APIHelper', APIProvider)
.provider('PluploadHelper', PluploadProvider)


.directive('ngToken',  ngTokenClassComponent)
.directive('routeBodyclass', RouteBodyClassComponent)
.directive('pageContainer', PageContainerComponent)
.directive('responsiveElement', ResponsiveElementComponent)
.directive('fixHeightElement', FullHeightElementComponent)
.directive('materialPreloader', require('./app.common/directives/loader/preloader').default)
.directive('inlineEditable', require('./app.common/directives/inline-editable/inline-editable').default)

.filter('phpDate', require('./app.common/filters/phpDate').default)
.filter('repeatReverse', require('./app.common/filters/repeatReverse').default)

.factory('safeApply', require('./app.common/factories/safeApply').default)

.run(require('./app.common/run/run').default)
.run(RoutesRun)

.config(require('./app.common/config/theme.config').default)
.config(require('./app.common/config/icon.config').default)

.config(SatellizerConfig)
.name;