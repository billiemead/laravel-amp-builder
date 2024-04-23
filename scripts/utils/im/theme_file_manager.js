export default function($dialog, communication,$file_uploader, popup, $cacheFactory, $_file_manager)
{
	"ngInject";
	this.open = function(settings){
		return $_file_manager.open($.extend({},{
			onlyImage: true,
			tabs:
			[
				'myfiles', 
				'libraries',
				//'link'
			],
			footerTabs:
			{
				'myfiles' :{icon:'fa fa-user', name: t('LBL_IMAGE_MANAGER_THEMES'), url:  getApiPath('getAssetList', 'theme'), manage:true, upload_url: getApiPath('upload', 'theme'), copy_url: getApiPath('copyFile', 'theme'), cut_url: getApiPath('cutFile', 'theme'), delete_url:getApiPath('deleteFile', 'theme'), rename_url: getApiPath('renameFile', 'theme'), newfolder_url: getApiPath('newFolder', 'theme'),  deletefolder_url: getApiPath('deleteFolders', 'theme'),  deleteItems_url: getApiPath('deleteItems', 'asset'),  download_url:getApiPath('downloadFile', 'theme')},
				'libraries':{icon:'fa fa-image', name: t('LBL_IMAGE_MANAGER_LIBRARY'), url:  getApiPath('getLibraryList', 'asset')},
				'link':{icon:'fa fa-link', name: t('LBL_IMAGE_MANAGER_LINK'), url:  'api?path=asset&action=getLibraryList&'},
			},
		}, settings));
	}
	
}