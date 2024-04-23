<section class="content-header">
  <h1>
	@lang('profile.profile')
  </h1>
  <ol class="breadcrumb">
	<li><a href="#"><i class="fa fa-dashboard"></i>@lang('profile.home')</a></li>
	<li class="active">@lang('profile.profile')</li>
  </ol>
</section>
<section class="content">
	<div class="box">
		<div>
			<md-tabs md-dynamic-height md-border-bottom>
				<md-tab label="@lang('profile.information')">
					<md-section layout-padding>
						<form ng-submit="updateUser()">
							<p class="alert alert-success"  ng-repeat="message in changeInfo_success">
								@{{message}}
							</p>
							<p class="alert alert-danger"  ng-repeat="error in errors">
								@{{error}}
							</p>
							<md-input-container class="md-block">
								<label>@lang('profile.entry_name')</label>
								<input type="text" ng-model="data.name" required/>
							</md-input-container>
							<md-input-container class="md-block">
								<label>@lang('profile.entry_email')</label>
								<input type="text" ng-model="data.email" disabled/>
							</md-input-container>
							<div>
								<md-button type="submit" class="md-raised md-primary">@lang('profile.save')</md-button>
								
							</div>
						</form>
						
					</md-section>
				</mb-tab>
				<md-tab label="@lang('profile.change_password')">
					<md-section layout-padding>
						<form ng-submit="changePassword()">
							<p class="alert alert-success" ng-repeat="message in changePassword_success">
								@{{message}}
							</p>
							<p class="alert alert-danger"  ng-repeat="error in changePassword_errors">
								@{{error}}
							</p>
							<md-input-container class="md-block">
								<label>@lang('profile.entry_new_password')</label>
								<input type="password" ng-model="new_password" required/>
							</md-input-container>
							<md-input-container class="md-block">
								<label>@lang('profile.entry_old_password')</label>
								<input type="password" ng-model="old_password" required/>
							</md-input-container>
							<div>
								<md-button type="submit" class="md-raised md-primary">@lang('profile.btn_change_password')</md-button>
							</div>
							</form>
						</md-section>
						
				</md-tab>
				@if(config('gdpr.enabled'))
				<md-tab label="@lang('profile.privacy_gdpr')">
					<md-content flex layout-padding>
					<h4>@lang('profile.download_account_info_title')</h4>
					<form action="{{route('gdpr-download')}}" method="POST" target="_blank">
						{{ csrf_field() }}
						<md-input-container class="md-block">
							<label>@lang('auth.entry_password')</label>
							<input type="password" name="password" required/>
						</md-input-container>
						<md-button type="submit" class="md-raised md-secondary">@lang('profile.download_account')</md-button>
					</form>
					</md-content>
					<md-content flex layout-padding>
					<h4>@lang('profile.close_my_account')</h4>
					<form action="{{route('gdpr-close-account')}}" method="POST">
							{{ csrf_field() }}
							<md-input-container class="md-block">
								<label>@lang('auth.entry_password')</label>
								<input type="password" name="password" required/>
							</md-input-container>
							<md-input-container class="md-block">
								<label>@lang('auth.entry_confirm_password')</label>
								<input type="password" name="password_confirmation" required/>
							</md-input-container>
							<md-button type="submit" class="md-raised md-primary">@lang('profile.close_account')</md-button>
						</form>
					</md-content>
				</md-tab>
				@endif
			</md-tabs>  
		</div>
	</div>
</section>