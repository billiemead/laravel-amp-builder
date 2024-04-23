var controller = require('../../app.builder/controllers/header').default;
export default function($rootScope,$scope,pageEdit, popup_page, popup_templatehistory, popup, $dialog, pageEdit_undoManager, pageEdit_event, safeApply, pageEdit_layout, API, $controller)
{
	"ngInject";
	$scope.page_list = [];
	$controller(controller, {$scope: $scope});
	
	
	$scope.history = function()
	{
		popup_templatehistory.open({
			//currentPageIndex:$scope.currentPageIndex
		});
	}
	$scope.manageScreenshot = function()
	{
		var that = this;
		popup.open({
			name:'template_screenshot',
			controller: function($scope, $uploader)
			{
				"ngInject";
				var basePath = window.siteInfo.screenshot;
				$scope.path = basePath;
				var module = that;
				$scope.upload_options = {
					url: getApiPath('') + '/screenshot/upload',
					onUploadComplete : function(response)
					{
						$scope.path = basePath  + '?' + new Date().getTime();
						$scope.$apply();
					}
				}
				
				$scope.takeScreenshot = function()
				{
					if(window.screenshot_handler == 'javascript')
					{
						var controlModule = pageEdit.getBodyModule().getControlModule();
						if(controlModule)
						pageEdit.getChilrenIframe().captureScreenshot(controlModule.getElement()).then(canvas => {
							var img = canvas.toDataURL("image/jpg");
							API.service('screenshot').post({image:img}).then(function(response){
								$scope.path = basePath  + '?' + new Date().getTime();
							});
						});
					}
					else
						API.service('screenshot').post({}).then(function(response){
							$scope.path = basePath  + '?' + new Date().getTime();
						});
				}
			}
		});
	}
	
}