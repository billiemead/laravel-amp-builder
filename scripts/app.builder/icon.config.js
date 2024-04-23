export default function($mdIconProvider, $sceDelegateProvider) {
	"ngInject";
	var path = window.basePath + '/assets/images/sprites/';
	$mdIconProvider.iconSet('module', path + 'modules.svg', 24)
	.iconSet('widgetStyles', path + 'widgetStyles.svg', 24)
	.iconSet('resolutions', path + 'resolutions.svg', 24)
	.defaultIconSet(path + 'widgetStyles.svg', 24);;
	$sceDelegateProvider.resourceUrlWhitelist([
        'self',
        '**'
      ]);
}
