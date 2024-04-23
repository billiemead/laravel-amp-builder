/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"profile": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./app.profile.js","defaultVendors~admin~~36146cbb","defaultVendors~admin~~4cee1585","default~admin~common~~e8c10102"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.admin/controllers/templates/edit.js":
/*!*************************************************!*\
  !*** ./app.admin/controllers/templates/edit.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"API\", \"$stateParams\", \"$dialog\", \"$controller\", function ($scope, API, $stateParams, $dialog, $controller) {\n\t\"ngInject\";\n\n\t$scope.data = {};\n\tAPI.one(\"template\", $stateParams.id).get().then(function (json) {\n\t\t$scope.name = json.name;\n\t\t$scope.data = json;\n\t});\n\t$controller(__webpack_require__(/*! ./form */ \"./app.admin/controllers/templates/form.js\").default, { $scope: $scope });\n\t$scope.submit = function () {\n\t\tvar api = API.restangularizeElement('', $scope.data, 'template');\n\t\tapi.put().then(function (json) {\n\t\t\tif (json == 1) {\n\t\t\t\t$dialog.message({\n\t\t\t\t\ttitle: window.t('record_save_successful_title'),\n\t\t\t\t\tmessage: window.t('record_save_successful_message')\n\t\t\t\t});\n\t\t\t} else {\n\t\t\t\t$scope.errors = json;\n\t\t\t}\n\t\t});\n\t};\n}];\n\n//# sourceURL=webpack:///./app.admin/controllers/templates/edit.js?");

/***/ }),

/***/ "./app.admin/controllers/templates/form.js":
/*!*************************************************!*\
  !*** ./app.admin/controllers/templates/form.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"API\", \"$state\", \"$stateParams\", \"popup\", \"$dialog\", function ($scope, API, $state, $stateParams, popup, $dialog) {\n\t\"ngInject\";\n\n\t$scope.filterCategory = function (criteria) {\n\t\treturn function (item) {\n\t\t\tvar type = $scope.data.type;\n\t\t\tif (type == 'global_section') type = 'section';\n\t\t\treturn type != undefined && item[type] != undefined && item[type] == 1;\n\t\t};\n\t};\n\tAPI.all(\"theme_category\").getList().then(function (json) {\n\t\t$scope.themes_categories = angular.copy(json);\n\t});\n}];\n\n//# sourceURL=webpack:///./app.admin/controllers/templates/form.js?");

/***/ }),

/***/ "./app.admin/controllers/templates/list.js":
/*!*************************************************!*\
  !*** ./app.admin/controllers/templates/list.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"popup\", \"$dialog\", \"API\", function ($scope, popup, $dialog, API) {\n\t\"ngInject\";\n\n\t$scope.gridInstance = {};\n\t$scope.deleteTemplate = function (id) {\n\t\t$dialog.confirm({\n\t\t\ttitle: window.t(\"remove_record_title\"),\n\t\t\tmessage: window.t(\"remove_record_message\")\n\t\t}).result.then(function (result) {\n\t\t\tif (result == 1) {\n\t\t\t\tAPI.one('template', id).remove().then(function (json) {\n\t\t\t\t\tif (json == 1) {\n\t\t\t\t\t\t$scope.gridInstance.instance.reloadData();\n\t\t\t\t\t} else {\n\t\t\t\t\t\t$scope.errors = json;\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t}\n\t\t});\n\t};\n\tAPI.all(\"theme_category\").getList().then(function (json) {\n\t\t$scope.themes_categories = angular.copy(json);\n\t});\n\t$scope.cloneTemplate = function (id) {\n\t\tAPI.service('template/clone').get(id).then(function (json) {\n\t\t\tif (json == 1) {\n\t\t\t\t$scope.gridInstance.instance.reloadData();\n\t\t\t} else {\n\t\t\t\t$scope.errors = json;\n\t\t\t}\n\t\t});\n\t};\n\t$scope.startUploadTemplate = function (id) {\n\t\tvar parentScope = $scope;\n\t\tpopup.open({\n\t\t\tname: 'upload_template',\n\t\t\tcontroller: [\"$modalInstance\", \"$scope\", function controller($modalInstance, $scope) {\n\t\t\t\t\"ngInject\";\n\n\t\t\t\t$scope.uploaded_templates = [];\n\t\t\t\t$scope.uploaded = false;\n\t\t\t\t$scope.upload_options = {\n\t\t\t\t\turl: getApiPath() + '/template/upload',\n\t\t\t\t\tmulti_selection: true,\n\t\t\t\t\textensions: ['template', 'zip'],\n\t\t\t\t\tonFileUploaded: function onFileUploaded(response) {\n\t\t\t\t\t\tvar file = response.file.response.info.result;\n\t\t\t\t\t\tif ($.isArray(file)) {\n\t\t\t\t\t\t\tfor (var i in file) {\n\t\t\t\t\t\t\t\t$scope.uploaded_templates.push(file[i]);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t} else $scope.uploaded_templates.push(file);\n\t\t\t\t\t},\n\t\t\t\t\tonUploadComplete: function onUploadComplete() {\n\t\t\t\t\t\t$scope.uploaded = true;\n\t\t\t\t\t\tparentScope.gridInstance.instance.reloadData();\n\t\t\t\t\t},\n\t\t\t\t\tonError: function onError(response) {\n\t\t\t\t\t\tvar error = response.error;\n\t\t\t\t\t\t$dialog.message({\n\t\t\t\t\t\t\ttitle: error.message,\n\t\t\t\t\t\t\tmessage: error.response\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t};\n\t\t\t}]\n\t\t});\n\t};\n}];\n\n//# sourceURL=webpack:///./app.admin/controllers/templates/list.js?");

/***/ }),

/***/ "./app.common/config/router.config.js":
/*!********************************************!*\
  !*** ./app.common/config/router.config.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = function ($stateProvider, $urlRouterProvider, controllers) {\n\tif (window.routes == undefined || controllers == undefined) return;\n\n\tfunction loadRoute(item) {\n\t\tvar controller = context.checkExists(item.controller, controllers);\n\n\t\tvar state = {\n\t\t\turl: item.url,\n\t\t\tcontroller: context.g_loadModule(item.controller, controllers)\n\t\t};\n\t\tif (item.templateUrl) state.templateUrl = getViewPath(item.templateUrl);\n\t\tif (item.template) state.template = item.template;\n\t\tif (item.abstract) {\n\t\t\tstate.abstract = true;\n\t\t\tstate.template = state.template || \"<ui-view/>\";\n\t\t\tstate.controller = [\"$scope\", function ($scope) {\n\t\t\t\t\"ngInject\";\n\t\t\t}];\n\t\t}\n\t\t$stateProvider.state(item.name, state);\n\t\tif (item.redirectTo != undefined) {\n\t\t\t$urlRouterProvider.when(item.url, item.redirectTo);\n\t\t}\n\n\t\tif (item.default) $urlRouterProvider.otherwise(item.url);\n\t}\n\tfor (var i in routes) {\n\t\tvar route = routes[i];\n\t\tloadRoute(route);\n\t}\n};\n\nvar context = __webpack_require__(/*! ../../utils/native */ \"./utils/native.js\");\n\n//# sourceURL=webpack:///./app.common/config/router.config.js?");

/***/ }),

/***/ "./app.profile.js":
/*!************************!*\
  !*** ./app.profile.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _app = __webpack_require__(/*! ./app.common */ \"./app.common.js\");\n\nvar _app2 = _interopRequireDefault(_app);\n\n__webpack_require__(/*! ./popup/section_list */ \"./popup/section_list.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n__webpack_require__(/*! ./utils/ui.sidenav/index */ \"./utils/ui.sidenav/index.js\");\n\nvar injector = [_app2.default, 'ui.Sidenav'];\nvar getAnalyticViewPath = function getAnalyticViewPath(path, site_id) {\n\treturn decodeURIComponent(window.analyticviewPath).format2({ viewPath: path, site_id: site_id });\n};\nwindow.getAnalyticViewPath = getAnalyticViewPath;\nangular.module('admin_app', injector).controller('profileController', __webpack_require__(/*! ./app.profile/controllers/profile */ \"./app.profile/controllers/profile.js\").default).controller('menuController', __webpack_require__(/*! ./app.profile/controllers/menu */ \"./app.profile/controllers/menu.js\").default).controller('searchController', __webpack_require__(/*! ./app.profile/controllers/search */ \"./app.profile/controllers/search.js\").default).controller('addPageController', __webpack_require__(/*! ./app.profile/controllers/projects/add */ \"./app.profile/controllers/projects/add.js\").default).controller('loginController', __webpack_require__(/*! ./app.profile/controllers/login/login */ \"./app.profile/controllers/login/login.js\").default).directive('ldWidgets', __webpack_require__(/*! ./app.profile/directives/ldWidgets */ \"./app.profile/directives/ldWidgets.js\").default).directive('analyticWidgets', __webpack_require__(/*! ./app.profile/directives/analyticWidgets */ \"./app.profile/directives/analyticWidgets.js\").default).config(__webpack_require__(/*! ./app.profile/config */ \"./app.profile/config.js\").default).run([\"$rootScope\", function ($rootScope) {\n\t\"ngInject\";\n}]);\n\n//# sourceURL=webpack:///./app.profile.js?");

