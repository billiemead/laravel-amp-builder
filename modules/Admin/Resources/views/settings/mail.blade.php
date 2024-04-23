<form class="" config-form="mail" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.mail_services.from')</label>
			<textarea type="text" ng-model="data.from.address"></textarea>
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.mail_services.from_name')</label>
		<textarea type="text" ng-model="data.from.name"></textarea>
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.mail_services.encryption')</label>
		<md-select ng-model="data.encryption">
			@php($encryptions = ["ssl", "tls"])
			@foreach($encryptions as $encryption)
			<md-option value="{{$encryption}}">{{$encryption}}</md-option>
			@endforeach
		</md-select>
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.mail_services.driver')</label>
		<md-select ng-model="data.driver">
			@php($mail_drivers = ["smtp", "mail", "sendmail", "mailgun", "sparkpost", "ses", "log"])
			@foreach($mail_drivers as $driver)
			<md-option value="{{$driver}}">{{$driver}}</md-option>
			@endforeach
		</md-select>
	</md-input-container>
	<div ng-show="data.driver == 'smtp'">
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.host')</label>
			<input type="text" ng-model="data.host" />
		</md-input-container>
		
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.port')</label>
			<input type="text" ng-model="data.port" />
		</md-input-container>
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.username')</label>
			<input type="text" ng-model="data.username" />
		</md-input-container>
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.password')</label>
			<input type="password" ng-model="data.password" />
		</md-input-container>
	</div>
	<div ng-show="data.driver == 'mailgun'">
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.mailgun.domain')</label>
			<input type="text" ng-model="data.mailgun.domain" />
		</md-input-container>
		
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.mailgun.secret')</label>
			<input type="text" ng-model="data.mailgun.secret" />
		</md-input-container>
	</div>
	<div ng-show="data.driver == 'sparkpost'">
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.mailgun.secret')</label>
			<input type="text" ng-model="data.sparkpost.secret" />
		</md-input-container>
	</div>
	<div ng-show="data.driver == 'ses'">
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.ses.key')</label>
			<input type="text" ng-model="data.ses.key" />
		</md-input-container>
		
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.ses.secret')</label>
			<input type="text" ng-model="data.ses.secret" />
		</md-input-container>
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.mail_services.ses.region')</label>
			<input type="text" ng-model="data.ses.region" />
		</md-input-container>
	</div>
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
		
	</div>
	
</form>
<form ng-submit="send_test_mail(test_email)">
	<h3>@lang('admin.mail_services.send_test_mail_title')</h3>
	<md-input-container class="md-block">
		<input type="email" ng-model="test_email" required placeholder="email"/>
	</md-input-container>
	<div class="form-group">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.mail_services.send_test_mail')</md-button>
	</div>
</form>