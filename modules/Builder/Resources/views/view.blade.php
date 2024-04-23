<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{{App::getLocale()}}" lang="{{App::getLocale()}}" ng-app="frontend_app">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="{{App::getLocale()}}" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	@include('builder::amp_scripts')
	@php
		$themeConfig = $themeObject->getConfig();
		$css_preprocessor = array_get($themeConfig , 'css_preprocessor');
		$use_css_variable = config('builder.use_css_variable');
	@endphp
	<script type="text/javascript">
		var basePath  = '{{url("/")}}';
		var edit_mode = 1;
		var baseUrl  = '{url}';
		var ajaxPath  = '{action}';
	</script>
	
	@if($css_preprocessor== 'less' || $css_preprocessor== 'css')
	<link title="theme_style_id" rel="stylesheet/less" type="text/css" href="{{asset('/')}}/assets/css/empty.css" />


	<script>
		less = {
			env: "development",errorReporting:"console"
		};
		less.globalVars = ({
		  '@theme_path': "'{{ url('/themes/'.$theme) }}'"
		});
	</script>
	<script type="text/html" id="less_inline_style_cached">
	</script>
	
	
	<script type="text/javascript" src="{{asset('/')}}/assets/js/less/less.js"></script>
	@endif
	@if($css_preprocessor== 'sass' || $css_preprocessor== 'scss')
		<script>
		scss = {
			env: "development",errorReporting:"console",
			workerUrl: '{{asset('/')}}/assets/js/sassjs/sass.worker.js'
		};
		
		</script>
		<script type="text/javascript" src="{{asset('assets/js/sassjs/sass.js')}}"></script>
	@endif
	{!! \Assets::renderHeader() !!}

<title></title>
</head>
<body>
{!! $content !!}

{!! \Assets::renderFooter() !!}
</body>
</html>