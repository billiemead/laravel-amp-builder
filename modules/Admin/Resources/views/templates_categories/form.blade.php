<form name="form" ng-submit="submit()">
	<uib-alert type="danger"  ng-repeat="error in errors">
		@{{error}}
	</uib-alert>
	<md-input-container class="md-block">
		<label>@lang('admin.page_template_category.entry_title')</label>
		<input ng-model="data.title" name="title" type="text" required>
		<div ng-messages="form.name.$error">
			<span class="error" ng-message="required">Please enter a name</span>
		</div>
	</md-input-container>
	<md-input-container class="md-block">
		<label>@lang('admin.page_template_category.entry_description')</label>
		<input ng-model="data.description" name="description" type="text">
		<div ng-messages="form.description.$error">
			<span class="error" ng-message="required">Please enter a name</span>
		</div>
	</md-input-container>
	
	<md-button class="md-raised md-primary" type="submit" ng-disabled="submitting">
		@lang('admin.save')
	  </md-button>
	<md-button class="" href="#templates_categories">
		@lang('admin.close')
	</md-button>
</form>