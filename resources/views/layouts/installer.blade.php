<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="{{App::getLocale()}}" lang{{App::getLocale()}}en" ng-app="installer_app">
<head>
	@include('layouts.meta_tag')
	{!! \Assets::renderHeader() !!}
	{!! \Themes::render('admin') !!}
	<script type="text/javascript">
		var basePath  = '{{url("/")}}';
		var baseUrl  = '{url}';
		var ajaxPath  = '{action}';
		var apiPath  ='{{url("/ajax/{action}")}}';
		var viewPath  = '{{url("/view_url")}}/path/profile.{viewPath}';
		var listPath  = '{{url("/list/{name}")}}';
		var baseScriptPath = 'scripts';
		var version = "1";
		var X_CSRF_TOKEN = "{{csrf_token()}}";
	</script>
</head>
<body id="page" class=""  ng-controller="installerController" ng-cloak>
	<div id="loadingSpinner" style="display:none;"><div><div class="ui-block"></div></div></div>
	<div id="main" layout="column">
		<div layout="row" id="main-layout">
			<material-preloader>
				<div class="material-preloader">
					<div layout="row" layout-sm="column" layout-align="center" class="layout-sm-column layout-align-center-stretch layout-row">
						<md-progress-circular md-mode="indeterminate" aria-valuemin="0" aria-valuemax="100" role="progressbar" class="ng-isolate-scope md-mode-indeterminate" style="width: 50px; height: 50px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" style="width: 50px; height: 50px; transform-origin: 25px 25px 25px;"><path fill="none" stroke-width="5" stroke-linecap="square" d="M25,2.5A22.5,22.5 0 1 1 2.5,25" stroke-dasharray="106.02875205865553" stroke-dashoffset="139.05579720699458" transform="rotate(-90 25 25)"></path></svg></md-progress-circular>
					</div>
				</div>
			</material-preloader>
				@yield('content')
		</div>
		{!! \Assets::renderFooter() !!}
		
	</div>
</body>
</html>