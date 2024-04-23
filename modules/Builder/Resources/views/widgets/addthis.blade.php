@if($widget->isViewMode())
	@php
		app('app.widget')->registerScript('amp-addthis')
	@endphp
@endif
<amp-addthis layout="responsive" width="1" height="1" data-pub-id="{{array_get($data, 'pub_id')}}" data-widget-id="{{array_get($data, 'widget_id')}}" data-widget-type="{{array_get($data, 'widget_type')}}"></amp-addthis>