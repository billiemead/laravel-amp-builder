var base = require('../../base');

module.exports =
{
    name:'integration/hubspot',
    template:require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, popup, API) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.hasAccount = false;
        $scope.list = [];
        $scope.data.fields =  $scope.data.fields || {};
        
        $scope.data.fields.custom_fields = $scope.data.fields.custom_fields || {};
        var parentForm = popupParams.parentForm;
        $scope.fieldList = parentForm.getFieldList();
        $scope.refresh = function () {
            API.service('connections').get(popupParams.providerType).then(function (json) {
                $scope.accounts = json;
                $scope.hasAccount = json.length > 0;
                if (!$scope.data.account  && $scope.accounts.length) {
                    $scope.data.account = "" + json[0].id;
                }
                $scope.changeAccount();
            });
            
            
        }
        $scope.refresh();
        
        
        $scope.changeAccount = function () {
            $scope.list = [];
            if ($scope.data.account == undefined) {
                return;
            }
            API.service('integrations').get(popupParams.providerType + '/forms', {connection_id: $scope.data.account}).then(function (json) {
                $scope.list = json;
                if ($scope.data.list != undefined) {
                    $scope.changeList();
                }
            });
        }
        $scope.changeList = function () {
            var list = $scope.list[$scope.data.list];
            if (list != undefined) {
                $scope.mapping_fields = list.mapping_fields;
                if ($scope.mapping_fields) {
                    delete $scope.mapping_fields.restangularEtag;
                }
            }
                
        }
    },
}