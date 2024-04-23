export function SatellizerConfig ($authProvider) {
  'ngInject'

  $authProvider.httpInterceptor = function () {
    return true
  }

  $authProvider.loginUrl = window.basePath + '/login';
  $authProvider.tokenRoot = 'data' // compensates success response macro
}
