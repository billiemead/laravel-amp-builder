export default function($dialog, communication)
{
	"ngInject";
	this.open = function(settings)
	{
		var options = $.extend({}, 
		{
			extensions: 'jpeg, png, gif',
			url:getRelativeUrl() + 'api?path=asset&action=upload',
			overwrite : false,
		}, settings);
		return $dialog.open(
		{
			templateUrl:getApiPath('getHtml', 'content') + '&name=modules/image/file_uploader',
			controller: function($scope,$modalInstance)
			{
				"ngInject";
				$scope.ok = function()
				{
					$modalInstance.close($scope.uploadedFiles);
				};
				$scope.cancel = function()
				{
					$scope.ok();
				};
				$scope.identify = window.randomString();
				var browse_button = document.getElementById('image-upload-' + $scope.identify);
				$scope.hidden_browse_button = $('<button class="hidden-lg"></button>');
				$scope.hidden_browse_button.attr('id', 'hidden_browse_button' + $scope.identify);
				$('body').append($scope.hidden_browse_button);
				$scope.addFileItem = function()
				{
					var input = $scope.hidden_browse_button;
					input.trigger('click');
				};
				$scope.uploader = new plupload.Uploader({
					runtimes : 'gears,html5,flash,silverlight,browserplus',
					browse_button : 'hidden_browse_button' + $scope.identify,
					container : 'page',
					max_file_size : '10mb',
					url : options.url ,
					flash_swf_url : '../scripts/plupload/plupload.flash.swf',
					silverlight_xap_url : '../../scripts/plupload/plupload.silverlight.xap',
					multipart_params : {
						"YII_CSRF_TOKEN" : window.YII_CSRF_TOKEN,
					},
					//filters : [
					//	{title : "files", extensions : options.extensions},
					//	],
					//resize : {width : 320, height : 240, quality : 90}
				});
			
				$scope.uploader.init();
				$scope.uploader.bind('Error', function(up, error) {
				});
				
				$scope.uploader.bind('UploadComplete', function(up, files) {
					if($scope.onUploadComplete != undefined)
						$scope.onUploadComplete();
					$scope.ok();
				});
				$scope.files = [];
				$scope.formatSize = function(s)
				{
					return plupload.formatSize(s);
				};
				$scope.removeFile = function(file,$index)
				{
					if(!file.uploaded)
						$scope.files.splice($index, 1);
				};
				$scope.startUpload = function()
				{
					if($scope.files.length == 0)
						return;
					$scope.uploader.start();
				};
				$scope.uploader.bind('FilesAdded', function(up, files) {
					for(var i = 0;i < files.length, file=files[i];i++)
						$scope.files.push(file);
					$scope.$digest();
				});
				$scope.uploader.bind('UploadProgress', function(up, file) {
					var flag = 0;
					for(var i = 0;i < $scope.files.length;i++)
					{
						if($scope.files[i].id == file.id)
						{
							$scope.files[i].uploading = 1;
							$scope.files[i].deletable = 0;
							$scope.files[i].percent = file.percent;
							$scope.$digest();
						}
					}
				});
				$scope.uploadedFiles = [];
				$scope.uploader.bind('FileUploaded', function(up, file,response) {
					var r = $.parseJSON(response.response);
					$scope.uploadedFiles.push(r);
					if(typeof options.onFileUploaded == 'function')
					{
						options.onFileUploaded(r);
					}
					var flag = 0;
					for(var i = 0;i < $scope.files.length;i++)
					{
						if($scope.files[i].id == file.id)
						{
							$scope.files[i].uploaded = 1;
							$scope.files[i].deletable = 0;
							
							$scope.$digest();
						}
					}
					
				});
			}
		});
		
	}
}