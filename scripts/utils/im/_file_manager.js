export default function($dialog, communication,$file_uploader, popup, $cacheFactory, $uploader, API, $q, safeApply, $controller, $compile, $rootScope)
{
	"ngInject";
	this.open = function(settings)
	{
		var backitem ='<div  class="item back_item col-md-4"><div class="thumbnail"><a href="javascript:void(0);"></a></div><div class="name"></div></div>';
		
		var options = $.extend({}, 
		{
			multiSelection:false,
			tabs:
			[
				'myfiles', 
				'libraries',
				
				//'themes',
				//'link'
			],
			footerTabs:
			{
				'myfiles' :
				{
					icon:'fa fa-user', 
					name: t('filemanager.myfiles'), 
					url:  '/', 
					manage:true, 
					upload_url: getApiPath() + '/file',
					newfolder_url: 'new_folder', 
					deleteItems_url: 'delete', 
					deletefolder_url: 'delete_folder', 
				},
				'libraries_icon':{icon:'fa fa-image', name: t('filemanager.libraryfiles'), url:  'libraries_icon'},
				'libraries':{icon:'fa fa-image', name: t('filemanager.libraryfiles'), url:  'libraries'},
				'themes':{icon:'fa fa-tachometer', name: t('filemanager.themefiles'), url:  getApiPath('getThemeList', 'asset')},
				'link':{icon:'fa fa-link', name: t('filemanager.linkfiles')},
			},
			extensions:['png','jpg','gif'],
			sortname: 'name',
			sortorder: 'asc',
			rp:10,
			sp: 1,
		}, settings);
		
		var imageTypes = ['png','jpg','gif'];
		var audioTypes = ['mp3', 'oga', 'wav', 'mid', 'midi'];
		var videoTypes = ['mp4', 'm4v', 'ogg', 'ogv', 'webm', 'flv', 'mpeg', 'mov', 'wmv'];
		var documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'epub', 'txt', 'odt', 'odp', 'ods'];
		var svgTypes = ['svg'];
		
		var uniqueID = 'all';
		var instructionString = window.t('filemanager.uploadMessage');
		if(options.onlyImage){
			uniqueID = 'image';
			options.mimeType = 'image/';
			options.tabs = ['myfiles', 'libraries', 'link'];
			options.extensions = imageTypes;
			instructionString = window.t('filemanager.onlyImageMessage');
		}
		if(options.onlyVideo){
			uniqueID = 'video';
			options.extensions = videoTypes;
			instructionString = window.t('filemanager.onlyVideoMessage');
		}
		if(options.onlyAudio){
			uniqueID = 'audio';
			options.mimeType = 'audio/';
			options.extensions = audioTypes;
			instructionString = window.t('filemanager.onlyAudioMessage');
		}
		if(options.onlyDocument){
			uniqueID = 'document';
			options.mimeTypes = ['application/msword, application/pdf,application/vnd.ms-,application/vnd.openxmlformats'];
			options.extensions = documentTypes;
			instructionString = window.t('filemanager.onlyDocumentMessage');
		}
		if(options.onlySVG){
			uniqueID = 'svg';
			options.tabs = ['myfiles', 'libraries_icon', 'link'];
			options.mimeType = 'image/svg';
			options.extensions = svgTypes;
			instructionString = window.t('filemanager.onlySVGMessage');
		}
		if(options.allFiles){
			var ex = []
			options.extensions = ex.concat(imageTypes, audioTypes, videoTypes, documentTypes);
			instructionString = window.t('filemanager.allFilesMessage');
		}
		function mainController($scope, $mdDialog)
		{
			"ngInject";
			instances.put(uniqueID + 'modal', this);
			this.showInstance = $scope.showInstance = function(show = true)
			{
				$scope.is_hidden = !show;
				safeApply($scope);
			}
			$scope.clipboard = false;
			$scope.data = {};
			$scope.instructionString = instructionString;
			$scope.selectedFiles = [];
			$scope.relativeUrl = getRelativeUrl();
			function getCacheFiles(type, folder){
				var cache = $cacheFactory.get('FileManager');
				if(!cache)
					cache = $cacheFactory('FileManager');
				var extensions = options.extensions;
				if(extensions != undefined && extensions.length){
					extensions = extensions.join()
				}
				else
					extensions = '';
				var cached = cache.get(type + ':' + folder + ':' + extensions)
				if(cached != undefined)
				{
					return angular.copy(cached);
				}
				return false;
			}
			function cacheFiles(type, folder, files){
				var extensions = options.extensions;
				if(extensions != undefined && extensions.length){
					extensions = extensions.join()
				}
				else
					extensions = '';
				var cache = $cacheFactory.get('FileManager');
				if(!cache)
					cache = $cacheFactory('FileManager');
				
				cache.put(type + ':'+ folder + ':' + extensions, angular.copy(files));
			}
			function clearCacheFiles(type, folder){
				var extensions = options.extensions;
				if(extensions != undefined && extensions.length){
					extensions = extensions.join()
				}
				else
					extensions = '';
				var cache = $cacheFactory.get('FileManager');
				if(!cache)
					cache = $cacheFactory('FileManager');
				
				cache.remove(type + ':'+ folder + ':' + extensions);
			}
			$scope.downloadFolder = function(folder)
			{
				var url = $scope.current_tab.download_url;
				url += '&folder=' + encodeURIComponent(folder) 
				window.open(url);
			};
			$scope.display_filesize = function(filesize){

				if(!isNaN(filesize)){
					var decr = 1024, step = 0;
					var prefix = ['Byte','KB','MB','GB','TB','PB'];
				
					while((filesize / decr) > 0.9){
						filesize = filesize / decr;
						step++;
					}
					return (filesize*1).toFixed(2)+' '+prefix[step];
				} 
				else {
			
					return 'NaN';
				}
			}
			$scope.maxUploadSize= window.max_upload_size;
			$scope.maxUploadSizeString = window.max_upload_size < 0 ? 'Unlimited' : $scope.display_filesize($scope.maxUploadSize);
			$scope.uploadSize = 0;
			$scope.uploadSizeString = $scope.display_filesize($scope.uploadSize);
			if(options.limited_size_upload){
				API.service('file').get('UploadSize').then(function(json)
				{
					$scope.uploadSize= json;
					$scope.uploadSizeString = $scope.display_filesize($scope.uploadSize);
				});
			}
			
			
			
			$scope.onUploadComplete = function(files)
			{
				clearCacheFiles($scope.current_tab.id, $scope.current_folder || '');
				return $scope.openFolder($scope.currentFolderObj);
				
			}
			$scope.refreshFolder = function()
			{
				if(!$scope.current_tab.url)
					return;
				clearCacheFiles($scope.current_tab.id, $scope.current_folder || '');
				return $scope.openFolder($scope.currentFolderObj);
			}
			$scope.newFolder = function(folder)
			{
				var url = $scope.current_tab.newfolder_url;
				var pscope = $scope;
				var that = this;
				var template = require('./templates/newFolder.tmpl');
				var modalInstance = $dialog.open(
				{
					template: template,
					controller: function($scope,$modalInstance)
					{
						"ngInject";
						$scope.name = 'New Folder'
						$scope.ok = function()
						{
							API.service('file/' + url).post({folder: '', name:$scope.name,t:'d'}).then(function(json)
							{
								var name = json.name || $scope.name;
								var rootCached = getCacheFiles(pscope.current_tab.id, '');
								if(rootCached != undefined && rootCached != false) {
									var folders = rootCached.folders || [];
									folders.splice(0,0, {name:name, path:'/'+ name});
									cacheFiles(pscope.current_tab.id, '', {files:rootCached.files, folders: folders});
									pscope.folders = angular.copy(folders);
								}
								$modalInstance.close();
							}, function()
							{
								$modalInstance.close();
							});
						};
						$scope.cancel = function()
						{
							$modalInstance.dismiss('cancel');
						};
					}
				});
				
			};
			
			$scope.deleteFolder = function(folder, index){
				if(!folder || folder.path == ""){
					return;
				}
				if(confirm(window.t('filemanager.delete_folder_confirm')) == false)
					return;
				var url = $scope.current_tab.deletefolder_url;
				var that = this;
				var pscope = $scope;
				API.service('file/' + url).post({folders:[folder.path]}).then(function(json)
				{
					var rootCached = getCacheFiles(pscope.current_tab.id, '');
					if(rootCached != undefined && rootCached != false) {
						var folders = rootCached.folders || [];
						folders.splice(index,1);
						cacheFiles(pscope.current_tab.id, '', {files:rootCached.files, folders: folders});
						pscope.folders = angular.copy(folders);
					}
					$scope.uploadSize = json;
					$scope.uploadSizeString = $scope.display_filesize($scope.uploadSize);
				});
			}
			function fetchParameter(gfld, current_folder)
			{
				return {
					gfld: gfld,
					searchPhrase: $scope.searchPhrase,
					page:$scope.currentPage, 
					folder: current_folder,
					rp: options.rp, 
					sortname:options.sortname, 
					sortorder:options.sortorder,
					"mimeTypes[]": options.mimeTypes,
					mimeType: options.mimeType,
					"extensions[]": options.extensions
				};
			}
			var column = 5;
			$scope.popupicon_filterIcons = function(searchPhrase)
			{
				//$scope.searchPhrase = searchPhrase;
				var files = $scope.original_files.filter(item => item.name.indexOf(searchPhrase) != -1);
				
				$scope.files = split(files, column);
				safeApply($scope);
				
			}
			function split(files, column)
			{
				var rs = [];
				var f = angular.copy(files);
				if(f == undefined)
					return rs;
				while (f.length > 0)
					rs.push(f.splice(0, column));
				return rs;
			}
			
			function isRootFolder(folder)
			{
				if(!folder){
					return true;
				}
				if(folder.path != undefined){
					return folder.path == '';
				}
				return false;
			}
			$scope.openFolder = function(folder)
			{
				if(!folder){
					folder = {path:''};
				}
				var isRefresh = ($scope.currentFolderObj != undefined && $scope.currentFolderObj.path == folder.path);
				if(!isRefresh){
					($scope.upload_options = $.extend({}, $scope.upload_options, {folder:folder.path}));
				} 
				$scope.selectedFiles = [];
				$scope.selectedFolders = [];
				$scope.current_folder = folder.path;
				$scope.currentFolderObj = folder;
				$scope.currentPage = $scope.currentPage || options.sp || 1;
				$scope.searchPhrase = $scope.searchPhrase || '';
				var cached = getCacheFiles($scope.current_tab.id, $scope.current_folder || '');
				if(cached != undefined && cached !== false){
					$scope.original_files = cached.files;
					$scope.files = split(cached.files, column);
					$scope.inner_folders = cached.folders;
					folder.folders = cached.folders;
					if(isRootFolder(folder))
						$scope.folders = cached.folders;
					return;
				}
				var a = fetchParameter(1, $scope.current_folder);
				$scope.files = [];
				$scope.inner_folders = [];
				//$scope.folders = [];
				return API.service('file').get($scope.current_tab.url,a).then(function(d)
				{
					$scope.original_files = d.files;
					$scope.files = split(d.files, column);
					if($scope.current_tab.id.indexOf('libraries') >= 0){
						d.folders = d.folders.map(function(item){
							item.name = window.t('filemanager.libraries_folders.' + item.name);
							return item;
						});
					}
					$scope.inner_folders = d.folders;
					folder.folders = d.folders;
					
					if(isRootFolder(folder)){
						$scope.folders = d.folders;
					}
					if(!$scope.original_files.length && $scope.current_tab.id.indexOf('libraries') >= 0 && $scope.folders.length){
						$scope.openFolder($scope.folders[0]);
					}
						
					cacheFiles($scope.current_tab.id, $scope.current_folder, {files:d.files, folders:d.folders});
					safeApply($scope);
					$(window).trigger('resize');
				});
			};
			
			$scope.changeTab_link = function(tab){
				$scope.selectedFiles = [];
				$scope.selectedFolders = [];
				$scope.files = [];
			}
			$scope.addImageUrl = function()
			{
				$scope.remote_files = $scope.remote_files || [];					
				$scope.remote_files.push({full_url:$scope.url, thumbnail:$scope.url});
				
				
			}
			$scope.upload_options = {};
			$scope.changeTab = function(tab)
			{
				if(typeof $scope.current_tab != 'undefined' && tab.id == $scope.current_tab.id)
					return;
				$scope.current_tab = tab
				$scope.upload_options = {
					url:$scope.current_tab.upload_url,
					folder: $scope.current_folder,
					multi_selection: true,
					extensions:options.extensions,
					onUploadComplete: function()
					{
						$scope.onUploadComplete();
					}
				}
				if($scope['changeTab_' + tab.id] != undefined) {
					return $scope['changeTab_' + tab.id](tab);
				}
				$scope.selectedFiles = [];
				$scope.selectedFolders = [];
				$scope.searchPhrase = '';
				$scope.openFolder();
				safeApply($scope);
				return;
				
				
			};
			
			$scope.selectFolder = function(folder,$index)
			{
				$scope.selectedFolders = $scope.selectedFolders || [];
				if(!folder.selected)
				{
					$scope.selectedFolders.push($index);
					folder.selected = true;
				}
				else
				{
					delete folder.selected;
					$scope.selectedFolders.splice($.inArray($index, $scope.selectedFolders), 1);
				}
			};
			$scope.selectFile = function(file,$index)
			{
				$scope.selectedFiles = $scope.selectedFiles || [];
				if(!file.selected)
				{
					$scope.selectedFiles.push(file);
					file.selected = true;
				}
				else
				{
					delete file.selected;
					$scope.selectedFiles.splice($.inArray(file, $scope.selectedFiles), 1);
				}
				if(options.multiSelection == false){
					for(var i in $scope.selectedFiles){
						if($scope.selectedFiles[i] != file){
							delete $scope.selectedFiles[i].selected;
						}
					}
					if(file.selected){
						$scope.selectedFiles = [file];
					}
					else{
						$scope.selectedFiles = [];
					}
					
				}
			};
			$scope.checkFileSelected = function(file)
			{
				return $.inArray(file, $scope.selectedFiles);
			};
			$scope.ok = function()
			{
				var data = [];
				for(var i = 0;i < $scope.selectedFiles.length;i++)
				{
					data.push($scope.selectedFiles[i]);
				}
				$mdDialog.hide(data);
			};
			$scope.close = function(){
				$mdDialog.cancel();
			}
			$scope.delete = function()
			{
				var url = $scope.current_tab.deleteItems_url;
				if(!url){
					alert('delete files isn\'t supported');
				}
				if(confirm("Delete this file?") == false)
					return;
				var files = [];
				for(var i = 0;i < $scope.selectedFiles.length;i++)
				{
					files.push($scope.selectedFiles[i].file);
				}
				var folders = [];
				for(var i = 0;i < $scope.selectedFolders.length;i++)
				{
					folders.push($scope.inner_folders[$scope.selectedFolders[i]]);
				}
				API.service('file/' + url).post({files:files,folders:folders}).then(function(json)
				{
					for(var i = $scope.selectedFiles.length-1;i >=0 ;i--)
					{
						for(var j in $scope.files){
							var index = $scope.files[j].indexOf($scope.selectedFiles[i]);
							if(index >= 0){
								$scope.files[j].splice(index, 1);
							}
						}
						
					}
					for(var i = $scope.selectedFolders.length;i >= 0;i--)
					{
						$scope.inner_folders.splice($scope.selectedFolders[i],1);
					}
					$scope.selectedFiles = [];
					$scope.selectedFolders = [];
					$scope.uploadSize = json;
					$scope.uploadSizeString = $scope.display_filesize($scope.uploadSize);
				});
			};
			$scope.cancel = function()
			{
				$modalInstance.dismiss('cancel');
			};
			$scope.tabs = [];
			var default_tab = false;
			for(var i in options.tabs)
			{
				if(!options.tabs[i])	continue;
				var tab = angular.copy(options.footerTabs[options.tabs[i]]);
				tab.id = options.tabs[i];
				tab.name = window.t(tab.name);
				$scope.tabs.push(tab);
			
			}
			$scope.changeTab($scope.tabs[0]);
		}
		var instances = $cacheFactory.get('fileManagerInstances');
		if(instances == undefined)
			instances = $cacheFactory('fileManagerInstances');
		var popupinstance = instances.get(uniqueID + 'element');
		var promise = instances.get(uniqueID + 'promise');
		var contentElement = "";
		if(popupinstance){
			
			contentElement = popupinstance;
		}
		else{
			var template = require('./templates/file_manager.tmpl');
			contentElement = angular.element(template);
			var hiddenDiv = $('<div style=""></div>');
			hiddenDiv.hide();
			hiddenDiv.append(contentElement);
			$('body').append(hiddenDiv);
			var scope = $rootScope.$new();
			$controller(mainController, {$scope: scope, $modalInstance:{}, $moduleInstance:this});
			
			
			
			$compile(contentElement)(scope);
			instances.put(uniqueID + 'element', contentElement);
		}
		var defer = $q.defer();	
		return popup.open(
		{
			name:'file_manager',
			contentElement: contentElement,
			parent:angular.element(document.body)
		});
		var rs = {result:defer.promise};
		instances.put(uniqueID + 'promise', rs);
		return rs;
	};
}