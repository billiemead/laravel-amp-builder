<section class="content-header" layout-gt-sm="row" layout="column" layout-align-gt-sm="none" layout-align="center center">
	<h1>
		@lang('admin.page_domains.title')
	</h1>
	<div flex></div>
	<div class="content-header-actions">
	</div>
</section>
<section class="content">
	<div class="box">
		<div stOptions="gridOptions" st-filters="filters" st-grid="gridInstance" st-grid-name="domain" st-grid-url="{{url('/')}}/pagedlist/domain" class="grid">
			<div layout="row">
				
			</div>
			<st-grid-column field="id" display_name="@lang('admin.page_domains.list_columns.id')"></st-grid-column>
			<st-grid-column field="name" display_name="@lang('admin.page_domains.list_columns.name')"></st-grid-column>
			<st-grid-column field="path" display_name="@lang('admin.page_domains.list_columns.path')"></st-grid-column>
			<st-grid-column field="subdomain" display_name="@lang('admin.page_domains.list_columns.subdomain')"><div ng-if="!row.subdomain"><i class="fa fa-close" md-colors="{color:'warn'}"></i></div><div ng-if="row.subdomain"><i class="fa fa-chevron-circle-down" md-colors="{color:'primary'}"></i></div></st-grid-column>
			<st-grid-column field="site_id" display_name="@lang('admin.page_domains.list_columns.site_id')"></st-grid-column>
			<st-grid-column field="created_at" type="datetime" format="{{config('formats.datatable_datetime_format')}}" display_name="@lang('admin.created_at')"></st-grid-column>
			<st-grid-column-button class="md-raised md-primary" href="@{{row.view_url}}" target="_blank">@lang('admin.view')</st-grid-column-button>
			<st-grid-column-button class="md-icon-button fa fa-trash" ng-click="$parent.$parent.deleteTemplate(row.id)"></st-grid-column-button>
			
		</div>
	</div>
</section>