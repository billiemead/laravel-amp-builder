// Usage
//
//<md-dialog rc-drag="md-toolbar" ng-cloak>
//  <form>
//    <md-toolbar>
//      ...
//    </md-toolbar>
//    <md-dialog-content>
//      ...
//    </md-dialog-content>
//  </form>
//</md-dialog>


function rcDragDirective($window, $document) {
  'ngInject';

  const moveThreshold = 100;

  let documentListenersActive = false;
  let rAFPending = false;
  let mouseStart = null;
  let mouseLast = null;
  let mouseDelta = {x: 0, y: 0};
  let offset = {x: 0, y: 0};
  let target;

  function setupDocumentListeners() {
    if (!documentListenersActive) {
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
      documentListenersActive = true;
    }
  }

  function takedownDocumentListeners() {
    if (documentListenersActive) {
      $document.off('mousemove', mousemove);
      $document.off('mouseup', mouseup);
      documentListenersActive = false;
    }
  }

  function updateViewport() {
    target.css('transform', 'translate('+ (offset.x + mouseDelta.x) +'px,'+ (offset.y + mouseDelta.y) +'px)');
  }

  function requestUpdateViewport() {
    if (!rAFPending) {
      $window.requestAnimationFrame(function() {
        updateViewport();
        rAFPending = false;
      });
      rAFPending = true;
    }
  }

  function mousedown(ev) {
    mouseStart = {x: ev.pageX, y: ev.pageY};
    mouseLast = mouseStart;
    setupDocumentListeners();
  }

  function mousemove(ev) {
    if (mouseLast === null || Math.abs(ev.pageX - mouseLast.x) > moveThreshold || Math.abs(ev.pageY - mouseLast.y) > moveThreshold) {
      mouseStart = null;
      mouseup();
    }
    else {
      mouseLast = {x: ev.pageX, y: ev.pageY};
      mouseDelta = {x: (ev.pageX - mouseStart.x), y: (ev.pageY - mouseStart.y)};
      requestUpdateViewport();
    }
  }

  function mouseup() {
    if (mouseStart !== null) {
      offset.x += mouseDelta.x;
      offset.y += mouseDelta.y;
      mouseDelta = {x: 0, y: 0};
    }
    mouseStart = null;
    mouseLast = null;
    takedownDocumentListeners();
  }

  function link(scope, elem, attrs) {
	var modal = $(elem);
	var handle = attrs.rcDrag;
		modal.draggable(
		{
			handle:handle
		})
   

    scope.$on('$destroy', function() {
      //takedownDocumentListeners();
    });
  }

  return {
    restrict: 'A',
    link: link
  };
}

export default rcDragDirective;