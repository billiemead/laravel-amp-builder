export default function($scope,API,$state, $stateParams, popup, $dialog) {
	"ngInject";
	$scope.filterCategory = function( criteria ) {
        return function( item ) {
			var type = $scope.data.type;
			if(type == 'global_section')
				type = 'section';
            return type != undefined && item[type] != undefined &&  item[type] == 1;
        };
    };
	API.all("theme_category").getList().then(function(json) {
		$scope.themes_categories = angular.copy(json);
	});
	
	
}