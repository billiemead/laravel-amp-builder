export default function($window)
{
	"ngInject";
	function link(scope, element, attrs) {
		var w = angular.element($window);
		var fixed = attrs.imfixLeftHeight;
        function resize() {
			var body = $(element).parents('.modal-body');
			
            var window_height =  body.height();
			var hh = $('.image-categories',body).height();			
			var h = window_height - hh;
			if(fixed = 'absolute')
			{
				$(element).css('height', h);
			}
			else
				$(element).css('max-height', h);
        };
        w.bind('resize.imdialog', function () {
			resize();
        });
	}
	return {link:link};
}