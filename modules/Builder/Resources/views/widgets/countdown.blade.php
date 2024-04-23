@php
$dateString = $widget->toISODate()
@endphp
@if(is_string($dateString))
	@if($widget->isViewMode())
		@php
			app('app.widget')->registerScript('amp-date-countdown');
			app('app.widget')->registerScript('amp-mustache', 2);
			
		@endphp
	@endif
<amp-date-countdown  end-date="{{$widget->toISODate()}}" layout="flex-item">
  <template type="amp-mustache">
	<div class="countdown"><div class="countdown-section days"><span class="count curr">@{{d}}</span> <span class="unit">days</span></div><div class="countdown-section hours"><span class="count curr">@{{h}}</span> <span class="unit">hours</span></div><div class="countdown-section minutes"><span class="count curr">@{{m}}</span> <span class="unit">minutes</span></div><div class="countdown-section seconds"><span class="count curr">@{{s}}</span> <span class="unit">seconds</span></div></div>
  </template>
</amp-date-countdown>
@endif