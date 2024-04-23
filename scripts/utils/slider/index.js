/*
 *
 * https://github.com/fatlinesofcode/ngDraggable
 */
angular.module("ngDraggable", [])
    .service('ngDraggable', [function() {


        var scope = this;
        scope.inputEvent = function(event) {
            if (angular.isDefined(event.touches)) {
                return event.touches[0];
            }
            //Checking both is not redundent. If only check if touches isDefined, angularjs isDefnied will return error and stop the remaining scripty if event.originalEvent is not defined.
            else if (angular.isDefined(event.originalEvent) && angular.isDefined(event.originalEvent.touches)) {
                return event.originalEvent.touches[0];
            }
            return event;
        };

    }])
    .directive('ngDrag', ['$rootScope', '$parse', '$document', '$window', 'ngDraggable', function ($rootScope, $parse, $document, $window, ngDraggable) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.value = attrs.ngDrag;
                var offset,_centerAnchor=false,_mx,_my,_tx,_ty,_mrx,_mry;
                var _hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
                var _pressEvents = 'touchstart mousedown';
                var _moveEvents = 'touchmove mousemove';
                var _releaseEvents = 'touchend mouseup';
                var _dragHandle;

                // to identify the element in order to prevent getting superflous events when a single element has both drag and drop directives on it.
                var _myid = scope.$id;
                var _data = null;

                var _dragOffset = null;

                var _dragEnabled = false;

                var _pressTimer = null;

                var onDragStartCallback = $parse(attrs.ngDragStart) || null;
                var onDragStopCallback = $parse(attrs.ngDragStop) || null;
                var onDragCallback = $parse(attrs.ngDragDrag) || null;
				
                var allowTransform = angular.isDefined(attrs.allowTransform) ? scope.$eval(attrs.allowTransform) : true;
				var parentBounding = angular.isDefined(attrs.parentBounding) ? scope.$eval(attrs.parentBounding) : false;
				var axis = angular.isDefined(attrs.axis) ? attrs.axis : undefined;
				var containment = angular.isDefined(attrs.containment) ? attrs.containment : undefined;	
                var getDragData = $parse(attrs.ngDragData);

                // deregistration function for mouse move events in $rootScope triggered by jqLite trigger handler
                var _deregisterRootMoveListener = angular.noop;

                var initialize = function () {
                    
					if(element.draggable( "instance" ) != undefined){
						element.draggable( "destroy" );
					}
					element.draggable({
						iframeFix: true,
						handle: "[ng-drag-handle]",
						containment:containment,
						
						axis: axis,
						
						start: function(event, ui)
						{
							if (onDragStartCallback ){
								var _data = getDragData(scope);
								scope.$apply(function () {
									onDragStartCallback(scope, {$data: _data, $ui: ui, $event: event});
								});
							}
						},
						drag: function( event, ui ) {
							if (!onDragCallback )return;
							var _data = getDragData(scope);
							scope.$apply(function () {
								onDragCallback(scope, {$data: _data, $ui: ui, $event: event});
							});
						},
						stop: function(event, ui){
							if (onDragStopCallback ){
								var _data = getDragData(scope);
								scope.$apply(function () {
									onDragStopCallback(scope, {$data: _data, $ui: ui, $event: event});
								});
							}
						}
					});
                };

            
                initialize();
            }
        };
    }])

   
