@extends('layouts.auth')
@section('content')
<md-content class="" layout="row" layout-align="space-around" layout-padding="layout-padding layout-align="center center" ng-controller="loginController">
    <md-card flex="flex" flex-gt-sm="50" flex-gt-md="33">
		<md-toolbar class="title">
			<div class="md-toolbar-tools">
				<h2>
					@lang('auth.error_title')
				</h2>
			</div>
		</md-toolbar>
		<md-card-content>
			<div class="">
				<div class="">
                    Something wrong, please <a href="{{url('/auth/login')}}">try again</a>
						<div>{{$message}}</div>
                </div>
			</div>
		</md-card-content>
    </md-card>
</md-content>
@stop