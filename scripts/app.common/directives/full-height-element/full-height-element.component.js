fullHeightElement.$inject = ['$window']
function fullHeightElement ($window) {
  return {
  //  scope: {ngModel: '=ngModel'},
    link: function(scope, element)
			{
				var resize = function()
				{
					var e = angular.element(element);
					if(e.children().length == 0)
					{	
						//e.css('height', '');	
						//return;
					}
					var w = angular.element($window);
					
					
					var window_height = w.height();
					var element_top = e.offset().top;
					var element_height = window_height - element_top;
					e.css('height', element_height);
				}
				resize();
				angular.element($window).on('resize', resize);
				element.on('$destroy', function(){
					angular.element($window).off('resize', resize);
			  })
			},
    restrict: 'EA'
  }
}

export const FullHeightElementComponent = fullHeightElement
