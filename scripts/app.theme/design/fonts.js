export default function($scope, communication,$window,popup, pageEdit_font, $state,commonUtils, pageEdit_less, safeApply, $dialog, $uploader, $http, popup_google_font_browser){
	"ngInject";
	communication.getList('fonts').then( function(json)
	{
		$scope.fontList = json;
	});
	
	$scope.removeScheme = function(index){
		$dialog.confirm({
			title:'Confirm',
			message:'Are you sure to delete this font'
		}).result.then(function(json){
			if(json == 1){
				communication.api('removeFont', {index:index}, 'theme').then(function(json)
				{
					if(json == 1){
						$scope.fontList.splice(index, 1)
						pageEdit_font.removeFontTag(index);
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
	$scope.editScheme = function(index)
	{
		var parentScope = $scope;
		var font = $scope.fontList[index];
		popup.open({
			name:'fontDetail',
			controller : function($scope, $modalInstance)
			{
				"ngInject";
				$scope.data = icon;
				$scope.path = window.basePath  + 'themes/' + window.siteInfo.theme + '/fonts/' + font.file;// + '?' + new Date().getTime();
				$scope.ok = function()
				{
					$modalInstance.close($scope.data);
				}
			}
		}).result.then(function(data)
		{
		})
	}
	$scope.browseGoogleFont = function()
	{
		popup_google_font_browser.open().result.then(function(name)
		{
			if(name != undefined){
				communication.api('addGoogleFont', {name:name}, 'theme').then(function(json)
				{
					$scope.fontList.push(json);
				})
			}
		});
		return;
		
	}
	$scope.addFont = function()
	{
		var uploader = new $uploader({
				filters : [
					{title : "Zip Archive", extensions : "zip"}						
				],
				url: getApiPath('uploadFontArchive', 'theme'),
				onError: function(params)
				{
					console.log(params);
				},
				onUploadComplete : function(json)
				{
					if(json.files[0].response.result){
						var result = json.files[0].response.result;
						$scope.fontList.push(result);
						pageEdit_font.addFontTag(result);
						communication.removeList('fonts');
					}
					safeApply($scope);
				}
			});
			uploader.start();
	}
}