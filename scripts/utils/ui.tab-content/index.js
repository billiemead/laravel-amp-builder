angular.module("uib/template/tabs/tab2.html", [])
.run(["$templateCache", function($templateCache) {
	"ngInject";
	$templateCache.put("uib/template/tabs/tab2.html", require('./templates/tab2.tmpl'));
}]);
angular.module("uib/template/tabs/tabset2.html", [])
.run(["$templateCache", function($templateCache) {
	"ngInject";
	$templateCache.put('uib/template/tabs/tabset2.html', require('./templates/tabset2.tmpl'));
}]);

angular.module("template/tabs/uiTab.html", [])
.run(["$templateCache", function($templateCache) {
	"ngInject";
	$templateCache.put("template/tabs/uiTab.html", require('./templates/uiTab.tmpl'));
}]);
angular.module("template/tabs/uiTabset.html", [])
.run(["$templateCache", function($templateCache) {
	"ngInject";
	$templateCache.put("template/tabs/uiTabset.html",  require('./templates/uiTabset.tmpl'));
}]);
angular.module("template/tabs/uiSidebar.html", [])
.run(["$templateCache", function($templateCache) {
	"ngInject";
  $templateCache.put("template/tabs/uiSidebar.html", require('./templates/uiSidebar.tmpl'));
}]);
angular.module('ui.tabcontent',["uib/template/tabs/tabset2.html", "template/tabs/uiSidebar.html", "uib/template/tabs/tab2.html","template/tabs/uiTab.html","template/tabs/uiTabset.html"])

.controller('uiTabsetController', require('./controller/uiTabsetController').default)
.directive('uiTabset', require('./directive/uiTabset').default)
.directive('uiSidebar', require('./directive/uiSidebar').default)

.directive('uiTabPane', require('./directive/uiTabPane').default)
.directive('uiTabForm', require('./directive/uiTabForm').default)
.directive('uiTab', require('./directive/uiTab').default)
.directive('uiTabHeadingTransclude', require('./directive/uiTabHeadingTransclude').default)
.directive('uiTabDynamicContentTransclude', require('./directive/uiTabDynamicContentTransclude').default)
.directive('uiTabContentTransclude', require('./directive/uiTabContentTransclude').default);
