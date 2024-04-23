export default function($scope, communication,$window,popup, pageEdit_font, $state,commonUtils, pageEdit_less, safeApply, $dialog, $uploader){
	"ngInject";
	communication.getList('icons').then( function(json)
	{
		$scope.iconList = json;
	});
	
	$scope.removeScheme = function(name){
		$dialog.confirm({
			title:'Confirm',
			message:'Are you sure to delete this font'
		}).result.then(function(json){
			if(json == 1){
				communication.api('removeIcon', {name:name}).then(function(json)
				{
					if(json == 1){
						delete $scope.iconList[name];
						pageEdit_font.removeFontTag(name);
					}
						
					else
						$dialog.message({
							title:'Error',
							message:json
						});
				});
			}
			
		});
		
		
	}
	$scope.editScheme = function(name)
	{
		var parentScope = $scope;
		var icon = $scope.iconList[name];
		popup.open({
			name:'iconDetail',
			controller : function($scope, $modalInstance)
			{
				"ngInject";
				$scope.data = icon;
				$scope.path = window.basePath  + 'themes/' + window.siteInfo.theme + '/fonts/' + icon.name + '/' + icon.file;// + '?' + new Date().getTime();
				console.log(icon);
				$scope.ok = function()
				{
					$modalInstance.close($scope.data);
				}
			}
		}).result.then(function(data)
		{
		})
	}
	$scope.editIcon = function(index)
	{
		
	}
	$scope.addIcon = function()
	{
		var uploader = new $uploader({
				filters : [
					{title : "Zip Archive", extensions : "zip"}						
				],
				url: getApiPath('uploadIconArchive'),
				onError: function(params)
				{
					console.log(params);
				},
				onUploadComplete : function(json)
				{
					if(json.files[0].response.result){
						var result = json.files[0].response.result;
						$scope.iconList[result.name] = result;
						pageEdit_font.addFontTag(result);
						communication.removeList('icons');
					}
					safeApply($scope);
				}
			});
			uploader.start();
	}
}