/***/ }),

/***/ "./app.profile/config.js":
/*!*******************************!*\
  !*** ./app.profile/config.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$stateProvider\", \"$urlRouterProvider\", \"$mdDateLocaleProvider\", function ($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {\n\t\"ngInject\";\n\n\t$mdDateLocaleProvider.formatDate = function (date) {\n\t\treturn moment(date).format('YYYY-MM-DD');\n\t};\n\t__webpack_require__(/*! ../app.common/config/router.config */ \"./app.common/config/router.config.js\").default($stateProvider, $urlRouterProvider, controllers);\n\treturn;\n}];\n\nvar controllers = __webpack_require__(\"./app.profile/controllers sync recursive ^\\\\.\\\\/.*\\\\.js$\");\n\n//# sourceURL=webpack:///./app.profile/config.js?");

/***/ }),

/***/ "./app.profile/controllers sync recursive ^\\.\\/.*\\.js$":
/*!***************************************************!*\
  !*** ./app.profile/controllers sync ^\.\/.*\.js$ ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./domains/list.js\": \"./app.profile/controllers/domains/list.js\",\n\t\"./integrations/list.js\": \"./app.profile/controllers/integrations/list.js\",\n\t\"./login/login.js\": \"./app.profile/controllers/login/login.js\",\n\t\"./menu.js\": \"./app.profile/controllers/menu.js\",\n\t\"./profile.js\": \"./app.profile/controllers/profile.js\",\n\t\"./projects/add.js\": \"./app.profile/controllers/projects/add.js\",\n\t\"./projects/analytics.js\": \"./app.profile/controllers/projects/analytics.js\",\n\t\"./projects/edit.js\": \"./app.profile/controllers/projects/edit.js\",\n\t\"./projects/list.js\": \"./app.profile/controllers/projects/list.js\",\n\t\"./search.js\": \"./app.profile/controllers/search.js\",\n\t\"./templates/add.js\": \"./app.profile/controllers/templates/add.js\",\n\t\"./templates/edit.js\": \"./app.profile/controllers/templates/edit.js\",\n\t\"./templates/list.js\": \"./app.profile/controllers/templates/list.js\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./app.profile/controllers sync recursive ^\\\\.\\\\/.*\\\\.js$\";\n\n//# sourceURL=webpack:///./app.profile/controllers_sync_^\\.\\/.*\\.js$?");

/***/ }),

/***/ "./app.profile/controllers/domains/list.js":
/*!*************************************************!*\
  !*** ./app.profile/controllers/domains/list.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"popup\", \"$dialog\", \"API\", function ($scope, popup, $dialog, API) {\n\t\"ngInject\";\n\n\t$scope.gridInstance = {};\n\t$scope.deleteTemplate = function (id) {\n\t\t$dialog.confirm({\n\t\t\ttitle: window.t(\"remove_record_title\"),\n\t\t\tmessage: window.t(\"remove_record_message\")\n\t\t}).result.then(function (result) {\n\t\t\tif (result == 1) {\n\t\t\t\tAPI.one('domain', id).remove().then(function (json) {\n\t\t\t\t\tif (json == 1) {\n\t\t\t\t\t\t$scope.gridInstance.instance.reloadData();\n\t\t\t\t\t} else {\n\t\t\t\t\t\t$scope.errors = json;\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t}\n\t\t});\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/domains/list.js?");

/***/ }),

/***/ "./app.profile/controllers/integrations/list.js":
/*!******************************************************!*\
  !*** ./app.profile/controllers/integrations/list.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"API\", \"$dialog\", \"popup\", \"safeApply\", function ($scope, API, $dialog, popup, safeApply) {\n\t\"ngInject\";\n\n\t$scope.delete = function (index) {\n\t\t$dialog.confirm({\n\t\t\ttitle: window.t(\"delete_integration_title\"),\n\t\t\tmessage: window.t(\"delete_integration_message\")\n\t\t}).result.then(function () {\n\t\t\tAPI.one('integration', $scope.integrations[index].id).remove().then(function (json) {\n\t\t\t\tif (json == 1) {\n\t\t\t\t\t$scope.integrations.splice(index, 1);\n\t\t\t\t} else {\n\t\t\t\t\t$dialog.message({ title: 'Error', message: json });\n\t\t\t\t}\n\t\t\t});\n\t\t});\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/integrations/list.js?");

/***/ }),

/***/ "./app.profile/controllers/login/login.js":
/*!************************************************!*\
  !*** ./app.profile/controllers/login/login.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$location\", \"$rootScope\", \"$scope\", \"communication\", function ($location, $rootScope, $scope, communication) {\n\t\"ngInject\";\n\n\t$scope.submitData = function () {\n\t\t$scope.buttonDisabled = true;\n\t\tform.submit();\n\t};\n\tif (window.grecaptcha) grecaptcha.ready(function () {\n\t\tgrecaptcha.execute(\"{{$siteKey}}\", { action: 'auth' }).then(function (token) {\n\t\t\tconsole.log('token', token);\n\t\t});\n\t});\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/login/login.js?");

/***/ }),

/***/ "./app.profile/controllers/menu.js":
/*!*****************************************!*\
  !*** ./app.profile/controllers/menu.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$location\", \"$rootScope\", \"$scope\", \"communication\", function ($location, $rootScope, $scope, communication) {\n\t\"ngInject\";\n\n\t$scope.currentMenu = 'dashboard';\n\t$scope.currentMenuPath = ['dashboard'];\n\tfunction getCurrentMenu(name) {\n\t\tif (name != undefined) {\n\t\t\tvar path = name.split('.');\n\t\t\tif (path.length) {\n\t\t\t\treturn path[0];\n\t\t\t}\n\t\t}\n\t\treturn name;\n\t}\n\tfunction getMenuPath(name) {\n\t\tif (name != undefined) {\n\t\t\tvar path = name.split('.');\n\t\t\tif (path.length) {\n\t\t\t\treturn path;\n\t\t\t}\n\t\t}\n\t\treturn [];\n\t}\n\t$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {\n\t\t$scope.currentMenu = getCurrentMenu(toState.name);\n\t\t$scope.currentMenuPath = getMenuPath(toState.name);\n\t});\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/menu.js?");

/***/ }),

/***/ "./app.profile/controllers/profile.js":
/*!********************************************!*\
  !*** ./app.profile/controllers/profile.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"API\", \"$state\", \"$stateParams\", function ($scope, API, $state, $stateParams) {\n\t\"ngInject\";\n\n\tAPI.service(\"user\").get('').then(function (json) {\n\t\t$scope.data = json;\n\t});\n\n\t$scope.changePassword = function () {\n\t\tAPI.service('user/password').post({ old_password: $scope.old_password, new_password: $scope.new_password }).then(function (json) {\n\t\t\tif (json == 1) {\n\t\t\t\t$scope.changePassword_success = [\"Password updated.\"];\n\t\t\t\tdelete $scope.changePassword_errors;\n\t\t\t} else {\n\t\t\t\t$scope.changePassword_errors = json;\n\t\t\t\tdelete $scope.changePassword_success;\n\t\t\t}\n\t\t});\n\t};\n\t$scope.updateUser = function () {\n\t\tAPI.service('user').post($scope.data).then(function (json) {\n\t\t\tif (json == 1) {\n\t\t\t\t$scope.changeInfo_success = [\"Information updated.\"];\n\t\t\t\tdelete $scope.errors;\n\t\t\t} else {\n\t\t\t\t$scope.errors = json;\n\t\t\t\tdelete $scope.changeInfo_success;\n\t\t\t}\n\t\t});\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/profile.js?");

/***/ }),

