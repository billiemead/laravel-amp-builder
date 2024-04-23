<form class="" config-form="visitortracker" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
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
		<label class="control-label">@lang('admin.start_plan')</label>
		<md-select type="text" ng-model="data.start_plan">
			<md-option ng-repeat="plan in plans" ng-value="plan.id">@{{plan.name}}</md-option>
		</md-select>
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.trial_time')</label>
		<input type="text" ng-model="data.trial_time" />
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.google_api_key')</label>
		<input type="text" ng-model="data.google_api_key" />
	</md-input-container>
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
	</div>
</form>
