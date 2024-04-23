<section class="content-header">
  <h1>
	@lang('profile.websites')
	<md-button href="#projects/add" class="md-raised md-secondary">@lang('profile.new_website')
	</md-button>
  </h1>
  
</section>
<section class="content">
	<div class="box">
		<table class="dataTable">
			<thead>
				<tr>
					<td>@lang('analytic.pagename')</td>
					<td  hide-xs hide-sm>@lang('analytic.users')</td>
					<td  hide-xs hide-sm>@lang('analytic.pageviews')</td>
					<td  hide-xs hide-sm>@lang('analytic.conversions')</td>
					<td  hide-xs hide-sm>@lang('analytic.conversion_rate')</td>
					<td></td>
				</tr>
			</thead>
			<tbody>
				<tr ng-repeat="page in pages">
					<td>@{{page.name}}</td>
					<td  hide-xs hide-sm>@{{page.unique_users}}</td>
					<td  hide-xs hide-sm>@{{page.visits_count}}</td>
					<td  hide-xs hide-sm>@{{page.conversions_count}}</td>
					<td  hide-xs hide-sm>@{{page.conversion_rate || 0}}%</td>
					<td align="right">
						<md-button href="#projects/edit/@{{page.id}}"" class="md-raised md-primary">@lang('edit')</md-button>
						<md-menu class="md-secondary">
							<md-button class="md-icon-button md-raised md-secondary" ng-click="$mdMenu.open($event)">
								<md-icon class="fa fa-angle-down"></md-icon>
							</md-button>
							<md-menu-content width="4">
								<md-menu-item>
								  <md-button href=@{{page.edit_url}} target="_blank">@lang('admin.page_templates.list_columns.builder_btn')</md-button>
								</md-menu-item>
								<md-menu-item>
								  <md-button href=@{{page.preview_url}} target="_blank">@lang('profile.view')</md-button>
								</md-menu-item>
								<md-menu-item>
									<md-button href="#projects/analytics/@{{page.id}}">@lang('profile.analytics')</md-button>
								</md-menu-item>
								<md-menu-item>
								  <md-button ng-click="deleteSite($index)">@lang('profile.delete')</md-button>
								</md-menu-item>
							</md-menu-content>
						</md-menu>
						
						
					</td>
				</tr>
			</tbody>
		</table>
	
		<div ng-if="pages && !pages.length">
			@lang('profile.empty_page_message')
		</div>
	</div>
</section>