@php
	$required = array_get($config, 'data.validators.required');
	$maxlength = array_get($data,'maxlength');
	$minlength = array_get($data,'minlength');
@endphp
<textarea name="{{$widget->getPage_id()}}" placeholder="{{array_get($data,'placeholder')}}" {{$required ? ' required' : ''}} @if(!empty($maxlength)) maxlength="{{$maxlength}}" @endif @if(!empty($minlength)) minlength="{{$minlength}}" @endif></textarea>