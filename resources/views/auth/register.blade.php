@extends('layouts.auth')
@section('content')
@if(!config('auth.disable_register'))
<md-content class="" layout="row" layout-padding="layout-padding" layout-align="center center" ng-controller="loginController">
    <md-card flex-gt-sm="50" flex-gt-md="25">
		<md-toolbar class="title">
			<div class="md-toolbar-tools">
				<h2>
					@lang('auth.register_title')
				</h2>
			</div>
		</md-toolbar>
		<md-card-content>
			
		
			<div class="">
				@if (count($errors) > 0)
					@foreach ($errors->all() as $error)
						<div class="md-warn">{{ $error }}</div>
					@endforeach
					</div>
				@endif
			
				<form class="" method="POST" action="" name="form">
					<input type="hidden" name="_token" value="{{ csrf_token() }}">
					<md-input-container class="md-block">
						<input type="text" placeholder="@lang('auth.entry_name')" required name="name" value="{{ old('name') }}">
					</md-input-container>
					<md-input-container class="md-block">
						<input type="email" placeholder="@lang('auth.entry_email')" required name="email" value="{{ old('email') }}">
					</md-input-container>
					<md-input-container class="md-block">
						<input type="password" placeholder="@lang('auth.entry_password')" required  name="password" value="{{ old('password') }}" >
					</md-input-container>
					<md-input-container class="md-block">
						<input type="password" placeholder="@lang('auth.entry_confirm_password')" required  name="password_confirmation" >
					</md-input-container>
					@include('auth.recaptcha')
					
					<div layout="row" layout-align="center center">
						<md-button type="submit" ng-click="submitData()" class="md-raised md-primary md-button-block">
							@lang('auth.btn_register')
						</md-button>
					</div>
					<md-divider></md-divider>
					<div layout="row" layout-align="center center">
					{!! trans('auth.already_have_account_message') !!}
					</div>
				</form>
			</div>
		</md-card-content>
    </md-card>
	@else
	{!! trans('auth.register_disabled') !!}
	@endif

</md-content>


@stop