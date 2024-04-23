@php
	$modules = array_get($config, 'modules', [])
@endphp
@foreach($modules as $module)
{!! $widget->renderChildModule($module) !!}
@endforeach
@if($widget->isViewMode())
<a class="close-dialog" on="tap:wrapper_{{$widget->getPage_id()}}.{{$widget->getPopupType() == 'user_notification' ? 'dismiss':'close'}}">
@include('common.svg.close')

</a>
@php
	app('app.widget')->registerScript($widget->getPopupTag());
@endphp
@endif