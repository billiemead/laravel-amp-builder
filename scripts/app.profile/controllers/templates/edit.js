export default function($scope,API,$state, $stateParams, popup, $dialog, $controller) {
	"ngInject";
	$controller(require('../../../app.admin/controllers/templates/edit').default, {$scope:$scope});
}