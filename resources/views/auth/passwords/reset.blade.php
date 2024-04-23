@extends('layouts.auth')

@section('content')
<md-content class="" layout="row" layout-padding="layout-padding" layout-align="center center" ng-controller="loginController">
    <md-card flex="flex" flex-gt-sm="50" flex-gt-md="33">
	   <md-toolbar class="title">
			<div class="md-toolbar-tools">
				<h2>
					@lang('auth.reset_password_title')
				</h2>
			</div>
		</md-toolbar>

		<md-card-content>
			<form class="form-horizontal" role="form" method="POST" action="{{ url('/password/reset') }}">
				{{ csrf_field() }}

				<input type="hidden" name="token" value="{{ $token }}">

				<md-input-container class="md-block {{ $errors->has('email') ? ' has-error' : '' }}">
					<label for="email" class="col-md-4 control-label">E-Mail Address</label>

						<input id="email" type="email" class="form-control" name="email" value="{{ $email or old('email') }}" required>

						@if ($errors->has('email'))
							<span class="help-block">
								<strong>{{ $errors->first('email') }}</strong>
							</span>
						@endif
				</md-input-container>

				<md-input-container class="md-block {{ $errors->has('password') ? ' has-error' : '' }}">
					<label for="password" class="col-md-4 control-label">Password</label>

						<input id="password" type="password" class="form-control" name="password" required>

						@if ($errors->has('password'))
							<span class="help-block">
								<strong>{{ $errors->first('password') }}</strong>
							</span>
						@endif
				</md-input-container>

				<md-input-container class="md-block {{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
					<label for="password-confirm" class="col-md-4 control-label">Confirm Password</label>
						<input id="password-confirm" type="password" class="form-control" name="password_confirmation" required>

						@if ($errors->has('password_confirmation'))
							<span class="help-block">
								<strong>{{ $errors->first('password_confirmation') }}</strong>
							</span>
						@endif
				</md-input-container>
				
				@include('auth.recaptcha')
				<div class="">
					<md-button type="submit" class="md-raised md-primary">
						<i class="fa fa-refresh"></i>@lang('auth.reset_password_btn')
					</md-button>
				</div>
			</form>
		</md-card>
    </md-card>
</md-content>
@endsection
