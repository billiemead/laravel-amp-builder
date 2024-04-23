<form class="" config-form="screenshot" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.screenshot_tab.provider')</label>
		<md-select ng-model="data.provider">
			@php($providers = config('screenshot.providers'))
			@foreach($providers as $name=>$value)
			<md-option value="{{$name}}">{{$name}}</md-option>
			@endforeach
		</md-select>
	</md-input-container>
	
	<div ng-show="data.provider == 'api_flash'">
		<md-input-container class="md-block">
			<label class="control-label">@lang('admin.screenshot_tab.access_key')</label>
			<input type="text" ng-model="data.api_flash.access_key" />
		</md-input-container>
	
	</div>
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
	</div>
	
</form>