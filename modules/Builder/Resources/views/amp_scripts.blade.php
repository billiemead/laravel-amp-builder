@php
	$preloads = config('amp.preloads');
	foreach($preloads as $preload)
	{
		
		if(is_string($preload))
			app('app.widget')->registerScript($preload);
		else if(is_array($preload)){
			app('app.widget')->registerScript($preload[0],$preload[1]);
		}
	}
@endphp
{{app('app.widget')->renderScript()}}