@php
	$required = array_get($config, 'data.validators.required');
	$maxlength = array_get($data,'maxlength');
	$minlength = array_get($data,'minlength');
@endphp
<input type="tel" name="{{$widget->getPage_id()}}" {{$required ? ' required' : ''}} placeholder="{{array_get($data,'placeholder')}}" @if(!empty($maxlength)) maxlength="{{$maxlength}}" @endif @if(!empty($minlength)) minlength="{{$minlength}}" @endif/>