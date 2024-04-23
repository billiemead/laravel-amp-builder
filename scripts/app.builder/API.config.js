export default function(APIHelperProvider, PluploadHelperProvider) {
	"ngInject";
	APIHelperProvider.setVerifyFunction(function(url){
		var services = ['connections', 'integrations', 'file', 'variants', 'site/update', 'template/structure'];
		var apiPath = window.apiPath + '/';
		for(var i in services){
			var url2Check = apiPath + services[i];
			if(url.indexOf(url2Check) >= 0)
				return true;
		}
	});
	APIHelperProvider.setConfigFunction(function(configurer){
		configurer.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig){
			headers['Model-Id'] = window.siteInfo.variant_id|| window.siteInfo.id;
		});
	});
	PluploadHelperProvider.setConfigFunction(function(options){
		options.headers = options.headers || {};
		options.headers['Model-Id'] = window.siteInfo.variant_id|| window.siteInfo.id;
	})
}
