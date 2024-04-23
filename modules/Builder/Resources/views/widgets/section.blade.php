@php($modules = array_get($config, 'data', []))
@foreach($modules as $module)
{!! $widget->renderChildModule($module); !!}
@endforeach