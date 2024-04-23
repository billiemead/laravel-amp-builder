@php
	$lightbox = $widget->lightboxMode() && $widget->isViewMode();
@endphp
@if($lightbox)
	@php(app('app.widget')->registerScript('amp-image-lightbox'))

<amp-image-lightbox id="lightbox_{{$widget->getPage_id()}}" layout="nodisplay"></amp-image-lightbox>
@endif
<amp-img src="{{$widget->getRealPath($data['src'])}}" {!! $widget->getAMPTag() !!}@if($lightbox) on="tap:lightbox_{{$widget->getPage_id()}}" @endif></amp-img>
