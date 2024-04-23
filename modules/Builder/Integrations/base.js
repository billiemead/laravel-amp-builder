module.exports =
{
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, API, $window, SatellizerPopup) {
        "ngInject";
        $scope.hasAccount = false;
        $scope.list = [];
        var parentForm = popupParams.parentForm;
        var integrations = parentForm.getData().integrations || {};
        var providerType = popupParams.providerType;
        $scope.data = {};
        if (integrations[providerType] != undefined) {
            $scope.data = angular.copy(integrations[providerType]);
        }
        $scope.fieldList = parentForm.getFieldList();
        $scope.custom_fields = [];
        function doCallback(url, params)
        {
            $.get(url, params, function () {
                $scope.refresh();
            });
        }
        $scope._authorize = function (data) {
            var providerInfo = popupParams.providerInfo;
            return API.all('integrations').customPOST('', popupParams.providerType + '/authorize', data);
        }
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
    },
}