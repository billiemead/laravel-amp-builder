export default function($rootScope, safeApply, $http, $dialog)
{
	"ngInject";
	return {
		template:require('./ampValidatorButton.tmpl'),
		controller: function($scope, $element, $attrs){
			"ngInject";
			$scope.validate = function()
			{
				$scope.success = false;
				$scope.error = false;
				var src = $('#edit_page').attr('src');
				$.get(src).then(function(response){
					var html = response;
					var validationResult = amp.validator.validateString(html);
					if(validationResult.status == 'PASS'){
						$scope.success = true;
						$scope.errorLength = 0;
						safeApply($scope);
					}
					else{
						$scope.failed = true;
						$scope.errorLength = validationResult.errors.length;
						$scope.errors = printResult(validationResult);
						safeApply($scope);
					}
						
						
				});
			}
			var printResult = function(validationResult)
			{
				var rs = [];
				for (var ii = 0; ii < validationResult.errors.length; ++ii) {

					var error = validationResult.errors[ii];
					error.message = amp.validator.renderErrorMessage(error);
					error.category = amp.validator.categorizeError(error);
					error.icon = error.severity.toLowerCase();
					error.isError = error.severity === 'ERROR';
					error.isWarning = error.severity === 'WARNING';
					rs.push(error);
				}
				return rs;
			}
		}
	}
}