/***/ "./app.profile/controllers/projects/add.js":
/*!*************************************************!*\
  !*** ./app.profile/controllers/projects/add.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"communication\", \"$stateParams\", \"popup\", \"$state\", \"$dialog\", \"API\", function ($scope, communication, $stateParams, popup, $state, $dialog, API) {\n\t\"ngInject\";\n\n\t$scope.category = 0;\n\tif ($stateParams.id != undefined) {\n\t\t$scope.category = $stateParams.id;\n\t}\n\n\t$scope.data = {};\n\t$scope.errors = {};\n\t$scope.templates = [];\n\tvar filterCategory = function filterCategory(categories, type) {\n\t\tvar rs = [];\n\t\tif ($.isArray(categories)) {\n\t\t\trs = categories.filter(function (item) {\n\t\t\t\treturn item[type] != undefined && item[type] == 1;\n\t\t\t});\n\t\t}\n\t\treturn rs;\n\t};\n\tAPI.service('page').getList().then(function (json) {\n\t\t$scope.pages = json;\n\t});\n\n\t$scope.category_name = false;\n\tAPI.service('theme_category').getList().then(function (json) {\n\t\t$scope.themes_categories = filterCategory(json, 'page');\n\t\tfor (var i in $scope.themes_categories) {\n\t\t\tif ($scope.themes_categories[i].id == $scope.category) {\n\t\t\t\t$scope.category_name = $scope.themes_categories[i].title;\n\t\t\t}\n\t\t}\n\t});\n\t$scope.scrollContainer = $('page-container');\n\n\tvar scrollLoader = function scrollLoader() {\n\t\tthis.items = [];\n\t\tthis.busy = false;\n\t\tthis.disabled = false;\n\t\tthis.page = 0;\n\t\tthis.length = 4;\n\t\tthis.recordsTotal = Infinity;\n\t\tthis.nextPage = function () {\n\t\t\tif (this.busy) return;\n\t\t\tif (!$scope.current_tab) return;\n\t\t\tthis.busy = true;\n\t\t\tAPI.service('template/nextPage').post({ length: this.length, start: this.page == 0 ? 0 : this.page * this.length }, { category: $scope.category, type: $scope.current_tab.type || 'page', is_global: $scope.current_tab.is_global }).then(function (json) {\n\t\t\t\tthis.recordsTotal = json.recordsTotal * 1;\n\t\t\t\tif (json.data && json.data.length) {\n\t\t\t\t\tfor (var i in json.data) {\n\t\t\t\t\t\tthis.items.push(json.data[i]);\n\t\t\t\t\t}\n\t\t\t\t\tthis.disabled = this.items.length >= this.recordsTotal;\n\t\t\t\t} else this.disabled = true;\n\t\t\t\tthis.busy = false;\n\t\t\t\tthis.disabled = this.disabled || this.busy;\n\t\t\t\tthis.page++;\n\t\t\t}.bind(this));\n\t\t};\n\t\tthis.reset = function () {\n\t\t\tthis.items = [];\n\t\t\tthis.page = 0;\n\t\t\tthis.disabled = false;\n\t\t\tthis.nextPage();\n\t\t};\n\t};\n\t$scope.filter = function (category) {\n\n\t\tif (category == $scope.category) return;\n\t\t$scope.category = category;\n\t\t$scope.loader.reset();\n\t};\n\t$scope.loader = new scrollLoader();\n\t$scope.selectTheme = function (theme, maxsite) {\n\t\tpopup.open({\n\t\t\tname: 'add_page',\n\t\t\tcontroller: [\"$scope\", \"$modalInstance\", \"$state\", function controller($scope, $modalInstance, $state) {\n\t\t\t\t\"ngInject\";\n\n\t\t\t\t$scope.data = { type: 1, template: theme };\n\t\t\t\t$scope.ok = function () {\n\t\t\t\t\tAPI.service('page').post($scope.data).then(function (json) {\n\t\t\t\t\t\tif (json == 1) {\n\t\t\t\t\t\t\t$modalInstance.close(1);\n\t\t\t\t\t\t\t$state.go(\"projects.list\", {}, { reload: true });\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t$scope.errors = json;\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t};\n\t\t\t}]\n\t\t});\n\t};\n\t$scope.reloadState = function (category_id) {\n\t\tif (category_id != undefined) $state.go(\"pages.add_category\", { id: category_id }, { reload: true });else $state.go(\"pages.add\", {}, { reload: true });\n\t};\n\t$scope.loader = new scrollLoader();\n\t$scope.tabs = [{ name: 'System Templates', type: 'page', is_global: 1 }, { name: 'My Templates', type: 'page', is_global: 0 }];\n\t$scope.changeTab = function (index) {\n\t\t$scope.current_tab = $scope.tabs[index];\n\t\t$scope.loader.reset();\n\t};\n\t$scope.changeTab(0);\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/projects/add.js?");

/***/ }),

/***/ "./app.profile/controllers/projects/analytics.js":
/*!*******************************************************!*\
  !*** ./app.profile/controllers/projects/analytics.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"$state\", \"$stateParams\", \"$rootScope\", \"$dialog\", \"API\", \"popup\", function ($scope, $state, $stateParams, $rootScope, $dialog, API, popup) {\n\t\"ngInject\";\n\n\t$rootScope.site_id = $stateParams.id;\n\t$scope.site_id = $stateParams.id;\n\t$scope.data = { 'startDate': moment().subtract(1, 'months'), 'endDate': moment() };\n\t$scope.data.options = {\n\t\topens: \"left\",\n\t\teventHandlers: {\n\t\t\t\"apply.daterangepicker\": function applyDaterangepicker(ev, picker) {\n\t\t\t\t$rootScope.date = $scope.data.date;\n\t\t\t\t$rootScope.$broadcast('dateChanged');\n\t\t\t}\n\t\t}\n\t};\n\t$scope.changeData = function () {\n\t\t$rootScope.date = $scope.data;\n\t\t$rootScope.$broadcast('dateChanged');\n\t};\n\t$scope.setSelectLabel = function (label) {\n\t\t$scope.data.select_label = label;\n\t};\n\t$scope.clearData = function () {\n\t\t$dialog.confirm({\n\t\t\ttitle: window.t(\"delete_site_analytic\"),\n\t\t\tmessage: window.t(\"delete_site_analytic_message\")\n\t\t}).result.then(function () {\n\t\t\tAPI.service('page/clearAnalytic').post({ id: $stateParams.id }).then(function (json) {\n\t\t\t\t$scope.changeData();\n\t\t\t});\n\t\t});\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/projects/analytics.js?");

/***/ }),

/***/ "./app.profile/controllers/projects/edit.js":
/*!**************************************************!*\
  !*** ./app.profile/controllers/projects/edit.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"$state\", \"$stateParams\", \"$rootScope\", \"$dialog\", \"API\", \"popup\", \"popup_section_list\", function ($scope, $state, $stateParams, $rootScope, $dialog, API, popup, popup_section_list) {\n\t\"ngInject\";\n\n\t$scope.site_id = $stateParams.id;\n\t$scope.data = {};\n\tAPI.one('page', $stateParams.id).get().then(function (json) {\n\t\t$scope.data = json;\n\t}, function (error) {\n\t\tif (error.status = 404) $state.go(\"projects.list\", {}, { reload: true });\n\t\t//console.log(error)\n\t});\n\t$scope.variants = [];\n\tAPI.service('page').get('variants', { site_id: $stateParams.id }).then(function (json) {\n\t\t$scope.variants = json.variants;\n\t\t$scope.discarded_variants = json.discarded_variants;\n\t});\n\t$scope.addVariant = function () {\n\t\tpopup_section_list.open({ type: 'page' }).result.then(function (template) {\n\t\t\tpopup.open({\n\t\t\t\tname: 'add_variant',\n\t\t\t\tcontroller: [\"$scope\", \"$modalInstance\", function controller($scope, $modalInstance) {\n\t\t\t\t\t\"ngInject\";\n\n\t\t\t\t\t$scope.data = { name: 'newpage', template: template.id || template };\n\n\t\t\t\t\t$scope.ok = function () {\n\t\t\t\t\t\tAPI.one('page/variants').customPOST({ site_id: $stateParams.id, data: $scope.data }).then(function (json) {\n\t\t\t\t\t\t\tif (json.id) $modalInstance.close(json);else $scope.errors = json;\n\t\t\t\t\t\t});\n\t\t\t\t\t};\n\t\t\t\t}]\n\t\t\t}).result.then(function (data) {\n\t\t\t\t$scope.variants.push(data);\n\t\t\t});\n\t\t});\n\t};\n\t$scope.cloneVariant = function (variant) {\n\t\tAPI.service('page/variants/clone/' + variant.id).post({}).then(function (json) {\n\t\t\t$scope.variants.push(json);\n\t\t});\n\t};\n\t$scope.changeName = function (variant) {\n\t\tpopup.open({\n\t\t\tname: 'edit_variant',\n\t\t\tcontroller: [\"$scope\", \"$modalInstance\", function controller($scope, $modalInstance) {\n\t\t\t\t\"ngInject\";\n\n\t\t\t\t$scope.data = { name: variant.name };\n\n\t\t\t\t$scope.ok = function () {\n\t\t\t\t\tvar postData = { id: variant.id, data: $scope.data };\n\t\t\t\t\tvar id = variant.id;\n\n\t\t\t\t\tAPI.one('page/variants/' + id).customPUT(postData).then(function (json) {\n\t\t\t\t\t\tif (json.id) $modalInstance.close(json);else $scope.errors = json;\n\t\t\t\t\t});\n\t\t\t\t};\n\t\t\t}]\n\t\t}).result.then(function (data) {\n\t\t\tvariant.name = data.name;\n\t\t});\n\t};\n\n\t$scope.removeVariant = function (index) {\n\t\tif ($scope.variants.length <= 1) return;\n\t\tvar id = $scope.variants[index].id;\n\t\tAPI.one('page/variants', id).remove().then(function (json) {\n\t\t\t$scope.discarded_variants.push($scope.variants[index]);\n\t\t\t$scope.variants.splice(index, 1);\n\t\t});\n\t};\n\t$scope.restoreVariant = function (index) {\n\t\tvar id = $scope.discarded_variants[index].id;\n\t\tAPI.service('page/variants/restore/' + id).post({}).then(function (json) {\n\t\t\t$scope.variants.push(json);\n\t\t\t$scope.discarded_variants.splice(index, 1);\n\t\t});\n\t};\n\t$scope.destroyVariant = function (index) {\n\t\tvar id = $scope.discarded_variants[index].id;\n\t\tAPI.service('page/variants/forceDelete/' + id).post({}).then(function (json) {\n\t\t\t$scope.discarded_variants.splice(index, 1);\n\t\t});\n\t};\n\t$scope.addDomain = function () {\n\t\tvar site_id = $scope.data.id;\n\t\tpopup.open({\n\t\t\tname: 'add_domain',\n\t\t\tcontroller: [\"$scope\", \"$modalInstance\", function controller($scope, $modalInstance) {\n\t\t\t\t\"ngInject\";\n\n\t\t\t\t$scope.isNew = true;\n\t\t\t\t$scope.data = { subdomain: 1, site_id: site_id };\n\n\t\t\t\t$scope.ok = function (form) {\n\t\t\t\t\tAPI.service('page/domain').post($scope.data).then(function (json) {\n\t\t\t\t\t\tif (json.name) $modalInstance.close(json);else if (json[0] != undefined) {\n\t\t\t\t\t\t\tform.name.$setValidity('uniqued', false);\n\t\t\t\t\t\t\t$scope.error = json[0];\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t};\n\t\t\t}]\n\t\t}).result.then(function (d) {\n\t\t\t$scope.data.domains = $scope.data.domains || [];\n\t\t\t$scope.data.domains.push(d);\n\t\t});\n\t};\n\t$scope.removeDomain = function (index) {\n\t\tvar id = $scope.data.domains[index].id;\n\t\tAPI.one('page/domain', id).remove().then(function (json) {\n\t\t\t$scope.data.domains.splice(index, 1);\n\t\t});\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/projects/edit.js?");

/***/ }),

