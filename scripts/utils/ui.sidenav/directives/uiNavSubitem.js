export default function($parse,$controller,communication,$compile,$state, $rootScope) {
	"ngInject";
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'template/tabs/uiNavSubItem.html',
		//transclude: true,
		scope: {
		active: '=?',
		heading: '@',
		headingIcon: '@',
		onSelect: '&select', //This callback is called in contentHeadingTransclude
		//once it inserts the tab's content into the dom
		onDeselect: '&deselect',
		url:'@templateUrl'
		},
		controller: function($scope)
		{
			"ngInject";
			var ctrl = this;
			ctrl.isActive = function(route){
				var parents = getParentList($state.$current);
				var result = $state.is(route);
				if(!result) {
					for(var i = 0;i < parents.length-1;i++) {
						if(parents[i].name==route) {return true;};
					}
				}
				return result;
			};

			function getParentList(state) {
				var parentList = [];
				var state = state.parent;
				while(state) {
					parentList.push(state);
					state = state.parent;
				}
				return parentList;
			}
			$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
				$scope.active = ctrl.isActive($scope.url.replace(/\//g,'.'));
			});
		}
	};
}