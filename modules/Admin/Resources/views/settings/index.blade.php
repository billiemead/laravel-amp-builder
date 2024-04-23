<section class="content-header">
  <h1>
	@lang('admin.settings')
  </h1>
  <ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-dashboard"></i> @lang('admin.home')</a></li>
	<li class="active">@lang('admin.settings')</li>
  </ol>
</section>
<section class="content">
<div class="box none-padding">
	<ui-paneltab size=25>
		<ui-paneltab-item heading="@lang('admin.settings_page.general_tab')">
				@include('admin::settings.general') 
		</ui-paneltab-item>
		<ui-paneltab-item heading="@lang('admin.settings_page.auth_tab')">
				@include('admin::settings.auth') 
		</ui-paneltab-item>
	
		<ui-paneltab-item heading="@lang('admin.settings_page.integrations_tab')">
				@include('admin::settings.integrations') 
		</ui-paneltab-item>
		
		<ui-paneltab-item heading="@lang('admin.settings_page.mail_tab')">
				@include('admin::settings.mail') 
		</ui-paneltab-item>
		<ui-paneltab-item heading="@lang('admin.settings_page.publishing_tab')">
				@include('admin::settings.publishing') 
		</ui-paneltab-item>
		
		<ui-paneltab-item heading="@lang('admin.settings_page.locale_tab')">
				@include('admin::settings.language') 
		</ui-paneltab-item>
		<ui-paneltab-item heading="@lang('admin.settings_page.cache_tab')">
				@include('admin::settings.cache') 
		</ui-paneltab-item>
		
		
	</ui-paneltab>
	
</div>
</section>