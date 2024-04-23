var base = require('../../base');

module.exports =
{
    name:'integration/getresponse',
    template:require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, popup,API) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.hasAccount = false;
        $scope.list = [];
        $scope.data.fields =  $scope.data.fields || {};
        
        $scope.data.fields.custom_fields = $scope.data.fields.custom_fields || {};
        var parentForm = popupParams.parentForm;
        $scope.fieldList = parentForm.getFieldList();
        $scope.refresh = function () {
            API.all('connections').customGET(popupParams.providerType).then(function (json) {
                $scope.hasAccount = json.length > 0;
                if (!$scope.hasAccount) {
                    $scope.addAccount();
                }
            });
            API.all('integrations/getresponse').customGET('campaigns').then(function (json) {
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
                name:'integration/getresponse/authorize',
                template: require('./authorize.tmpl'),
                controller: function ($scope, $modalInstance) {
                    "ngInject";
                    $scope.ok = function () {
                        parentScope._authorize({key:$scope.api}).then(function (json) {
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