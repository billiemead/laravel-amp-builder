var base = require('../../base');

module.exports =
{
    name:'integration/activecampaign',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, popup, API) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.hasAccount = false;
        $scope.list = [];
        $scope.data = $scope.data || {};
        var parentForm = popupParams.parentForm;
        $scope.fieldList = parentForm.getFieldList();
        $scope.mapping_fields = [];
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
                $scope.list = json.list;
                $scope.mapping_fields = json.mapping_fields;
                if ($scope.mapping_fields) {
                    delete $scope.mapping_fields.restangularEtag;
                }
            });
        }
    
        $scope.refresh();
        $scope.addAccount = function () {
            var parentScope = $scope;
            popup.open({
                name:'integration/activecampaign/authorize',
                template: require('./authorize.tmpl'),
                controller: function ($scope, $modalInstance) {
                    "ngInject";
                    $scope.ok = function () {
                        parentScope._authorize({api_url:$scope.api_url, api_key:$scope.api_key}).then(function (json) {
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
        
    
    },
}