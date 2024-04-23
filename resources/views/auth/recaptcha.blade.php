@if(config('auth.reCAPTCHA.enable'))
@php
	$version = config('auth.reCAPTCHA.version');
	if($version == 2)
		echo view('auth.recaptcha_forms.v2');
	else
		echo view('auth.recaptcha_forms.v3');
@endphp
@if (session('captchaErrors'))
	<div  class="md-warn">
		{!! session('captchaErrors') !!}
	</div >
@endif

@endif