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
/******/ 		"installer": 0
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
/******/ 	deferredModules.push(["./app.installer.js","defaultVendors~admin~~36146cbb","defaultVendors~admin~~4cee1585","default~admin~common~~e8c10102"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app.installer.js":
/*!**************************!*\
  !*** ./app.installer.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! ./utils/md-steppers/md-steppers.min */ \"./utils/md-steppers/md-steppers.min.js\");\n\nvar _app = __webpack_require__(/*! ./app.common */ \"./app.common.js\");\n\nvar _app2 = _interopRequireDefault(_app);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar injector = [_app2.default, 'md-steppers'];\n\nangular.module('installer_app', injector).controller('installerController', [\"$location\", \"$rootScope\", \"$scope\", \"communication\", \"$q\", \"$timeout\", function ($location, $rootScope, $scope, communication, $q, $timeout) {\n\t\"ngInject\";\n\n\t$scope.selectedStep = 0;\n\t$scope.stepProgress = 1;\n\t$scope.maxStep = 6;\n\t$scope.stepData = [{ data: {}, completed: false, url: 'install/wait' }, { data: {}, completed: false, url: 'install/wait', initUrl: 'install/requirement' }, { data: {}, completed: false, url: 'install/wait', initUrl: 'install/permissions' }, { data: { database_hostname: 'localhost', app_url: window.basePath, app_name: 'AMP Builder' }, completed: false, initUrl: 'install/environment', url: 'install/database' }, { data: {}, completed: false, url: 'install/admin' }, { data: {}, completed: false, url: 'install/final', redirect: 'auth/login' }];\n\t$scope.selectStep = function (step) {\n\t\tif ($scope.stepData[step].initUrl != undefined) {\n\t\t\t$scope.showBusyText = false;\n\t\t\tcommunication.ajaxCall($scope.stepData[step].initUrl).then(function (json) {\n\t\t\t\t$scope.showBusyText = false;\n\t\t\t\t$scope.stepData[step].data = $.extend({}, $scope.stepData[step].data, json);\n\t\t\t}, function () {\n\t\t\t\t$scope.showBusyText = false;\n\t\t\t});\n\t\t}\n\t};\n\t$scope.reloadCurrentStep = function () {\n\t\t//console.log($scope.selectedStep);\n\t\t//return;\n\t\t$scope.selectStep($scope.selectedStep);\n\t};\n\t$scope.enableNextStep = function nextStep() {\n\t\tif ($scope.selectedStep >= $scope.maxStep) {\n\t\t\treturn;\n\t\t}\n\t\tif ($scope.selectedStep === $scope.stepProgress - 1) {\n\t\t\t$scope.stepProgress = $scope.stepProgress + 1;\n\t\t}\n\t\t$scope.selectedStep = $scope.selectedStep + 1;\n\t};\n\n\t$scope.moveToPreviousStep = function moveToPreviousStep() {\n\t\tif ($scope.selectedStep > 0) {\n\t\t\t$scope.selectedStep = $scope.selectedStep - 1;\n\t\t}\n\t};\n\t$scope.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {\n\t\t$scope.showBusyText = true;\n\t\tif (!stepData.completed && !isSkip) {\n\t\t\tcommunication.ajaxCall(stepData.url, stepData.data).then(function (json) {\n\t\t\t\t$scope.showBusyText = false;\n\t\t\t\tstepData.completed = true;\n\t\t\t\tif (stepData.redirect) {\n\t\t\t\t\twindow.location.href = stepData.redirect;\n\t\t\t\t} else $scope.enableNextStep();\n\t\t\t}, function (json) {\n\t\t\t\t$scope.showBusyText = false;\n\t\t\t});\n\t\t} else {\n\t\t\t$scope.showBusyText = false;\n\t\t\tif (stepData.redirect) {\n\t\t\t\twindow.location.href = stepData.redirect;\n\t\t\t} else $scope.enableNextStep();\n\t\t}\n\t};\n}]).controller('updateController', [\"$location\", \"$rootScope\", \"$scope\", \"communication\", \"$q\", \"$timeout\", function ($location, $rootScope, $scope, communication, $q, $timeout) {\n\t\"ngInject\";\n\n\t$scope.selectedStep = 0;\n\t$scope.stepProgress = 1;\n\t$scope.maxStep = 3;\n\t$scope.stepData = [{ data: {}, completed: false, url: 'update/wait' }, { data: {}, completed: false, url: 'update/wait', initUrl: 'update/overview' }, { data: {}, completed: false, url: 'update/final' }];\n\t$scope.selectStep = function (step) {\n\t\tif ($scope.stepData[step].initUrl != undefined) {\n\t\t\t$scope.showBusyText = false;\n\t\t\tcommunication.ajaxCall($scope.stepData[step].initUrl).then(function (json) {\n\n\t\t\t\t$scope.showBusyText = false;\n\t\t\t\t$scope.stepData[step].data = $.extend({}, $scope.stepData[step].data, json);\n\t\t\t}, function () {\n\t\t\t\t$scope.showBusyText = false;\n\t\t\t});\n\t\t}\n\t};\n\t$scope.enableNextStep = function nextStep() {\n\t\tif ($scope.selectedStep >= $scope.maxStep) {\n\t\t\treturn;\n\t\t}\n\t\tif ($scope.selectedStep === $scope.stepProgress - 1) {\n\t\t\t$scope.stepProgress = $scope.stepProgress + 1;\n\t\t}\n\t\t$scope.selectedStep = $scope.selectedStep + 1;\n\t};\n\n\t$scope.moveToPreviousStep = function moveToPreviousStep() {\n\t\tif ($scope.selectedStep > 0) {\n\t\t\t$scope.selectedStep = $scope.selectedStep - 1;\n\t\t}\n\t};\n\t$scope.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {\n\t\t$scope.showBusyText = true;\n\t\tif (!stepData.completed && !isSkip) {\n\t\t\tcommunication.ajaxCall(stepData.url, stepData.data).then(function (json) {\n\t\t\t\tconsole.log(json);\n\t\t\t\t$scope.showBusyText = false;\n\t\t\t\tstepData.completed = true;\n\t\t\t\tif (stepData.redirect) {\n\t\t\t\t\twindow.location.href = stepData.redirect;\n\t\t\t\t} else $scope.enableNextStep();\n\t\t\t}, function (json) {\n\t\t\t\t$scope.showBusyText = false;\n\t\t\t});\n\t\t} else {\n\t\t\t$scope.showBusyText = false;\n\t\t\tif (stepData.redirect) {\n\t\t\t\twindow.location.href = stepData.redirect;\n\t\t\t} else $scope.enableNextStep();\n\t\t}\n\t};\n}]).run([\"$rootScope\", function ($rootScope) {}]);\n\n//# sourceURL=webpack:///./app.installer.js?");

/***/ }),

