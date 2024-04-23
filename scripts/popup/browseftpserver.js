(function () { "use strict";
angular.module('ui.popup')
.service('popup_browseftpserver', ['communication','popup',function(communication,popup)
{
	this.open = function(opt)
	{
		return popup.open(
		{
			name:'browseftpserver',
			controller: function($scope,$modalInstance)
			{
				
				$scope.data = {};
				$scope.data.mod = 'zip';
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				}
				$scope.ok = function () {
					$modalInstance.close(1);
				}
				$scope.connectFtp = function() {
					communication.api('connectFtp',$scope.data).then(function(data) {
						if(data.folders!= undefined)
							$scope.folders = data.folders;
					});
				}
				$scope.currentConnectionId = 0;
				$scope.setConnection = function(connection) {
					$scope.data.host_name = connection.data.host_name;
					$scope.data.username = connection.data.username;
					$scope.data.password = connection.data.password;
					$scope.data.port = connection.data.port;
					$scope.data.ssl = connection.data.ssl;
					$scope.currentConnectionId = connection.id;
					
				}
				$scope.saveFtp = function() {
					var data = $.extend({}, $scope.data);
					delete data.mod;
					data.id = $scope.currentConnectionId;
					communication.api('saveFtp',data).then(function(data) {
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
					});
				}
				$scope.deleteFtp = function() {
					communication.api('deleteFtp',{id:$scope.currentConnectionId}).then(function(data) {
						for(var i in $scope.connectionList) {
							if(!$scope.connectionList[i])	continue;
							if($scope.connectionList[i].id == $scope.currentConnectionId) {
								$scope.connectionList[i].splice(i,1);
							}
						}
					});
				}
				$scope.export = function () {
					communication.ajaxCall('export',$scope.data).then(function(data) {
						
						if(data.zip != undefined){
							// window.open(data.zip,  '_blank');
							var iframe = $('<iframe style="display:none;" src="' + data.zip + '"></iframe>');
							$('body').append(iframe);
							$('#loadingSpinner').show();
							iframe.load(function()
							{
								$modalInstance.dismiss('cancel');
								$('#loadingSpinner').hide();
							})
						}
					});
					
					
				}
				
				
			},
		});
	}
}]);
}());