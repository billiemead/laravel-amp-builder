<?php
    use \App\Models\Page;

$pages = Page::where('site_id', $site->id)->withCount(['visits', 'conversions'])->get();
?>
<div class="box">
	<table class="dataTable">
		<thead>
		<tr>
			<td>@lang('analytic.pagename')</td>
			<td>@lang('analytic.users')</td>
			<td>@lang('analytic.pageviews')</td>
			<td hide-xs hide-sm>@lang('analytic.conversions')</td>
			<td hide-xs hide-sm>@lang('analytic.conversion_rate')</td>
		</tr>
		</thead>
		@foreach($pages as $page)
			
		<tr>
			<td><a href="{{$page->view_url}}" target="_blank">{{$page->name}}</a></td>
			<td>{{$page->unique_users}}</td>
			<td>{{$page->visits_count}}</td>
			<td hide-xs hide-sm>{{$page->conversions_count}}</td>
			<td hide-xs hide-sm>{{$page->conversion_rate}}%</td>
		</tr>
		@endforeach
	</div>
</div>