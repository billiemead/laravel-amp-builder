<form class="" config-form="general" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.brand_name')</label>
		<input type="text" ng-model="data.brand_name" />
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.title')</label>
		<input type="text" ng-model="data.title" />
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.description')</label>
			<textarea type="text" ng-model="data.description"></textarea>
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.keywords')</label>
		<textarea type="text" ng-model="data.keywords"></textarea>
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.fav_icon')</label>
		<input type="text" ng-model="data.fav_icon" />
	</md-input-container>
	
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.logo')</label>
		<input type="text" ng-model="data.logo" />
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.logo_white')</label>
		<input type="text" ng-model="data.logo_white" />
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.logo_small_white')</label>
		<input type="text" ng-model="data.logo_small_white" />
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.google_api_key')</label>
		<input type="text" ng-model="data.google_api_key" />
	</md-input-container>
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
	</div>
</form>
