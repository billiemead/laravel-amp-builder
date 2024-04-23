export default function (fileManagerConfigProvider) {
	"ngInject";
	var url = window.basePath + 'edit_with_theme/' + window.siteInfo.theme + '/api/fileManager';
	var defaults = fileManagerConfigProvider.$get();
	fileManagerConfigProvider.set({
		appName: 'angular-filemanager',
		pickCallback: function(item) {
			var msg = 'Picked %s "%s" for external use'
			.replace('%s', item.type)
			.replace('%s', item.fullPath());
			window.alert(msg);
		},

		allowedActions: angular.extend(defaults.allowedActions, {
			pickFiles: true,
			pickFolders: false,
			changePermissions: false,
		}),
		listUrl: url,
		uploadUrl: url,
		renameUrl:  url,
		copyUrl:  url,
		moveUrl:  url,
		removeUrl:  url,
		editUrl:  url,
		getContentUrl:  url,
		createFolderUrl:  url,
		downloadFileUrl:  url,
		downloadMultipleUrl:  url,
		compressUrl:  url,
		extractUrl:  url,
		permissionsUrl:  url,
		basePath: '/',
	});
}