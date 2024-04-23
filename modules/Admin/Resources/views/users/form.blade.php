<div class="box">
	<form name="form" ng-submit="submit()">
		<uib-alert type="danger"  ng-repeat="error in errors">
			@{{error}}
		</uib-alert>
		<md-input-container class="md-block">
			<label>@lang('admin.page_users.entry_name')</label>
			<input ng-model="data.name" name="name" type="text" required>
			<div ng-messages="form.name.$error">
				<span class="error" ng-message="required">Please enter a name</span>
			</div>
		</md-input-container>
		<md-input-container class="md-block">
			<label>@lang('admin.page_users.entry_email')</label>
			<input ng-model="data.email" name="email" type="text" required email>
			<div ng-messages="form.email.$error">
				<span class="error" ng-message="required">Please enter a email</span>
				<span class="error" ng-message="email">Please enter a valid email</span>
			</div>
		</md-input-container>
		<md-input-container class="md-block">
			<label>@lang('admin.page_users.entry_password')</label>
			<input ng-model="data.password" name="password" type="password" ng-required="isNew">
			<div ng-messages="form.password.$error">
				<span class="error" ng-message="required">Please enter a name</span>
			</div>
		</md-input-container>
		<label>@lang('admin.page_users.entry_permission')</label>
		<md-input-container class="md-block">
			<md-checkbox ng-model="data.permissions[role.id]"  ng-repeat="role in roles">
			@{{role.name}}
			</md-select>
		</md-input-container>
	
		<md-input-container class="md-block">
			<md-checkbox ng-model="data.is_active" aria-label="Is Active" ng-true-value="1" ng-false-value="0">
				@lang('admin.page_users.entry_active')
			</md-checkbox>
		</md-input-container>
		<md-input-container class="md-block" ng-if="!data.activated">
			<md-checkbox ng-model="data.activated" aria-label="Email validated" ng-true-value="1" ng-false-value="0">
				@lang('admin.page_users.entry_activated')
			</md-checkbox>
		</md-input-container>
		<md-button class="md-raised md-primary" type="submit" ng-disabled="submitting">
			@lang('admin.save')
		  </md-button>
		<md-button class="" href="#users">
			@lang('admin.close')
		</md-button>
	</form>
</div>