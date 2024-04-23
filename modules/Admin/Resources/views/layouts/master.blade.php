<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="{{sts_getBiDirection()}}" xml:lang="{{App::getLocale()}}" lang="{{App::getLocale()}}" ng-app="admin_app" ng-strict-di>
<head>
	@include('layouts.meta_tag') 
	{!! \Assets::renderHeader() !!}
	{!! \Themes::render('admin') !!}
</head>
<body id="page" class="" ng-controller="adminController" route-body-class ng-cloak>
	<div ng-token="{{JWTAuth::fromUser(auth()->user())}}"></div>

	<div id="main" layout="column">
		@include('layouts.preloader') 
		@include('layouts.builder_loader') 
		<div layout="row" id="main-layout">
			@include('layouts.admin_sidebar') 
			<md-content layout="column" flex>
				<md-toolbar id="toolbar" class="md-menu-toolbar">
				<div class="md-toolbar-tools">
					<md-button class="md-icon-button" aria-label="" ld-sidenav-toggle="navigation" hide-gt-sm>
						<md-icon class="fa fa-bars"></md-icon>
					</md-button>
					<md-button class="md-icon-button" aria-label="" href="#users/list">
						<md-icon class="fa fa-user"></md-icon>&nbsp
					</md-button>
					<md-button class="md-icon-button" aria-label="" href="#settings/general">
						<md-icon class="fa fa-cog"></md-icon>&nbsp
					</md-button>
					<h2 flex md-truncate>
					</h2>

					@include('common.account_menu')
				</div>
			</md-toolbar>
			@include('common.update') 
			@yield('content')
		</div>
	</div>

	<script type="text/javascript">
		var basePath  = '{{asset("/")}}';
		var baseUrl  = '{url}';
		var ajaxPath  = '{action}';
		
		var apiPath  ='{{url("/api/admin/")}}';
		var viewPath  = '{{url("/api/view_url")}}/path/admin::{viewPath}';
		var routes  = {!! json_encode(config("admin.ui-router")) !!};
		var X_CSRF_TOKEN = "{{csrf_token()}}";
	</script>
	{!! \Assets::renderFooter() !!}
@include('common.language')
@include('layouts.sentry')
</body>

</html>