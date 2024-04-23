export default function($scope,API, $dialog,$file_manager) {
	"ngInject";
	$scope.gridInstance = {};
	$scope.deleteCategories = function(id) {
		$dialog.confirm({
			title: window.t("LBL_DELETE_POST_CATEGORIES_TITLE"),
			message: window.t("LBL_DELETE_POST_CATEGORIES_MESSAGE"),
		}).result.then(function(result){
			if(result == 1) {
				API.one('theme_category', id).remove().then(function(json)
				{
					if(json == 1) {
						$scope.gridInstance.instance.reloadData();
					}
					else {
						$scope.errors = json;
					}
					
				});
			}
		});;
	}
}