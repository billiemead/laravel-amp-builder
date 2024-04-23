@extends('layouts.auth')
@section('content')
<md-content layout="row" layout-padding="layout-padding" layout-align="center center" ng-controller="loginController">
    <md-card flex-gt-sm="50" flex-gt-md="25">
		<md-toolbar class="title">
			<div class="md-toolbar-tools">
				<h2>
					@lang('auth.login_title')
				</h2>
			</div>
		</md-toolbar>
		<md-card-content>
			@if(!config('auth.disable_social_login'))

			@endif
			<div class="">
				@if (session('activationStatus'))
					<div  class="md-warn">
						{!! trans('auth.activationStatus') !!}
					</div >
				@endif

				@if (session('activationWarning'))
					<div  class="md-warn">
						{!! trans('auth.activationWarning') !!}
					</div >
				@endif
				@if (session('bannedWarning'))
					<div  class="md-warn">
						{!! trans('auth.bannedWarning') !!}
					</div >
				@endif
				@if (count($errors) > 0)
					@foreach ($errors->all() as $error)
						<div  class="alert alert-danger">
							{!! $error !!}
						</div >
					@endforeach
				@endif
				@php
					$demo = config('app.demo_auth');
				@endphp
				<form class="" method="POST" action="" name="form">
					<input type="hidden" name="_token" value="{{ csrf_token() }}">
					<md-input-container class="md-block">
						<label>@lang('auth.entry_email')</label>
						<input type="email" placeholder="" required name="email" value="{{ !empty(old('email')) ? old('email') : array_get($demo, 'email') }}">
					</md-input-container>
					<md-input-container class="md-block">
						<label>@lang('auth.entry_password')</label>
						<input type="password" placeholder="" required  name="password" value="{{ !empty(old('password')) ? old('password') : array_get($demo, 'password') }}" >
					</md-input-container>
					<md-input-container class="md-block">
						<md-checkbox name="remember" aria-label="Remember">
							@lang('auth.remember_me')
						  </md-checkbox>
					</md-input-container>
					@include('auth.recaptcha')
					<div layout="row" layout-align="center center">
						<md-button type="submit" class="md-raised md-primary" ng-click="submitData()" ng-disabled="buttonDisabled">
							<i class="fa fa-signin"></i>@lang('auth.btn_login')
						</md-button>
						<div flex="flex"></div>
						<md-button href="{{ @url('/password/reset') }}" class="">
							@lang('auth.forgot_password')
						</md-button>
					</div>
					
					
					<div layout="row" layout-align="center">
						
					</div>
					
					@if(!config('auth.disable_register'))
					<md-divider></md-divider>
					<div layout="row" layout-align="center center">
					{!!trans('auth.dont_have_account_message')!!}
					</div>
					@endif
				</form>
				</md-card-content>

			</div>
    </md-card>
	
</md-content>


@stop