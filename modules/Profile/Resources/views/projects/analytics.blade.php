<section class="content-header">
  <h1>
	@lang('profile.analytics')
  </h1>
	<div class="content-header-actions" layout-column>
		<md-button class="md-raised md-secondary" href="#projects/edit/@{{site_id}}">@lang('profile.back')</md-button>
		<md-button class="md-raised md-secondary" ng-click="clearData()">@lang('profile.clear_analytic_data_btn')</md-button>
	</div>
</section>
<section class="content">
	<div class="analytic" ld-widgets src="visitor/overview">
	</div>
	
	<div class="box" ng-controller="searchController">
		<div class="col-md-6">
			<div layout-gt-xs="row">
			<div flex-gt-xs>
			  <h4 class="box-title">@lang('analytic.start_date')</h4>
			  <md-datepicker ng-model="data.startDate" md-placeholder="@lang('analytic.start_date')" ng-change="changeData()"></md-datepicker>
			</div>

			<div flex-gt-xs>
			  <h4 class="box-title">@lang('analytic.end_date')</h4>
			  <md-datepicker ng-model="data.endDate" md-placeholder="@lang('analytic.end_date')" ng-change="changeData()"></md-datepicker>
			</div>
		  </div>
	  </div>
	</div>
	<div class="analytic" ld-widgets src="visitor/charts">
	</div>
	<div class="analytic" ld-widgets src="conversion/charts">
	</div>
</section>