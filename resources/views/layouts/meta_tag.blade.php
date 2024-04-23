<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="keywords" content="{{config('general.keywords')}}" />
<meta name="description" content="{{config('general.description')}}" />
@if(config('http_fcgi.enable'))
<meta name="bypass_fastcgi" content="{{ config('http_fcgi.tokenName') }}" />
@endif
<link rel="icon" href="{{config('general.fav_icon')}}">
<meta name="language" content="{{App::getLocale()}}" />
<link rel="prefetch" href="{{config('general.logo_svg')}}">
<title>{{config('general.title')}}</title>