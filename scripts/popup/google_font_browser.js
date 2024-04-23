var fonts = require('../../storage/api-response.json');
angular.module('ui.popup')
.service('popup_google_font_browser', function($dialog, $mdPanel)
{
	"ngInject";
	this.open = function(opt)
	{
		var template = require('../templates/popup/google_font_browser.tmpl');
		opt = opt || {};
		var panelPosition = $mdPanel.newPanelPosition().absolute().centerHorizontally().top('100px');
		return $dialog.open({
			template: template,
			position:panelPosition,
			onOpenComplete: function()
			{
				$(window).trigger('resize');
			},
			controller: function($scope, $modalInstance)
			{
				"ngInject";
				$scope.search = "";
				$scope.fonts = [];
				for(var i in fonts){
					$scope.fonts.push(fonts[i]);
				}
				$scope.selectFont = function(font_name)
				{
					$modalInstance.close(font_name);
				}
				
			},
			
		});
	}
});