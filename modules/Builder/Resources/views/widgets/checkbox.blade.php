@php
	$values = $widget->getValues();
	$singlePost = sizeof($values) <= 1;
@endphp
	@foreach($values as $value)
	<label><input type="checkbox" name="{{$widget->getPage_id()}}{{!$singlePost ? '[]':''}}" value="{{$value}}">{{$value}}</label>
	@endforeach
