export default function($dialog, popup)
{
	"ngInject";
	return function(up, files)
	{
		this.uploader = up;
		
		this.open = function()
		{
			var that = this;
			this.modalInstance = popup.open({
				template : require('./templates/upload_progress.tmpl'),
				controller:function($scope, $modalInstance)
				{
					"ngInject";
					$scope.files = files;
					that.uploader.unbind('CloseProgress');
					that.uploader.bind('CloseProgress', function(up, files) {
						$scope.$dismiss();
						
					});
					for(var i = 0;i < $scope.files.length;i++)
					{
						$scope.files[i].progress = 0;
					}
					$scope.cancel = function()
					{
						that.uploader.unbind('CloseProgress');
						$modalInstance.cancel();
					}
				}
			});
			return this.modalInstance;
		};
		this.changeProgress = function(file)
		{
		}
		this.close = function(file)
		{
		}
	}
}