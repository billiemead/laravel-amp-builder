@php
	$siteKey = config('auth.reCAPTCHA.site_key');
@endphp
<script src="https://www.google.com/recaptcha/api.js?render={{$siteKey}}"></script>
<input type="hidden" name="{{config('auth.reCAPTCHA.input_field_id')}}" id="{{config('auth.reCAPTCHA.input_field_id')}}"/>
<script>
grecaptcha.ready(function() {
    grecaptcha.execute("{{$siteKey}}", {action: 'auth'}).then(function(token) {
		document.getElementById('{{config('auth.reCAPTCHA.input_field_id')}}').value = token;
    });
});
</script>