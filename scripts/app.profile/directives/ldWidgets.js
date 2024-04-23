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
			scope.loadedTime = new Date().getTime();
			scope.include_src = window.getAnalyticViewPath(attrs.src,$rootScope.site_id) + '&cache='+ scope.loadedTime;
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
						scope.include_src = window.getAnalyticViewPath(scope.cacheUrl,$rootScope.site_id)+ '&startDate='+startDate.format("YYYY-MM-DD")+ '&endDate='+endDate.format("YYYY-MM-DD") + '&cache='+ scope.loadedTime;
					}
                }
                
            });
        }
    };
}