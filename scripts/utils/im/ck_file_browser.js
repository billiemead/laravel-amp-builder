export default function($file_manager)
{
	"ngInject";
	this.open = function(settings)
	{
		return $file_manager.open({
			windowClass:'ck_file_browser_wnd_class',
			backdropClass:'ck_file_browser_bdr_class',
		});
	}
}