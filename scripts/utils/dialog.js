angular.module("template/dialog/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dialog/window.html",
    "<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" class=\"\"\n" +
    "    uib-modal-animation-class=\"fade\"\n" +
    "	ng-class=\"{in: animate,size: size ? 'modal-' + size : ''\ }\" ng-style=\"{'z-index': 1050 + index*10}\" ng-click=\"close($event)\">\n" +
    "    <div class=\"\" uib-modal-transclude></div></div>\n" +
    "");
}]);
angular.module("template/dialog/window_nd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dialog/window_nd.html",
    "<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" class=\"modal modal-nd\"\n" +
    "    modal-animation-class=\"fade\"\n" +
    "	ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'inline-table'}\" ng-click=\"close($event)\">\n" +
    "    <div class=\"modal-dialog\" ng-class=\"size ? 'modal-' + size : ''\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
    "</div>\n" +
    "");
}]);
angular.module("template/dialog/confirm.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dialog/confirm.html",
    "<md-dialog aria-label=\"Confirm\">" +
	"<md-toolbar>" +
		  "<div class=\"md-toolbar-tools\">" +
			"<h2>{{title}}</h2>"+
			
			"<span flex></span>"+
			"<md-button class=\"md-icon-button\" ng-click=\"$dismiss()\">"+
			  "<md-icon class=\"fa fa-times\" aria-label=\"Close dialog\"></md-icon>"+
			"</md-button>"+
		  "</div>"+
		  "</md-toolbar>"+
		  "<md-dialog-content>"+
			"<div class=\"md-dialog-content\">"+
    "{{message}}" +
	"</div>"+
	 "</md-dialog-content>"+
	"<md-dialog-actions layout=\"row\">"+
			"<span flex></span>"+
		  "<md-button ng-click=\"ok()\">"+
			window.t('ok') +
		  "</md-button>"+
		   "<md-button ng-click=\"$dismiss()\">"+
			window.t('cancel') +
		  "</md-button>"+
		"</md-dialog-actions>"+
	
	
	"</md-dialog>"+
    "");
}]);
angular.module("template/dialog/confirm2.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dialog/confirm2.html",
    "<div class=\"modal-header\" header-draggable>\n" +
	"<button class=\"close\" ng-click=\"$close()\"><span aria-hidden=\"true\">×</span><span class=\"sr-only\">Close</span></button>"+
	"<h4>{{title}}</h4>"+
	"</div>"+
    " <div class=\"modal-body\" fix-body-height> " +
    "<div>{{message}}</div>" +
	"</div>"+
	"<div class=\"modal-footer\">"+
	"<button class=\"btn btn-primary\" ng-click=\"ok(1)\">"+window.t('yes')+"</button>"+
	"<button class=\"btn btn-warning\" ng-click=\"ok(2)\">"+window.t('no')+"</button>"+
	"<button class=\"btn btn-danger\" ng-click=\"$dismiss()\">"+window.t('cancel')+"</button>"+
    "");
}]);
angular.module("template/dialog/message.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/dialog/message.html",
  "<md-dialog aria-label=\"Confirm\">" +
	"<md-toolbar>" +
		  "<div class=\"md-toolbar-tools\">" +
			"<h2>{{title}}</h2>"+
			
			"<span flex></span>"+
			"<md-button class=\"md-icon-button\" ng-click=\"$dismiss()\">"+
			  "<md-icon class=\"fa fa-times\" aria-label=\"Close dialog\"></md-icon>"+
			"</md-button>"+
		  "</div>"+
		  "</md-toolbar>"+
		  "<md-dialog-content>"+
			"<div class=\"md-dialog-content\">"+
    "<div ng-bind-html=\"message\"></div>" +
	"</div>"+
	 "</md-dialog-content>"+
	"<md-dialog-actions layout=\"row\">"+
			"<span flex></span>"+
		  
		   "<md-button ng-click=\"$dismiss()\">"+
			window.t('close') +
		  "</md-button>"+
		"</md-dialog-actions>"+
	
	
	"</md-dialog>"+
    
    "");
}]);

