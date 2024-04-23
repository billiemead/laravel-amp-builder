var base = require('../../base');

module.exports =
{
    name:'integration/mailwizz',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, popup, API) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.hasAccount = false;
        $scope.list = [];
        $scope.data = $scope.data || {};
        //$scope.data.fields = {};
        var parentForm = popupParams.parentForm;
        $scope.fieldList = parentForm.getFieldList();
        $scope.mapping_fields = [];
        $scope.refresh = function () {
            API.all('connections').get(popupParams.providerType).then(function (json) {
                $scope.hasAccount = json.length > 0;
                if (!$scope.hasAccount) {
                    $scope.addAccount();
                }
            });
            API.service('integrations').get(popupParams.providerType + '/list').then(function (json) {
                if (json.error != undefined) {
                    $dialog.message({
                        title: 'Error',
                        message: json.error
                    });
                }
                $scope.list = json.list;
                if ($scope.data.list != undefined) {
                    $scope.changeList();
                }
            });
        }
    
        $scope.refresh();
        $scope.addAccount = function () {
            var parentScope = $scope;
            popup.open({
                name:'integration/acellemail/authorize',
                template: require('./authorize.tmpl'),
                controller: function ($scope, $modalInstance) {
                    "ngInject";
                    $scope.ok = function () {
                        parentScope._authorize({acellemail_name: $scope.name, url:$scope.api_url, token:$scope.api_token}).then(function (json) {
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
            var list_id = $scope.data.list;
                
            API.service('integrations').get(popupParams.providerType + '/fields', {list_id:list_id}).then(function (json) {
                $scope.mapping_fields = json;
                if ($scope.mapping_fields) {
                    delete $scope.mapping_fields.restangularEtag;
                }
            });
        }
    
    },
}