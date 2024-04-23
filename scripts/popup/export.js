(function () { "use strict";
angular.module('ui.popup')
.service('popup_export', ['communication','popup',function(communication,popup)
{
	this.open = function(opt)
	{
		opt = opt || {};
		return popup.open(
		{
			name:'export',
			controller: function($scope,$modalInstance, $dialog)
			{
				var siteData = opt.data || {};
				communication.getList('FtpConnection').then(function(data) {
					$scope.connectionList = data;
					
				});
				
				$scope.data = {};
				$scope.data.mod = 'zip';
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				}
				$scope.ok = function () {
					$modalInstance.close(1);
				}
				$scope.connectFtp = function() {
					communication.api('connectFtp',$scope.data, 'export').then(function(data) {
						$dialog.message({message:window.t('LBL_CONNECTION_SUCESSFULL_MESSAGE'), title:window.t('LBL_CONNECTION_SUCESSFULL')});
					}, function(data)
						{
							$scope.errors = data.message;
							return data;
						});
				}
				$scope.browsed = false;
				$scope.browseFtp = function(path) {
					$scope.browsed = true;
					if(path) {
						$scope.browe_folder = path;
						$scope.data.folder = path;
					}
					
					var data = $.extend({}, $scope.data);
					data.folder = path;
					communication.api('browseFtp',data, 'export').then(function(data) {
						if(data.folders!= undefined)
							$scope.folders = data.folders;
					}, function(data)
					{
						$scope.errors = data.message;
						//return data;
					});
				}
				$scope.currentConnectionId = 0;
				$scope.setConnection = function(connection) {
					$scope.data.host_name = connection.data.host_name;
					$scope.data.username = connection.data.username;
					$scope.data.password = connection.data.password;
					$scope.data.port = connection.data.port;
					$scope.data.ssl = connection.data.ssl;
					$scope.data.folder = connection.data.folder;
					$scope.currentConnectionId = connection.id;
					
				}
				$scope.saveFtp = function() {
					var data = $.extend({}, $scope.data);
					delete data.mod;
					data.id = $scope.currentConnectionId;
					communication.api('saveFtp',data, 'export').then(function(data) {
						if($scope.currentConnectionId == 0) {
							$scope.connectionList.push(data);
							$scope.setConnection(data);
						}
						else {
							for(var i in $scope.connectionList) {
								if(!$scope.connectionList[i])	continue;
								if($scope.connectionList[i].id == $scope.currentConnectionId) {
									$scope.connectionList[i] = data;
								}
							}
						}
					}, function(data)
						{
							$scope.errors = data.message;
							//return data;
						});
				}
				$scope.deleteFtp = function() {
					communication.api('deleteFtp',{id:$scope.currentConnectionId}, 'export').then(function(data) {
						for(var i in $scope.connectionList) {
							if(!$scope.connectionList[i])	continue;
							if($scope.connectionList[i].id == $scope.currentConnectionId) {
								$scope.connectionList[i].splice(i,1);
							}
						}
					});
				}
				$scope.export = function () {
					if($scope.data.mod == 'zip') {
						var url = getApiPath('exportZip', 'path=export');
						var form = $('<form method="post" target="_blank" action="' + url + '"></form>');
						for (var key in siteData) {
							if (siteData.hasOwnProperty(key)) {
								var hiddenField = $('<input>');
								hiddenField.attr("type", "hidden");
								hiddenField.attr("name", key);
								if(typeof siteData[key] === 'object'){
									hiddenField.attr("value", JSON.stringify(siteData[key]));
								}
								else{
									hiddenField.attr("value", siteData[key]);
								}
								form.append(hiddenField);
							}
						}
						$('body').append(form);
						//$('#loadingSpinner').show();
						form.submit();
					}
					else if($scope.data.mod == 'ftp') {
						var $parentScope = $scope;
						popup.open({
							name:'selectuploaditem',
							controller: function($scope, $modalInstance) {
								$scope.export_assets = [];
								$scope.export_pages = [];
								$scope.include_theme = true;
								$scope.include_image = true;
								communication.api('getUploadItems').then(function(data) {
									if(data.export_assets)
										$scope.export_assets = data.export_assets;
									if(data.export_pages)
										$scope.export_pages = data.export_pages;
									if(data.export_styles)
										$scope.export_styles = data.export_styles;
		
								})
								function exportAssets() {
									var _continue = false;
									if($scope.include_theme) {
										communication.api('exportTheme',{ftpData :$parentScope.data}, 'export').then(function(data) {
											exportAssets()
										}, function(data) {
											$modalInstance.dismiss('cancel');
											$parentScope.errors = data.message;
										});
										return;
									}
									
									if($scope.include_image) {
										communication.api('exportImage',{ftpData :$parentScope.data}, 'export').then(function(data) {
											exportAssets()
										}, function(data) {
											$modalInstance.dismiss('cancel');
											$parentScope.errors = data.message;
										});
										return;
									}
									for(var i in $scope.export_assets) {
										if($scope.export_assets[i].checked && !$scope.export_assets[i].uploaded) {
											$scope.export_assets[i].uploading = true;
											communication.api('exportAsset',{ftpData :$parentScope.data, realname:$scope.export_assets[i].realname}, 'export').then(function(data) {
												$scope.export_assets[i].uploaded = true;
												$scope.export_assets[i].uploading = false;
												exportAssets()
											}, function(data) {
												$modalInstance.dismiss('cancel');
												$parentScope.errors = data.message;
											});
											return;
										}
									}
									for(var i in $scope.export_pages) {
										if($scope.export_pages[i].checked && !$scope.export_pages[i].uploaded) {
											$scope.export_pages[i].uploading = true;
											communication.api('exportPage',{ftpData :$parentScope.data, name:$scope.export_pages[i].name}, 'export').then(function(data) {
												$scope.export_pages[i].uploaded = true; 
												$scope.export_pages[i].uploading = false;
												exportAssets();
											}, function(data) {
												$modalInstance.dismiss('cancel');
												$parentScope.errors = data.message;
											});
											return;
										}
									}
									for(var i in $scope.export_styles) {
										if($scope.export_styles[i].checked && !$scope.export_styles[i].uploaded) {
											$scope.export_styles[i].uploading = true;
											communication.api('exportStyle',{ftpData :$parentScope.data, name:$scope.export_styles[i].name}, 'export').then(function(data) {
												$scope.export_styles[i].uploaded = true; 
												$scope.export_styles[i].uploading = false;
												exportAssets();
											}, function(data) {
												$modalInstance.dismiss('cancel');
												$parentScope.errors = data.message;
											});
											return;
										}
									}
									$dialog.message({message:window.t('LBL_UPLOAD_SUCESSFULL_TITLE'), title:window.t('LBL_UPLOAD_SUCESSFULL_MESSAGE')});
								}
								$scope.ok = function()
								{
									exportAssets();
									
								}
							}
						}).result.then(function() {
						});
					}
					
				}
				
				
			},
		});
	}
}]);
}());