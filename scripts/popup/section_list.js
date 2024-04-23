angular.module('ui.popup')
.service('popup_section_list', function(API,$templateCache,popup, $rootScope, $controller)
{
	this.open = function(opt)
	{
		opt = opt || {};
		var that = this;
		return popup.open(
		{
			template:require('../templates/popup/section_list.tmpl'),
			data:opt.data,
			controller: function($scope,$modalInstance)
			{
				"ngInject";
				
				$scope.basePath = window.basePath;
				
				var filterCategory = function(categories, type){
					var rs = [];
					if($.isArray(categories)){
						rs = categories.filter(function(item){
							return item[type] != undefined && item[type] == 1;
						});
					}
					return rs;
				}
				API.service('template/category').getList().then(function(json)
				{
					var type = opt.type || $scope.current_tab.type || 'section';
					$scope.categories = filterCategory(json, type);
				});
				
				$scope.selectTemplate = function(template)
				{
					$modalInstance.close(template);
				}
				$scope.selectBlankTemplate = function(section)
				{
					$modalInstance.close('blank');
				}
				$scope.filter = function(category){
					
					if(category == $scope.category)
						return;
					$scope.category = category;
					$scope.loader.reset();
				}
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
						API.service('template/nextPage').post({length: this.length, start: (this.page == 0 ? 0 : this.page * this.length)}, {category:$scope.category,type:$scope.current_tab.type || 'section', is_global: $scope.current_tab.is_global }).then(function(json)
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
				$scope.loader = new scrollLoader;
				$scope.tabs = [
					{name: window.t('template_list_popup.my_templates'), type:opt.type, is_global:0},
					{name: window.t('template_list_popup.system_templates'), type:opt.type, is_global:1}
				]
				$scope.changeTab = function(index)
				{
					$scope.current_tab = $scope.tabs[index];
					$scope.loader.reset();
				}
				$scope.changeTab(0);
				if(opt.controller != undefined)
					$controller(opt.controller, {$scope:$scope, $modalInstance:$modalInstance})
			},
			size:'lg',
		});
	}
});