/***/ "./app.profile/controllers/projects/list.js":
/*!**************************************************!*\
  !*** ./app.profile/controllers/projects/list.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"API\", \"$dialog\", \"popup\", \"safeApply\", function ($scope, API, $dialog, popup, safeApply) {\n\t\"ngInject\";\n\n\tAPI.service('page').getList().then(function (json) {\n\t\t$scope.pages = json;\n\t});\n\t$scope.deleteSite = function (index) {\n\t\t$dialog.confirm({\n\t\t\ttitle: window.t(\"delete_site_title\"),\n\t\t\tmessage: window.t(\"delete_site_message\")\n\t\t}).result.then(function () {\n\t\t\tAPI.one('page', $scope.pages[index].id).remove().then(function (json) {\n\t\t\t\tif (json == 1) {\n\t\t\t\t\t$scope.pages.splice(index, 1);\n\t\t\t\t} else {\n\t\t\t\t\t$dialog.message({ title: 'Error', message: json });\n\t\t\t\t}\n\t\t\t});\n\t\t});\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/projects/list.js?");

/***/ }),

/***/ "./app.profile/controllers/search.js":
/*!*******************************************!*\
  !*** ./app.profile/controllers/search.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$location\", \"$rootScope\", \"$scope\", \"communication\", function ($location, $rootScope, $scope, communication) {\n\t\"ngInject\";\n}];\n\nvar moment = __webpack_require__(/*! moment */ \"../node_modules/moment/moment.js\");\nwindow.moment = moment;\n\n//# sourceURL=webpack:///./app.profile/controllers/search.js?");

/***/ }),

/***/ "./app.profile/controllers/templates/add.js":
/*!**************************************************!*\
  !*** ./app.profile/controllers/templates/add.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"communication\", \"$state\", \"$uploader\", \"API\", function ($scope, communication, $state, $uploader, API) {\n\t\"ngInject\";\n\n\t$scope.data = {};\n\t$scope.isNew = true;\n\tAPI.all(\"theme_category\").getList().then(function (json) {\n\t\t$scope.themes_categories = angular.copy(json);\n\t});\n\t$scope.submit = function () {\n\t\tAPI.all('template').post($scope.data).then(function (json) {\n\t\t\tif (json == 1) {\n\t\t\t\t$state.go(\"templates.list\", {}, { reload: true });\n\t\t\t} else {\n\t\t\t\t$scope.errors = json;\n\t\t\t}\n\t\t});\n\t};\n\t$scope.upload = function () {\n\t\tvar uploader = new $uploader({\n\t\t\turl: getApiPath('uploadTemplate'),\n\t\t\tmultipart_params: $scope.data,\n\t\t\tonError: function onError(params) {\n\t\t\t\tconsole.log(params);\n\t\t\t},\n\t\t\tonUploadComplete: function onUploadComplete() {\n\t\t\t\tvar new_template = params.files[0].response.result;\n\t\t\t\tcommunication.removeList('templates');\n\t\t\t\t$state.go(\"templates.edit\", { id: new_template }, { reload: true });\n\t\t\t\t//$scope.replace_screenshot_count = ($scope.replace_screenshot_count || 0) + 1;\n\t\t\t\t//$scope.$apply();\n\t\t\t}\n\t\t});\n\t\tuploader.start();\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/templates/add.js?");

/***/ }),

/***/ "./app.profile/controllers/templates/edit.js":
/*!***************************************************!*\
  !*** ./app.profile/controllers/templates/edit.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"API\", \"$state\", \"$stateParams\", \"popup\", \"$dialog\", \"$controller\", function ($scope, API, $state, $stateParams, popup, $dialog, $controller) {\n\t\"ngInject\";\n\n\t$controller(__webpack_require__(/*! ../../../app.admin/controllers/templates/edit */ \"./app.admin/controllers/templates/edit.js\").default, { $scope: $scope });\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/templates/edit.js?");

/***/ }),

/***/ "./app.profile/controllers/templates/list.js":
/*!***************************************************!*\
  !*** ./app.profile/controllers/templates/list.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$scope\", \"$controller\", function ($scope, $controller) {\n\t\"ngInject\";\n\n\t$controller(__webpack_require__(/*! ../../../app.admin/controllers/templates/list */ \"./app.admin/controllers/templates/list.js\").default, { $scope: $scope });\n}];\n\n//# sourceURL=webpack:///./app.profile/controllers/templates/list.js?");

/***/ }),

/***/ "./app.profile/directives/analyticWidgets.js":
/*!***************************************************!*\
  !*** ./app.profile/directives/analyticWidgets.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$http\", \"$rootScope\", function ($http, $rootScope) {\n\t\"ngInject\";\n\n\treturn {\n\t\trestrict: 'A',\n\t\tscope: {\n\t\t\tsrc: '=src'\n\t\t},\n\t\ttemplate: '<div ng-include=\"include_src\"></div>',\n\t\tlink: function link(scope, element, attrs, ngInclude) {\n\t\t\tscope.cacheUrl = attrs.src;\n\t\t\tscope.include_src = window.getPiwikAnalyticViewPath(attrs.src, $rootScope.site_id);\n\t\t\tscope.$on('dateChanged', function () {\n\t\t\t\tvar newVal = $rootScope.date;\n\t\t\t\tif (newVal != undefined) {\n\t\t\t\t\tif (newVal.startDate && newVal.endDate) {\n\t\t\t\t\t\tvar startDate = newVal.startDate;\n\t\t\t\t\t\tif (!moment.isMoment(newVal.startDate)) {\n\t\t\t\t\t\t\tstartDate = moment(newVal.startDate);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tvar endDate = newVal.endDate;\n\t\t\t\t\t\tif (!moment.isMoment(newVal.endDate)) {\n\t\t\t\t\t\t\tendDate = moment(newVal.endDate);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tscope.include_src = window.getPiwikAnalyticViewPath(scope.cacheUrl, $rootScope.site_id) + '&startDate=' + startDate.format(\"YYYY-MM-DD\") + '&endDate=' + endDate.format(\"YYYY-MM-DD\");\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/directives/analyticWidgets.js?");

/***/ }),

/***/ "./app.profile/directives/ldWidgets.js":
/*!*********************************************!*\
  !*** ./app.profile/directives/ldWidgets.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$http\", \"$rootScope\", function ($http, $rootScope) {\n\t\"ngInject\";\n\n\treturn {\n\t\trestrict: 'A',\n\t\tscope: {\n\t\t\tsrc: '=src'\n\t\t},\n\t\ttemplate: '<div ng-include=\"include_src\"></div>',\n\t\tlink: function link(scope, element, attrs, ngInclude) {\n\t\t\tscope.cacheUrl = attrs.src;\n\t\t\tscope.loadedTime = new Date().getTime();\n\t\t\tscope.include_src = window.getAnalyticViewPath(attrs.src, $rootScope.site_id) + '&cache=' + scope.loadedTime;\n\t\t\tscope.$on('dateChanged', function () {\n\t\t\t\tvar newVal = $rootScope.date;\n\t\t\t\tif (newVal != undefined) {\n\t\t\t\t\tif (newVal.startDate && newVal.endDate) {\n\t\t\t\t\t\tvar startDate = newVal.startDate;\n\t\t\t\t\t\tif (!moment.isMoment(newVal.startDate)) {\n\t\t\t\t\t\t\tstartDate = moment(newVal.startDate);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tvar endDate = newVal.endDate;\n\t\t\t\t\t\tif (!moment.isMoment(newVal.endDate)) {\n\t\t\t\t\t\t\tendDate = moment(newVal.endDate);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tscope.include_src = window.getAnalyticViewPath(scope.cacheUrl, $rootScope.site_id) + '&startDate=' + startDate.format(\"YYYY-MM-DD\") + '&endDate=' + endDate.format(\"YYYY-MM-DD\") + '&cache=' + scope.loadedTime;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t};\n}];\n\n//# sourceURL=webpack:///./app.profile/directives/ldWidgets.js?");

/***/ }),

