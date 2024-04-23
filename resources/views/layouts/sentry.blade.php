@php
$sentryDSN = config('sentry.dsn');
@endphp
@if(!empty($sentryDSN) && is_string($sentryDSN) && strlen($sentryDSN))
<script src="https://cdn.ravenjs.com/3.26.4/angular/raven.min.js" crossorigin="anonymous"></script>
<script>Raven.config('{{$sentryDSN}}').install();</script>
@endif