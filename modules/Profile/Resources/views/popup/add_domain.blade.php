<md-dialog rc-drag="md-toolbar" aria-label="@lang('builder::builder.publishpopup.add_title') " flex="50">
	<form ng-cloak ng-submit="ok(form)" name="form">
    <md-toolbar>
      <div class="md-toolbar-tools">
        <h2>
		<span ng-hide="!isNew"> @lang('builder::builder.publishpopup.add_title') </span>
		<span ng-hide="isNew"> @lang('builder::builder.publishpopup.edit_title') </span>
		</h2>
		
        <span flex></span>
        <md-button class="md-icon-button" ng-click="$dismiss()">
          <i class="fa fa-times" aria-label="Close dialog"></i>
        </md-button>
      </div>
    </md-toolbar>
	<md-dialog-content>
		<div class="md-dialog-content">
			<md-input-container class="md-block">
				<md-radio-group ng-model="data.subdomain">
					@if(config('publishing.subdomain.enabled'))<md-radio-button value="1" class="md-primary"> @lang('builder::builder.publishpopup.subdomain')</md-radio-button>@endif
					@if(config('publishing.domain.enabled'))<md-radio-button value="0"> @lang('builder::builder.publishpopup.custom_domain')  </md-radio-button>@endif
			</md-radio-group>
			</md-input-container>
			@if(config('publishing.subdomain.enabled'))
				<div class="md-block" ng-hide="data.subdomain == 0">
				<label> @lang('builder::builder.publishpopup.entry_subdomain_name') </label>
				<div class="input-group">
				<input ng-model="data.name" required name="name" class="form-control">
				<span class="input-group-append">{{config('publishing.subdomain.domain')}}</span>
				</div>
				<div ng-messages="form.name.$error">
				  <div class="error" ng-message="uniqued">@{{error}}</div>
				</div>
			</div>
			@endif
			@if(config('publishing.domain.enabled'))
			<div class="md-block" ng-hide="data.subdomain == 1">
				<md-input-container class="md-block" ng-hide="data.subdomain == 1">
					
					<label> @lang('builder::builder.publishpopup.entry_domain_name') </label>
					<input ng-model="data.name" required flex="80" name="name">
					
					<div ng-messages="form.name.$error">
					  <div class="error" ng-message="uniqued">@{{error}}</div>
					</div>
					<p class="md-primary"> @lang('builder::builder.publishpopup.custom_domain_instruction') </p>
				</md-input-container>
				{!! config('publishing.domain.instruction') !!}
				<md-input-container class="md-block" ng-hide="data.subdomain == 1">
				</md-input-container>
			</div>
			@endif
		</div>
	</md-dialog-content>
	<md-dialog-actions layout="row">
		<span flex></span>
		<md-button type="submit">
			 @lang('common.ok') 
		</md-button>
		<md-button ng-click="$dismiss()">
         @lang('common.cancel') 
      </md-button>
    </md-dialog-actions>
  </form>
</md-dialog>

