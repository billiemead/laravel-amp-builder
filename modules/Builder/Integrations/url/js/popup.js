var base = require('../../base');

module.exports =
{
    name:'integration/url',
    template: require('./popup.tmpl'),
    controller: function ($scope,$modalInstance, $dialog, popupParams, communication, $controller) {
        "ngInject";
        $controller(base.controller, {$scope: $scope, $modalInstance: $modalInstance, popupParams: popupParams});
        $scope.data = $scope.data || {};
        
        var parentForm = popupParams.parentForm;
        $scope.data.fields =  $scope.data.fields || {};
        $scope.fieldList = parentForm.getFieldList();
        for (var i in $scope.fieldList) {
           var field_name = $scope.fieldList[i].name;
			if($scope.data.fields[field_name] == undefined)
				$scope.data.fields[field_name] = $scope.fieldList[i].display_name;
        }
        
        
    },
}