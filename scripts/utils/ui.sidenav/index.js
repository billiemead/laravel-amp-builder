angular.module("template/tabs/uiNavItem.html", [])
.run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/uiNavItem.html", require('./templates/uiNavItem.tmpl'));
}]);
angular.module("template/tabs/uiNavSubItem.html", [])
.run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/uiNavSubItem.html", require('./templates/uiNavSubItem.tmpl'));
}]);
angular.module("template/tabs/uiSidenav.html", [])
.run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/uiSidenav.html", require('./templates/uiSidenav.tmpl'));
}]);
angular.module('ui.Sidenav',["template/tabs/uiNavItem.html", "template/tabs/uiNavSubItem.html","template/tabs/uiSidenav.html"])

.controller('uiSidenavController', require('./controllers/uiSidenavController').default)
.directive('uiSidenav', require('./directives/uiSidenav').default)

.controller('uiNavItemController', require('./controllers/uiNavItemController').default)
.directive('uiNavItem', require('./directives/uiNavItem').default)

.directive('uiNavSubitem', require('./directives/uiNavSubitem').default)
.directive('uiNavItemHeadingTransclude', require('./directives/uiNavItemHeadingTransclude').default)

.directive('uiNavItemContentTransclude', require('./directives/uiNavItemContentTransclude').default)
.directive('uiNavSubitemTransclude', require('./directives/uiNavSubitemTransclude').default)
.directive('uiSidenavContent', require('./directives/uiSidenavContent').default)
.directive('uiNavItemDynamicContentTransclude', require('./directives/uiNavItemDynamicContentTransclude').default)

;
