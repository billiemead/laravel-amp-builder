@foreach ($styles as $style)
	@if(isset($style['inline']) && $style['inline'])
		{!! Assets::getHtmlBuilder()->inline_style($style['src'], $style['attributes'], $style['wrap_by']) !!}
	@else
		{!! Assets::getHtmlBuilder()->style($style['src'] . Assets::getBuildVersion(), $style['attributes']) !!}
	@endif
@endforeach

@foreach ($headScripts as $script)
    {!! Assets::getHtmlBuilder()->script($script['src'] . Assets::getBuildVersion(), $script['attributes']) !!}
    @if (!empty($script['fallback']))
        <script>window.{!! $script['fallback'] !!} || document.write('<script src="{{ $script['fallbackURL'] }}"><\/script>')</script>
    @endif
@endforeach