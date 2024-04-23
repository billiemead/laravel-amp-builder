<form class="" config-form="publishing" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-input-container class="md-block">
		<md-checkbox ng-model="data.subdomain.enabled" ng-checked="data.subdomain.enabled == true || data.subdomain.enabled == 1">@lang('admin.publishing_tab.subdomain_enabled')</md-checkbox>
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">
			@lang('admin.publishing_tab.subdomain_name')
		</label>
		<input type="text" ng-model="data.subdomain.domain" />
	</md-input-container>
	<md-input-container class="md-block">
		<md-checkbox ng-model="data.domain.enabled" ng-checked="data.domain.enabled == true || data.domain.enabled == 1">@lang('admin.publishing_tab.domain_enabled')</md-checkbox>
	</md-input-container>
	
	<label class="control-label">@lang('admin.publishing_tab.domain_instruction')</label>
	<md-input-container class="md-block">
		<textarea ng-model="data.domain.instruction" rows="5"></textarea>
	</md-input-container>
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
	</div>
</form>
