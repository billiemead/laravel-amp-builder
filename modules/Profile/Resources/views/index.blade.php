@extends('profile::layouts.master')
@section('sidebar_menu')
	{!! \App\Menu::renderModule('profile') !!}
@stop
@section('content')
<div class="content-wrapper" page-container>
	<div id="top-header-bg" class="md-accent-bg"></div>
	<ui-view></ui-view>
</div>
@stop