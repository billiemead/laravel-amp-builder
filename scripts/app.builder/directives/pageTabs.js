var widgetFunction = require('../../app.builder/directives/widgetModule');

export default function(pageEdit, pageEdit_event, $rootScope, API, safeApply, popup)
{
	"ngInject";
	return {
		template:require('./pageTabs.tmpl'),
		controller: function($scope, $element, $attrs){
			"ngInject";
			$scope.popups = {};
			$(window).off('changePageTab.pageTabs');
			$(window).on('changePageTab.pageTabs', function(event, n){
				$scope.currentPageTab = n;
				safeApply($scope);
			});
			function changeEditType(current)
			{
				var bodyModule = pageEdit.getBodyModule();
				if(bodyModule){
					bodyModule.changeEditTab(current);
				}
			}
			
			$scope.changePage = changeEditType;
			function refreshPopupList(change){
				if(!jQuery_iframe)
					return;
				var bodyModule = pageEdit.getBodyModule();
				if(!bodyModule){
					return;
				}
				$scope.popups = {};
				var popupList = bodyModule.getPopupList();
				for(var i in popupList)
				{
					var popup = popupList[i];
					var id = popup.getPage_id();
					$scope.popups[id] = {id:id, name: popup.getDisplayName()};
						
				};
			}
			function addNewPopup(module)
			{
				$scope.popups[module.getPage_id()] = {id:module.getPage_id(), name: module.getDisplayName()};
				$rootScope.currentEditTab = module.getPage_id();
				$scope.currentEditTab = module.getPage_id();
				changeEditType($rootScope.currentEditTab);
				safeApply($scope);
			}
			var that = this;
			$rootScope.$on('iframeLoaded', function(e, n){
			if(that.iframeLoadedHandled)	return;
				that.iframeLoadedHandled = true;
				pageEdit_event.on(pageEdit_event.MODULE_CREATING_COMPLETED, function(event, params)
				{
					if(params.module.getType() == 'popup' && params.module.is_new_inserted_element){
						addNewPopup(params.module);
					}
					else if(params.module.is_new_inserted_element){
						if(params.module.isInsertedByDragDrop())
							params.module.doSelect();
					}
				});
				pageEdit_event.on(pageEdit_event.BLOCK_REMOVED, function(event, params)
				{
					refreshPopupList();
					$rootScope.currentEditTab = 'main';
					$scope.currentEditTab = 'main';
					changeEditType('main');
				});
			});
			$rootScope.$on('editorReady', function(e, n){
				refreshPopupList();
			});
			$scope.add_popup = function(type)
			{
				var bodyModule = pageEdit.getBodyModule();
				return bodyModule.addPopup();
				
				
			}
			function addNewPopup(module)
			{
				$scope.popups[module.getPage_id()] = {id:module.getPage_id(), name: module.getDisplayName()};
				$rootScope.currentEditTab = module.getPage_id();
				$scope.currentEditTab = module.getPage_id();
				changeEditType($rootScope.currentEditTab);
				safeApply($scope);
			}
			$scope.add_section = function()
			{
				var visible_sections = pageEdit.getBodyModule().getSectionInViewport();
				if(visible_sections && visible_sections.length)
					visible_sections[0].addNew();
			
			}
		}
	}
}
