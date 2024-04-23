@if($widget->isViewMode())
	@php
		app('app.widget')->registerScript('amp-instagram');
		
	@endphp
@endif
<amp-instagram layout="responsive" width="1" height="1" data-shortcode="{{array_get($data, 'shortcode')}}"></amp-instagram>