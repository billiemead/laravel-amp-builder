<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="{{sts_getBiDirection()}}" xml:lang="{{App::getLocale()}}" lang="{{App::getLocale()}}" dir="{{sts_getBiDirection()}}" ng-app="admin_app">
<head>
	@include('layouts.meta_tag')
	{!! \Assets::renderHeader() !!}
	{!! \Themes::render('admin') !!}
</head>
<body class="login_page" ng-cloak>
@include('layouts.preloader') 
    @yield('content')
	
	{!! \Assets::renderFooter() !!}

	
	
	<script type="text/javascript">
		var basePath  = '{{asset("/")}}';
		var baseUrl  = '{url}';
		var X_CSRF_TOKEN = "{{csrf_token()}}";
	</script>
</body>
</html>