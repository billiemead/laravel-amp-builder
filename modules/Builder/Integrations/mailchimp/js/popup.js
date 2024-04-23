var base = require('../../base');
module.exports =
{
    name:'integration/mailchimp',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, API, $controller) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.accounts = [];
        $scope.list = [];
        
        
        var parentForm = popupParams.parentForm;
        $scope.data.fields =  $scope.data.fields || {};
        
        $scope.data.fields.merge_fields = $scope.data.fields.merge_fields || {};
        var providerInfo = popupParams.providerInfo;
        $scope.fieldList = parentForm.getFieldList();
        $scope.refresh = function () {
            API.service('connections').get(popupParams.providerType).then(function (json) {
                $scope.accounts = json;
            });
            API.service('integrations').get(popupParams.providerType + '/list').then(function (json) {
                $scope.list = json;
                if ($scope.data.list != undefined) {
                    $scope.changeList();
                }
            });
        }
        $scope.refresh();
        $scope.mapping_fields = [];
        $scope.changeList = function () {
            var list = $scope.data.list;
            if (list == undefined) {
                return;
            }
            var cnn_id = list.split('-')[0];
            var list_id = list.split('-')[1];
            API.all('integrations').customGET(popupParams.providerType + '/listField', {connection_id:cnn_id, list_id:list_id}).then(function (json) {
                $scope.mapping_fields = json;
                if ($scope.mapping_fields) {
                    delete $scope.mapping_fields.restangularEtag;
                }
            });
            
        }
        
    },
}