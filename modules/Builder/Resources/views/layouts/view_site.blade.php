<!doctype html>
<html amp>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<link rel="canonical" href="{{array_get($pageSEO, 'canonical_url', url('/'))}}">
	<meta name="language" content="en" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="{{array_get($pageSEO, 'description')}}"/>
	<meta name="keywords" content="{{array_get($pageSEO, 'keywords')}}"/>
	@php
		$favicon = array_get($pageSEO, 'favicon');
		if(empty($favicon))
			$favicon = config('general.fav_icon');
	@endphp
	<link rel="icon" href="{{ $favicon }}">
	
	@php(app('app.widget')->registerScript('amp-analytics'))
	{!! \Assets::renderHeader() !!}
	{!! app('app.widget')->renderStyle() !!}
	
	@if(!empty($pageCustomCSS['code']))
		{!! app('app.widget')->renderCustomStyle($pageCustomCSS['code']) !!}
	@endif
	{!! app('app.widget')->renderScript() !!}
	{!! app('app.widget')->renderFonts() !!}
	@if(!empty($pageCustomJs['header']))
			{{$pageCustomJs['header']}}
	@endif
	@if(!empty($pageCustomHtml['header']))
		{!! $pageCustomHtml['header'] !!}
	@endif
	<title>{{array_get($pageSEO, 'title')}}</title>

</head>
<body>
	
	<amp-analytics>
	<script type="application/json">
	{
	  "requests": {
		"pageview": "{{config('app.url')}}/track/{{$page->uuid}}",
		"conversion": "{{config('app.url')}}/track/{{$page->uuid}}?type=conversion&goal=form_submission"
	  },
	  "extraUrlParams": {
		  "_token": "{{csrf_token()}}"
		},
	
	  "triggers": {
		"trackPageview": {
		  "on": "visible",
		  "request": "pageview"
		},
		 "formSubmitSuccess": {
          "on": "amp-form-submit-success",
          "request": "conversion",
          "vars": {
            "eventId": "form-submit-success"
          }
        }
	  }
	 
	}
	</script>
	</amp-analytics>
	@if(!empty($pageAnalytics['google_tag_manager_id']))
		<amp-analytics config="https://www.googletagmanager.com/amp.json?id={{$pageAnalytics['google_tag_manager_id']}}" data-credentials="include"></amp-analytics>
	@endif
	@if(!empty($pageAnalytics['fb_pixel_id']))
		@php(app('app.widget')->registerScript('amp-analytics'))
		<amp-analytics type="facebookpixel" id="facebook-pixel">
			<script type="application/json">
			{
			  "vars": {
				"pixelId": "{{$pageAnalytics['fb_pixel_id']}}"
			  },
			  "triggers": {
				"trackPageview": {
				  "on": "visible",
				  "request": "pageview"
				}
			  }
			}
			</script>
		</amp-analytics>
	@endif
	@if(!empty($pageAnalytics['ga_code']))
		@php(app('app.widget')->registerScript('amp-analytics'))
		<amp-analytics type="googleanalytics" id="googleanalytics">
			<script type="application/json">
			{
			  "extraUrlParams" : {
				"dimension5": "AMP",
				"metric17": "10"
			  },
			  "vars": {
				"account": "{{$pageAnalytics['ga_code']}}",
				"anonymizeIP": ""
			  },
			  "triggers": {
				"defaultPageview": {
				  "on": "visible",
				  "request": "pageview",
				  "vars": {
					"title": "Example Pageview"
				  }
				}
			  }
			}
			</script>
		</amp-analytics>
	@endif
	@if(!empty($pageCustomJs['body']))
		{{$pageCustomJs['body']}}
	@endif
	@if(!empty($pageCustomHtml['body']))
		{!! $pageCustomHtml['body'] !!}
	@endif


@yield('content')




@if(!empty($pageCustomJs['footer']))
		{{$pageCustomJs['footer']}}
@endif
@if(!empty($pageCustomHtml['footer']))
	{!! $pageCustomHtml['footer'] !!}
@endif


</body>
</html>