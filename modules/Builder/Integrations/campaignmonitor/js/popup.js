var base = require('../../base');

module.exports =
{
    name:'integration/campaignmonitor',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, popup, API) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.hasAccount = false;
        $scope.list = [];
        
        var parentForm = popupParams.parentForm;
        $scope.fieldList = parentForm.getFieldList();
        $scope.refresh = function () {
            API.service('connections').get(popupParams.providerType).then(function (json) {
                $scope.hasAccount = json.length > 0;
                if (!$scope.hasAccount) {
                    $scope.addAccount();
                }
            });
            API.service('integrations').get(popupParams.providerType + '/campaigns').then(function (json) {
                if (json.error != undefined) {
                    $dialog.message({
                        title:'Error',
                        message:json.error
                    })
                }
                $scope.list = json;
                if ($scope.data.list != undefined) {
                    $scope.changeList();
                }
            });
        }
        $scope.refresh();
        
        $scope.addAccount = function () {
            var parentScope = $scope;
            popup.open({
                name:'integration/campaignmonitor/authorize',
                template: require('./authorize.tmpl'),
                controller: function ($scope, $modalInstance) {
                    "ngInject";
                    $scope.ok = function () {
                        parentScope._authorize({key:$scope.api, client_id:$scope.client_id}).then(function (json) {
                            if (json == 1) {
                                $modalInstance.close(1);
                            }
                        });
                    }
                }
            }).result.then(function () {
                $scope.refresh();
            });
        }
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