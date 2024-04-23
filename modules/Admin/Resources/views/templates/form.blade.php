	<div class="box">
	<form name="form" ng-submit="submit()">
		<uib-alert type="danger"  ng-repeat="error in errors">
			@{{error}}
		</uib-alert>
		<md-input-container class="md-block">
			<label>@lang('admin.page_templates.entry_name')</label>
			<input ng-model="data.name" name="name" type="text" required>
			<div ng-messages="form.name.$error">
				<span class="error" ng-message="required">Please enter a name</span>
			</div>
		</md-input-container>
		<md-input-container class="md-block" ng-if="isNew">
			<label>@lang('admin.page_templates.entry_type')</label>
			<md-select placeholder="Select a type" ng-model="data.type" ng-change="changeType(data.type)" required>
			  <md-option value="page">@lang('admin.page_templates.template_types.page')</md-option>
			  <md-option value="section">@lang('admin.page_templates.template_types.section')</md-option>
			</md-select>
		</md-input-container>
		<md-input-container class="md-block">
			<label>@lang('admin.page_templates.list_columns.category')</label>
			<md-select placeholder="Select a category" ng-model="data.category" required>
			  <md-option ng-value="@{{themes_category.id}}" ng-repeat="themes_category in themes_categories | filter:filterCategory(criteria)">@{{themes_category.title}}</md-option>
			</md-select>
		</md-input-container>
		<md-input-container class="md-block">
		<md-checkbox ng-model="data.categories[themes_category.id]" ng-repeat="themes_category in themes_categories | filter:filterCategory(criteria)">@{{themes_category.title}}</md-checkbox>
		</md-input-container>
		<md-input-container class="md-block">
			<md-checkbox ng-model="data.is_active" aria-label="Is Active" ng-true-value="1" ng-false-value="0">
				@lang('admin.page_users.entry_active')
			</md-checkbox>
		</md-input-container>
		<md-button class="md-raised md-primary" type="submit" ng-disabled="submitting">
			@lang('admin.save')
		  </md-button>
		<md-button class="" href="#templates">
			@lang('admin.close')
		</md-button>
	</form>
	</div>