/***/ "./utils/md-steppers/md-steppers.min.js":
/*!**********************************************!*\
  !*** ./utils/md-steppers/md-steppers.min.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n!function (e, t) {\n  function n() {\n    function t(t, s, p, r) {\n      if (r) {\n        var d = r.getStepElementIndex(s),\n            i = n(s, \"md-step-body\").remove(),\n            c = n(s, \"md-step-label\").remove(),\n            a = r.insertStep({ scope: t, parent: t.$parent, index: d, element: s, template: i.html(), label: c.html() }, d);t.select = t.select || e.noop, t.deselect = t.deselect || e.noop, t.$watch(\"active\", function (e) {\n          e && r.select(a.getIndex());\n        }), t.$watch(\"complete\", function () {\n          r.refreshIndex();\n        }), t.$watch(\"disabled\", function () {\n          r.refreshIndex();\n        }), t.$watch(function () {\n          return r.getStepElementIndex(s);\n        }, function (e) {\n          a.index = e, r.updateStepOrder();\n        }), t.$on(\"$destroy\", function () {\n          r.removeStep(a);\n        });\n      }\n    }function n(t, n) {\n      for (var s = t[0].children, p = 0, r = s.length; p < r; p++) {\n        var d = s[p];if (d.tagName === n.toUpperCase()) return e.element(d);\n      }return e.element();\n    }return { require: \"^?mdSteppers\", terminal: !0, compile: function compile(s, p) {\n        var r = n(s, \"md-step-label\"),\n            d = n(s, \"md-step-body\");n(s, \"md-step-actions\");if (0 == r.length && (r = e.element(\"<md-step-label></md-step-label>\"), p.label ? r.text(p.label) : r.append(s.contents()), 0 == d.length)) {\n          var i = s.contents().detach();d = e.element(\"<md-step-body></md-step-body>\"), d.append(i);\n        }return s.append(r), d.html() && s.append(d), t;\n      }, scope: { complete: \"=?mdComplete\", active: \"=?mdActive\", disabled: \"=?ngDisabled\", select: \"&?mdOnSelect\", deselect: \"&?mdOnDeselect\" } };\n  }function s() {\n    return { require: \"^?mdSteppers\", link: function link(e, t, n, s) {\n        s && s.attachRipple(e, t);\n      } };\n  }function p() {\n    return { terminal: !0 };\n  }function r(t, n, s, p, r, d, i, c, a, o) {\n    function l() {\n      ie.selectedIndex = ie.selectedIndex || 0, m(), u(), f(), o(n), d.nextTick(function () {\n        ne(), X(), se(), ie.steppers[ie.selectedIndex] && ie.steppers[ie.selectedIndex].scope.select(), me = !0, Y();\n      });\n    }function m() {\n      var t = c.$mdSteppersTemplate,\n          n = e.element(ae.data);n.html(t), a(n.contents())(ie.parent), delete c.$mdSteppersTemplate;\n    }function f() {\n      e.element(s).on(\"resize\", P), t.$on(\"$destroy\", x);\n    }function u() {\n      t.$watch(\"$mdSteppersCtrl.selectedIndex\", y);\n    }function h(e, t) {\n      var n = c.$normalize(\"md-\" + e);t && U(e, t), c.$observe(n, function (t) {\n        ie[e] = t;\n      });\n    }function g(e, t) {\n      function n(t) {\n        ie[e] = \"false\" !== t;\n      }var s = c.$normalize(\"md-\" + e);t && U(e, t), c.hasOwnProperty(s) && n(c[s]), c.$observe(s, n);\n    }function x() {\n      le = !0, e.element(s).off(\"resize\", P);\n    }function S(t) {\n      e.element(ae.wrapper).toggleClass(\"md-stretch-steppers\", j()), se();\n    }function v(e) {\n      ie.shouldCenterSteppers = z();\n    }function $(e, t) {\n      e !== t && d.nextTick(ie.updateInkBarStyles);\n    }function b(e, t) {\n      e !== t && (ie.maxStepWidth = G(), ie.shouldCenterSteppers = z(), d.nextTick(function () {\n        ie.maxStepWidth = G(), X(ie.selectedIndex);\n      }));\n    }function I(e) {\n      n[e ? \"removeClass\" : \"addClass\"](\"md-no-step-content\");\n    }function C(n) {\n      var s = ie.shouldCenterSteppers ? \"\" : \"-\" + n + \"px\";e.element(ae.paging).css(p.CSS.TRANSFORM, \"translate3d(\" + s + \", 0, 0)\"), t.$broadcast(\"$mdSteppersPaginationChanged\");\n    }function w(e, t) {\n      e !== t && ae.steppers[e] && (X(), V());\n    }function y(e, n) {\n      e !== n && (ie.selectedIndex = K(e), ie.lastSelectedIndex = n, ie.updateInkBarStyles(), ne(), X(e), t.$broadcast(\"$mdSteppersChanged\"), ie.steppers[n] && ie.steppers[n].scope.deselect(), ie.steppers[e] && ie.steppers[e].scope.select());\n    }function k(e) {\n      var t = n[0].getElementsByTagName(\"md-step\");return Array.prototype.indexOf.call(t, e[0]);\n    }function T() {\n      T.watcher || (T.watcher = t.$watch(function () {\n        d.nextTick(function () {\n          T.watcher && n.prop(\"offsetParent\") && (T.watcher(), T.watcher = null, P());\n        }, !1);\n      }));\n    }function B(e) {\n      switch (e.keyCode) {case p.KEY_CODE.LEFT_ARROW:\n          e.preventDefault(), Q(-1, !0);break;case p.KEY_CODE.RIGHT_ARROW:\n          e.preventDefault(), Q(1, !0);break;case p.KEY_CODE.SPACE:case p.KEY_CODE.ENTER:\n          e.preventDefault(), ce || (ie.selectedIndex = ie.focusIndex);}ie.lastClick = !1;\n    }function E(e) {\n      ce || (ie.focusIndex = ie.selectedIndex = e), ie.lastClick = !0, d.nextTick(function () {\n        ie.steppers[e].element.triggerHandler(\"click\");\n      }, !1);\n    }function L(e) {\n      ie.shouldPaginate && (e.preventDefault(), ie.offsetLeft = re(ie.offsetLeft - e.wheelDelta));\n    }function W() {\n      var e,\n          t,\n          n = ae.canvas.clientWidth,\n          s = n + ie.offsetLeft;for (e = 0; e < ae.steppers.length && (t = ae.steppers[e], !(t.offsetLeft + t.offsetWidth > s)); e++) {}ie.offsetLeft = re(t.offsetLeft);\n    }function D() {\n      var e, t;for (e = 0; e < ae.steppers.length && (t = ae.steppers[e], !(t.offsetLeft + t.offsetWidth >= ie.offsetLeft)); e++) {}ie.offsetLeft = re(t.offsetLeft + t.offsetWidth - ae.canvas.clientWidth);\n    }function P() {\n      ie.lastSelectedIndex = ie.selectedIndex, ie.offsetLeft = re(ie.offsetLeft), d.nextTick(function () {\n        ie.updateInkBarStyles(), Y();\n      });\n    }function O(t) {\n      e.element(ae.inkBar).toggleClass(\"ng-hide\", t);\n    }function A(e) {\n      n.toggleClass(\"md-dynamic-height\", e);\n    }function R(e) {\n      if (!le) {\n        var t = ie.selectedIndex,\n            n = ie.steppers.splice(e.getIndex(), 1)[0];te(), ie.selectedIndex === t && (n.scope.deselect(), ie.steppers[ie.selectedIndex] && ie.steppers[ie.selectedIndex].scope.select()), d.nextTick(function () {\n          Y(), ie.offsetLeft = re(ie.offsetLeft);\n        });\n      }\n    }function N(t, n) {\n      var s = me,\n          p = { getIndex: function getIndex() {\n          return ie.steppers.indexOf(r);\n        }, isActive: function isActive() {\n          return this.getIndex() === ie.selectedIndex;\n        }, isLeft: function isLeft() {\n          return this.getIndex() < ie.selectedIndex;\n        }, isRight: function isRight() {\n          return this.getIndex() > ie.selectedIndex;\n        }, shouldRender: function shouldRender() {\n          return !ie.noDisconnect || this.isActive();\n        }, hasFocus: function hasFocus() {\n          return !ie.lastClick && ie.hasFocus && this.getIndex() === ie.focusIndex;\n        }, id: d.nextUid() },\n          r = e.extend(p, t);return e.isDefined(n) ? ie.steppers.splice(n, 0, r) : ie.steppers.push(r), Z(), ee(), d.nextTick(function () {\n        Y(), s && ie.autoselect && d.nextTick(function () {\n          d.nextTick(function () {\n            E(ie.steppers.indexOf(r));\n          });\n        });\n      }), r;\n    }function F() {\n      var e = {};return e.wrapper = n[0].getElementsByTagName(\"md-steppers-wrapper\")[0], e.data = n[0].getElementsByTagName(\"md-step-data\")[0], e.canvas = e.wrapper.getElementsByTagName(\"md-steppers-canvas\")[0], e.paging = e.canvas.getElementsByTagName(\"md-pagination-wrapper\")[0], e.steppers = e.paging.getElementsByTagName(\"md-step-item\"), e.dummies = e.canvas.getElementsByTagName(\"md-dummy-step\"), e.inkBar = e.paging.getElementsByTagName(\"md-ink-bar\")[0], e.contentsWrapper = n[0].getElementsByTagName(\"md-steppers-content-wrapper\")[0], e.contents = e.contentsWrapper.getElementsByTagName(\"md-step-content\"), e;\n    }function M() {\n      return ie.offsetLeft > 0;\n    }function H() {\n      var e = ae.steppers[ae.steppers.length - 1];return e && e.offsetLeft + e.offsetWidth > ae.canvas.clientWidth + ie.offsetLeft;\n    }function j() {\n      switch (ie.stretchSteppers) {case \"always\":\n          return !0;case \"never\":\n          return !1;default:\n          return !ie.shouldPaginate && s.matchMedia(\"(max-width: 600px)\").matches;}\n    }function z() {\n      return ie.centerSteppers && !ie.shouldPaginate;\n    }function _() {\n      if (ie.noPagination || !me) return !1;var t = n.prop(\"clientWidth\");return e.forEach(F().dummies, function (e) {\n        t -= e.offsetWidth;\n      }), t < 0;\n    }function K(e) {\n      if (e === -1) return -1;var t,\n          n,\n          s = Math.max(ie.steppers.length - e, e);for (t = 0; t <= s; t++) {\n        if (n = ie.steppers[e + t], n && n.scope.disabled !== !0) return n.getIndex();if (n = ie.steppers[e - t], n && n.scope.disabled !== !0) return n.getIndex();\n      }return e;\n    }function U(e, t, n) {\n      Object.defineProperty(ie, e, { get: function get() {\n          return n;\n        }, set: function set(e) {\n          var s = n;n = e, t && t(e, s);\n        } });\n    }function Y() {\n      j() || q(), ie.maxStepWidth = G(), ie.shouldPaginate = _();\n    }function q() {\n      var t = 1;e.forEach(F().dummies, function (e) {\n        t += Math.ceil(e.offsetWidth);\n      }), e.element(ae.paging).css(\"width\", t + \"px\");\n    }function G() {\n      return n.prop(\"clientWidth\");\n    }function J() {\n      var e = ie.steppers[ie.selectedIndex],\n          t = ie.steppers[ie.focusIndex];ie.steppers = ie.steppers.sort(function (e, t) {\n        return e.index - t.index;\n      }), ie.selectedIndex = ie.steppers.indexOf(e), ie.focusIndex = ie.steppers.indexOf(t);\n    }function Q(e, t) {\n      var n,\n          s = t ? \"focusIndex\" : \"selectedIndex\",\n          p = ie[s];for (n = p + e; ie.steppers[n] && ie.steppers[n].scope.disabled; n += e) {}ie.steppers[n] && (ie[s] = n);\n    }function V() {\n      F().dummies[ie.focusIndex].focus();\n    }function X(e) {\n      if (null == e && (e = ie.focusIndex), ae.steppers[e] && !ie.shouldCenterSteppers) {\n        var t = ae.steppers[e],\n            n = t.offsetLeft,\n            s = t.offsetWidth + n;ie.offsetLeft = Math.max(ie.offsetLeft, re(s - ae.canvas.clientWidth + 64)), ie.offsetLeft = Math.min(ie.offsetLeft, re(n));\n      }\n    }function Z() {\n      oe.forEach(function (e) {\n        d.nextTick(e);\n      }), oe = [];\n    }function ee() {\n      var t = !1;e.forEach(ie.steppers, function (e) {\n        e.template && (t = !0);\n      }), ie.hasContent = t;\n    }function te() {\n      ie.selectedIndex = K(ie.selectedIndex), ie.focusIndex = K(ie.focusIndex);\n    }function ne() {\n      if (!ie.dynamicHeight) return n.css(\"height\", \"\");if (!ie.steppers.length) return oe.push(ne);var e = ae.contents[ie.selectedIndex],\n          t = e ? e.offsetHeight : 0,\n          s = ae.wrapper.offsetHeight,\n          p = t + s,\n          r = n.prop(\"offsetHeight\");\"bottom\" === n.attr(\"md-align-steppers\") && (r -= s, p -= s, void 0 !== n.attr(\"md-border-bottom\") && ++r), ce = !0;var c = { height: r + \"px\" },\n          a = { height: p + \"px\" };n.css(c), i(n, { from: c, to: a, easing: \"cubic-bezier(0.35, 0, 0.25, 1)\", duration: .5 }).start().done(function () {\n        n.css({ transition: \"none\", height: \"\" }), d.nextTick(function () {\n          n.css(\"transition\", \"\");\n        }), ce = !1;\n      });\n    }function se() {\n      if (!ae.steppers[ie.selectedIndex]) return void e.element(ae.inkBar).css({ left: \"auto\", right: \"auto\" });if (!ie.steppers.length) return oe.push(ie.updateInkBarStyles);if (!n.prop(\"offsetParent\")) return T();var t,\n          s = ie.selectedIndex,\n          p = ae.paging.offsetWidth,\n          r = ae.steppers[s],\n          i = r.offsetLeft;p - i - r.offsetWidth;ie.shouldCenterSteppers && (t = Array.prototype.slice.call(ae.steppers).reduce(function (e, t) {\n        return e + t.offsetWidth;\n      }, 0), p > t && d.nextTick(se, !1)), pe(), e.element(ae.inkBar).css({ left: \"32px\", right: p - i + \"px\" });\n    }function pe() {\n      var t = ie.selectedIndex,\n          n = ie.lastSelectedIndex,\n          s = e.element(ae.inkBar);e.isNumber(n) && s.toggleClass(\"md-left\", t < n).toggleClass(\"md-right\", t > n);\n    }function re(e) {\n      if (!ae.steppers.length || !ie.shouldPaginate) return 0;var t = ae.steppers[ae.steppers.length - 1],\n          n = t.offsetLeft + t.offsetWidth;return e = Math.max(0, e), e = Math.min(n - ae.canvas.clientWidth, e);\n    }function de(t, n) {\n      if (!ie.disableTabsBehavior) {\n        var s = { colorElement: e.element(ae.inkBar) };r.attach(t, n, s);\n      }\n    }var ie = this,\n        ce = !1,\n        ae = F(),\n        oe = [],\n        le = !1,\n        me = !1;h(\"stretchSteppers\", S), U(\"focusIndex\", w, ie.selectedIndex || 0), U(\"offsetLeft\", C, 0), U(\"hasContent\", I, !1), U(\"maxStepWidth\", $, G()), U(\"shouldPaginate\", b, !1), g(\"noInkBar\", O, !0), g(\"dynamicHeight\", A), g(\"noPagination\"), g(\"swipeContent\"), g(\"noDisconnect\"), g(\"autoselect\"), g(\"centerSteppers\", v, !0), g(\"enableDisconnect\"), ie.scope = t, ie.parent = t.$parent, ie.steppers = [], ie.lastSelectedIndex = null, ie.hasFocus = !1, ie.lastClick = !0, ie.shouldCenterSteppers = z(), ie.updatePagination = d.debounce(Y, 100), ie.redirectFocus = V, ie.attachRipple = de, ie.insertStep = N, ie.removeStep = R, ie.select = E, ie.scroll = L, ie.nextPage = W, ie.previousPage = D, ie.keydown = B, ie.canPageForward = H, ie.canPageBack = M, ie.refreshIndex = te, ie.incrementIndex = Q, ie.getStepElementIndex = k, ie.updateInkBarStyles = d.debounce(se, 100), ie.updateStepOrder = d.debounce(J, 100), l();\n  }function d() {\n    return { scope: { selectedIndex: \"=?mdSelected\", busyText: \"=?mdBusyText\", busy: \"=?mdBusy\", disableTabsBehavior: \"=?mdDisableTabsBehavior\" }, template: function template(e, t) {\n        t.$mdSteppersTemplate = e.html();var n = t.mdDisableTabsBehavior ? \"\" : 'ng-click=\"$mdSteppersCtrl.select(step.getIndex())\" ',\n            s = t.mdDisableTabsBehavior ? 'class=\"md-step md-step-nopointer\" ' : 'class=\"md-step\" ';return [\"\", \"<md-steppers-wrapper> \", \"<md-step-data></md-step-data> \", \"<md-steppers-canvas \", 'tabindex=\"{{ $mdSteppersCtrl.hasFocus ? -1 : 0 }}\" ', 'aria-activedescendant=\"step-item-{{$mdSteppersCtrl.steppers[$mdSteppersCtrl.focusIndex].id}}\" ', 'ng-focus=\"$mdSteppersCtrl.redirectFocus()\" ', 'ng-class=\"{ ', \"'md-paginated': $mdSteppersCtrl.shouldPaginate, \", \"'md-center-steppers': $mdSteppersCtrl.shouldCenterSteppers \", '}\" ', 'ng-keydown=\"$mdSteppersCtrl.keydown($event)\" ', 'role=\"steplist\"> ', '<md-busy ng-show=\"$mdSteppersCtrl.busy\">{{$mdSteppersCtrl.busyText}}</md-busy>', \"<md-pagination-wrapper \", \"ng-class=\\\"{ 'md-center-steppers': $mdSteppersCtrl.shouldCenterSteppers }\\\" \", 'md-step-scroll=\"$mdSteppersCtrl.scroll($event)\"> ', \"<md-step-item \", 'tabindex=\"-1\" ', s, \"style=\\\"max-width: {{ $mdSteppersCtrl.maxStepWidth + 'px' }}\\\" \", 'ng-repeat=\"step in $mdSteppersCtrl.steppers\" ', 'role=\"step\" ', 'aria-controls=\"step-content-{{::step.id}}\" ', 'aria-selected=\"{{step.isActive()}}\" ', \"aria-disabled=\\\"{{step.scope.disabled || 'false'}}\\\" \", n, 'ng-class=\"{ ', \"'md-active':    step.isActive(), \", \"'md-focused':   step.hasFocus(), \", \"'md-disabled':  step.scope.disabled, \", \"'md-complete':  step.scope.complete \", '}\" ', 'ng-disabled=\"step.scope.disabled\" ', 'md-swipe-left=\"$mdSteppersCtrl.nextPage()\" ', 'md-swipe-right=\"$mdSteppersCtrl.previousPage()\" ', 'md-scope=\"::step.parent\"><md-step-label-wrapper ', 'stepindex=\"{{::$index+1}}\" ', 'md-steppers-template=\"::step.label\" ', 'md-scope=\"::step.parent\" ', \"></md-step-label-wrapper>\", \"</md-step-item> \", \"</md-pagination-wrapper> \", '<div class=\"md-visually-hidden md-dummy-wrapper\"> ', \"<md-dummy-step \", 'class=\"md-step\" ', 'tabindex=\"-1\" ', 'stepindex=\"{{::$index+1}}\" ', 'id=\"step-item-{{::step.id}}\" ', 'role=\"step\" ', 'aria-controls=\"step-content-{{::step.id}}\" ', 'aria-selected=\"{{step.isActive()}}\" ', \"aria-disabled=\\\"{{step.scope.disabled || 'false'}}\\\" \", 'ng-focus=\"$mdSteppersCtrl.hasFocus = true\" ', 'ng-blur=\"$mdSteppersCtrl.hasFocus = false\" ', 'ng-repeat=\"step in $mdSteppersCtrl.steppers\" ', 'md-scope=\"::step.parent\"><md-step-label-wrapper ', 'stepindex=\"{{::$index+1}}\" ', 'md-steppers-template=\"::step.label\" ', 'md-scope=\"::step.parent\" ', \"></md-step-label-wrapper></md-dummy-step> \", \"</div> \", \"</md-steppers-canvas> \", \"</md-steppers-wrapper> \", '<md-steppers-content-wrapper ng-show=\"$mdSteppersCtrl.hasContent && $mdSteppersCtrl.selectedIndex >= 0\"> ', \"<md-step-content \", 'id=\"step-content-{{::step.id}}\" ', 'role=\"steppanel\" ', 'aria-labelledby=\"step-item-{{::step.id}}\" ', 'md-swipe-left=\"$mdSteppersCtrl.swipeContent && $mdSteppersCtrl.incrementIndex(1)\" ', 'md-swipe-right=\"$mdSteppersCtrl.swipeContent && $mdSteppersCtrl.incrementIndex(-1)\" ', 'ng-if=\"$mdSteppersCtrl.hasContent\" ', 'ng-repeat=\"(index, step) in $mdSteppersCtrl.steppers\" ', 'ng-class=\"{ ', \"'md-no-transition': $mdSteppersCtrl.lastSelectedIndex == null, \", \"'md-active':        step.isActive(), \", \"'md-left':          step.isLeft(), \", \"'md-right':         step.isRight(), \", \"'md-no-scroll':     $mdSteppersCtrl.dynamicHeight \", '}\"> ', \"<div \", 'md-steppers-template=\"::step.template\" ', 'md-connected-if=\"step.isActive()\" ', 'md-scope=\"::step.parent\" ', 'ng-if=\"$mdSteppersCtrl.enableDisconnect || step.shouldRender()\"></div> ', \"</md-step-content> \", \"</md-steppers-content-wrapper>\"].join(\"\");\n      }, controller: \"MdSteppersController\", controllerAs: \"$mdSteppersCtrl\", bindToController: !0 };\n  }function i(e, t) {\n    function n(n, s, p, r) {\n      function d() {\n        n.$watch(\"connected\", function (e) {\n          e === !1 ? i() : c();\n        }), n.$on(\"$destroy\", c);\n      }function i() {\n        r.enableDisconnect && t.disconnectScope(a);\n      }function c() {\n        r.enableDisconnect && t.reconnectScope(a);\n      }if (r) {\n        var a = r.enableDisconnect ? n.compileScope.$new() : n.compileScope;return s.html(n.template), e(s.contents())(a), s.on(\"DOMSubtreeModified\", function () {\n          r.updatePagination(), r.updateInkBarStyles();\n        }), t.nextTick(d);\n      }\n    }return { restrict: \"A\", link: n, scope: { template: \"=mdSteppersTemplate\", connected: \"=?mdConnectedIf\", compileScope: \"=mdScope\" }, require: \"^?mdSteppers\" };\n  }function c(e) {\n    return { restrict: \"A\", compile: function compile(t, n) {\n        var s = e(n.mdStepScroll, null, !0);return function (e, t) {\n          t.on(\"mousewheel\", function (t) {\n            e.$apply(function () {\n              s(e, { $event: t });\n            });\n          });\n        };\n      } };\n  }r.$inject = [\"$scope\", \"$element\", \"$window\", \"$mdConstant\", \"$mdStepInkRipple\", \"$mdUtil\", \"$animateCss\", \"$attrs\", \"$compile\", \"$mdTheming\"], i.$inject = [\"$compile\", \"$mdUtil\"], c.$inject = [\"$parse\"], e.module(\"md-steppers\", [\"material.core\", \"material.components.icon\"]), e.module(\"md-steppers\").directive(\"mdStep\", n), e.module(\"md-steppers\").directive(\"mdStepItem\", s), e.module(\"md-steppers\").directive(\"mdStepLabel\", p), e.module(\"md-steppers\").controller(\"MdSteppersController\", r), e.module(\"md-steppers\").directive(\"mdSteppers\", d), e.module(\"md-steppers\").directive(\"mdSteppersTemplate\", i), function () {\n    \"use strict\";\n    function t(t) {\n      function n(n, s, p) {\n        return t.attach(n, s, e.extend({ center: !1, dimBackground: !0, outline: !1, rippleSize: \"full\" }, p));\n      }return { attach: n };\n    }t.$inject = [\"$mdInkRipple\"], e.module(\"md-steppers\").factory(\"$mdStepInkRipple\", t);\n  }(), e.module(\"md-steppers\").directive(\"mdStepScroll\", c);\n}(angular, window);\n\n//# sourceURL=webpack:///./utils/md-steppers/md-steppers.min.js?");

/***/ })

/******/ });