/***/ "./popup/section_list.js":
/*!*******************************!*\
  !*** ./popup/section_list.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nangular.module('ui.popup').service('popup_section_list', [\"API\", \"$templateCache\", \"popup\", \"$rootScope\", \"$controller\", function (API, $templateCache, popup, $rootScope, $controller) {\n\tthis.open = function (opt) {\n\t\topt = opt || {};\n\t\tvar that = this;\n\t\treturn popup.open({\n\t\t\ttemplate: __webpack_require__(/*! ../templates/popup/section_list.tmpl */ \"./templates/popup/section_list.tmpl\"),\n\t\t\tdata: opt.data,\n\t\t\tcontroller: [\"$scope\", \"$modalInstance\", function controller($scope, $modalInstance) {\n\t\t\t\t\"ngInject\";\n\n\t\t\t\t$scope.basePath = window.basePath;\n\n\t\t\t\tvar filterCategory = function filterCategory(categories, type) {\n\t\t\t\t\tvar rs = [];\n\t\t\t\t\tif ($.isArray(categories)) {\n\t\t\t\t\t\trs = categories.filter(function (item) {\n\t\t\t\t\t\t\treturn item[type] != undefined && item[type] == 1;\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t\treturn rs;\n\t\t\t\t};\n\t\t\t\tAPI.service('template/category').getList().then(function (json) {\n\t\t\t\t\tvar type = opt.type || $scope.current_tab.type || 'section';\n\t\t\t\t\t$scope.categories = filterCategory(json, type);\n\t\t\t\t});\n\n\t\t\t\t$scope.selectTemplate = function (template) {\n\t\t\t\t\t$modalInstance.close(template);\n\t\t\t\t};\n\t\t\t\t$scope.selectBlankTemplate = function (section) {\n\t\t\t\t\t$modalInstance.close('blank');\n\t\t\t\t};\n\t\t\t\t$scope.filter = function (category) {\n\n\t\t\t\t\tif (category == $scope.category) return;\n\t\t\t\t\t$scope.category = category;\n\t\t\t\t\t$scope.loader.reset();\n\t\t\t\t};\n\t\t\t\tvar scrollLoader = function scrollLoader() {\n\t\t\t\t\tthis.items = [];\n\t\t\t\t\tthis.busy = false;\n\t\t\t\t\tthis.disabled = false;\n\t\t\t\t\tthis.page = 0;\n\t\t\t\t\tthis.length = 4;\n\t\t\t\t\tthis.recordsTotal = Infinity;\n\t\t\t\t\tthis.nextPage = function () {\n\t\t\t\t\t\tif (this.busy) return;\n\t\t\t\t\t\tif (!$scope.current_tab) return;\n\t\t\t\t\t\tthis.busy = true;\n\t\t\t\t\t\tAPI.service('template/nextPage').post({ length: this.length, start: this.page == 0 ? 0 : this.page * this.length }, { category: $scope.category, type: $scope.current_tab.type || 'section', is_global: $scope.current_tab.is_global }).then(function (json) {\n\t\t\t\t\t\t\tthis.recordsTotal = json.recordsTotal * 1;\n\t\t\t\t\t\t\tif (json.data && json.data.length) {\n\t\t\t\t\t\t\t\tfor (var i in json.data) {\n\t\t\t\t\t\t\t\t\tthis.items.push(json.data[i]);\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tthis.disabled = this.items.length >= this.recordsTotal;\n\t\t\t\t\t\t\t} else this.disabled = true;\n\t\t\t\t\t\t\tthis.busy = false;\n\t\t\t\t\t\t\tthis.disabled = this.disabled || this.busy;\n\t\t\t\t\t\t\tthis.page++;\n\t\t\t\t\t\t}.bind(this));\n\t\t\t\t\t};\n\t\t\t\t\tthis.reset = function () {\n\t\t\t\t\t\tthis.items = [];\n\t\t\t\t\t\tthis.page = 0;\n\t\t\t\t\t\tthis.disabled = false;\n\t\t\t\t\t\tthis.nextPage();\n\t\t\t\t\t};\n\t\t\t\t};\n\t\t\t\t$scope.loader = new scrollLoader();\n\t\t\t\t$scope.tabs = [{ name: window.t('template_list_popup.my_templates'), type: opt.type, is_global: 0 }, { name: window.t('template_list_popup.system_templates'), type: opt.type, is_global: 1 }];\n\t\t\t\t$scope.changeTab = function (index) {\n\t\t\t\t\t$scope.current_tab = $scope.tabs[index];\n\t\t\t\t\t$scope.loader.reset();\n\t\t\t\t};\n\t\t\t\t$scope.changeTab(0);\n\t\t\t\tif (opt.controller != undefined) $controller(opt.controller, { $scope: $scope, $modalInstance: $modalInstance });\n\t\t\t}],\n\t\t\tsize: 'lg'\n\t\t});\n\t};\n}]);\n\n//# sourceURL=webpack:///./popup/section_list.js?");

/***/ }),

/***/ "./templates/popup/section_list.tmpl":
/*!*******************************************!*\
  !*** ./templates/popup/section_list.tmpl ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<md-dialog rc-drag=\\\"md-toolbar\\\" aria-label=\\\" {{('builder.template_list_popup.title')| lang }} \\\" class=\\\"md-section-list-popup\\\" flex=\\\"80\\\">\\r\\n\\t<form ng-cloak ng-submit=\\\"ok()\\\">\\r\\n\\t\\t<md-toolbar>\\r\\n\\t\\t\\t<div class=\\\"md-toolbar-tools\\\">\\r\\n\\t\\t\\t<h2> {{('builder.template_list_popup.title')| lang }} </h2>\\r\\n\\r\\n\\t\\t\\t<span flex></span>\\r\\n\\t\\t\\t<md-button class=\\\"md-icon-button\\\" ng-click=\\\"$dismiss()\\\">\\r\\n\\t\\t\\t  <i class=\\\"fa fa-times\\\" aria-label=\\\"Close dialog\\\"></i>\\r\\n\\t\\t\\t</md-button>\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t</md-toolbar>\\r\\n\\t\\t<md-dialog-content class=\\\"scroll-container\\\">\\r\\n\\t\\t\\t<md-nav-bar md-selected-nav-item=\\\"current_tab.name\\\">\\r\\n\\t\\t\\t\\t<md-nav-item md-nav-click=\\\"changeTab($index)\\\" name=\\\"{{tab.name}}\\\" ng-class=\\\"{active: current_tab.id==tab.id }\\\" ng-repeat=\\\"tab in tabs\\\">\\r\\n\\t\\t\\t\\t\\t<i class=\\\"{{tab.icon}}\\\"></i>{{tab.name}}\\r\\n\\t\\t\\t\\t</md-nav-item>\\r\\n\\t\\t\\t</md-nav-bar>\\r\\n\\t\\t\\t<div class=\\\"md-dialog-content\\\" layout=\\\"row\\\">\\r\\n\\t\\t\\t\\t<div flex-xs flex-gt-xs=\\\"30\\\">\\r\\n\\t\\t\\t\\t\\t<md-sidenav class=\\\"filter_theme_nav\\\" md-component-id=\\\"sidenav\\\"  md-is-locked-open=\\\"$mdMedia('gt-md')\\\" md-whiteframe=\\\"4\\\">\\r\\n\\t\\t\\t\\t\\t\\t<md-toolbar layout=\\\"row\\\" class=\\\"\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\\"md-toolbar-tools\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<span>Filter</span>\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</md-toolbar>\\r\\n\\t\\t\\t\\t\\t\\t<md-divider></md-divider>\\r\\n\\t\\t\\t\\t\\t\\t<md-content>\\r\\n\\t\\t\\t\\t\\t\\t<md-list>\\r\\n\\t\\t\\t\\t\\t\\t\\t<md-list-item  ng-click=\\\"filter('all')\\\" ng-class=\\\"{selected: !category}\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\tAll\\r\\n\\t\\t\\t\\t\\t\\t\\t</md-list-item>\\r\\n\\t\\t\\t\\t\\t\\t\\t<md-list-item ng-repeat=\\\"cat in categories\\\"  ng-click=\\\"filter(cat.id)\\\" ng-class=\\\"{selected: category==cat.id}\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{{cat.title}}\\r\\n\\t\\t\\t\\t\\t\\t\\t</md-list-item>\\r\\n\\t\\t\\t\\t\\t\\t</md-list>\\r\\n\\t\\t\\t\\t\\t\\t</md-content>\\r\\n\\t\\t\\t\\t\\t</md-sidenav>\\r\\n\\t\\t\\t\\t\\t\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t<div flex-xs flex-gt-xs=\\\"70\\\">\\r\\n\\t\\t\\t\\t\\t<md-toolbar layout=\\\"row\\\" class=\\\"\\\">\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\\"md-toolbar-tools\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<span ng-if=\\\"category_name == false\\\">All templates</span>\\r\\n\\t\\t\\t\\t\\t\\t\\t<span ng-if=\\\"category_name !== false\\\"{{category_name}}</span>\\r\\n\\t\\t\\t\\t\\t\\t\\t<span ng-if=\\\"templates.length\\\">({{templates.length}})</span>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t</md-toolbar>\\r\\n\\t\\t\\t\\t\\t<md-content layout-padding md-whiteframe=\\\"3\\\" layout=\\\"column\\\">\\r\\n\\t\\t\\t\\t\\t\\t<div layout=\\\"row\\\" infinite-scroll='loader.nextPage()' infinite-scroll-container=\\\"'md-dialog-content.scroll-container'\\\" infinite-scroll-disabled='loader.disabled' infinite-scroll-distance='1' infinite-scroll-listen-for-event=\\\"list:filtered\\\" layout-wrap>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div flex-xs flex-gt-xs=\\\"50\\\" layout=\\\"column\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<md-card class=\\\"template-item\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\\"card-image\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<img src=\\\"{{basePath}}/assets/images/noimg.png\\\" class=\\\"md-card-image\\\" alt=\\\"\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<md-card-title>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t  <md-card-title-text>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\\"md-headline\\\">Blank</span>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t  </md-card-title-text>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</md-card-title>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<md-card-actions layout=\\\"row\\\" layout-align=\\\"end center\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t  <md-button class=\\\"md-raised md-primary\\\" ng-click=\\\"selectBlankTemplate()\\\">{{'builder.template_list_popup.select_template' | lang}}</md-button>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</md-card-actions>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</md-card>\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div flex-xs flex-gt-xs=\\\"50\\\" layout=\\\"column\\\" ng-repeat=\\\"template in loader.items\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<md-card class=\\\"template-item\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\\"card-image\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<img ng-src=\\\"{{template.screenshot_url_nc}}\\\" class=\\\"md-card-image\\\" alt=\\\"{{template.name}}\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<md-card-title>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t  <md-card-title-text>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\\"md-headline\\\">{{template.name}}</span>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t  </md-card-title-text>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</md-card-title>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<md-card-actions layout=\\\"row\\\" layout-align=\\\"end center\\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t  <md-button class=\\\"md-raised md-primary\\\" ng-click=\\\"selectTemplate(template)\\\">{{'builder.template_list_popup.select_template' | lang}}</md-button>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t  <md-button href=\\\"{{template.preview_url}}\\\" target=\\\"_blank\\\">{{'builder.template_list_popup.preview_template' | lang}}</md-button>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</md-card-actions>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</md-card>\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div ng-show='loader.busy'>Loading data...</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\r\\n\\t\\t\\t\\t\\t</md-content>\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t</md-dialog-content>\\r\\n\\t\\t<md-dialog-actions layout=\\\"row\\\">\\r\\n\\t\\t\\t<span flex></span>\\r\\n\\t\\t\\t<md-button ng-click=\\\"$dismiss()\\\">\\r\\n\\t\\t\\t {{('builder.cancel')| lang }} \\r\\n\\t\\t  </md-button>\\r\\n\\t\\t</md-dialog-actions>\\r\\n\\t</form>\\r\\n</md-dialog>\"\n\n//# sourceURL=webpack:///./templates/popup/section_list.tmpl?");

/***/ }),

