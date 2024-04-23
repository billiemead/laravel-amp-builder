export default function uiTabsetCtrl($scope,$state,$rootScope) 
{
	"ngInject";
	this.addedLastTab = false;
	function getParentList(state) {
		var parentList = [];
		var state = state.parent;
		while(state) {
			parentList.push(state);
			state = state.parent;
		}
		return parentList;
	}
	var ctrl = this,
	tabs = ctrl.tabs = $scope.tabs = [];
	ctrl.refresh = function()
	{
		angular.forEach(tabs, function(tab) {
			var active  = false;
			active = ctrl.isActive(tab.url.replace(/\//g,'.'));
			console.log(active, tab.url);
			if(active) {
				ctrl.select(tab);
				return;
			}
		});
		var flag = false;
		for(var i = 0;i < tabs.length;i++)
		{
			if(tabs[i].active) {
				flag = true;
			}
		}
		if(!flag) 
		{
			tabs[0].active = true;
		}	
	}
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		if(!$rootScope.configuration_load_completed)
		{
			$rootScope.nextState = toState.name;
			event.preventDefault();
			return false;
		}
	});
	$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
		ctrl.refresh();
		
	});
	ctrl.select = function(selectedTab) {
		angular.forEach(tabs, function(tab) {
			
		  if (tab.active && tab !== selectedTab) {
			tab.active = false;
			tab.onDeselect();
		  }
		});
		if (selectedTab.active && selectedTab.loaded) return;
		if (selectedTab.load !== undefined) {
		selectedTab.load();
		}
		selectedTab.active = true;
		selectedTab.loaded = true;
		selectedTab.onSelect();
	};
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
	ctrl.addTab = function addTab(tab, last) {
    tabs.push(tab);
	var active = ctrl.isActive(tab.url.replace(/\//g,'.'));
	
	if(active) {
		
		ctrl.select(tab);
	}
    else if (tab.active) {
      ctrl.select(tab);
	  
    }
	
	if(last) {
		if($state.$current.name=="") {return;}
		var flag = false;
		for(var i = 0;i < tabs.length;i++)
		{
			if(tabs[i].active) {
				flag = true;
			}
		}
		if(!flag) 
		{
			tabs[0].active = true;
		}	
		this.addedLastTab = true;
	}
  };

  ctrl.removeTab = function removeTab(tab) {
    var index = tabs.indexOf(tab);
    //Select a new tab if the tab to be removed is selected and not destroyed
    if (tab.active && tabs.length > 1 && !destroyed) {
      //If this is the last tab, select the previous tab. else, the next tab.
      var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
      ctrl.select(tabs[newActiveIndex]);
    }
    tabs.splice(index, 1);
  };

  var destroyed;
  $scope.$on('$destroy', function() {
    destroyed = true;
  });
}