angular.module('ui.dialog', ['template/dialog/window.html','template/dialog/message.html','template/dialog/confirm2.html','template/dialog/confirm.html'])
.provider('$dialog', function () {
	var $uibModalProvider = {
		$get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller','$sce','$mdDialog', '$mdPanel',
		function ($injector, $rootScope, $q, $http, $templateCache, $controller,$sce, $mdDialog, $mdPanel) {
			var $dialog = {};
			
			$dialog._open = function(options)
			{
				options = options || {};
				options.animation = options.animation ||false;
				//options.hasBackdrop = options.backdrop || true;
				var dialogInstance = $mdDialog.show(options);
				
				return {result:dialogInstance};
			};
			
			$dialog.openPanel = function(options)
			{
				var panelPosition = $mdPanel.newPanelPosition().absolute().center();
				var animation = $mdPanel.newPanelAnimation();
				animation.duration({open:300, close:300});
				
				switch(options.openFrom) {
					case 'button':
					  animation.openFrom('.animation-target');
					  break;
					case 'corner':
					  animation.openFrom({top:0, left:0});
					  break;
					
					case 'bottom':
					  animation.openFrom({
						top: document.documentElement.clientHeight,
						left: document.documentElement.clientWidth / 2 - 250
					  });
				}
				switch(options.closeTo) {
					case 'button':
					  animation.closeTo('.animation-target');
					  break;
					case 'corner':
					  animation.closeTo({top:0, left:0});
					  break;
					case 'bottom':
					  animation.closeTo({
						top: document.documentElement.clientHeight,
						left: document.documentElement.clientWidth / 2 - 250
					  });
				}

				switch(options.animationType) {
					case 'custom':
					  animation.withAnimation({
						open: 'demo-dialog-custom-animation-open',
						close: 'demo-dialog-custom-animation-close'
					  });
					  break;
					case 'slide':
					  animation.withAnimation($mdPanel.animation.SLIDE);
					  break;
					case 'scale':
					  animation.withAnimation($mdPanel.animation.SCALE);
					  break;
					case 'fade':
					  animation.withAnimation($mdPanel.animation.FADE);
					  break;
					case 'none':
					default:
					  animation = undefined;
					  break;
				}
				
				var defaultConfig = {
					attachTo: angular.element(document.body),
					position: panelPosition,
					clickOutsideToClose: true,
					escapeToClose: true,
					focusOnOpen: true,
					animation:animation
				}
				var deferred = $q.defer();
				var promise = deferred.promise;
				var dialogInstance = $mdPanel.create($.extend({}, defaultConfig, options,{
					multiple: true,
					controller : function($scope, mdPanelRef)
					{
						"ngInject";
						$scope.$dismiss = function()
						{
							deferred.reject(1);
							mdPanelRef.destroy();
						}
						$scope.$close = function()
						{
							$scope.$dismiss();
						}
						mdPanelRef.close = function(result)
						{
							if(result === 'escapeToClose' || result === 'clickOutsideToClose'){
								deferred.reject(1);
							}
							else
								deferred.resolve(result);
							mdPanelRef.destroy();
						}
						if(angular.isDefined(options.controller))
						{
							$controller(options.controller, {$scope:$scope,$uibModalInstance:mdPanelRef,$modalInstance:mdPanelRef});
						}
					}
				}));
				dialogInstance.open();
				return {result:promise};
			}
			$dialog.open = function(options)
			{
				options = options || {};
				return $dialog._open($.extend({}, options,{
					multiple: true,
					controller : function($scope,$mdDialog)
					{
						"ngInject";
						$scope.$dismiss = function()
						{
							$mdDialog.cancel();
						}
						$scope.$close = function()
						{
							$mdDialog.cancel();
						}
						$mdDialog.close = $mdDialog.hide;
						if(angular.isDefined(options.controller))
						{
							$controller(options.controller, {$scope:$scope,$uibModalInstance:$mdDialog,$modalInstance:$mdDialog});
						}
					}
				}));
			};
			$dialog.message = function(options)
			{
				var options = options || {};
				return $dialog.open({
					templateUrl: options.templateUrl || 'template/dialog/message.html',
					controller : function($scope,$mdDialog)
					{
						"ngInject";
						try{
							$scope.message = $sce.trustAsHtml(options.message);
						}
						catch(e) {
							$scope.message = options.message;
						}
						$scope.title = $sce.trustAsHtml(options.title);
						try{
							$scope.title = $sce.trustAsHtml(options.title);
						}
						catch(e) {
							$scope.title = options.title;
						}
						//$scope.title = (options.title);
						
						if(angular.isDefined(options.controller))
						{
							$controller(options.controller, {$scope:$scope,$uibModalInstance:$mdDialog,$modalInstance:$mdDialog});
						}
					}
				});
			};
			$dialog.confirm = function(options)
			{
				var options = options || {};
				return $dialog.open({
					templateUrl: options.templateUrl || 'template/dialog/confirm.html',
					controller : function($scope,$mdDialog)
					{
						"ngInject";
						$scope.message = options.message;
						$scope.title = options.title;
						$scope.ok = function()
						{
							$mdDialog.hide(1);
						};
						if(angular.isDefined(options.controller))
						{
							$controller(options.controller, {$scope:$scope,$uibModalInstance:$mdDialog,$modalInstance:$mdDialog});
						}
					}
				});
			};
		
			
			$dialog.confirm2 = function(options)
			{
				var options = options || {};
				return $dialog.open({
					templateUrl: options.templateUrl || 'template/dialog/confirm2.html',
					controller : function($scope,$uibModalInstance)
					{
						"ngInject";
						$scope.message = options.message;
						$scope.title = options.title;
						$scope.ok = function(result)
						{
							$uibModalInstance.close(result);
						};
						
						if(angular.isDefined(options.controller))
						{
							$controller(options.controller, {$scope:$scope,$uibModalInstance:$uibModalInstance,$modalInstance:$uibModalInstance});
						}
						
					}
				});
			};
			return $dialog;
		}]
	}
	return $uibModalProvider;
})
.directive('headerDraggable',function($window)
{
	"ngInject";
	function link(scope, element, attrs) {
		var modal = $(element).parents('.modal-dialog:first');
		if(modal.draggable)
			modal.draggable(
			{
				handle:element
			});
	}
	return {link:link};
})
.directive('fixBodyHeight',function($window)
{
	"ngInject";
	function link(scope, element, attrs) {
		var w = angular.element($window);
		var fixed = attrs.fixBodyHeight;
        function resize() {
			var e = $(element);
            var window_height =  $(window).height();
			var offset = $(element).offset();
			var top = offset.top;
			if(top < 0)
				top = 84;
			var titlebar = e.prev();
			var footer = e.next();
			var h = 0;
			if(!e.hasClass('modal-body')) {
				e = e.parents('.modal-body');
				window_height =  e.height();
				top = 0;
				h = window_height - top - footer.outerHeight() - titlebar.outerHeight() - 10;
			}
			else {
				top -= $(window).scrollTop();
				titlebar = e.prev();
				footer = e.next();
				h = window_height - top - footer.outerHeight() - titlebar.outerHeight() - 10;
			}
				
			
			
			if(fixed = 'absolute')
			{
				$(element).css('height', h);
			}
			else
				$(element).css('max-height', h);
        };
        w.on('resize.dialog', function () {
            resize();
        });
	}
	return {link:link};
})

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}
window.randomString = randomString;
