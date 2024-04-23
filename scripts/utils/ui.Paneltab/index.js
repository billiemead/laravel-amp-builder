angular.module("template/tabs/uiPaneltabItem.html", [])
.run(["$templateCache", function($templateCache) {
	"ngInject";
	$templateCache.put("template/tabs/uiPaneltabItem.html", require('./templates/uiPaneltabItem.tmpl'));
}]);
angular.module("template/tabs/uiPaneltab.html", [])
.run(["$templateCache", function($templateCache) {
	"ngInject";
	$templateCache.put("template/tabs/uiPaneltab.html",  require('./templates/uiPaneltab.tmpl'));
}]);
angular.module('ui.paneltab',["template/tabs/uiPaneltabItem.html","template/tabs/uiPaneltab.html"])

.controller('uiPaneltabController', require('./controller/uiTabsetController').default)
.directive('uiPaneltab', require('./directive/uiPaneltab').default)

.directive('uiPaneltabItem', require('./directive/uiPaneltabItem').default)
.directive('uiPaneltabItemHeadingTransclude', require('./directive/uiPaneltabItemHeadingTransclude').default)
.directive('uiPaneltabContentTransclude', require('./directive/uiPaneltabContentTransclude').default);
