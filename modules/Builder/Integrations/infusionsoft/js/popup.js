var base = require('../../base');
module.exports =
{
    name:'integration/infusionsoft',
    template:require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, API, safeApply) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.accounts = [];
        $scope.list = [];
        var parentForm = popupParams.parentForm;
        var providerInfo = popupParams.providerInfo;
        $scope.fieldList = parentForm.getFieldList();
        $scope.refresh = function () {
            API.service('connections').get(popupParams.providerType).then(function (json) {
                $scope.accounts = json;
                if ($scope.accounts.length && !$scope.data.account) {
                    $scope.data.account = '' + $scope.accounts[0].id;
                }
                if ($scope.data.account) {
                    $scope.changeAccount();
                }
            });
        }
        $scope.refresh();
        $scope.list_detail = {};
        $scope.disable_submit = false;
        $scope.changeAccount = function () {
            var account = $scope.data.account;
            if (account == undefined) {
                return;
            }
            
            API.service('integrations').get(popupParams.providerType + '/list',{connection_id:account}).then(function (json) {
                if (json.error != undefined) {
                    $scope.disable_submit = true;
                    $dialog.message({
                        title:'Error',
                        message:json.error
                    })
                    return;
                }
                $scope.disable_submit = false;
                $scope.mapping_fields = json.mapping_fields;
                if ($scope.mapping_fields) {
                    delete $scope.mapping_fields.restangularEtag;
                }
                $scope.tags = json.tags;
                $scope.list = json.list;
                if ($scope.data.list != undefined) {
                    $scope.changeList();
                }
            });
            
        }
        $scope.changeList = function () {
            var list_id = $scope.data.list;
            var cnn_id = $scope.data.account;
            if (list_id == undefined || !list_id.length) {
                $scope.sequences = [];
                return;
            }
            API.service('integrations').get(popupParams.providerType + '/campaigns', {connection_id:cnn_id, list_id:list_id}).then(function (json) {
                $scope.sequences = json.sequences;
            });
        }
    },
}