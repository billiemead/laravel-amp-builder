@extends('admin::layouts.master')
@section('sidebar_menu')
	{!! \App\Menu::renderModule('admin') !!}
@stop

@section('content')
<div class="content-wrapper" page-container>
	<div id="top-header-bg" class="md-accent-bg"></div>
	<ui-view></ui-view>
</div>
@stop