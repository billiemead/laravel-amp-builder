export default function($parse,$controller,communication,$compile,$state) {
	"ngInject";
	return {
		require: '^uiTabset',
		restrict: 'E',
		replace: true,
		templateUrl: 'template/tabs/uiTab.html',
		transclude: true,
		scope: {
		  active: '=?',
		  heading: '@',
		  headingIcon: '@',
		  onSelect: '&select', //This callback is called in contentHeadingTransclude
							  //once it inserts the tab's content into the dom
		  onDeselect: '&deselect',
		  url:'@templateUrl',
		  hide:'@'
		},
		controller: function($scope)
		{
			"ngInject";
		},
		compile: function(elm, attrs, transclude) {
			return function postLink(scope, elm, attrs, uiTabsetCtrl, $state) {
				scope.changed= false;
				scope.$watch('active', function(active) {
					if (active) {
						uiTabsetCtrl.select(scope);
					}
				});
				scope.disabled = false;
				if ( attrs.disabled ) {
					scope.$parent.$watch($parse(attrs.disabled), function(value) {
						scope.disabled = !! value;
					});
				}
				scope.path = scope.url.replace(/\//g,'.');
				scope.select = function() {
				};
				var templateCtrl, templateScope;
				console.log(window.requireContexts);
				if (angular.isDefined(attrs.templateUrl) && (angular.isDefined(attrs.controller) || angular.isDefined(attrs.dynamicCtrl))) 
				{
					scope._compile = function()
					{
						var createElement = function(f)
						{
							templateScope = scope.$new();
							templateScope.isTabbedPane = true;
							var controller;
							if(window.requireContexts){
								
								var keys = window.requireContexts.keys();
								for(var j in keys){
									var n  = keys[j];
									var cls = window.requireContexts(n);
									var l = n.length;
									n = n.substring(2, l - 3);
									if(f == n)
										controller = cls;
								}
							}
						
							if(controller != undefined)
								templateCtrl = $controller(controller, {$scope: templateScope});
							else if(attrs.controller != undefined)
								templateCtrl = $controller(attrs.controller, {$scope: templateScope});
							$compile(scope.contentElement)(templateScope);
							scope.loaded = true;
					
						}
						if(angular.isDefined(attrs.dynamicCtrl) )
						{
							createElement(attrs.dynamicCtrl);
						}
						else
							createElement();
					}
					scope.load = function() 
					{
						if(!scope.loaded || angular.isDefined(attrs.noCache))
							communication.getHtml(attrs.templateUrl).then(function(response) 
							{
								var element = angular.element(response);
								scope.contentElement = element;
								//if (!scope.$$phase) 
									//scope.$digest();
							});
					};
				}
			
				uiTabsetCtrl.addTab(scope, elm.next().length==0);
					scope.$on('$destroy', function() {
						uiTabsetCtrl.removeTab(scope);
					});

				//We need to transclude later, once the content container is ready.
				//when this link happens, we're inside a tab heading.
				scope.$transcludeFn = transclude;
			};
		}
	};
}