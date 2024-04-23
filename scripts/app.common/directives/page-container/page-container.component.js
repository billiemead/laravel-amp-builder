pageContainerClass.$inject = ['$rootScope']
function pageContainerClass ($rootScope) {
  return {
    scope: {ngModel: '=ngModel'},
    link: function routeBodyClassLink (scope, elem) {
      
    },
    restrict: 'EA'
  }
}

export const PageContainerComponent = pageContainerClass
