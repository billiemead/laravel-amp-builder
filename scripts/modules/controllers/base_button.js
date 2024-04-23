export default function($file_manager,$dialog, safeApply, pageEdit, pageEdit_layout) 
{
	"ngInject";
	
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.range = function(n) {
			return new Array(n);
		};
		$scope.changeData = function(updateView = false)
		{
			$scope._changeData($scope.data, updateView);
		}
		function getPopupList(type = 'lightbox'){
			var rs = {};
			if(!jQuery_iframe)
				return;
			var bodyModule = pageEdit.getBodyModule();
			if(!bodyModule){
				return;
			}
			var popupList = bodyModule.getPopupList();
			for(var i in popupList)
			{
				var popup = popupList[i];
				if(popup.getPopupType() == type){
					var id = popup.getPage_id();
					rs[id] = {id:id, name: popup.getDisplayName()};
				}
			};
			return rs;
		}
		$scope.data.actionType = $scope.data.actionType || 'none';
		$scope.popups = getPopupList();
		$scope.sidebars = getPopupList('sidebar');
		$scope.pages = window.siteInfo.pages || [];
		safeApply($scope);
		
	};
	
};
