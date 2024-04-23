function ngTokenClass () {
  return {
    scope: {
      ngToken: '@',
	  redirect:'='
    },
	controller: function($scope, $auth)
	{
		"ngInject";
		$auth.setToken($scope.ngToken);
	}
  }
}

export const ngTokenClassComponent = ngTokenClass
