<select name="{{$widget->getPage_id()}}">
	@foreach($widget->getValues() as $value)
	<option value="{{$value}}">{{$value}}</option>
	@endforeach
</select>