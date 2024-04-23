@extends('layouts.auth')

<!-- Main Content -->
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
			@if (session('status'))
				<div class="alert alert-success">
					{{ session('status') }}
				</div>
			@endif

			<form class="form-horizontal" role="form" method="POST" action="{{ url('/password/email') }}">
				{{ csrf_field() }}

				<md-input-container class="md-block {{ $errors->has('email') ? ' has-error' : '' }}">
					<label for="email" class="col-md-4 control-label">E-Mail Address</label>

					<input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}">

					@if ($errors->has('email'))
						<span class="help-block">
							<strong>{{ $errors->first('email') }}</strong>
						</span>
					@endif
				</md-input-container>
				@include('auth.recaptcha')
				<div class="form-group">
					<md-button type="submit" class="md-raised md-primary">
						<i class="fa fa-btn fa-envelope"></i> @lang('auth.send_password_btn')
					</md-button>
				</div>
			</form>
		</md-card-content>
    </md-card>
</md-content>
@endsection
