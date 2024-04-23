var plupload = require('plupload');
export default function($upload_progress, PluploadHelper){
	"ngInject";
	return function(options)
	{
		this.options = options;
		
		this.createUploadProgress = function(up, files)
		{
			if(this.uploadProgress){
				delete this.uploadProgress;
			}
			this.uploadProgress = new $upload_progress(up, files);
			this.uploadProgress.open();
		};
		this.closeUploadProgress = function()
		{
			this.uploadProgress.close();
		}
		this.changeProgress = function(file)
		{
			this.uploadProgress.changeProgress(file);
		};
		this.destroy = function()
		{
			
		}
		this.buildUrl = function(options)
		{
			var qs = [];
			if(!options)
				return;
			var url = options.url;
			if( angular.isDefined(options.folder))
				qs.push('f=' + options.folder);
			if(angular.isDefined(options.new_name))
				qs.push('n=' + options.new_name);
			if(angular.isDefined(options.overwrite) && options.overwrite)
				qs.push('overwrite=1');
			if(qs.length)
				url += '?' + qs.join('&');
			return url;
			
		}
		this.setOptions = function(options)
		{
			this.options = $.extend({}, this.options, options);
			for(var i in options){
				var oldOption = this.uploader.getOption(i);
				if(!(oldOption == options[i]))
					this.uploader.setOption(i, options[i]);
			}
			this.uploader.setOption('url', this.buildUrl(options));
		}
		this.start = function(button)
		{
			var that = this;
			var id, btn;
			if(button != undefined){
				id = $(button).attr('id');
			}
			else{
				id = 'button_' + randomString();
				btn = $('<button></button>');
				btn.css('visibility', 'hidden');
				$('body').append(btn);
			}
			var browse_button = button || btn;
			browse_button = browse_button[0];
			
			var options = $.extend(true, {},{
					browse_button : browse_button,
					container : 'page',
					overwrite : false,
					max_file_size : '10mb',
					flash_swf_url: 'moxie/Moxie.swf',
					silverlight_xap_url: 'moxie/Moxie.xap',
					multipart_params : {
						"_token" : window.X_CSRF_TOKEN,
					},
					headers:{
						'X-Requested-With': 'XMLHttpRequest',
						'Authorization': 'Bearer ' + window.localStorage.satellizer_token,
					}
				}, this.options,{url: url}
			)
			var meta = $('meta[name="bypass_fastcgi"]')
			if(meta.length) {
				var metaContent = meta.attr('content');
				options.headers[metaContent] = options.headers.Authorization
			}
			options = PluploadHelper.config(options);
			var url = this.buildUrl(options);
			
			var opts = $.extend(options, {url:url});
			this.uploader = new plupload.Uploader(opts);
			this.uploader.init();
			var that = this;
			this.uploader.bind('Error', function(up, error) {
				console.log('Uploader Error', error);
				if(btn != undefined)
					btn.remove();
				if(angular.isDefined(that.options.onError))
					that.options.onError({error:error});
			});
			this.uploader.bind('Browse', function(up) {
				
			});
			this.uploader.bind('FileUploaded', function(up, file, response) {
				var r = $.parseJSON(response.response);
				file.response = r;
				if(angular.isDefined(that.options.onFileUploaded))
					that.options.onFileUploaded({file:file,response:response});
				
			});
			

			this.uploader.bind('UploadComplete', function(up, files, response) {
				if(btn != undefined)
					btn.remove();
				up.trigger('CloseProgress');
				
				if(angular.isDefined(that.options.onUploadComplete))
					that.options.onUploadComplete({files:files, response: response});
			});
			
			this.uploader.bind('FilesAdded', function(up, files) {
				 up.start();
				 
				 that.createUploadProgress(up,files);
				 if(angular.isDefined(that.options.onFilesAdded))
					that.options.onFilesAdded({files:files});
			});
			
			this.uploader.bind('UploadProgress', function(up, file) {
				that.changeProgress(file);
				if(angular.isDefined(that.options.onUploadProgress))
					that.options.onUploadProgress({file:file});
			});
			if(btn != undefined){
				btn.trigger('click');
			}
			
		}
	}
}