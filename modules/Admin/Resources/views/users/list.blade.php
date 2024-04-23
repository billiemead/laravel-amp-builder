<section class="content-header" layout-gt-sm="row" layout="column" layout-align-gt-sm="none" layout-align="center center">
	<h1>
		@lang('admin.page_users.title')
	</h1>
	<div flex></div>
	<div class="content-header-actions" >
		<md-button class="md-raised md-secondary" href="#users/add">@lang('admin.page_users.add')</md-button>
	</div>
  
</section>
<section class="content">
	<div class="box">
		<div stOptions="gridOptions" st-filters="filters" st-grid="gridInstance" st-grid-name="user" st-grid-url="{{url('/')}}/pagedlist/users" class="grid">
			<div layout="row">
				
				</md-input-container>
				<md-input-container>
				  <md-select ng-model="filters.role" placeholder="@lang('admin.filter_by_role')" ng-change="gridInstance.instance.reloadData()">
					<md-option value=""><em>@lang('builder.all')</em></md-option>
					<md-option ng-repeat="role in roles" ng-value="role.id">
					  @{{role.name}}
					</md-option>
				  </md-select>
				</md-input-container>
				<md-input-container>
				  <md-select ng-model="filters.is_active" placeholder="@lang('admin.filter_by_status')" ng-change="gridInstance.instance.reloadData()">
					<md-option value=""><em>@lang('builder.all')</em></md-option>
					<md-option value="1">
					  {{trans('common.active')}}
					</md-option>
					<md-option value="0">
					  {{trans('common.inactive')}}
					</md-option>
				  </md-select>
				</md-input-container>
			</div>
			<st-grid-column field="id" display_name="@lang('admin.page_users.list_columns.id')"></st-grid-column>
			<st-grid-column field="name" display_name="@lang('admin.page_users.list_columns.name')"></st-grid-column>
			<st-grid-column field="email" display_name="@lang('admin.page_users.list_columns.email')"></st-grid-column>
			<st-grid-column field="roles" display_name="@lang('admin.page_users.list_columns.roles')"></st-grid-column>
			<st-grid-column field="is_active" display_name="@lang('admin.page_users.list_columns.active')"><div ng-if="!row.is_active"><i class="fa fa-close" md-colors="{color:'warn'}"></i></div><div ng-if="row.is_active"><i class="fa fa-chevron-circle-down" md-colors="{color:'primary'}"></i></div></st-grid-column>
			<st-grid-column field="last_login" type="datetime" format="{{config('formats.datatable_datetime_format')}}" display_name="@lang('admin.page_users.list_columns.last_login')"></st-grid-column>
			<st-grid-column field="created_at" type="datetime" format="{{config('formats.datatable_datetime_format')}}" display_name="@lang('admin.created_at')"></st-grid-column>
			<st-grid-column-button class="md-icon-button fa fa-cog" href="#users/edit/@{{ row.id }}"></st-grid-column-button>
			<st-grid-column-button class="md-icon-button fa fa-trash" ng-click="$parent.$parent.deleteUser(row.id)"></st-grid-column-button>
		</div>
	</div>
</section>