var base = require('../../base');
module.exports =
{
    name:'integration/salesforce',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, API) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.accounts = [];
        $scope.list = [];
        $scope.mapping_fields = [];
        
        var parentForm = popupParams.parentForm;
        $scope.data.fields =  $scope.data.fields || {};
        $scope.disable_submit = false;
        $scope.data.fields.merge_fields = $scope.data.fields.merge_fields || {};
        var providerInfo = popupParams.providerInfo;
        $scope.fieldList = parentForm.getFieldList();
        $scope.refresh = function () {
            API.service('connections').get(popupParams.providerType).then(function (json) {
                $scope.accounts = json;
                if ($scope.data.account == undefined && $scope.accounts.length) {
                    $scope.data.account = '' + $scope.accounts[0].id;
                }
                $scope.changeAccount();
            });
        }
        $scope.refresh();
        
        $scope.changeAccount = function () {
            var account = $scope.data.account;
            if (account == undefined) {
                return;
            }
            $scope.list = [];
            $scope.mapping_fields = [];
            API.service('integrations').get(popupParams.providerType + '/list',{connection_id:account}).then(function (json) {
                if (json.error != undefined) {
                    $scope.disable_submit = true
                    $dialog.message({
                        title: 'Error',
                        message:json.error
                    });
                    return;
                }
                $scope.disable_submit = false;
                $scope.list = json.list;
                $scope.mapping_fields = json.mapping_fields;
                if ($scope.mapping_fields) {
                    delete $scope.mapping_fields.restangularEtag;
                }
                if ($scope.data.list != undefined) {
                    $scope.changeList();
                }
            });
            
        }
        $scope.changeList = function () {
            var account = $scope.data.account;
            var list = $scope.data.list;
            if (list == undefined) {
                return;
            }
            var cnn_id = list.split('-')[0];
            var list_id = list.split('-')[1];
            
        }
        
    },
}