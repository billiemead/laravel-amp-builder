@php
	$dir  = resource_path('lang');
	$files = array_diff(scandir($dir), array('..', '.'));
@endphp
<form class="" config-form="app" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-input-container class="md-block">
		<md-checkbox  ng-model="data.rtl">@lang('admin.language_tab.rtl')</md-checkbox>
	</md-input-container>
	<md-input-container class="md-block">
		<label class="control-label">@lang('admin.language_tab.language')</label>
		<md-select ng-model="data.locale">
			@foreach($files as $file)
			<md-option value="{{$file}}">{{$file}}</md-option> 
			@endforeach
		</md-select>
	</md-input-container>
	
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
	</div>
</form>
