import './utils/md-steppers/md-steppers.min';
import common_app from './app.common';
var injector =  [common_app, 'md-steppers'];


angular.module('installer_app', injector)

.controller('installerController', function($location,$rootScope,$scope, communication, $q, $timeout)
{
	"ngInject";
	$scope.selectedStep = 0;
    $scope.stepProgress = 1;
    $scope.maxStep = 6;
	$scope.stepData= [
		{data:{}, completed:false,url:'install/wait'},
		{data:{}, completed:false, url:'install/wait', initUrl:'install/requirement'},
		{data:{}, completed:false, url:'install/wait', initUrl:'install/permissions'},
		{data:{database_hostname:'localhost', app_url: window.basePath, app_name:'AMP Builder'}, completed:false, initUrl:'install/environment', url:'install/database'},
		{data:{}, completed:false, url:'install/admin'},
		{data:{}, completed:false, url:'install/final', redirect: 'auth/login'}
	];
	$scope.selectStep = function(step){
		if($scope.stepData[step].initUrl != undefined){
			$scope.showBusyText = false;
			communication.ajaxCall($scope.stepData[step].initUrl).then(function (json) {
				$scope.showBusyText = false;
				$scope.stepData[step].data = $.extend({}, $scope.stepData[step].data, json);
			}, function()
			{
				$scope.showBusyText = false;
			});
		}
		
	}
	$scope.reloadCurrentStep = function()
	{
		//console.log($scope.selectedStep);
		//return;
		$scope.selectStep($scope.selectedStep);
	}
	$scope.enableNextStep = function nextStep() {
        if ($scope.selectedStep >= $scope.maxStep) {
            return;
        }
        if ($scope.selectedStep === $scope.stepProgress - 1) {
            $scope.stepProgress = $scope.stepProgress + 1;
        }
        $scope.selectedStep = $scope.selectedStep + 1;
    }

    $scope.moveToPreviousStep = function moveToPreviousStep() {
        if ($scope.selectedStep > 0) {
            $scope.selectedStep = $scope.selectedStep - 1;
        }
    }
	$scope.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {
        $scope.showBusyText = true;
        if (!stepData.completed && !isSkip) {
			communication.ajaxCall(stepData.url, stepData.data).then(function (json) {
                $scope.showBusyText = false;
                stepData.completed = true;
				if(stepData.redirect){
					window.location.href = stepData.redirect;
				}
                else 
					$scope.enableNextStep();
            }, function(json)
			{
				$scope.showBusyText = false;
			})
        } else {
            $scope.showBusyText = false;
            if(stepData.redirect){
				window.location.href = stepData.redirect;
			}
			else 
				$scope.enableNextStep();
        }
	}

})

.controller('updateController', function($location,$rootScope,$scope, communication, $q, $timeout)
{
	"ngInject";
	$scope.selectedStep = 0;
    $scope.stepProgress = 1;
    $scope.maxStep = 3;
	$scope.stepData= [
		{data:{}, completed:false,url:'update/wait'},
		{data:{}, completed:false, url:'update/wait', initUrl:'update/overview'},
		{data:{}, completed:false, url:'update/final'}
	];
	$scope.selectStep = function(step){
		if($scope.stepData[step].initUrl != undefined){
			$scope.showBusyText = false;
			communication.ajaxCall($scope.stepData[step].initUrl).then(function (json) {
				
				$scope.showBusyText = false;
				$scope.stepData[step].data = $.extend({}, $scope.stepData[step].data, json);
			}, function()
			{
				$scope.showBusyText = false;
			});
		}
		
	}
	$scope.enableNextStep = function nextStep() {
        if ($scope.selectedStep >= $scope.maxStep) {
            return;
        }
        if ($scope.selectedStep === $scope.stepProgress - 1) {
            $scope.stepProgress = $scope.stepProgress + 1;
        }
        $scope.selectedStep = $scope.selectedStep + 1;
    }

    $scope.moveToPreviousStep = function moveToPreviousStep() {
        if ($scope.selectedStep > 0) {
            $scope.selectedStep = $scope.selectedStep - 1;
        }
    }
	$scope.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {
        $scope.showBusyText = true;
        if (!stepData.completed && !isSkip) {
			communication.ajaxCall(stepData.url, stepData.data).then(function (json) {
				console.log(json)
                $scope.showBusyText = false;
                stepData.completed = true;
				if(stepData.redirect){
					window.location.href = stepData.redirect;
				}
                else 
					$scope.enableNextStep();
            }, function(json)
			{
				$scope.showBusyText = false;
			})
        } else {
            $scope.showBusyText = false;
            if(stepData.redirect){
				window.location.href = stepData.redirect;
			}
			else 
				$scope.enableNextStep();
        }
	}

})
.run(function($rootScope) 
{
});
