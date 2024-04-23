@extends('builder::layouts.view_site')
@section('pageDescription')
{{$description}}
@stop
@section('pageKeywords')
{{$keywords}}
@stop
@section('pageTitle')
{{$title}}
@stop
@section('content')
{!! $content !!}

@stop