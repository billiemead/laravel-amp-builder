var base = require('../../base');

module.exports =
{
    name:'integration/aweber',
    template:require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, API) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.accounts = [];
        $scope.list = [];
        $scope.data = $scope.data || {};
		$scope.data.fields =  $scope.data.fields || {};
        
        $scope.data.fields.custom_fields = $scope.data.fields.custom_fields || {};
        var parentForm = popupParams.parentForm;
        $scope.fieldList = parentForm.getFieldList();
        $scope.refresh = function () {
            API.service('connections').get(popupParams.providerType).then(function (json) {
                $scope.accounts = json;
            });
            API.service('integrations').get(popupParams.providerType + '/list').then(function (json) {
                $scope.list = json;
                $scope.changeList();
            });
        }
        $scope.refresh();
        
        $scope.custom_fields = [];
        $scope.changeList = function () {
            var list = $scope.data.list;
            if (list == undefined) {
                return;
            }
            var cnn_id = list.split('-')[0];
            var list_id = list.split('-')[1];
            API.service('integrations').get(popupParams.providerType + '/fields', {connection_id:cnn_id, list_id:list_id}).then(function (json) {
                $scope.mapping_fields = json;
                if ($scope.mapping_fields) {
                    delete $scope.mapping_fields.restangularEtag;
                }
            });
        }
    
    },
}