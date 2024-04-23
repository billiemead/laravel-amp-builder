export default function($location,$rootScope,$scope, communication)
{
	"ngInject";
	$scope.submitData = function() {
		$scope.buttonDisabled = true;
		form.submit();
	}
	if(window.grecaptcha)
		grecaptcha.ready(function() {
		grecaptcha.execute("{{$siteKey}}", {action: 'auth'}).then(function(token) {
			console.log('token', token)
		});
	});
}