var _ = require('lodash');
export class APIService {
  constructor (Restangular, $window, ToastService, APIHelper, $http, $q, SatellizerShared, $auth, $dialog) {
    'ngInject'
    // content negotiation
    var headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/x.laravel.v1+json'
    }
	var activeCalls =  0;
	var redirectTimeout = 3000;
	var blockScreenUrls = {};
	var traceMessage = function(debug)
	{
		var message = "";
		message += 'Class: ' + debug.class + "<br/>";
		message += 'File: ' + debug.file + "<br/>";
		message += 'Line: ' + debug.line + "<br/>";
		if(debug.trace != undefined){
			for(var i in debug.trace){
				message += debug.trace[i] + "<br/>";
			}
		}
		return message;
	}
    var API = Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer
		.setBaseUrl(window.apiPath)
		.setPlainByDefault(true)
        .setDefaultHeaders(headers)
        .setErrorInterceptor(function (response, deferred, responseHandler) {
			if(blockScreenUrls[response.config.url]){
				activeCalls--;
			}
			if ( activeCalls == 0) {
				$('#loadingSpinner').hide();
			}
			var status_code = response.status;
			if(status_code == 401){
				var message = response.data.message;
				needRedirectLogin(message);
				
			}
			if(status_code == 500){
				var code = response.data.code;
				var message = response.data.message + "<br/>";
				if(code && code == 401){
					return needRedirectLogin(message);
				}
				
				if(response.data.debug != undefined)
					message += traceMessage(response.data.debug);
				$dialog.message({
					title:'Error',
					message: message
				});
				return;
			}
			if (response.data.errors != undefined) {
				for (var error in response.data.errors) {
					return ToastService.showSimpleToast(response.data.errors[error][0])
				}
			}
			if (response.data.message != undefined) {
				return ToastService.showSimpleToast(response.data.message);
				
			}
        })
        .addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
			if(httpConfig.blockScreen || APIHelper.isBlockedService(url)){
				activeCalls++;
				blockScreenUrls[url] = true;
				$('#loadingSpinner').show();
			}
			else if(operation == 'post' || operation == 'put' || operation == 'delete'){
				activeCalls++;
				blockScreenUrls[url] = true;
				$('#loadingSpinner').show();
			}
			headers['X-Requested-With'] = 'XMLHttpRequest';
			var token = $window.localStorage.satellizer_token;
		  
          if (token) {
            headers.Authorization = 'Bearer ' + token
			var meta = $('meta[name="bypass_fastcgi"]')
			if(meta.length) {
				var metaContent = meta.attr('content');
				headers[metaContent] = headers.Authorization
			}
          }
        })
        .addResponseInterceptor(function (response, operation, what, url) {
			if(blockScreenUrls[url]){
				activeCalls--;
				delete blockScreenUrls[url];
			}
			if ( activeCalls <= 0) {
				$('#loadingSpinner').hide();
			}
			if(response.data){
				return response.data;
			}
			return response
        });
		APIHelper.configRestangular(RestangularConfigurer);
    });
	var refreshAccesstoken = function() {
		return SatellizerShared.refreshToken($http);
	};
	var needRedirectLogin = function(message)
	{
		$dialog.message({
			title:'Error',
			message: message,
			controller: function($scope, $modalInstance)
			{
				"ngInject";
				$scope.$dismiss = function()
				{
					SatellizerShared.redirectLogin();
				}
				if(redirectTimeout > 0)
					window.setTimeout(function(){
						SatellizerShared.redirectLogin();
					}, redirectTimeout);
			}
		});
	}
	return API;
  }
}
