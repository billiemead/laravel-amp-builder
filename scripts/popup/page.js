angular.module('ui.popup')
.service('popup_page', function(communication,popup_form,$templateCache,popup, pageEdit, $rootScope, API)
{
	"ngInject";
	this.addPage = function()
	{
		var that = this;
		return popup.open({
			name:'pagelist_add_page_item',
			controller: function($scope,$modalInstance)
			{
				"ngInject";
				$scope.data = {name:'newpage'};
				$scope.data.is_new = false;
				$scope.ok = function()
				{
					$modalInstance.close($scope.data);
				}
			}
		});
	}
	this.open = function(opt)
	{
		opt = opt || {};
		var that = this;
		return popup.open(
		{
			name:'page',
			data:opt.data,
			controller: function($scope,$modalInstance, $dialog)
			{
				"ngInject";
				$scope.currentPageId = window.siteInfo.variant_id;
				$scope.currentPageIndex = opt.currentPageIndex || 0;
				window.siteInfo.pages = window.siteInfo.pages || [{name:'index'}];
				$scope.page_list = window.siteInfo.pages;
				API.all('variants').getList().then(function(json)
				{
					$scope.page_list = json;
				});
				
				$scope.viewSiteUrl = viewSiteUrl;
				$scope.addPage = function()
				{
					return that.addPage().result.then(function(data)
					{
						$scope.page_list.push(checkNewPage(data));
						window.siteInfo.pages = $scope.page_list;
					});
				}
				function getUniquePageName(a, index)
				{
					var timestamp = $.now();
					var name = a;
					for(var i in $scope.page_list){
						if(index != undefined && i == index) continue;
						if(name == $scope.page_list[i].name)
							name = a + timestamp+Math.floor(Math.random()*101);
					}
					return name;
				};
				function checkNewPage(data, index) {
					data.name = $.trim(data.name);
					if(data.name.length == 0) {
						data.name = "newpage";
					}
					data.name = getUniquePageName(data.name, index);
					return data;
				}
				$scope.clonePage = function(index)
				{
					if(index == $scope.currentPageIndex) {
						var structure = pageEdit.getPageStructure();
						$scope.page_list[index].structure = structure;
					}
					var clone = angular.copy($scope.page_list[index]);
					delete clone.id;
					
					clone.name = $scope.page_list[index].name + '_copy';
					clone = checkNewPage(clone);
					API.service('site/clonePage').post({page_id:$scope.page_list[index].id, name:clone.name}).then(function(json)
					{
						clone.id = json.id;
						$scope.page_list.push(clone);
						window.siteInfo.pages = $scope.page_list;
					});
					
					
				}
				$scope.editPage = function(item)
				{
					return popup_form.open({
						name:'pagelist_edit_page_item',
						controller: function($scope, $modalInstance)
						{
							"ngInject";
							$scope.data = angular.copy(item || {});
							$scope.data.is_new = false;
							$scope.ok = function()
							{
								$modalInstance.close($scope.data);
							}
						}
					}).result.then(function(data)
					{
						var index = $scope.page_list.indexOf(item);
						$scope.page_list[index] = $.extend({}, $scope.page_list[index], checkNewPage(data, index));
						window.siteInfo.pages = $scope.page_list;
						$rootScope.$emit('changePageEvent', $scope.currentPageIndex);
					})
				}
				$scope.deletePage = function($event, item,$index)
				{
					if($index != $scope.currentPageIndex) {
						var page_id = $scope.page_list[$index].id
						$dialog.confirm({title:window.t('pagepopup.delete_variant_title'), message:window.t('pagepopup.delete_variant_message')}).result.then(function()
						{
							API.service('site/deletePage').post({page_id:page_id}).then(function(json)
							{
								$scope.page_list.splice($index ,1);
								window.siteInfo.pages = $scope.page_list;
								if($scope.currentPageIndex > $index) {
									$scope.currentPageIndex--;
									$rootScope.$emit('changeVariantEvent', $scope.currentPageIndex);
								}
							});
							
								
						});
					}
					
				}
				$scope.savePage = function() {
					var item = $scope.page_list[$scope.currentPageIndex];
					var structure = pageEdit.getPageStructure();
					
					item.structure = structure;
					window.siteInfo.pages[$scope.currentPageIndex].structure = angular.copy(structure);
					console.log('savePage' + item.name, window.siteInfo.pages[$scope.currentPageIndex].structure);
					
				}
				$scope.changePage = function(item, index)
				{
					if(index == $scope.currentPageIndex)
						return;
					$dialog.confirm(
					{
						title:window.t('pagepopup.change_variant_title'),
						message:window.t('pagepopup.change_variant_message')
					}).result.then(function(result)
					{
						$scope.savePage();
						return API.service('site/fetchPageContent').withHttpConfig({blockScreen:true}).post(item).then(function(json)
						{
							item.content = json.content;
							pageEdit.changePage(item);
							$scope.currentPageIndex = index;
							$rootScope.$emit('changeVariantEvent', $scope.currentPageIndex);
						})
						
						
					});
					
				}
				
			},
		});
	}
});
