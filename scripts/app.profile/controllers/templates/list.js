export default function($scope,$controller) {
	"ngInject";
	$controller(require('../../../app.admin/controllers/templates/list').default, {$scope:$scope});
	
}