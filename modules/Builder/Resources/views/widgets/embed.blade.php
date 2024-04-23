@php
$object = $widget->getEmbedObject();
$amp_service = $widget->getAMPElement($object['amp_code']);

@endphp
@if($widget->isViewMode())
	@if(isset($amp_service))
		@php(app('app.widget')->registerScript("amp-".$amp_service))
	@endif

@else
@endif
{!! $object['amp_code'] !!}
