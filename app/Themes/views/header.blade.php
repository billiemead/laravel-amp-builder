<script type="text/javascript">
	var currentTheme = "{{$currentTheme}}";
	var themes = {!! json_encode($themes) !!};
</script>
@if(strlen($customStyles))<script type="text/style">{!! $customStyles !!}</script>  @endif



