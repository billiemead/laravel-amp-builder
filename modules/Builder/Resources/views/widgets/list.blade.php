@php(app('app.widget')->registerScript('amp-list'))
@php(app('app.widget')->registerScript('amp-mustache', 2))
<amp-list src="{{$widget->getRealPath($data['src'])}}" {!! $widget->getAMPTag() !!}>
	<template type="amp-mustache">{!! array_get($data, 'template') !!}</template>
</amp-list>
