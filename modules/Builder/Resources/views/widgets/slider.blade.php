@if($widget->isViewMode())
	@php(app('app.widget')->registerScript('amp-carousel'))
@endif
<amp-carousel {!! $widget->getAMPTag() !!} type="slides">
	@php($slides = array_get($config, 'slides', []))
	@foreach($slides as $slide)
		<div class="slides">
			<div class="inner_slide">
				@foreach($slide as $module)
				{!! $widget->renderChildModule($module) !!}
				@endforeach
			</div>
		</div>
	 @endforeach
</amp-carousel>
