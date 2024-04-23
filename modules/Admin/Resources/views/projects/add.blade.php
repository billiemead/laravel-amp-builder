<section class="content-header">
  <h1>
	Add website
  </h1>
  
</section>
<section class="content">
	<div class="box">
		<form name="form" ng-submit="submit()">
			<uib-alert type="danger"  ng-repeat="error in errors">
				@{{error}}
			</uib-alert>
			<md-input-container class="md-block">
				<label>@lang('admin.name')</label>
				<input ng-model="data.name" name="name" type="text" required>
				<div ng-messages="form.name.$error">
					<span class="error" ng-message="required">Please enter a name</span>
				</div>
			</md-input-container>
			<md-input-container class="md-block">
				<label>@lang('admin.theme')</label>
				<md-select placeholder="Select a category" ng-model="data.theme" style="min-width: 200px;" required>
				  <md-option ng-value="@{{theme.name}}" ng-repeat="theme in themes">@{{theme.display_name}}</md-option>
				</md-select>
			</md-input-container>
			<md-button class="md-raised md-primary" type="submit" ng-disabled="submitting">
				Save
			  </md-button>
			<md-button class="" href="#pages">
				Close
			</md-button>
		</form>
	</div>
</section>