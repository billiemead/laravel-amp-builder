
<material-preloader id="site-preloader">
	<div class="preloader">
		<div class="loader-inner">
			<div class="logo animation-rotate">
				{!! \Modules\Builder\Widgets\Svg::getSVGContent(config('general.logo_svg'), false) !!}
			</div>
			<p>{{config('general.brand_name')}}</p>
		</div>
	</div>
</material-preloader>