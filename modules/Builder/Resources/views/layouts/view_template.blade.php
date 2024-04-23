<!doctype html>
<html amp >
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="language" content="en" />
	<link rel="canonical" href="{{url('/')}}">
	
	<meta name="description" content="@yield('pageDescription')"/>
	<meta name="keywords" content="@yield('pageKeywords')"/>	
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
   
	{!! \Assets::renderHeader() !!}
	{!! app('app.widget')->renderStyle() !!}
	
	
	{!! app('app.widget')->renderScript() !!}
	{!! app('app.widget')->renderFonts() !!}

<title>@yield('pageTitle')</title>

</head>
<body class="{{$template->type}}" page-type="page_template" template-type="{{$template->type}}">

@yield('content')

</body>
</html>