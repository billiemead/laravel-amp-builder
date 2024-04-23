var base = require('../../base');
module.exports =
{
    name:'integration/zohocrm',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, API) {
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
                if ($scope.data.account == undefined && $scope.accounts.length) {
                    $scope.data.account = '' + json[0].id;
                }
                $scope.changeAccount();
            });
            
        }
        $scope.changeAccount = function () {
            var account = $scope.data.account;
            if (account == undefined) {
                return;
            }
            
            API.service('integrations').get(popupParams.providerType + '/list', {connection_id:account}).then(function (json) {
                $scope.list = json.list;
                $scope.mapping_fields = json.mapping_fields;
                if ($scope.mapping_fields) {
                    delete $scope.mapping_fields.restangularEtag;
                }
            });
            
        }
        $scope.refresh();
        $scope.mapping_fields = [];
        
        
    },
}