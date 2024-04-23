<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="{{sts_getBiDirection()}}" xml:lang="{{App::getLocale()}}" lang="{{App::getLocale()}}" ng-app="preview_app" ng-strict-di>
<head>
	@include('layouts.meta_tag') 
	
	<script type="text/javascript">
		var basePath  = '{{url("/")}}';
		var baseUrl  = '{url}';
		var ajaxPath  = '{action}';
		var apiPath  = '{{url("/")}}';
		var siteId = "{{$account}}";
		var variantId = {{$variant->id}};
		var resolutions = {!! json_encode(config('resolutions')) !!};
		var X_CSRF_TOKEN = "{{ csrf_token() }}";
	</script>
	{!! \Assets::renderHeader() !!}
	{!! \Themes::render('builder') !!}

</head>

<body id="page" class="preview-mode">
@include('layouts.preloader') 

<div class="full-height">
	<div class="main_container full-height" layout="column">
		@include('layouts.builder_loader') 
		
		<md-toolbar id="control-panel-holder" class="md-hue-2">
			<div class="md-toolbar-tools">
				<md-button class="md-icon-button" aria-label="">
					<i class="fa fa-bars"></i>
				</md-button>
				
				<div page-tabs></div>
				
				<page-resolutions></page-resolutions>
				
				<h2 flex md-truncate>
				<div amp-validator-button></div>
				</h2>
				
				
			</div>
		</md-toolbar>
		
		<div id="editor_container" class="full-height" flex layout="row">
			<div class="position-absolute bg-white p-2">
				<label>Scan QR code to view on mobile</label>
				
				<div class="text-center">
					<qrcode size="274" data="{{$variant->view_url}}" href="{{$variant->view_url}}"></qrcode>
				</div>
			</div>
			<div id="customize_preview" class="full-height flex" style="vertical-align:top">
				<div id="iframelive">
					<div id="frameWrapper">
						<div id="frameCover">
							<div id="frameinnerCover">
							<div id="edit_page_meta" data-src="{{$variant->view_url}}">
								
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	</div>
</div>
{!! \Assets::renderFooter() !!}


@include('builder::language')

</body>
</html>