@php
$slides = array_get($config, 'slides', []);
$images = array_get($data, 'images', []);
$index = 0;
$carousel_id = 'carousel_'.$widget->getPage_id();
$attributeString = $widget->getAttributeTag();
$thumbnail = array_get($data, 'thumbnail', false);

@endphp
@if($widget->isViewMode())
	@php
	app('app.widget')->registerScript('amp-carousel');
	@endphp
@endif

<amp-carousel id="{{ $carousel_id }}" {!! $widget->getAMPTag() !!} type="slides"{{$attributeString}}>
	@foreach($images as $image)
		<div>
		<amp-img src="{{$image['src']}}"  width="1"  height="1"  layout="responsive"  alt=""></amp-img>
		@php
			$modules = array_get($slides, $index, []);

			$index++;
		@endphp
		@foreach($modules as $module)
			{!! $widget->renderChildModule($module) !!}
		@endforeach
		</div>
	 @endforeach
</amp-carousel>
@if($thumbnail)
@php
$index = 0;
$thumbnail_width = array_get($data, 'thumbnail_width', 60);

$thumbnail_height = array_get($data, 'thumbnail_height', 40);

@endphp
@if($widget->isViewMode())
<div class="carousel-preview">
	@foreach($images as $image)
		<button on="tap:{{ $carousel_id }}.goToSlide(index={{$index}})">
			<amp-img src="{{$image['src']}}"  width="{{ $thumbnail_width }}"  height="{{ $thumbnail_height }}"  layout="fixed"  alt=""></amp-img>
		</button>
		@php
			$index++;
		@endphp
	 @endforeach
</div>
@endif
@endif