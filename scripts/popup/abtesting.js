(function () { "use strict";
angular.module('ui.popup')
.service('popup_abtesting', function(communication,popup_form,$templateCache,popup, pageEdit, $rootScope)
{
	"ngInject";
	
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
				$scope.currentPageIndex = opt.currentPageIndex || 0;
				window.siteInfo.pages = window.siteInfo.pages || [{name:'index'}];
				$scope.page_list = window.siteInfo.pages;
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
					communication.api('clonePage', {page_id:$scope.page_list[index].id, name:clone.name}).then(function(json)
					{
						clone.id = json;
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
						$dialog.confirm({title:'Delete Page?',message:'Are you sure to delete this page?'}).result.then(function()
						{
							communication.api('deletePage', {page_id:page_id}).then(function(json)
							{
								$scope.page_list.splice($index ,1);
								window.siteInfo.pages = $scope.page_list;
								if($scope.currentPageIndex > $index) {
									$scope.currentPageIndex--;
									$rootScope.$emit('changePageEvent', $scope.currentPageIndex);
								}
							});
							
								
						});
					}
					
				}
				$scope.savePage = function() {
					var item = $scope.page_list[$scope.currentPageIndex];
					var structure = pageEdit.getPageStructure();
					
					item.structure = structure;
					window.siteInfo.pages = $scope.page_list;
				}
				$scope.changePage = function(item, index)
				{
					if(index == $scope.currentPageIndex)
						return;
					$dialog.confirm(
					{
						title:window.t('LBL_CHANGE_PAGE_CONFIRM_TITLE'),
						message:window.t('LBL_CHANGE_PAGE_CONFIRM_MESSAGE')
					}).result.then(function(result)
					{
						$scope.savePage();
						pageEdit.changePage(item);
						$scope.currentPageIndex = index;
						$rootScope.$emit('changePageEvent', $scope.currentPageIndex);
					});
					
				}
				
			},
			size:'lg',
		});
	}
});
}());