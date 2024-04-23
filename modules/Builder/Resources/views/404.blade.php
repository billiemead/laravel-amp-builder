@extends('layouts.view_site_error_page')
@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="error-template">
                <h1>
                    Oops!</h1>
                <h2>@lang('profile.not_found_title')</h2>
                <div class="error-details">
                    @lang('profile.not_found_message')
                </div>
                <div class="error-actions">
                    <a href="{{url('/')}}" class="btn btn-primary btn-lg">Take Me Home </a>
                </div>
            </div>
        </div>
    </div>
</div>
@stop