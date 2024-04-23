@php
	$frontendConfig = config('frontend');
@endphp
<form class="" config-form="frontend" layout-padding>
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-tabs md-dynamic-height md-border-bottom md-center-tabs>
	@foreach($frontendConfig as $section_name=>$section)
		@php
			$keys = recursive_array_keys($section);
		@endphp
		<md-tab label="{{$section_name}}">
			<md-content layout-padding>
			@foreach($keys as $key)
			<md-input-container class="md-block">
				<label class="control-label">
					@if(trans('admin.landingpage.'.$key) != 'admin.landingpage.'.$key)
						@lang('admin.landingpage.'.$key)
					@else
					{{$key}}
					@endif
				</label>
				<input type="text" ng-model="data.{{$section_name}}.{{$key}}" />
			</md-input-container>
			@endforeach
			</md-content>
		</md-tab>
	@endforeach
	</md-tabs>
	
	<div class="box-footer">
		<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
	</div>
</form>
