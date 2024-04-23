 "use strict";

angular.module('ui.popup',['ui.dialog']).
value('options',
{
	name:'',
	controller : 'popupmodalController',
	postData:{}
})
.service('popup', function($controller,options,$dialog,communication)
{
	"ngInject";
	this.open = function(opt, panel)
	{
		var template;
		var templateOption = {};
		if(!opt.template && !opt.templateUrl){
			var path = 'popup/' + opt.name;
			if(window.getTemplate){
				template = window.getTemplate(path);
			}
			if(template != undefined)
				templateOption.template = template;
			else{
				templateOption.templateUrl = getViewPath(path);
			}
		}
		
		
		
		var f = $dialog.open;
		if(panel)
			f = $dialog.openPanel;
		return f($.extend({}, opt,templateOption, {
			controller: function($scope,$modalInstance)
			{
				"ngInject";
				try
				{
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
					var ctrlInstance, ctrlLocals = {};
					if(opt.controller )
					{
						ctrlLocals.$scope = $scope;
						ctrlLocals.$modalInstance = $modalInstance;
						ctrlLocals.popupParams = opt;
						ctrlInstance = $controller(opt.controller,ctrlLocals);
					}
				}
				catch(e)
				{
					console.log(e);
				}
			},
			size: opt.size,
			hasBackdrop:opt.hasBackdrop
		}));
	}
})
.service('popup_form', function($controller,options,$dialog,communication)
{
	"ngInject";
	this.open = function(opt)
	{
		return $dialog.open({
			templateUrl: getViewPath('popup/' + opt.name),//$('#popup_backend_template_'+ opt.name).html(),
			controller: function($scope,$modalInstance)
			{
				"ngInject";
				try
				{
					$scope.data = angular.copy(opt.data || {});
					$scope.errors = {};
					$scope.close = function () {
						$dialog.confirm2(
						{
							title:window.t('LBL_DISCARD_CHANGE_QUESTION'),
							message:window.t('LBL_DISCARD_CHANGE_MESSAGE')
						}).result.then(function(result)
						{
							if(result == 1)
								$scope._save().then(function(data)
								{
									$modalInstance.close(data);
								});
							else
								$modalInstance.dismiss('cancel');
						});
					};
					$scope.save = function()
					{
						var valid = true;
						if($scope.form)
						{
							valid = ($scope.form.$valid);
						}
						if(valid)
							$scope._save().then(function(data)
							{
								if(data.success!= undefined && !data.success)
									return;
								$modalInstance.close(data);
							});
						else
							console.log($scope.form.$error);
					}
					$scope.save_new = function()
					{
						$scope._save().then(function(data)
						{
							$modalInstance.close(data);
						});
					}
					$scope._save = function()
					{
						var data = $scope.data;
						if(angular.isDefined(opt.form_name))
						{
							data = {};
							data[opt.form_name] = $scope.data;
						}
						var saveAction = opt.save_action || 'saveForm';
						return communication.api(saveAction, data, opt.execute_path, false).then(function(data)
						{
							return data;
						}, function(data)
						{
							$scope.errors = data.message;
							return data;
						});
					}
					var ctrlInstance, ctrlLocals = {};
					if(opt.controller )
					{
						ctrlLocals.$scope = $scope;
						ctrlLocals.$modalInstance = $modalInstance;
						ctrlInstance = $controller(opt.controller,ctrlLocals);
					}
				}
				catch(e)
				{
					console.log(e);
				}
			},
			size: opt.size,
			backdrop:false 
		});
	}
})
.service('popup_grid', function(popup,$controller,options,$dialog,communication)
{
	"ngInject";
	this.open = function(opt)
	{
		return popup.open({
			name: opt.name,
			controller: function($scope,$modalInstance)
			{
				"ngInject";
				$scope.gridInstance={};
				try
				{
					$scope.close = function () {
						$modalInstance.dismiss('cancel');
					};
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
					$scope.ok = function()
					{
						var rows = $scope.gridInstance.selections;
						
						$modalInstance.close(rows);
						console.log(rows);
					}
					var ctrlInstance, ctrlLocals = {};
					if(opt.controller )
					{
						ctrlLocals.$scope = $scope;
						ctrlLocals.$modalInstance = $modalInstance;
						ctrlInstance = $controller(opt.controller,ctrlLocals);
					}
				}
				catch(e)
				{
					console.log(e);
				}
			},
			size: opt.size,
			backdrop:true 
		});
	}
})
.controller('popupmodalController',['$scope','options',function($scope, options)
{
	"ngInject";
	$scope.popupData = {};
	communication.api('getFormData',options.postData)
	.then(function(response)
	{
		$scope.popupData = response;
	});
}]);
