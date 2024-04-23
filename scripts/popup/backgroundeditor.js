(function () { "use strict";
angular.module('ui.popup')
.service('popup_background_editor', ['popup', 'pageEdit_event', function(popup, pageEdit_event)
{
	this.open = function(background_element)
	{
		return popup.open({
			hasBackdrop:false,
			name:'backgroundeditor',
			controller: function($scope, $modalInstance,communication, $file_manager)
			{
				"ngInject";
				$scope.data = {};
				$scope.data.currentImage = '';
				var element = jQuery_iframe(background_element);
				var current_bg  = element.css('background-image');
				if(current_bg)
				{
					current_bg = StyleSheet.getBackgroundSrc(current_bg);
					$scope.data.currentImage = current_bg;
				}
				$scope.ok = function () {
					$modalInstance.close();
				};
				
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
			  	};
				$scope.removeBackground = function()
				{
					element.css('background-image','none');
					$scope.data.currentImage = 'none';
				};
				$scope.configBackground = function()
				{
					popup.open({
						name:'background_config',
						controller: function($scope, $modalInstance){
							"ngInject";
							$scope.data = {
								parallax: element.attr('data-stellar-background-ratio') != undefined
							};
							$scope.toogleParallax = function(){
								if($scope.data.parallax){
									element.attr('data-stellar-background-ratio', 0.5);
									jQuery_iframe.stellar();
								}
								else{
									element.removeAttr('data-stellar-background-ratio');
									jQuery_iframe.stellar('destroy');
								}
							}
							$scope.toogleOverlay = function(){
								
							}
							$scope.ok = function()
							{
								var valid  = validateVideoURL($scope.data);
								if(!valid){
									$scope.urlInvalid = true;
								}
								else
									$modalInstance.close($scope.data)
							}
						}
					}).result.then(function(json)
					{
						$scope.applyVideoBackground(json);
					});
				};
				$scope.browser = function()
				{
					$file_manager.open().result.then(function(images){
						if(images.length == 0)
						return;
						var image = images[0];
						$scope.applyImageBackground(image.full_url);
					});
				}
				$scope.applyImageBackground = function(src)
				{
					src = $.trim(src);
					if(src == undefined || src.length == 0) {
						element.css('background-image','');
					}
					else
						element.css('background-image','url(' +  src + ')');
					$scope.data.currentImage = src;
				}
				$scope.data.currentVideo = element.attr('data-video-bg');
				if($scope.data.currentVideo != undefined && $scope.data.currentVideo.length){
					$scope.data.currentVideoThumbnail = getVideoThumbnail($scope.data.currentVideo);
				}
				$scope.changeVideo = function()
				{
					var url = $scope.data.currentVideo
					popup.open({
						name:'videobg',
						controller: function($scope, $modalInstance){
							"ngInject";
							$scope.data = url;
							$scope.ok = function()
							{
								var valid  = validateVideoURL($scope.data);
								if(!valid){
									$scope.urlInvalid = true;
								}
								else
									$modalInstance.close($scope.data)
							}
						}
					}).result.then(function(json)
					{
						$scope.applyVideoBackground(json);
					});
				}
				function validateVideoURL(src){
					if(pageEdit_event.iframe.getWindow().parseEmbedURL != undefined){
						var obj = pageEdit_event.iframe.getWindow().parseEmbedURL(src);
						
						if(obj != undefined){
							return obj.stub.name == 'YouTube' || obj.stub.name == 'Vimeo';
						}
					}
				}
				function getVideoThumbnail(src){
					if(pageEdit_event.iframe.getWindow().parseEmbedURL != undefined){
						var obj = pageEdit_event.iframe.getWindow().parseEmbedURL(src);
						if(obj != undefined){
							return obj.getImageThumbnail();
						}
					}
				}
				$scope.removeVideoBackground = function()
				{
					var currentVideoElement = element.children('.mb_YTPlayer');
					if(currentVideoElement.length && currentVideoElement.YTPPlayerDestroy){
						currentVideoElement.YTPPlayerDestroy();
						currentVideoElement.remove();
					}
					var currentVideoElement = element.children('.vimeo_Player');
					if(currentVideoElement.length && currentVideoElement.vimeo_player_destroy){
						currentVideoElement.vimeo_player_destroy();
						currentVideoElement.remove();
					}
					
					element.removeAttr('data-video-bg');
					delete $scope.data.currentVideoThumbnail;
				}
				$scope.applyVideoBackground = function(src)
				{
					src = $.trim(src);
					if(src == undefined || src.length == 0) {
						
						$scope.removeVideoBackground();
					}
					else{
						$scope.removeVideoBackground();
						$scope.data.currentVideoThumbnail = getVideoThumbnail(src);
						element.attr('data-video-bg', src);
						pageEdit_event.iframe.getWindow().initBackgroundVideo(element);
						$scope.data.currentVideo = src;
					}
					
				}
				$scope.data.position = element.css('background-position');
				$scope.changePosition = function()
				{
					element.css('background-position',$scope.data.position);
				};
				$scope.data.scaling = element.css('background-repeat');
				$scope.changeScaling = function()
				{
					element.css('background-repeat',$scope.data.scaling);
				};
				$scope.data.color = element.css('background-color');
				if($scope.data.color == 'transparent') {
					$scope.data.color = "";
				}
				$scope.changeColor = function()
				{
					StyleSheet.setStyle(element, 'background-color',$scope.data.color);
				};
			}
		});
	}
}]);
}());