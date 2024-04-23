responsiveElement.$inject = ['$window']
function responsiveElement ($window) {
  return {
  //  scope: {ngModel: '=ngModel'},
    link: function(scope, element)
	{
		var img = $(element).children('img');
		img.load(function(){
			var parentWidth = $(this).parent().width();
			var height = parentWidth * 8 / 16;
			$(this).parent().height(height);
		})
		
	},
    restrict: 'EA'
  }
}

export const ResponsiveElementComponent = responsiveElement
