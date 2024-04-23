export default function uiSidenavCtrl($scope,$state,$rootScope) 
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
	
	$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
		ctrl.refresh();
	});
	function getCurrentMenu(name) {
		if(name != undefined){
			var path = name.split('.');
			if(path.length) {
				return path[0];
			}
			
		}
		return name;
	}
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		
		$scope.currentMenu = getCurrentMenu(toState.name);
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
		if(route.length && route[0] == '#')
			route = route.substring(1);;
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
		if (tab.active && tabs.length > 1 && !destroyed) {
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