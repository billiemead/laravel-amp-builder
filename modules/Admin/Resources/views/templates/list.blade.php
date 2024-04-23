<section class="content-header" layout-gt-sm="row" layout="column" layout-align-gt-sm="none" layout-align="center center">
	<h1>
		@lang('admin.page_templates.title')
	</h1>
	<div flex></div>
	<div class="content-header-actions">
		<md-button href="#templates/add" class="md-raised md-secondary">@lang('admin.page_templates.add')</md-button>
		<md-button ng-click="startUploadTemplate()" class="md-raised md-secondary">@lang('admin.page_templates.import')</md-button>
	</div>
</section>
<section class="content">
	<div class="box">
		<div stOptions="gridOptions" st-filters="filters" st-grid="gridInstance" st-grid-name="templates" st-grid-url="{{url('/')}}/pagedlist/templates" class="grid">
			<div layout="row">
				<md-input-container>
					<md-select ng-model="filters.type" placeholder="@lang('admin.filter_by_type')" ng-change="gridInstance.instance.reloadData()">
					<md-option value=""><em>@lang('builder::builder.all')</em></md-option>
					<md-option value="page">
					  {{trans('admin.page_templates.template_types.page')}}
					</md-option>
					<md-option value="section">
					  {{trans('admin.page_templates.template_types.section')}}
					</md-option>
					<md-option value="popup">
					  {{trans('admin.page_templates.template_types.popup')}}
					</md-option>
				  </md-select>
				</md-input-container>
				<md-input-container>
				  <md-select ng-model="filters.category" placeholder="@lang('admin.filter_by_category')" ng-change="gridInstance.instance.reloadData()">
					<md-option value=""><em>@lang('builder::builder.all')</em></md-option>
					<md-option ng-repeat="theme in themes_categories" ng-value="theme.id">
					  @{{theme.title}}
					</md-option>
				  </md-select>
				</md-input-container>
				<md-input-container>
				  <md-select ng-model="filters.is_active" placeholder="@lang('admin.filter_by_status')" ng-change="gridInstance.instance.reloadData()">
					<md-option value=""><em>@lang('builder::builder.all')</em></md-option>
					<md-option value="1">
					  {{trans('common.active')}}
					</md-option>
					<md-option value="0">
					  {{trans('common.inactive')}}
					</md-option>
				  </md-select>
				</md-input-container>
				<md-input-container>
					<md-checkbox ng-model="filters.user_template" ng-true-value="1" ng-false-value="0" ng-change="gridInstance.instance.reloadData()">@lang('admin.page_templates.filter_user_template')</md-checkbox>
				</md-input-container>
			</div>
			<st-grid-column field="id" display_name="@lang('admin.page_templates.list_columns.id')"></st-grid-column>
			<st-grid-column field="name" display_name="@lang('admin.page_templates.list_columns.name')"></st-grid-column>
			<st-grid-column field="main_category.title" display_name="@lang('admin.page_templates.list_columns.category')" not-searchable></st-grid-column>
			<st-grid-column field="type" display_name="@lang('admin.page_templates.list_columns.type')"></st-grid-column>
			<st-grid-column field="is_active" display_name="@lang('admin.page_users.list_columns.active')"><div ng-if="!row.is_active"><i class="fa fa-close" md-colors="{color:'warn'}"></i></div><div ng-if="row.is_active"><i class="fa fa-chevron-circle-down" md-colors="{color:'primary'}"></i></div></st-grid-column>
			<st-grid-column field="created_at" type="datetime" format="{{config('formats.datatable_datetime_format')}}" display_name="@lang('admin.created_at')"></st-grid-column>
			<st-grid-column field="owner.name" display_name="@lang('admin.page_websites.list_columns.owner')"></st-grid-column>
			
			<st-grid-column field="is_active">
				<md-menu class="md-secondary">
					<md-button class="md-raised md-secondary" ng-click="$mdMenu.open($event)">
						{{trans('common.action')}}<md-icon class="fa fa-angle-down"></md-icon>
					</md-button>
					<md-menu-content width="4">
						<md-menu-item>
						  <md-button href=@{{row.edit_url}} target="_blank">@lang('admin.page_templates.list_columns.builder_btn')</md-button>
						</md-menu-item>
						<md-menu-item>
						  <md-button href=@{{row.preview_url}} target="_blank">@lang('admin.view')</md-button>
						</md-menu-item>
						<md-menu-item>
						  <md-button ng-click="$parent.$parent.$parent.cloneTemplate(row.id)">@lang('admin.clone')</md-button>
						</md-menu-item>
						<md-menu-item>
							<md-button href="@{{row.export_url}}" target="_blank">@lang('admin.export')</md-button>
						</md-menu-item>
						<md-menu-item>
						  <md-button ng-click="$parent.$parent.$parent.deleteTemplate(row.id)">@lang('profile.delete')</md-button>
						</md-menu-item>
					</md-menu-content>
				</md-menu>
			</st-grid-column>
			<st-grid-column-button class="md-icon-button fa fa-cog" href="#templates/edit/@{{row.id}}"></st-grid-column-button>
		</div>
	</div>
</section>