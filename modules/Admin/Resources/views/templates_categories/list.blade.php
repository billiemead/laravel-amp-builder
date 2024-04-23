<section class="content-header" layout-gt-sm="row" layout="column" layout-align-gt-sm="none" layout-align="center center">
	<h1>
		@lang('admin.page_template_category.title')
	
	</h1>
	<div flex></div>
	<div class="content-header-actions" layout-column>
		<md-button class="md-raised md-secondary" href="#templates_categories/add">@lang('admin.page_template_category.add')</md-button>
	</div>
</section>
<section class="content">
	<div class="box">
		<div stOptions="gridOptions" st-filters="filters" st-grid="gridInstance" st-grid-name="themes_categories" st-grid-url="{{url('/')}}/pagedlist/themes_categories" class="grid">
			<st-grid-column field="id" display_name="@lang('admin.page_template_category.list_columns.id')"></st-grid-column>
			<st-grid-column field="title" display_name="@lang('admin.page_template_category.list_columns.title')"></st-grid-column>
			<st-grid-column-button class="md-icon-button fa fa-cog" href="#templates_categories/edit/@{{ row.id }}"></st-grid-column-button>
			<st-grid-column-button class="md-icon-button fa fa-trash" ng-click="$parent.$parent.deleteCategories(row.id)"></st-grid-column-button>
		</div>
	</div>
</section>