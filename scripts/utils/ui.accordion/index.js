var moduleName = angular
  .module('angAccordion', ['collapsibleItem'])
  .controller('angAccordionController', ['$scope', function($scope){
	var collapsibleItems = [];

	$scope.$watch('collapseAll', function () {
	  if ($scope.collapseAll == true) {
		  angular.forEach(collapsibleItems, function (collapsibleItem) {
			collapsibleItem.isOpenned = false;
			collapsibleItem.icon = collapsibleItem.closeIcon;
		  });
	  }
	  // dynamically expand all panels
	  else if( $scope.collapseAll === false) { // expand all is set to false
		  angular.forEach(collapsibleItems, function (collapsibleItem) {
			  collapsibleItem.isOpenned = true;
			  collapsibleItem.icon = collapsibleItem.openIcon;
		  });
	  }
	});

	  this.openCollapsibleItem = function(collapsibleItemToOpen) {
		if( $scope.oneAtATime ) {
		  angular.forEach(collapsibleItems, function(collapsibleItem) {
			collapsibleItem.isOpenned = false;
			collapsibleItem.icon = collapsibleItem.closeIcon;
		  });
		}
		collapsibleItemToOpen.isOpenned = true;
	  };

	  this.addCollapsibleItem = function(collapsibleItem) {
		collapsibleItems.push(collapsibleItem);

		if ( $scope.closeIconClass !== undefined || $scope.openIconClass !== undefined ) {
		  collapsibleItem.iconsType = 'class';
		  collapsibleItem.closeIcon = $scope.closeIconClass;
		  collapsibleItem.openIcon = $scope.openIconClass;
		}
		else if ( $scope.closeIconUrl !== undefined || $scope.openIconUrl !== undefined ) {
		  collapsibleItem.iconsType = 'url';
		  collapsibleItem.closeIcon = $scope.closeIconUrl;
		  collapsibleItem.openIcon = $scope.openIconUrl;
		}

		collapsibleItem.iconIsOnLeft = $scope.iconPosition == 'left' ? true: false;
	  };

  }])
  .directive('angAccordion', function() {
  return {
	restrict: 'EA',
	transclude: true,
	replace: true,
	scope: {
	  oneAtATime: '@',
	  closeIconUrl: '@',
	  openIconUrl: '@',
	  closeIconClass: '@',
	  openIconClass: '@',
	  iconPosition: '@',
	  collapseAll: '='
	},
	controller: 'angAccordionController',
	template: '<div class="accordion" ng-transclude></div>'
  };
})
.name;

angular.module('collapsibleItem', []).directive('collapsibleItem', function() {
  return {
	require: '^angAccordion',
	restrict: 'EA',
	transclude: true,
	replace: true,
	scope: {
	  itemTitle: '@',
	  itemDisabled: '=',
	  initiallyOpen: '='
	},
	link: function(scope, element, attrs, accordionController) {
	  scope.isOpenned = (scope.initiallyOpen) ? true : false;
	  accordionController.addCollapsibleItem(scope);

	  if(scope.isOpenned)
		scope.icon = scope.openIcon;
	  else
		scope.icon = scope.closeIcon;

	  scope.toggleCollapsibleItem = function () {
		if(scope.itemDisabled)
		  return;

		if(!scope.isOpenned) {
		  accordionController.openCollapsibleItem(this);
		  scope.icon = scope.openIcon;
		}
		else {
		  scope.isOpenned = false;
		  scope.icon = scope.closeIcon;
		}
	  };

	  scope.getIconUrl = function ( type ) {
		return type == 'url' ? scope.icon : null;
	  };
	},
	template: require('./template.tmpl')
  };
});

export default moduleName;
