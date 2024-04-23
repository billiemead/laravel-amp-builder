
<div class="box-body">
	<form class="" ng-submit="save('socials')" layout="column">
		<uib-alert type="danger"  ng-repeat="error in errors">
			@{{error}}
		</uib-alert>
		<div layout="row">
			<div flex="33" layout-padding>
				<h3>Facebook</h3>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.paypal.status')</label>
					<md-select type="text" ng-model="socials_config.facebook.status">
						<md-option value="0">@lang('admin.paypal.disable')</md-option>
						<md-option value="1">@lang('admin.paypal.enable')</md-option>
					</md-select>
				</md-input-container>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.facebook.client_id')</label>
					<input type="text" ng-model="socials_config.facebook.client_id" />
				</md-input-container>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.facebook.client_secret')</label>
					<input type="text" type="text" ng-model="socials_config.facebook.client_secret"/>
				</md-input-container>
			</div>
			<div flex="33" layout-padding>
				<h3>Twitter</h3>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.paypal.status')</label>
					<md-select type="text" ng-model="socials_config.twitter.status">
						<md-option value="0">@lang('admin.paypal.disable')</md-option>
						<md-option value="1">@lang('admin.paypal.enable')</md-option>
					</md-select>
				</md-input-container>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.facebook.client_id')</label>
					<input type="text" ng-model="socials_config.twitter.client_id" />
				</md-input-container>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.facebook.client_secret')</label>
					<input type="text" type="text" ng-model="socials_config.twitter.client_secret"/>
				</md-input-container>
			</div>
			<div flex="33" layout-padding>
				<h3>Google Plus</h3>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.paypal.status')</label>
					<md-select type="text" ng-model="socials_config.google.status">
						<md-option value="0">@lang('admin.paypal.disable')</md-option>
						<md-option value="1">@lang('admin.paypal.enable')</md-option>
					</md-select>
				</md-input-container>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.facebook.client_id')</label>
					<div class="controls">
						<input type="text" ng-model="socials_config.google.client_id" />
					</div>
				</md-input-container>
				<md-input-container class="md-block">
					<label class="control-label">@lang('admin.facebook.client_secret')</label>
					<input type="text" type="text" ng-model="socials_config.google.client_secret"/>
				</md-input-container>

			</div>
		</div>
		<div class="box-footer">
			<md-button class="md-raised md-primary" type="submit">Save</md-button>
		</div>
	</form>
</div>