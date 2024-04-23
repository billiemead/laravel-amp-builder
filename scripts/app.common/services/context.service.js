export class ContextService {
	constructor ($auth, $rootScope, API, AclService) {
    'ngInject'
		this.$auth = $auth
		this.API = API
		this.$rootScope = $rootScope;
		this.AclService = AclService
	}

	getContext () {
		let $auth = this.$auth
		let AclService = this.AclService;
		if ($auth.isAuthenticated()) {
			let API = this.API
			let basePath = window.basePath
			basePath = $.trim(basePath)
			let UserData = API.oneUrl('users', basePath + (basePath[basePath.length - 1] == '/' ? '' : '/') + 'api/auth/users/me')

			return UserData.get().then(function(json){

				angular.forEach(json.roles, function (value) {
					AclService.attachRole(value.name);
				})
				AclService.setAbilities(json.abilities)
				
			})
		} else {
			return null
		}
	}

	me (cb) {
		this.$rootScope.$watch('me', function (nv) {
			cb(nv)
		})
	}
}
