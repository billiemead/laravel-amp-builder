<script type="text/javascript">
	if(window.{{ $chart->id }}_create == undefined)
	{
		
		function {{ $chart->id }}_create(data) {
			{{ $chart->id }}_rendered = true;
			var loader_element = document.getElementById("{{ $chart->id }}_loader");
			loader_element.parentNode.removeChild(loader_element);
			window['{{ $chart->id }}'] = new Highcharts.Chart("{{ $chart->id }}", {
				series: data,
				{!! $chart->formatOptions(false, true) !!},
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: {
						month: '%e. %b',
						year: '%b',
					},
					title: {
						text: 'Date'
					}
				
				},
				yAxis: {
					plotLines: [{
						value: 0,
						height: 0.5,
						width: 1,
						color: '#808080'
					}]
				},
				plotOptions: {
					spline: {
						marker: {
							enabled: true
						}
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0
				},
				
			});
		}
		
	}
    window.{{ $chart->id }}_rendered = false;
	@if ($chart->api_url)
	let {{ $chart->id }}_api_url = "{!! $chart->api_url !!}";
	@endif
	if(window.{{ $chart->id }}_load == undefined)
	window.{{ $chart->id }}_load = function () {
		if (document.getElementById("{{ $chart->id }}") && !{{ $chart->id }}_rendered) {
			@if ($chart->api_url)
				fetch({{ $chart->id }}_api_url)
					.then(data => data.json())
					.then(data => { {{ $chart->id }}_create(data) });
			@else
				{{ $chart->id }}_create({!! $chart->formatDatasets() !!})
			@endif
		}
	};
	window.addEventListener("load", window.{{ $chart->id }}_load);
	document.addEventListener("turbolinks:load", window.{{ $chart->id }}_load);
	
	window.{{ $chart->id }}_load();
</script>

