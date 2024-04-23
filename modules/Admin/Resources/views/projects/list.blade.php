<section class="content-header" layout-gt-sm="row" layout="column" layout-align-gt-sm="none" layout-align="center center">
	<h1>
		@lang('admin.page_websites.title')
	</h1>
	<div flex></div>
	<div class="content-header-actions" ng-cloak>
		<md-button class="md-raised md-secondary" href="{{url('/profile')}}#projects/add">@lang('admin.page_websites.add')</md-button>
	</div>
</section>
<section class="content">
	<div class="box">
		<div stOptions="gridOptions" st-filters="filters" st-grid="gridInstance"  st-grid-name="site" st-grid-url="{{url('/')}}/pagedlist/sites" class="grid">
			<st-grid-column field="id" display_name="@lang('admin.page_websites.list_columns.id')"></st-grid-column>
			<st-grid-column field="name" display_name="@lang('admin.page_websites.list_columns.name')"></st-grid-column>
			<st-grid-column field="owner.name" display_name="@lang('admin.page_websites.list_columns.owner')"></st-grid-column>
			<st-grid-column field="variants_count" display_name="@lang('admin.page_websites.list_columns.variants')"></st-grid-column>
			<st-grid-column field="updated_at" type="datetime" format="{{config('formats.datatable_datetime_format')}}" display_name="@lang('admin.updated_at')"></st-grid-column>
			<st-grid-column field="created_at" type="datetime" format="{{config('formats.datatable_datetime_format')}}" display_name="@lang('admin.created_at')"></st-grid-column>
			<st-grid-column-button class="md-icon-button fa fa-cog" href="@{{row.edit_url}}" target="_blank"></st-grid-column-button>
			<st-grid-column-button class="md-icon-button fa fa-trash" ng-click="$parent.$parent.deleteSite(row.id)"></st-grid-column-button>
		</div>
		
	</div>
</section>