@if($widget->isViewMode())
	@php
		app('app.widget')->registerScript('amp-facebook-comments');
		
	@endphp
@endif
<amp-facebook-comments layout="responsive" width="1" height="1" data-numposts="{{array_get($data, 'numposts')}}" data-href="{{array_get($data, 'href')}}" ></amp-facebook-comments>