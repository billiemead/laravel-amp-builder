export default function(pageEdit,$rootScope)
{
	"ngInject";
	this.destroy = function()
	{
	};
	//load editting site into an iframe
	this.load = function()
	{
		var edit_page = $('iframe#edit_page');
		
		if(edit_page.length == 0)
		{
			var src = $('#edit_page_meta').attr('data-src');
			edit_page = $('<iframe id="edit_page" name="edit_page"></iframe');
			
			edit_page.attr('src', src);
			$('#edit_page_meta').after(edit_page);
			var that = this;
			$('#iframe_loadingSpinner').show();
			edit_page.on('load', function() 
			{
				pageEdit.init(window.edit_page);
				that.loadCompleted();	
				that.init();
			});
		}
		else
		{
			pageEdit.init(window.edit_page);
			this.init();
		}
	};
	//function run when iframe loaded.
	//just call unblockUI to unblock page and load document stylesheets which needed for builder
	this.loadCompleted = function()
	{
		$('#iframe_loadingSpinner').hide();
		//$('#edit_page').unblock();
		$rootScope.child_load_completed = true;
		return;
		
	};
	this.init = function()
	{
		var that = this;
		console.log('iframeLoaded');
		$rootScope.$emit('iframeLoaded');
	};
	
	this.afterInit = function()
	{
		
	};
	
}