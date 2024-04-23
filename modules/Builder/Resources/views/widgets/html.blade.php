<div>
@if($widget->isViewMode())
{!! array_get($data,'code') !!}

@else
	@lang('builder::builder.htmlmodule.previewString')
@endif	
</div>