/***/ "./utils/native.js":
/*!*************************!*\
  !*** ./utils/native.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar createModuleDefinition = function createModuleDefinition(bases, moduleDefinition) {\n\tvar m = {};\n\tvar parents = [];\n\tfor (var i in bases) {\n\t\tif (!bases.hasOwnProperty(i)) continue;\n\t\tparents.push(bases[i]);\n\t}\n\n\tmoduleDefinition.bases = parents;\n\n\treturn moduleDefinition;\n};\n\nvar createCustomModuleDefinition = function createCustomModuleDefinition(moduleDefinition) {\n\tvar m = {};\n\tvar parents = [];\n\tfor (var i in bases) {\n\t\tif (!bases.hasOwnProperty(i)) continue;\n\t\tparents.push(bases[i]);\n\t}\n\n\tmoduleDefinition.bases = parents;\n\n\treturn moduleDefinition;\n};\nwindow.createModuleDefinition = createModuleDefinition;\n\nfunction g_loadModule(name, require_contexts) {\n\tvar predefined = require_contexts;\n\tvar redkeys = predefined.keys();\n\n\tfor (var i in redkeys) {\n\t\tvar n = redkeys[i];\n\t\tif (n == './' + name + '.js') {\n\t\t\tvar c = predefined(n);\n\t\t\tif (c.default) return c.default;else return c();\n\t\t}\n\t}\n\tif (redkeys['./base.js']) {\n\t\tvar base = predefined('./base.js').default;\n\t\treturn base;\n\t}\n}\nfunction findDefinitionType(definition, require_contexts) {\n\tvar predefined = require_contexts;\n\tvar base = predefined.keys();\n\tvar redkeys = predefined.keys();\n\tfor (var i in redkeys) {\n\t\tvar n = redkeys[i];\n\t\tif (n == './' + name + '.js') {\n\t\t\tvar c = predefined(n);\n\t\t\tif (c.default && c.default == definition) return name;\n\t\t}\n\t}\n}\nfunction checkExists(name, require_contexts) {\n\tvar redkeys = require_contexts.keys();\n\treturn redkeys.indexOf('./' + name + '.js') >= 0;\n}\nmodule.exports = {\n\tcreateModuleDefinition: createModuleDefinition,\n\tg_loadModule: g_loadModule,\n\tcheckExists: checkExists,\n\tfindDefinitionType: findDefinitionType\n};\n\n//# sourceURL=webpack:///./utils/native.js?");

/***/ }),

/***/ "./utils/ui.sidenav/controllers/uiNavItemController.js":
/*!*************************************************************!*\
  !*** ./utils/ui.sidenav/controllers/uiNavItemController.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nuiSidenavCtrl.$inject = [\"$scope\", \"$state\", \"$rootScope\"];\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nexports.default = uiSidenavCtrl;\nfunction uiSidenavCtrl($scope, $state, $rootScope) {\n\t\"ngInject\";\n\n\tvar $ctrl = this;\n\t$scope.childItems = [];\n\t$scope.hasChildMenu = false;\n\t$ctrl.addChildItem = function (item) {\n\t\t$scope.childItems.push(item);\n\t};\n\t$ctrl.hasChildMenu = function () {\n\t\t$scope.hasChildMenu = true;\n\t};\n}\n\n//# sourceURL=webpack:///./utils/ui.sidenav/controllers/uiNavItemController.js?");

/***/ }),

/***/ "./utils/ui.sidenav/controllers/uiSidenavController.js":
/*!*************************************************************!*\
  !*** ./utils/ui.sidenav/controllers/uiSidenavController.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nuiSidenavCtrl.$inject = [\"$scope\", \"$state\", \"$rootScope\"];\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nexports.default = uiSidenavCtrl;\nfunction uiSidenavCtrl($scope, $state, $rootScope) {\n\t\"ngInject\";\n\n\tthis.addedLastTab = false;\n\tfunction getParentList(state) {\n\t\tvar parentList = [];\n\t\tvar state = state.parent;\n\t\twhile (state) {\n\t\t\tparentList.push(state);\n\t\t\tstate = state.parent;\n\t\t}\n\t\treturn parentList;\n\t}\n\tvar ctrl = this,\n\t    tabs = ctrl.tabs = $scope.tabs = [];\n\tctrl.refresh = function () {\n\t\tangular.forEach(tabs, function (tab) {\n\t\t\tvar active = false;\n\t\t\tactive = ctrl.isActive(tab.url.replace(/\\//g, '.'));\n\t\t\tif (active) {\n\t\t\t\tctrl.select(tab);\n\t\t\t\treturn;\n\t\t\t}\n\t\t});\n\t\tvar flag = false;\n\t\tfor (var i = 0; i < tabs.length; i++) {\n\t\t\tif (tabs[i].active) {\n\t\t\t\tflag = true;\n\t\t\t}\n\t\t}\n\t\tif (!flag) {\n\t\t\ttabs[0].active = true;\n\t\t}\n\t};\n\n\t$rootScope.$on(\"$stateChangeSuccess\", function (event, toState, toParams, fromState, fromParams) {\n\t\tctrl.refresh();\n\t});\n\tfunction getCurrentMenu(name) {\n\t\tif (name != undefined) {\n\t\t\tvar path = name.split('.');\n\t\t\tif (path.length) {\n\t\t\t\treturn path[0];\n\t\t\t}\n\t\t}\n\t\treturn name;\n\t}\n\t$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {\n\n\t\t$scope.currentMenu = getCurrentMenu(toState.name);\n\t});\n\tctrl.select = function (selectedTab) {\n\t\tangular.forEach(tabs, function (tab) {\n\t\t\tif (tab.active && tab !== selectedTab) {\n\t\t\t\ttab.active = false;\n\t\t\t\ttab.onDeselect();\n\t\t\t}\n\t\t});\n\t\tif (selectedTab.active && selectedTab.loaded) return;\n\t\tif (selectedTab.load !== undefined) {\n\t\t\tselectedTab.load();\n\t\t}\n\t\tselectedTab.active = true;\n\t\tselectedTab.loaded = true;\n\t\tselectedTab.onSelect();\n\t};\n\tctrl.isActive = function (route) {\n\t\tif (route.length && route[0] == '#') route = route.substring(1);;\n\t\tvar parents = getParentList($state.$current);\n\t\tvar result = $state.is(route);\n\t\tif (!result) {\n\t\t\tfor (var i = 0; i < parents.length - 1; i++) {\n\t\t\t\tif (parents[i].name == route) {\n\t\t\t\t\treturn true;\n\t\t\t\t};\n\t\t\t}\n\t\t}\n\t\treturn result;\n\t};\n\tctrl.addTab = function addTab(tab, last) {\n\t\ttabs.push(tab);\n\n\t\tvar active = ctrl.isActive(tab.url.replace(/\\//g, '.'));\n\n\t\tif (active) {\n\n\t\t\tctrl.select(tab);\n\t\t} else if (tab.active) {\n\t\t\tctrl.select(tab);\n\t\t}\n\n\t\tif (last) {\n\t\t\tif ($state.$current.name == \"\") {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tvar flag = false;\n\t\t\tfor (var i = 0; i < tabs.length; i++) {\n\t\t\t\tif (tabs[i].active) {\n\t\t\t\t\tflag = true;\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (!flag) {\n\t\t\t\ttabs[0].active = true;\n\t\t\t}\n\t\t\tthis.addedLastTab = true;\n\t\t}\n\t};\n\n\tctrl.removeTab = function removeTab(tab) {\n\t\tvar index = tabs.indexOf(tab);\n\t\tif (tab.active && tabs.length > 1 && !destroyed) {\n\t\t\tvar newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;\n\t\t\tctrl.select(tabs[newActiveIndex]);\n\t\t}\n\t\ttabs.splice(index, 1);\n\t};\n\n\tvar destroyed;\n\t$scope.$on('$destroy', function () {\n\t\tdestroyed = true;\n\t});\n}\n\n//# sourceURL=webpack:///./utils/ui.sidenav/controllers/uiSidenavController.js?");

/***/ }),

