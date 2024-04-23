<form class="" config-form="auth" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-input-container class="md-block">
		<md-checkbox ng-model="data.activation.enabled" ng-checked="data.activation.enabled == true || data.activation.enabled == 1">@lang('admin.authentication_services.activation')</md-checkbox>
	</md-input-container>
	<md-input-container class="md-block">
		<md-checkbox ng-model="data.welcome_email_enabled" ng-checked="data.welcome_email_enabled == true || data.welcome_email_enabled == 1">@lang('admin.authentication_services.send_welcome_email')</md-checkbox>
	</md-input-container>
	<md-input-container class="md-block">
		<md-checkbox ng-model="data.disable_register" ng-checked="data.disable_register == true || data.disable_register == 1">@lang('admin.authentication_services.disable_register')</md-checkbox>
	</md-input-container>
	
	<md-input-container class="md-block">
		<md-checkbox ng-model="data.reCAPTCHA.enable" ng-checked="data.reCAPTCHA.enable == true || data.reCAPTCHA.enable == 1">@lang('admin.authentication_services.enable_recaptcha')</md-checkbox>
	</md-input-container>
	<md-input-container class="md-block">
		<label>@lang('admin.authentication_services.recaptcha_version')</label>
		<md-select ng-model="data.reCAPTCHA.version">
			<md-option value="3">reCAPTCHA v3</md-option>
			<md-option value="2">reCAPTCHA v2 Checkbox</md-option>
		</md-select>
	</md-input-container>
	<md-input-container class="md-block">
		<label>@lang('admin.authentication_services.recaptcha_site_key')</label>
		<input ng-model="data.reCAPTCHA.site_key">
	</md-input-container>
	<md-input-container class="md-block">
		<label>@lang('admin.authentication_services.recaptcha_secret_key')</label>
		<input ng-model="data.reCAPTCHA.secret_key">
	</md-input-container>
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
	</div>
</form>
