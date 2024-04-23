export default function($stateProvider, $urlRouterProvider) {
	"ngInject";
	$urlRouterProvider
	.otherwise('/content');
	function registerState(name, params){
		var path = 'theme/' + params.path;
		var template;
		if(window.getTemplate){
			template = window.getTemplate(path);
		}
		var templateOption = {};
		if(template != undefined)
			templateOption.template = template;
		else{
			templateOption.templateUrl = getViewPath(path);
		}
		params = $.extend({}, params, templateOption);
		$stateProvider.state(name, params);
	}
	
	registerState('content', {
		url: "/content",
		path: "main",
		deepStateRedirect: true,
		controller: function($scope, communication, popup_section, pageEdit, commonUtils, pageEdit_event, $fk_file_manager)
		{
			"ngInject";
			$scope.fileManager = function()
			{
				$fk_file_manager.open();
			}
		}
    });
	registerState('content.sections', {
		url: "/sections",
		path: "sections",
		controller: require('./content/sections').default,
		deepStateRedirect: true,
    });
	registerState('content.design', {
      url: "/design",
	   path: ('design/main_menu'),
	   controller: function($scope, communication, popup_code, commonUtils, pageEdit, $http) {
		   "ngInject";
			$scope.options = [];
			
			var themeConfig = window.siteInfo.themeConfig;
			if(!themeConfig || !themeConfig.variablePath){
				return;
			}
			var path = getThemePath(window.siteInfo.theme) + '/' + themeConfig.variablePath;
			$scope.editLessVariable = function()
			{
				return communication.ajaxCall(path).then(function(json)
				{
					popup_code.open({
						data:$.trim(json),
						mode:'less',
						controller:function($scope, $modalInstance)
						{
							"ngInject";
							$scope.ok = function()
							{
								var ace = $scope.ace;
								ace.session.clearAnnotations();
								$scope.error = '';
								var rs = pageEdit.preprocessor.changeCustomVariableContent($scope.data, themeConfig);
								
								if(rs != undefined){
									rs.then(function(result) {
										console.log('dfdfdsfds', result);
										$modalInstance.close($scope.data);
									},
									function(error){
										console.log(error);
										$scope.error = error.message;
										
									});
								}
							}
						}
					})
					.result.then(function(data)
					{
						communication.api('saveThemeVariableContent',{content: data}).then(function(json)
						{
							
						});
					});
				});;
				
				
			}
			$scope.editThemeCSS = function()
			{
				var themeConfig = window.siteInfo.themeConfig;
				if(!themeConfig || !themeConfig.variablePath){
					return;
				}
				var path = getThemePath(window.siteInfo.theme) + '/' + themeConfig.themePath;
				communication.ajaxCall(path).then(function(json)
				{
					popup_code.open({
						data:$.trim(json),
						mode:'less',
						controller:function($scope, $modalInstance)
						{
							"ngInject";
							$scope.ok = function()
							{
								var ace = $scope.ace;
								ace.session.clearAnnotations();
								$scope.error = '';
								var rs = pageEdit.preprocessor.changeThemeContent($scope.data, themeConfig);
								
								if(rs != undefined){
									rs.then(function(result) {
										$modalInstance.close($scope.data);
									},
									function(error){
										$scope.error = error.message;
										
									});
								}
							}
						}
					})
					.result.then(function(data)
					{
						communication.api('saveThemeCSS',{content: data}).then(function(json)
						{
						});
					});
				});
				
			}
			if(!pageEdit.preprocessor){
				return;
			}
	   },
	   deepStateRedirect: true,
    })
	registerState('content.design.page_options', {
		url: "/page_options",
		path: ('design/page_options'),
		controller: require('./design/page_options').default
	})
	registerState('content.design.module_options', {
		url: "/module_options",
		path: ('design/module_options'),
		controller: require('./design/module_options').default
	})
	registerState('content.design.color', {
      url: "/color",
	   path: ('design/color'),
	   controller: require('./design/color').default
    });
	registerState('content.design.icon', {
		url: "/icon",
		path: ('design/icons'),
		controller: require('./design/icons').default
	});
	registerState('content.design.font', {
		url: "/font",
		path: ('design/fonts'),
		controller: require('./design/fonts').default
	});
}