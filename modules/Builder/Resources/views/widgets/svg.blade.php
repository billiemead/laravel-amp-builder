@php
$url = array_get($data,'src');
$code = $widget->getCode();

@endphp




	@if(isset($code))
	{!! $code !!}
	@else
	<amp-img width="{{$widget->getHeight()}}" height="{{$widget->getWidth()}}" layout="responsive" src="{{$url}}"></amp-img>
	@endif
