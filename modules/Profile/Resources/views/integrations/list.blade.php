<section class="content-header">
  <h1>
	@lang('profile.integrations')
	
  </h1>
  
</section>
<section class="content">
	<div class="box">
		<md-list>
			<md-list-item class="md-3-line" ng-repeat="integration in integrations">
			<div class="md-list-item-text" layout="column">
				<h3>@{{ integration.name }}</h3>
				<h4>@{{ integration.account_id }}</h4>
				<p>@{{ integration.account_name }}</p>
			</div>
			<md-button ng-click="delete($index)">@lang('profile.delete')</md-button>
				
		</md-list>
		<div ng-if="!integrations.length">
			@lang('profile.empty_integration_message')
		</div>
	</div>
</section>