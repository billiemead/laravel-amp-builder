export function RoutesRun ($rootScope, $state, $auth, AclService, $timeout, API, ContextService) {
  'ngInject'
	AclService.resume()

  /*eslint-disable */
	let deregisterationCallback = $rootScope.$on('$stateChangeStart', function (event, toState) {
		if (toState.data && toState.data.auth) {
			if (!$auth.isAuthenticated()) {
				event.preventDefault()
				return $state.go('login')
			}
		}

		$rootScope.bodyClass = 'hold-transition login-page'
	})

	function stateChange () {
		$timeout(function () {
     
			// get user current context
			if ($auth.isAuthenticated() && !$rootScope.me) {
				ContextService.getContext()
				.then((response) => {
					$rootScope.me = response;
				})
			}
		})
  }

  $rootScope.$on('$destroy', deregisterationCallback)
  $rootScope.$on('$stateChangeSuccess', stateChange)
/*eslint-enable */
}
