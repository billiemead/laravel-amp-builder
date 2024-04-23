export default function ($http, $rootScope) {
	"ngInject";
    return {
        restrict: 'A',
		scope: {
			src: '=src',
		  },
        template: '<div ng-include="include_src"></div>',
        link: function (scope, element, attrs, ngInclude) {
			scope.cacheUrl = attrs.src;
			scope.include_src = window.getPiwikAnalyticViewPath(attrs.src,$rootScope.site_id);
            scope.$on('dateChanged', function () {
				var newVal = $rootScope.date;
                if (newVal != undefined) {
					if(newVal.startDate && newVal.endDate){
						var startDate = newVal.startDate
						if (!moment.isMoment(newVal.startDate)) {
						  startDate = moment(newVal.startDate);
						}
						var endDate = newVal.endDate
						if (!moment.isMoment(newVal.endDate)) {
						  endDate = moment(newVal.endDate);
						}
						scope.include_src = window.getPiwikAnalyticViewPath(scope.cacheUrl,$rootScope.site_id)+ '&startDate='+startDate.format("YYYY-MM-DD")+ '&endDate='+endDate.format("YYYY-MM-DD");
					}
                }
                
            });
        }
    };
}