<amp-lightbox id="{{$id}}" class="modal-wrapper" layout="nodisplay">
<div class="modal">
<div class="modal-content">{!! $message !!}</div>
<a class="close-dialog" on="tap:{{$id}}.close">
@include('common.svg.close')
</a>
</div>
</amp-lightbox>