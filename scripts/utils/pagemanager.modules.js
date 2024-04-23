var float_req = require.context("../modules/controllers", true, /^\.\/.*\.js$/);
var natv = require('./native');
window.createModuleDefinition = natv.createModuleDefinition;

var pageEdit_widgets_app = angular.module('pageEdit.widgets',[])

.service('pageEdit_widgets', function()
{
	"ngInject";
	this.widgets = {};
	this.editors = {};
	this.float_editors = {};
	this.checkModuleExists = function( name ) {
		return natv.checkExists(name, float_req);
	}
	this.findDefinitionType = function( modulDefinition ) {
		return natv.findDefinitionType(modulDefinition, float_req);
	}
})
.factory('lazyLoadWidget', function($rootScope, $templateCache, $q,pageEdit_widgets)
{
	"ngInject";
	function loadModule( name, scope ) {
		return natv.g_loadModule(name, float_req);
	}
	
	return( loadModule );
})
.factory('lazyLoadEditor', function($rootScope, $templateCache, $q, pageEdit_widgets)
{
	"ngInject";
	function loadModule( name,successCallback, errorCallback ) {
		return natv.g_loadModule(name, float_req);
	}
	return( loadModule );
})
.factory('lazyLoadFloatEditor', function($rootScope, $templateCache, $q, pageEdit_widgets)
{
	"ngInject";
	function loadModule( name ) {
		return natv.g_loadModule(name, float_req);
	}
	return( loadModule );
}).factory('lazyLoadFrontendEditor', function($rootScope, $templateCache, $q, pageEdit_widgets)
{
	"ngInject";
	function loadModule( name, scope ) {
		return;
		
	}
	return( loadModule );
});