/***/ "./utils/ui.sidenav/directives/uiNavItem.js":
/*!**************************************************!*\
  !*** ./utils/ui.sidenav/directives/uiNavItem.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$parse\", \"$controller\", \"communication\", \"$compile\", \"$state\", function ($parse, $controller, communication, $compile, $state) {\n\t\"ngInject\";\n\n\treturn {\n\t\trequire: '^uiSidenav',\n\t\trestrict: 'E',\n\t\treplace: true,\n\t\ttemplateUrl: 'template/tabs/uiNavItem.html',\n\t\ttransclude: true,\n\t\tscope: {\n\t\t\tactive: '=?',\n\t\t\theading: '@',\n\t\t\theadingIcon: '@',\n\t\t\tonSelect: '&select',\n\t\t\tonDeselect: '&deselect',\n\t\t\turl: '@url'\n\t\t},\n\t\tcontroller: 'uiNavItemController',\n\t\tcompile: function compile(elm, attrs, transclude) {\n\t\t\treturn function postLink(scope, elm, attrs, uiSidenavCtrl) {\n\t\t\t\tscope.changed = false;\n\t\t\t\tscope.$watch('active', function (active) {\n\t\t\t\t\tif (active) {\n\t\t\t\t\t\tuiSidenavCtrl.select(scope);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t\tscope.disabled = false;\n\t\t\t\tif (attrs.disabled) {\n\t\t\t\t\tscope.$parent.$watch($parse(attrs.disabled), function (value) {\n\t\t\t\t\t\tscope.disabled = !!value;\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t\tscope.path = scope.url.replace(/\\//g, '.');\n\t\t\t\tscope.select = function () {};\n\t\t\t\tvar templateCtrl, templateScope;\n\t\t\t\tuiSidenavCtrl.addTab(scope, elm.next().length == 0);\n\t\t\t\tscope.$on('$destroy', function () {\n\t\t\t\t\tuiSidenavCtrl.removeTab(scope);\n\t\t\t\t});\n\t\t\t\tscope.$transcludeFn = transclude;\n\t\t\t};\n\t\t}\n\t};\n}];\n\n//# sourceURL=webpack:///./utils/ui.sidenav/directives/uiNavItem.js?");

/***/ }),

/***/ "./utils/ui.sidenav/directives/uiNavItemContentTransclude.js":
/*!*******************************************************************!*\
  !*** ./utils/ui.sidenav/directives/uiNavItemContentTransclude.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = function () {\n\t\"ngInject\";\n\n\tfunction isSubitem(node) {\n\t\treturn node.tagName && (node.hasAttribute('ui-nav-subitem') || node.tagName.toLowerCase() === 'ui-nav-subitem' || node.tagName.toLowerCase() === 'ui-nav-subitem');\n\t}\n\tfunction isTabHeading(node) {\n\t\treturn node.tagName && (node.hasAttribute('tab-heading') || node.hasAttribute('data-tab-heading') || node.tagName.toLowerCase() === 'tab-heading' || node.tagName.toLowerCase() === 'data-tab-heading');\n\t};\n\treturn {\n\t\trestrict: 'A',\n\t\trequire: '^uiSidenav',\n\t\tlink: function link(scope, elm, attrs, uiSidenav, uiNavItem) {\n\t\t\tvar tab = scope.$eval(attrs.uiNavItemContentTransclude);\n\t\t\ttab.$transcludeFn(tab.$parent, function (contents) {\n\t\t\t\tangular.forEach(contents, function (node) {\n\t\t\t\t\tif (isTabHeading(node)) {\n\t\t\t\t\t\ttab.headingElement = node;\n\t\t\t\t\t} else if (isSubitem(node)) {\n\t\t\t\t\t\ttab.childItems = tab.childItems || [];\n\t\t\t\t\t\ttab.childItems.push(node);\n\t\t\t\t\t} else {\n\t\t\t\t\t\telm.append(node);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t});\n\t\t}\n\n\t};\n};\n\n//# sourceURL=webpack:///./utils/ui.sidenav/directives/uiNavItemContentTransclude.js?");

/***/ }),

/***/ "./utils/ui.sidenav/directives/uiNavItemDynamicContentTransclude.js":
/*!**************************************************************************!*\
  !*** ./utils/ui.sidenav/directives/uiNavItemDynamicContentTransclude.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = function () {\n\t\"ngInject\";\n\n\treturn {\n\t\trestrict: 'A',\n\t\trequire: '^uiSidenav',\n\t\tlink: function link(scope, elm, attrs) {\n\t\t\tvar tab = scope.$eval(attrs.uiNavItemDynamicContentTransclude);\n\t\t\ttab.$watch('contentElement', function updateContentlement(content) {\n\t\t\t\tif (content) {\n\t\t\t\t\telm.html('');\n\t\t\t\t\telm.append(content);\n\t\t\t\t\ttab._compile();\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t};\n};\n\n//# sourceURL=webpack:///./utils/ui.sidenav/directives/uiNavItemDynamicContentTransclude.js?");

/***/ }),

/***/ "./utils/ui.sidenav/directives/uiNavItemHeadingTransclude.js":
/*!*******************************************************************!*\
  !*** ./utils/ui.sidenav/directives/uiNavItemHeadingTransclude.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = function () {\n\t\"ngInject\";\n\n\treturn {\n\t\trestrict: 'A',\n\t\trequire: '^uiNavItem',\n\t\tlink: function link(scope, elm, attrs, tabCtrl) {\n\t\t\tscope.$watch('headingElement', function updateHeadingElement(heading) {\n\t\t\t\tif (heading) {\n\t\t\t\t\telm.html('');\n\t\t\t\t\telm.append(heading);\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t};\n};\n\n//# sourceURL=webpack:///./utils/ui.sidenav/directives/uiNavItemHeadingTransclude.js?");

/***/ }),

/***/ "./utils/ui.sidenav/directives/uiNavSubitem.js":
/*!*****************************************************!*\
  !*** ./utils/ui.sidenav/directives/uiNavSubitem.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = [\"$parse\", \"$controller\", \"communication\", \"$compile\", \"$state\", \"$rootScope\", function ($parse, $controller, communication, $compile, $state, $rootScope) {\n\t\"ngInject\";\n\n\treturn {\n\t\trestrict: 'E',\n\t\treplace: true,\n\t\ttemplateUrl: 'template/tabs/uiNavSubItem.html',\n\t\t//transclude: true,\n\t\tscope: {\n\t\t\tactive: '=?',\n\t\t\theading: '@',\n\t\t\theadingIcon: '@',\n\t\t\tonSelect: '&select', //This callback is called in contentHeadingTransclude\n\t\t\t//once it inserts the tab's content into the dom\n\t\t\tonDeselect: '&deselect',\n\t\t\turl: '@templateUrl'\n\t\t},\n\t\tcontroller: [\"$scope\", function controller($scope) {\n\t\t\t\"ngInject\";\n\n\t\t\tvar ctrl = this;\n\t\t\tctrl.isActive = function (route) {\n\t\t\t\tvar parents = getParentList($state.$current);\n\t\t\t\tvar result = $state.is(route);\n\t\t\t\tif (!result) {\n\t\t\t\t\tfor (var i = 0; i < parents.length - 1; i++) {\n\t\t\t\t\t\tif (parents[i].name == route) {\n\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t};\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn result;\n\t\t\t};\n\n\t\t\tfunction getParentList(state) {\n\t\t\t\tvar parentList = [];\n\t\t\t\tvar state = state.parent;\n\t\t\t\twhile (state) {\n\t\t\t\t\tparentList.push(state);\n\t\t\t\t\tstate = state.parent;\n\t\t\t\t}\n\t\t\t\treturn parentList;\n\t\t\t}\n\t\t\t$rootScope.$on(\"$stateChangeSuccess\", function (event, toState, toParams, fromState, fromParams) {\n\t\t\t\t$scope.active = ctrl.isActive($scope.url.replace(/\\//g, '.'));\n\t\t\t});\n\t\t}]\n\t};\n}];\n\n//# sourceURL=webpack:///./utils/ui.sidenav/directives/uiNavSubitem.js?");

/***/ }),

