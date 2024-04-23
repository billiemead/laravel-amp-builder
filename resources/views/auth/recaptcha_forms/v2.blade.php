@php
	$siteKey = config('auth.reCAPTCHA.site_key');//?render=$siteKey
@endphp
<script src="https://www.google.com/recaptcha/api.js"></script>
<div class="g-recaptcha" data-sitekey="{{ config('auth.reCAPTCHA.site_key') }}"></div>
