@php
	$mask = array_get($data,'masks.mask');
	$mask_output = array_get($data,'masks.mask_output');
	$mask_trim_zeros = array_get($data,'masks.mask_trim_zeros', 2);
	$autocompletes_values = $widget->getAutocompleteValues();
	
	$maxlength = array_get($data,'maxlength');
	$minlength = array_get($data,'minlength');
	$required = array_get($config, 'data.validators.required');


@endphp
@php(app('app.widget')->registerScript('amp-inputmask'))
@php(app('app.widget')->registerScript('amp-autocomplete'))
<amp-autocomplete filter="substring">
	<input type="text" name="{{$widget->getPage_id()}}" @if(!empty($mask))  mask="{{$mask}}" mask-trim-zeros="{{$mask_trim_zeros}}" mask-output="{{$mask_output}}" @endif placeholder="{{array_get($data,'placeholder')}}" @if(!empty($maxlength)) maxlength="{{$maxlength}}" @endif @if(!empty($minlength)) minlength="{{$minlength}}" @endif {{$required ? ' required' : ''}} />
	<script type="application/json">
		{!! json_encode($autocompletes_values) !!}
	</script>
</amp-autocomplete>