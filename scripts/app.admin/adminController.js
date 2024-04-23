export default function($location,$rootScope,$scope, communication, $mdSidenav, $timeout, $log)
{
	"ngInject";
	$scope.toggleLeft = buildDelayedToggler('left');
   // $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
	
	function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
	$scope.openMenu = function($mdMenu, ev) {
    //  originatorEv = ev;
      $mdMenu.open(ev);
    };
}