export default function($upload_progress, $dialog, $uploader)
{
	"ngInject";
	var linkFn = function(scope, element, attrs)
	{
		var uploader = new $uploader;
		uploader.start(element);
		if(scope.uploadOptions != undefined){
			uploader.setOptions(scope.uploadOptions);
		}
		scope.$watch('uploadOptions', function(value){
			if(value){
				uploader.setOptions(value);
			}
		});
		
	}
	return {
		scope:{
			'uploadOptions': '=',
		},
		link:linkFn,
	};
}