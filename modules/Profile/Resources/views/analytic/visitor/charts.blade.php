<?php
    use \App\tracking\Models\Visit;
use \App\Models\Page;

$from = $startDate;
    $to = $endDate;
    
    $chart = new \App\Charts\PageView;
    
    $chart
    ->title(' ');
    $pageViewData = [];
    
    $pages = $site->variants;
    $visits = $site->visits()->where('created_at', '>=', $startDate)
    ->select(DB::raw('Date(created_at)'), DB::raw('count(id) as pageview'))
    ->groupBy(DB::raw('Date(created_at)'))
    ->orderBy('created_at', 'DESC')->get();
    
    $visits = $visits->map(function ($item) {
        return [\Carbon\Carbon::parse($item->created_at)->getTimestamp() * 1000, $item->pageview];
    });
    $chart->dataset(trans('analytic.total_pageviews'), 'line', $visits->values());
    
    $visits_by_variant = $site->visits()->where('created_at', '>=', $startDate)
    ->select('page_id', 'created_at', DB::raw('count(id) as pageview'))
    ->groupBy(DB::raw('Date(created_at), page_id'))
    ->orderBy('created_at', 'DESC')->get();
    $variants_pageView = [];
    foreach ($visits_by_variant as $item) {
        if (empty($variants_pageView[$item->page_id])) {
            $variants_pageView[$item->page_id] = [];
        }
        $variants_pageView[$item->page_id][] = [\Carbon\Carbon::parse($item->created_at)->getTimestamp() * 1000, $item->pageview];
    };
    foreach ($variants_pageView as $page_id=>$item) {
        $page_name = $page_id;
        foreach ($pages as $page) {
            if ($page->id == $page_id) {
                $page_name = $page->name;
            }
        }
        $chart->dataset('Page '.$page_name, 'line', $item);
    }
?>
<div class="box">
	<div class="box-header">
		<h3 class="box-title">@lang('analytic.pageviews')</h3>
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-12">
			  <div class="chart">
					<?php echo $chart->container(); ?>
			  </div>
			</div>
		</div>
	</div>
</div>
{!! $chart->script() !!}
