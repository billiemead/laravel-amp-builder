export default function($dialog, communication,$file_uploader, popup, $cacheFactory, $_file_manager)
{
	"ngInject";
	this.open = function(settings){
		return $_file_manager.open($.extend({}, {
			limited_size_upload: true,
			onlyImage: true,
			tabs:
			[
				'myfiles', 
				'libraries',
				
			],
			
		}, settings));
	};
}