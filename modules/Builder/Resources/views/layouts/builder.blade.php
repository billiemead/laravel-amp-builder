<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="{{sts_getBiDirection()}}" xml:lang="{{App::getLocale()}}" lang="{{App::getLocale()}}" ng-app="content_app" ng-strict-di>
<head>
	<script type="text/javascript">
		var basePath  = '{{url("/")}}';
		var baseUrl  = '{url}';
		var ajaxPath  = '{action}';
		var apiPath  ='{{ route("apiRoute") }}';
		var viewPath  = '{{asset("/")}}/resources/views/builder/{viewPath}.html';
		var viewPath  = '{{ url("/view_url") }}/path/builder.{viewPath}';
		var sectionviewPath  = '';
		var themePath  = '{{asset("/")}}/themes/{name}';
		var listPath  = '{{ route("apiRoute", ["variant_id"=>$variant->id]) }}/lists/{name}';
		var themeCssUrl  = '{{url("/themes/{name}/style")}}';
		var siteInfo = {!! json_encode($structure) !!};
		var screenshot_handler  = '{{config("screenshot.provider")}}';
		var baseScriptPath = '{{url("/")}}/scripts';
		var viewSiteUrl  = "{{route('viewSiteRoute', ['account'=>$variant->id])}}";
		var X_CSRF_TOKEN = "{{ csrf_token() }}";
		var resolutions = {!! json_encode(config('resolutions')) !!};
		var widgets = {!! json_encode(config('widgets')) !!};
	</script>
	@include('layouts.meta_tag') 
	{!! \Assets::renderHeader() !!}
	{!! \Themes::render('builder') !!}
</head>

<body id="page"  ng-cloak>
@include('layouts.preloader') 

<div ng-token="{{JWTAuth::fromUser(auth()->user())}}"></div>
<div class="full-height">
	<div class="main_container full-height" layout="column">
		@include('layouts.builder_loader') 
		
		<md-toolbar id="control-panel-holder" class="md-hue-2" ng-controller="headerController">
			<div class="" layout="row" layout-wrap>
				<md-button class="md-icon-button" aria-label="" href="{{url('profile')}}#/projects/edit/{{$variant->site_id}}">
					<i class="fa fa-arrow-left"></i>&nbsp
				</md-button>
			
				<div page-tabs></div>
				<md-button class="" ng-click="managePages()" aria-label="">
					@{{'manage_pages' | lang}}
				</md-button>
				
				<page-resolutions></page-resolutions>
				<md-button class="md-raised md-icon-button md-secondary" ng-disabled="!canUndo" ng-click="doUndo()">
					<i class="fa fa-undo"></i>
				</md-button>
				<md-button class="md-raised md-icon-button md-secondary" ng-disabled="!canRedo" ng-click="doRedo()">
					<i class="fa fa-redo"></i>
				</md-button>
				<div widget-control></div>
				<h2 flex-gt-sm>
				
				</h2>
				<md-button class="md-button" ng-click="history()" aria-label="@lang('builder.history')">
				 @{{'history' | lang}}
				</md-button>
				<md-button class="md-button" ng-click="save()" aria-label="@lang('builder.save')">
				 @{{'save' | lang}}
				</md-button>

				<md-button class="md-button" href="{{$site['preview_url']}}?variant={{$variant->id}}" target="_blank" aria-label=" @lang('builder.preview')">
				 @{{'preview' | lang}}
				</md-button>
				<md-button class="md-icon-button" aria-label="" ng-click="toogleRightPanel()" hide-gt-md>
					<i class="fa fa-bars"></i>
				</md-button>
				
			</div>
		</md-toolbar>
		<div id="editor_container" class="full-height position-relative" flex layout="row">
			<div class="leftPanel" id="leftPanel-container" layout="row">
				
			</div>
			<div id="customize_preview" class="full-height flex" style="vertical-align:top">
				<div id="iframelive">
					<div id="frameWrapper">
						<div id="edit_page_meta" data-src="{{route('iframe', ['account'=>$account])}}">
						</div>
					</div>
				</div>
			</div>
			<md-sidenav id="editing-container" md-component-id="rightPanel" md-is-locked-open="$mdMedia('gt-md')" class="md-sidenav-right"  md-disable-backdrop="@{{$mdMedia('gt-md')}}"  md-disable-close-events>
			</md-sidenav>
			
		</div>
	</div>
</div>
{!! \Assets::renderFooter() !!}
@include('builder::language')
@include('layouts.sentry') 
</body>
</html>