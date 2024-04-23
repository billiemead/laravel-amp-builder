<form class="" config-form="analytic" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-input-container class="md-block">
		<label class="control-label">@lang('analytic.ga_tracking_code')</label>
		<input type="text" ng-model="data.ga_code" placeholder="UA-"/>
	</md-input-container>
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
	</div>
</form>