/***/ "./utils/ui.sidenav/directives/uiNavSubitemTransclude.js":
/*!***************************************************************!*\
  !*** ./utils/ui.sidenav/directives/uiNavSubitemTransclude.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = function () {\n\t\"ngInject\";\n\n\treturn {\n\t\trestrict: 'A',\n\t\trequire: '^uiNavItem',\n\t\tlink: function link(scope, elm, attrs, tabCtrl) {\n\t\t\tscope.$watch('childItems', function updateHeadingElement(heading) {\n\t\t\t\tif (heading && heading.length) {\n\t\t\t\t\tconsole.log(heading);\n\t\t\t\t\ttabCtrl.hasChildMenu();\n\t\t\t\t\telm.html('');\n\t\t\t\t\telm.append(heading);\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\t};\n};\n\n//# sourceURL=webpack:///./utils/ui.sidenav/directives/uiNavSubitemTransclude.js?");

/***/ }),

/***/ "./utils/ui.sidenav/directives/uiSidenav.js":
/*!**************************************************!*\
  !*** ./utils/ui.sidenav/directives/uiSidenav.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = function () {\n\t\"ngInject\";\n\n\treturn {\n\t\trestrict: 'E',\n\t\ttransclude: true,\n\t\treplace: true,\n\t\tscope: {\n\t\t\ttype: '@',\n\t\t\tcolor: '@'\n\t\t},\n\t\tcontroller: 'uiSidenavController',\n\t\ttemplateUrl: function templateUrl(elem, attrs) {\n\t\t\treturn attrs.templateUrl || 'template/tabs/uiSidenav.html';\n\t\t},\n\t\tlink: function link(scope, element, attrs) {}\n\t};\n};\n\n//# sourceURL=webpack:///./utils/ui.sidenav/directives/uiSidenav.js?");

/***/ }),

/***/ "./utils/ui.sidenav/directives/uiSidenavContent.js":
/*!*********************************************************!*\
  !*** ./utils/ui.sidenav/directives/uiSidenavContent.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nexports.default = function () {\n\t\"ngInject\";\n\n\treturn {\n\t\tcontroller: [\"$scope\", function controller($scope) {\n\t\t\t\"ngInject\";\n\n\t\t\tthis.changed = function () {\n\t\t\t\t$scope.changed = true;\n\t\t\t\t$scope.tab.changed = true;;\n\t\t\t};\n\t\t\tthis.unchanged = function () {\n\t\t\t\t$scope.changed = false;\n\t\t\t\t$scope.tab.changed = false;\n\t\t\t};\n\t\t}],\n\t\tlink: function link(scope, element, attrs) {}\n\t};\n};\n\n//# sourceURL=webpack:///./utils/ui.sidenav/directives/uiSidenavContent.js?");

/***/ }),

/***/ "./utils/ui.sidenav/index.js":
/*!***********************************!*\
  !*** ./utils/ui.sidenav/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nangular.module(\"template/tabs/uiNavItem.html\", []).run([\"$templateCache\", function ($templateCache) {\n  $templateCache.put(\"template/tabs/uiNavItem.html\", __webpack_require__(/*! ./templates/uiNavItem.tmpl */ \"./utils/ui.sidenav/templates/uiNavItem.tmpl\"));\n}]);\nangular.module(\"template/tabs/uiNavSubItem.html\", []).run([\"$templateCache\", function ($templateCache) {\n  $templateCache.put(\"template/tabs/uiNavSubItem.html\", __webpack_require__(/*! ./templates/uiNavSubItem.tmpl */ \"./utils/ui.sidenav/templates/uiNavSubItem.tmpl\"));\n}]);\nangular.module(\"template/tabs/uiSidenav.html\", []).run([\"$templateCache\", function ($templateCache) {\n  $templateCache.put(\"template/tabs/uiSidenav.html\", __webpack_require__(/*! ./templates/uiSidenav.tmpl */ \"./utils/ui.sidenav/templates/uiSidenav.tmpl\"));\n}]);\nangular.module('ui.Sidenav', [\"template/tabs/uiNavItem.html\", \"template/tabs/uiNavSubItem.html\", \"template/tabs/uiSidenav.html\"]).controller('uiSidenavController', __webpack_require__(/*! ./controllers/uiSidenavController */ \"./utils/ui.sidenav/controllers/uiSidenavController.js\").default).directive('uiSidenav', __webpack_require__(/*! ./directives/uiSidenav */ \"./utils/ui.sidenav/directives/uiSidenav.js\").default).controller('uiNavItemController', __webpack_require__(/*! ./controllers/uiNavItemController */ \"./utils/ui.sidenav/controllers/uiNavItemController.js\").default).directive('uiNavItem', __webpack_require__(/*! ./directives/uiNavItem */ \"./utils/ui.sidenav/directives/uiNavItem.js\").default).directive('uiNavSubitem', __webpack_require__(/*! ./directives/uiNavSubitem */ \"./utils/ui.sidenav/directives/uiNavSubitem.js\").default).directive('uiNavItemHeadingTransclude', __webpack_require__(/*! ./directives/uiNavItemHeadingTransclude */ \"./utils/ui.sidenav/directives/uiNavItemHeadingTransclude.js\").default).directive('uiNavItemContentTransclude', __webpack_require__(/*! ./directives/uiNavItemContentTransclude */ \"./utils/ui.sidenav/directives/uiNavItemContentTransclude.js\").default).directive('uiNavSubitemTransclude', __webpack_require__(/*! ./directives/uiNavSubitemTransclude */ \"./utils/ui.sidenav/directives/uiNavSubitemTransclude.js\").default).directive('uiSidenavContent', __webpack_require__(/*! ./directives/uiSidenavContent */ \"./utils/ui.sidenav/directives/uiSidenavContent.js\").default).directive('uiNavItemDynamicContentTransclude', __webpack_require__(/*! ./directives/uiNavItemDynamicContentTransclude */ \"./utils/ui.sidenav/directives/uiNavItemDynamicContentTransclude.js\").default);\n\n//# sourceURL=webpack:///./utils/ui.sidenav/index.js?");

/***/ }),

/***/ "./utils/ui.sidenav/templates/uiNavItem.tmpl":
/*!***************************************************!*\
  !*** ./utils/ui.sidenav/templates/uiNavItem.tmpl ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div ng-class=\\\"{active: active, disabled: disabled}\\\" class=\\\"nav-item\\\">\\r\\n\\t<a href=\\\"{{url}}\\\" class=\\\"md-button\\\" ui-nav-item-heading-transclude><i class=\\\"{{headingIcon}}\\\"></i><span>{{heading}}</span>\\r\\n\\t\\t<i class=\\\"fa fa-angle-down\\\" ng-if=\\\"hasChildMenu && active\\\"></i>\\r\\n\\t</a>\\r\\n\\t<div class=\\\"child-items\\\" ui-nav-subitem-transclude>\\r\\n\\t</div>\\r\\n</div>\"\n\n//# sourceURL=webpack:///./utils/ui.sidenav/templates/uiNavItem.tmpl?");

/***/ }),

/***/ "./utils/ui.sidenav/templates/uiNavSubItem.tmpl":
/*!******************************************************!*\
  !*** ./utils/ui.sidenav/templates/uiNavSubItem.tmpl ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<div class=\\\"nav-suitem\\\">\\r\\n<a href=\\\"#/{{url}}\\\" class=\\\"md-button\\\" ng-class=\\\"{'md-primary': active, disabled: disabled}\\\" ><i class=\\\"{{headingIcon}}\\\"></i><span>{{heading}}</span></a>\\r\\n</div>\"\n\n//# sourceURL=webpack:///./utils/ui.sidenav/templates/uiNavSubItem.tmpl?");

/***/ }),

/***/ "./utils/ui.sidenav/templates/uiSidenav.tmpl":
/*!***************************************************!*\
  !*** ./utils/ui.sidenav/templates/uiSidenav.tmpl ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<section class=\\\"sidebar\\\">\\r\\n<div class=\\\"sidebar-menu\\\" ng-transclude></div>\\r\\n</section>\\r\\n\\r\\n\"\n\n//# sourceURL=webpack:///./utils/ui.sidenav/templates/uiSidenav.tmpl?");

/***/ })

/******/ });