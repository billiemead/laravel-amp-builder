export default angular.module("uib/template/tabs/tab_fix.html", []).run(function($templateCache) {
	"ngInject";
	$templateCache.put("uib/template/tabs/tab.html", require('./tab.tmpl'));
}).name;
