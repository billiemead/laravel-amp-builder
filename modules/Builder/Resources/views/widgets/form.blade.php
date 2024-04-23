@php
$modules = array_get($config, 'modules', [])
@endphp

@foreach($modules as $module)
{!! $widget->renderChildModule($module) !!}
@endforeach

@php
$message = array_get($data,'data.message', trans('builder::builder.formmodule.submit_success_message'));
$enable_recaptcha = array_get($data, 'enable_recaptcha');
$siteKey = array_get($data, 'recaptcha_sitekey');
@endphp
@if($widget->isViewMode())
	@php(app('app.widget')->registerScript('amp-form'))
	@php(app('app.widget')->registerScript('amp-lightbox'))
	@php(app('app.widget')->registerScript('amp-mustache', 2))
	@if ($enable_recaptcha)
		@php(app('app.widget')->registerScript('amp-recaptcha-input'))
	<amp-recaptcha-input layout="nodisplay"
      name="recaptcha_token"
      data-sitekey="{{$siteKey}}"
      data-action="amp_form">
    </amp-recaptcha-input>
	@endif

<div submit-success>
	@include('common.modal', ['id'=>$widget->getPage_id().'-success-modal', 'message' => $message])
</div>
<div submit-error>
	@include('common.modal', ['id'=>$widget->getPage_id().'-error-modal', 'message' => trans('builder::builder.formmodule.submit_error_message')])
</div>
@endif	
