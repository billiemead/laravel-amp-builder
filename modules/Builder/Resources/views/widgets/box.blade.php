@php($modules = array_get($config, 'modules', []))
@foreach($modules as $module)
{!! $widget->renderChildModule($module) !!}
@endforeach