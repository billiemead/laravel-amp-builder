<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="{{sts_getBiDirection()}}" xml:lang="{{App::getLocale()}}" lang="{{App::getLocale()}}" ng-app="admin_app" ng-strict-di>
<head>
	@include('layouts.meta_tag') 
	{!! \Assets::renderHeader() !!}
	{!! \Themes::render('profile') !!}
</head>
<body id="page" class=""  ng-controller="profileController">
	<div ng-token="{{JWTAuth::fromUser(auth()->user())}}"></div>
	<div id="main" layout="column">
		@include('layouts.preloader')
		@include('layouts.builder_loader') 

		<div layout="row" id="main-layout">
			@include('layouts.admin_sidebar')
			@php
			$isExpired = auth()->user()->isExpired();
			@endphp
			<md-content layout="column" flex>
				<md-toolbar  id="toolbar" class="md-menu-toolbar">
				<div class="md-toolbar-tools">
					<md-button class="md-icon-button" aria-label="" ld-sidenav-toggle="navigation" hide-gt-sm>
						<md-icon class="fa fa-bars"></md-icon>
					</md-button>
					
					<md-button class="md-icon-button" aria-label="" href="#projects/list">
					<md-icon class="fa fa-laptop"></md-icon>
					</md-button>
					
					<h2 flex md-truncate>
					</h2>
					
					@include('common.account_menu')
				</div>
			</md-toolbar>
				@yield('content')
			</md-content>	
			<script type="text/javascript">
					var basePath  = '{{url("/")}}';
					var baseUrl  = '{url}';
					var ajaxPath  = '{action}';
					var apiPath  ='{{url("/api/profile/")}}';
					var viewPath  = '{{url("/api/view_url")}}/path/profile::{viewPath}';
					var analyticviewPath  = '{{url("/analytic/{site_id}/view_url")}}?path={viewPath}';
					var listPath  = '{{url("/list/{name}")}}';
					var user_expired = {{$isExpired ? 1 : 0}};
					var routes  = {!! json_encode(config("profile.ui-router")) !!};
					var X_CSRF_TOKEN = "{{ csrf_token() }}";
			</script>
			{!! \Assets::renderFooter() !!}
		</div>
	</div>
	
	@include('layouts.footer')
	@include('common.language')
	@include('profile::language')
	@include('layouts.sentry') 

</body>
</html>