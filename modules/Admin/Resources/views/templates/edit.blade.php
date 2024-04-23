<section class="content-header" layout-gt-sm="row" layout="column" layout-align-gt-sm="none" layout-align="center center">
	<h1>
		@lang('admin.page_templates.edit_title') #@{{data.id}}
	</h1>
	<div flex></div>
	<div class="content-header-actions">
		<md-button class="md-raised md-primary" href=@{{data.edit_url}} target="_blank">@lang('admin.page_templates.list_columns.builder_btn')</md-button>
		<md-button class="md-raised md-secondary" href=@{{data.preview_url}} target="_blank">@lang('admin.view')</md-button>
		<md-button class="md-raised md-secondary" href="@{{data.export_url}}" target="_blank">@lang('admin.export')</md-button>
	</div>
</section>
<section class="content">
	@include('admin::templates.form')
</section>