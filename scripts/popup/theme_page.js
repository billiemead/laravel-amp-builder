(function () { "use strict";

angular.module('ui.popup')
.service('popup_page', ['communication','popup_form','$templateCache','popup', 'pageEdit','$rootScope','$controller', function(communication,popup_form,$templateCache,popup, pageEdit, $rootScope, $controller)
{
	this.pagePopupController = function($scope, $modalInstance, popup_section_list, commonUtils)
	{
		//$scope.data = angular.copy(item || {});
		//$scope.data.is_new = false;
		//console.log($scope.data);
		$scope.data = $.extend(true, {structure:{header:[], sections:[], footer:[]}}, $scope.data );
		$scope.ok = function()
		{
			$modalInstance.close($scope.data);
		}
		$scope.removeSection = function(arr,index)
		{
			arr.splice(index, 1);
		}
		$scope.addSection = function(arr)
		{
			popup_section_list.open({
			}).result.then(function(data){
				if(data == undefined)	return;
				arr.push(data);
			});
		}
		$scope.moveUp = function(arr, index)
		{
			commonUtils.moveArray(arr, index, index - 1);
		}
		$scope.moveDown = function(arr, index)
		{
			commonUtils.moveArray(arr, index, index + 1);
		}
	}
	this.addPage = function()
	{
		var that = this;
		return popup.open({
			name:'theme_page/edit',
			controller: function($scope,$modalInstance)
			{
				"ngInject";
				$scope.data = {name:'newpage', structure:{header:[], sections:[], footer:[]}};
				$scope.data.is_new = true;
				$controller(that.pagePopupController, {'$scope': $scope, '$modalInstance':$modalInstance});
			}
		});
	}
	this.open = function(opt)
	{
		opt = opt || {};
		var that = this;
		return popup.open(
		{
			name:'theme_page',
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
						data = checkNewPage(data);
						communication.api('savePage', data).then(function(json)
						{
							$scope.page_list.push(data);
							window.siteInfo.pages = $scope.page_list;
						});
						
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
					var clone = angular.copy($scope.page_list[index]);
					delete clone.id;
					clone.name = $scope.page_list[index].name + '_copy';
					clone = checkNewPage(clone);
					communication.api('clonePage', {source:$scope.page_list[index].name, dest:clone.name}).then(function(json)
					{
						clone.id = json;
						$scope.page_list.push(clone);
						window.siteInfo.pages = $scope.page_list;
					});
					
					
				}
				$scope.editPage = function(item)
				{
					return popup_form.open({
						name:'theme_page/edit',
						controller: function($scope, $modalInstance)
						{
							"ngInject";
							$scope.data = angular.copy(item || {});
							$scope.data.oldName = item.name;
							$scope.data.is_new = false;
							$controller(that.pagePopupController, {'$scope': $scope, '$modalInstance':$modalInstance});
							
						}
					}).result.then(function(data)
					{
						var index = $scope.page_list.indexOf(item);
						data = checkNewPage(data, index);
						communication.api('savePage', data).then(function(json)
						{
							$scope.page_list[index] = $.extend({}, $scope.page_list[index], checkNewPage(data, index));
							window.siteInfo.pages = $scope.page_list;
						});
						
					})
				}
				$scope.deletePage = function($event, item,$index)
				{
					if($index != $scope.currentPageIndex) {
						var name = $scope.page_list[$index].name
						$dialog.confirm({title:'Delete Page?',message:'Are you sure to delete this page?'}).result.then(function()
						{
							communication.api('deletePage', {name:name}).then(function(json)
							{
								$scope.page_list.splice($index ,1);
								window.siteInfo.pages = $scope.page_list;
								
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
}]);
}());