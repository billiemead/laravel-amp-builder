export default function(APIHelperProvider) {
	"ngInject";
	APIHelperProvider.setConfigFunction(function(configurer){
		configurer.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig){
			headers['Model-Id'] = window.variantId;
		});
	})
}
