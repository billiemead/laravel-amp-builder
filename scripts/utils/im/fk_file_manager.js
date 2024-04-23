export default function(popup, communication,FileManagerAppService, safeApply){
	"ngInject";
	this.open = function(settings){
		FileManagerAppService.open({
			name:'fk_file_manager'
		});
	}
}