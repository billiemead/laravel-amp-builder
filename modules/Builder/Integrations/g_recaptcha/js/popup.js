var base = require('../../base');

module.exports =
{
    name:'integration/campaignmonitor',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, popup, API) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.hasAccount = false;
        $scope.accounts = [];
        var parentForm = popupParams.parentForm;
        $scope.fieldList = parentForm.getFieldList();
        $scope.refresh = function () {
            API.service('connections').get(popupParams.providerType).then(function (json) {
                $scope.accounts = json;
                if (!$scope.accounts.length) {
                    $scope.addAccount();
                }
            });
            
        }
        $scope.refresh();
        
        $scope.addAccount = function () {
            var parentScope = $scope;
            popup.open({
                name:'integration/g_recaptcha/authorize',
                template: require('./authorize.tmpl'),
                controller: function ($scope, $modalInstance) {
                    "ngInject";
                    $scope.ok = function () {
                        parentScope._authorize({secret_key:$scope.secret_key, site_key:$scope.site_key, display_name:$scope.display_name}).then(function (json) {
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