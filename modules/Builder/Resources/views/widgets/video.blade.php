@php
$object = $widget->getEmbedObject();
$amp_service = $widget->getAMPElement($object['amp_code']);
@endphp
@if($widget->isViewMode())
	@if(isset($amp_service))
		@php(app('app.widget')->registerScript("amp-".$amp_service))
	@endif
	@php(app('app.widget')->registerScript("amp-iframe"))
	{!! $object['amp_code'] !!}
@else
{!! $object['code'] !!}
@endif