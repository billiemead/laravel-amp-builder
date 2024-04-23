export default function($rootScope,$scope,pageEdit, popup_page, popup_pagehistory,popup, $dialog, pageEdit_undoManager, pageEdit_event, safeApply, pageEdit_layout, API, $mdSidenav)
{
	"ngInject";
	// Get page list
	$scope.page_list = [];
	window.siteInfo.pages = window.siteInfo.pages || [{name:'index'}];
	
	$scope.currentPageIndex = 0;
	$scope.page_name = '';
	var that = this;
	$scope.managePages = function()
	{
		popup_page.open({
			currentPageIndex:$scope.currentPageIndex
		});
	}
	$scope.addPage = function()
	{
		popup_page.addPage();
	}
	// Save function, execute when user click Save Button
	$scope.save = function()
	{
		var bodyModule = pageEdit.getBodyModule();
		return bodyModule.save();
	};
	$scope.history = function()
	{
		popup_pagehistory.open({
			currentPageIndex:$scope.currentPageIndex
		});
	}
	
	$scope.toogleRightPanel = function()
	{
		$mdSidenav('rightPanel').toggle();
	}
	$scope.canUndo = pageEdit_undoManager.manager.canUndo();
	$scope.canRedo = pageEdit_undoManager.manager.canRedo();
	$scope.doUndo = function(){
		pageEdit_undoManager.manager.undo();
	}
	$scope.doRedo = function(){
		pageEdit_undoManager.manager.redo();
	}
	pageEdit_undoManager.manager.onchange = function()
	{
		$scope.canUndo = pageEdit_undoManager.manager.canUndo();
		$scope.canRedo = pageEdit_undoManager.manager.canRedo();
		safeApply($scope);
	}
}