@php
	$integrationConfig = config('integrations');
@endphp
<div class="box-body">
	<form class="" config-form="integrations" layout="column">
		<uib-alert type="danger"  ng-repeat="error in errors">
			@{{error}}
		</uib-alert>
		<div layout="" layout-wrap>
			@foreach($integrationConfig as $name=>$integration)
				@php
					if(isset($integration['disabled']) && $integration['disabled'])
						continue;
					$fixed_attributes = array_get($integration, 'fixed_attributes', []);
					unset($integration['fixed_attributes']);
					$keys = recursive_array_keys($integration);
					
				@endphp
			<div flex="33" layout-padding>
				@php
					$keyHelpUrl = 'admin.integration_services.'.$name.'.help_url';
					
				@endphp
				<h5>{{$name}}@if(trans($keyHelpUrl) != $keyHelpUrl) (<a href="@lang($keyHelpUrl)" target="_blank">?</a>)@endif</h5>
				@foreach($keys as $key)
					@php
						if(in_array($key, $fixed_attributes))
							continue;
						$keylang = 'admin.integration_services.'.$name.'.'.$key;
						$realLang = trans($keylang) != $keylang ? trans($keylang) : $key;
					@endphp
				<md-input-container class="md-block">
					
					@if(is_bool(config('integrations.'.$name.'.'.$key)))
						<md-checkbox  ng-model="data.{{$name}}.{{$key}}">{{$realLang}}</md-checkbox>
					@else
					<label class="control-label">
					{{$realLang}}
					</label>
					<input type="text" ng-model="data.{{$name}}.{{$key}}" />
					@endif
				</md-input-container>
				@endforeach
				
			</div>
			@endforeach
			
		</div>
	
		<div class="box-footer">
			<md-button class="md-raised md-primary" type="submit">@lang('admin.save')</md-button>
		</div>
	</form>
</div>