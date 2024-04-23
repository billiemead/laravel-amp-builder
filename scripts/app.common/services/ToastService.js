export class ToastService {
	constructor ($mdToast) {
		'ngInject'
		this.$mdToast = $mdToast
	}
	getToastPosition()
	{
		
	}
	showSimpleToast(content, position = 'top center', hideDelay = 3000) {
		let $mdToast = this.$mdToast

		$mdToast.show(
			$mdToast.simple()
			.textContent(content)
			.position(position )
			.hideDelay(hideDelay)
		);
	}
	showCustomToast(options) {
		let $mdToast = this.$mdToast
		$mdToast.show(options);
	}

}
