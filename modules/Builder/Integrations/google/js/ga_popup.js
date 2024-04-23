var base = require('../../base');

module.exports =
{
    name:'integration/google',
    providerType:'google',
    template: require('./ga_popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller, popup, SatellizerPopup, API) {
        "ngInject";
        $scope.openOauthDialog = function () {
            var providerInfo = popupParams.providerInfo;
            var url = providerInfo.authorizeDialogUrl;
            var token = $window.localStorage.satellizer_token
            if (token) {
                url+= '?token=' + token;
            }
            var popup = SatellizerPopup.open(url, popupParams.providerType, {}, providerInfo.callbackUrl);
            popup.then(function (result) {
                doCallback(providerInfo.callbackUrl, result)
            });
        }
        $scope.ok = function () {
            if ($scope.form.$valid) {
                $modalInstance.close($scope.data);
                if (SatellizerPopup._popup) {
                    SatellizerPopup._popup.close();
                }
            }
        }
        $scope.connections = [];
        $scope.analytic_connections = [];
        $scope.list = [];
        $scope.data = $scope.data || {};
        $scope.properties = [];
        $scope.profiles = [];
        $scope.accountId = '';
        $scope.data.connectionId = '';
        $scope.data.webPropertyId = '';
        $scope.data.websiteId = id
        $scope.data.profileId = '';
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
        $scope.changeConnection = function () {
            $scope.accounts = [];
            $scope.properties = [];
            $scope.profiles = [];
            $scope.webPropertyId = '';
            $scope.profileId = '';
            for (var i in $scope.analytic_connections) {
                if ($scope.analytic_connections[i].id == $scope.data.connectionId) {
                    $scope.accounts = $scope.analytic_connections[i].list;
                }
            }
        }
        $scope.changeAccount = function () {
            $scope.properties = [];
            $scope.profiles = [];
            $scope.webPropertyId = '';
            $scope.profileId = '';
            for (var i in $scope.accounts) {
                if ($scope.accounts[i].id == $scope.data.accountId) {
                    $scope.properties = $scope.accounts[i].properties;
                }
            }
        }
        $scope.changeProperty = function () {
            $scope.profiles = [];
            $scope.profileId = '';
            for (var i in $scope.accounts) {
                if ($scope.accounts[i].id == $scope.data.accountId) {
                    var properties = $scope.accounts[i].properties;
                    for (var j in properties) {
                        if (properties[j].id == $scope.data.webPropertyId) {
                            $scope.profiles = properties[j].profiles;
                        }
                    }
                }
            }
        }
    },
}