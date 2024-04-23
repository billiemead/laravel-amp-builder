<section class="content-header" layout-gt-sm="row" layout="column" layout-align-gt-sm="none" layout-align="center center">
	<h1>
		<md-button class="md-icon-button fa fa-arrow-left" href="#projects/list"></md-button>
		@lang('profile.edit') #@{{data.id}}
	</h1>
	<div class="content-header-actions" layout-column>
		<md-button class="md-raised md-secondary" href="@{{data.view_url}}" target="_blank" ng-disabled="!data.id">@lang('profile.view')</md-button>
		<md-button class="md-raised md-secondary" href="@{{data.edit_url}}" target="_blank" ng-disabled="!data.id">@lang('admin.page_templates.list_columns.builder_btn')</md-button>
		<md-button class="md-raised md-secondary" href="#projects/analytics/@{{data.id}}" ng-disabled="!data.id">@lang('profile.analytics')</md-button>
	</div>
 
</section>
<section class="content">
	
	<div class="box">
		<div class="box-header">
			<h3>@lang('profile.overview')</h3>
		</div>
		<div class="box-body">
			
			<div  layout="row">
				<div flex="25">
					<h3>@{{data.unique_users}}</h3>
					<p>@lang('analytic.users')</p>
				</div>
				<div flex="25">
					<h3>@{{data.visits_count}}</h3>
					<p>@lang('analytic.pageviews')</p>
				</div>
				<div flex="25">
					<h3>@{{data.conversions_count}}</h3>
					<p>@lang('analytic.conversions')</p>
				</div>
				<div flex="25">
					<h3>@{{data.conversion_rate}}%</h3>
					<p>@lang('analytic.conversion_rate')</p>
				</div>
			</div>
		</div>
	</div>
	<div class="box">
		<div class="box-header">
			<h3>@lang('profile.domains')</h3>
			<md-button class="md-raised md-secondary" ng-click="addDomain()">@lang('profile.add_domain')</md-button>
		</div>
		<div class="box-body">
			<md-list>
				<md-list-item ng-repeat="domain in data.domains">
				<p ng-if="domain.subdomain == 1">@{{domain.name}}.{{config('publishing.subdomain.domain')}}</p>
				<p ng-if="domain.subdomain == 0">@{{domain.name}}</p>
				<md-button href="@{{domain.view_url}}" target="_blank">@lang('profile.view')</md-button>
				<md-button ng-click="removeDomain($index)">@lang('profile.delete')</md-button>
				</md-list-item>	
			</md-list>
		</div>
	</div>
	<div class="box">
		<div class="box-header">
			<h3>@lang('profile.variants')</h3>
			<md-button class="md-raised md-secondary" ng-click="addVariant()">@lang('profile.add_variant')</md-button>
		</div>
		@php
			$displayWeight = config('abtesting.chooser') == App\Abtesting\VariantChooser::class;
		@endphp
		<div class="box-body">
			<table class="dataTable">
				<thead>
					<tr>
						<td>@lang('analytic.variantname')</td>
						<td>@lang('analytic.users')</td>
						<td>@lang('analytic.pageviews')</td>
						<td>@lang('analytic.conversions')</td>
						<td>@lang('analytic.conversion_rate')</td>
						<td>
							
						</td>
					</tr>
				</thead>
				<tbody>
					<tr ng-repeat="variant in variants">
						<td><span>@{{variant.name}}</span><md-button class="md-icon-button" ng-click="changeName(variant)" ng-if="variant.name != 'index'"><i class="fa fa-cog"></i></md-button></td>
						<td>@{{variant.unique_users}}</td>
						<td>@{{variant.visits_count}}</td>
						<td>@{{variant.conversions_count}}</td>
						<td>@{{variant.conversion_rate}}%</td>
						
						<td>
							<md-button href="@{{variant.edit_url}}" class="md-raised md-primary" target="_blank">@lang('edit')</md-button>
							<md-menu class="md-secondary">
							  <md-button class="md-icon-button md-raised md-secondary" ng-click="$mdMenu.open($event)">
								<md-icon class="fa fa-angle-down"></md-icon>
							  </md-button>
							  <md-menu-content width="4">
								<md-menu-item>
								  <md-button href="@{{variant.view_url}}" target="_blank">@lang('view')</md-button>
								</md-menu-item>
								<md-menu-item>
								  <md-button ng-click="cloneVariant(variant)">@lang('clone')</md-button>
								</md-menu-item>
								<md-menu-item ng-if="variants.length > 1">
								  <md-button ng-click="removeVariant($index)">@lang('delete')</md-button>
								</md-menu-item>
							  </md-menu-content>
							</md-menu>
							
							
						</td>
					</tr>
					<tr ng-repeat="variant in discarded_variants">
						<td>@{{variant.name}} <span class="badge badge-danger">@lang('profile.deleted')</span></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						@if($displayWeight)<td></td>
						@endif
						<td>
							<md-button ng-click="restoreVariant($index)" class="md-raised md-primary">@lang('profile.restore')</md-button>
							<md-button ng-click="destroyVariant($index)" class="md-raised md-secondary">@lang('profile.delete_forerver')</md-button>
						</td>
					</tr>
				</tbody>
				
			</table>
		</div>
	</div>
</section>