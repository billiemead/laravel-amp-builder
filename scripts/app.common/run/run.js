export default function($rootScope, $templateCache) 
{
	"ngInject";
	$rootScope.$emit('app_ready');
}