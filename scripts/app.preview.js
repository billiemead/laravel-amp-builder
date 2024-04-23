import common_app from './app.common';
import './utils/angular-qrcode';

var injects = [common_app, 'ngLocale', 'monospaced.qrcode'];
angular.module('preview_app', injects)
.directive('pageTabs', require('./app.preview/directives/pageTabs').default)
.component('pageResolutions', require('./app.preview/components/pageResolutions/component').default)
.directive('ampValidatorButton', require('./app.preview/directives/ampValidatorButton').default)
.config(require('./app.preview/API.config').default)
.config(require('./app.builder/icon.config').default)

.run(function($timeout, $rootScope) 
{
	"ngInject";
	
	var edit_page = $('iframe#edit_page');
	
	if(edit_page.length == 0)
	{
		var src = $('#edit_page_meta').attr('data-src');
		edit_page = $('<iframe id="edit_page" name="edit_page"></iframe');
		
		edit_page.attr('src', src);
		$('#edit_page_meta').after(edit_page);
		var that = this;
		$('#iframe_loadingSpinner').show();
		edit_page.load(function() 
		{
			$('#iframe_loadingSpinner').hide();
		});
	}
	else
	{
		//this.init();
	}
});

