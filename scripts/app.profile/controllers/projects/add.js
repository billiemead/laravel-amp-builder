export default function($scope,communication, $stateParams, popup, $state, $dialog, API) {
	"ngInject";
	$scope.category = 0;
	if($stateParams.id != undefined){
		$scope.category = $stateParams.id
	}
	
	$scope.data = {};
	$scope.errors = {};
	$scope.templates = [];
	var filterCategory = function(categories, type){
		var rs = [];
		if($.isArray(categories)){
			rs = categories.filter(function(item){
				return item[type] != undefined && item[type] == 1;
			});
		}
		return rs;
	}
	API.service('page').getList().then(function(json) {
		$scope.pages = json;
	});
	
	$scope.category_name = false;
	API.service('theme_category').getList().then(function(json)
	{
		$scope.themes_categories = filterCategory(json, 'page');
		for(var i in $scope.themes_categories){
			if($scope.themes_categories[i].id == $scope.category){
				$scope.category_name = $scope.themes_categories[i].title;
			}
		}
		
	});
	$scope.scrollContainer = $('page-container');
	
	var scrollLoader = function()
	{
		this.items = [];
		this.busy = false;
		this.disabled = false;
		this.page = 0;
		this.length = 4;
		this.recordsTotal = Infinity;
		this.nextPage = function()
		{
			if (this.busy) return;
			if (!$scope.current_tab) return;
			this.busy = true;
			API.service('template/nextPage').post({length: this.length, start: (this.page == 0 ? 0 : this.page * this.length)}, {category:$scope.category,type:$scope.current_tab.type || 'page', is_global: $scope.current_tab.is_global }).then(function(json)
			{
				this.recordsTotal = json.recordsTotal * 1;
				if(json.data && json.data.length)
				{
					for(var i in json.data){
						this.items.push(json.data[i]);
					}
					this.disabled = this.items.length >= this.recordsTotal;
				}
				else
					this.disabled = true;
				this.busy = false;
				this.disabled = this.disabled || this.busy;
				this.page++;
				
			}.bind(this));
		}
		this.reset = function()
		{
			this.items = [];
			this.page = 0;
			this.disabled = false;
			this.nextPage();
		}
	}
	$scope.filter = function(category){
					
		if(category == $scope.category)
			return;
		$scope.category = category;
		$scope.loader.reset();
	}
	$scope.loader = new scrollLoader;
	$scope.selectTheme = function(theme, maxsite)
	{
		popup.open({
			name:'add_page',
			controller: function($scope, $modalInstance,$state)
			{
				"ngInject";
				$scope.data = {type:1, template: theme};
				$scope.ok = function()
				{
					API.service('page').post($scope.data).then(function(json)
					{
						if(json == 1) {
							$modalInstance.close(1);
							$state.go("projects.list", {}, { reload: true });
						}
						else {
							$scope.errors = json;
						}
					});
				}
			}
		});
	}
	$scope.reloadState = function(category_id)
	{
		if(category_id != undefined)
			$state.go("pages.add_category", {id:category_id}, { reload: true });
		else
			$state.go("pages.add", {}, { reload: true });
	}
	$scope.loader = new scrollLoader;
	$scope.tabs = [

		{name:'System Templates', type:'page', is_global:1},
		{name:'My Templates', type:'page', is_global:0}
	]
	$scope.changeTab = function(index)
	{
		$scope.current_tab = $scope.tabs[index];
		$scope.loader.reset();
	}
	$scope.changeTab(0);
}