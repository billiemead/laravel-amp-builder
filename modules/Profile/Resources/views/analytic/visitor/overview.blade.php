<?php
    use \App\tracking\Models\Visit;
use \App\tracking\Models\Site;
use \App\tracking\Models\Conversion;

$pageviews = $site->visits_count;
    $conversions = $site->conversions_count;
    $unique_users = $site->unique_users;
    $conversion_rate = ($unique_users > 0 ? round($conversions/$unique_users, 4) * 100 : 0);
?>
<div class="box">
	<h3 class="box-title">
		@lang('analytic.overview')
	</h3>
	<div class="box-body" layout="row" layout-xs="column">
		<div flex=25 flex-xs=100>
			<h5>@lang('analytic.users')</h5>
			<p>{{$unique_users}}</p>
		</div>
		<div flex=25 flex-xs=100>
			<h5>@lang('analytic.pageviews')</h5>
			<p>{{$pageviews}}</p>
		</div>
		<div flex=25 flex-xs=100>
			<h5>@lang('analytic.conversions')</h5>
			<p>{{$conversions}}</p>
		</div>
		<div flex=25 flex-xs=100>
			<h5>@lang('analytic.conversion_rate')</h5>
			<p>{{$conversion_rate}}%</p>
		</div>
	</div>
</div>