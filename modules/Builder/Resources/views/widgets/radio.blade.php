@php
	$values = $widget->getValues();
	$singlePost = sizeof($values) <= 1;
	
@endphp
	@foreach($widget->getValues() as $value)
	<label><input type="radio" name="{{$widget->getPage_id()}}{{!$singlePost ? '[]':''}}" value="{{$value}}">{{$value}}</label>
	@endforeach
