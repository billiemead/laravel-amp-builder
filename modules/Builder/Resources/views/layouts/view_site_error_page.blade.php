<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{{App::getLocale()}}" lang="{{App::getLocale()}}">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="language" content="en" />
	<meta name="description" content="@yield('pageDescription')"/>
	<meta name="keywords" content="@yield('pageKeywords')"/>	
    <script type="text/javascript">
		var basePath  = '{{url("/")}}';
		var contactFormUrl = '{{url("ajax/sendContact/".$account)}}';
		<?php if ($view_mode == 'subfolder'): ?>
		var homePage  = '{{route("viewSiteRoute", ["account"=>$account])}}';
		<?php endif ?>
		var view_mode = '{{$view_mode}}';
		var version = "1";
		var X_CSRF_TOKEN = "{{csrf_token()}}";
	</script>
        	

<title>@yield('pageTitle')</title>
</head>
<body class="">
@include('layouts.preloader')
@if(isset($site))
{{--*/ $owner = $site->owner() /*--}}

{{--*/ $plan = $owner->getCurrentPlan() /*--}}
@if(isset($plan) && !empty($plan->header_code))
	{{$plan->header_code}}
@endif
@endif

@yield('content')
<style>
	.error-template {padding: 40px 15px;text-align: center;}
	.error-actions {margin-top:15px;margin-bottom:15px;}
	.error-actions .btn { margin-right:10px; }
</style>
<link rel="stylesheet" type="text/css" href="<?php echo url('/'); ?>/public/assets/css/pace.default.css" />
<link rel="stylesheet" type="text/css" href="<?php echo url('/'); ?>/public/assets/css/app/style.css?{{STS_VERSION}}" />
<link rel="stylesheet" type="text/css" href="<?php echo url('/');?>/storage/sites/{{$account}}/public/assets/css/themes.css" />
<link rel="stylesheet" type="text/css" href="<?php echo url('/');?>/storage/sites/{{$account}}/public/assets/css/style.css" />
<script type="text/javascript" src="<?php echo url('/'); ?>/public/assets/js/app_base.js"></script>
<script type="text/javascript" src="<?php echo url('/'); ?>/public/assets/js/app.js"></script>
<script type="text/javascript" src="<?php echo url('/'); ?>/public/assets/js/frontend.js"></script>

<script type="text/javascript" src="http://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
<script type="text/javascript" src="http://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key={{config('general.google_api_key')}}&sensor=true&callback=initializeMap"></script>
@if(isset($plan) && !empty($plan->footer_code))
	{{$plan->footer_code}}
@endif	
</body>
</html>