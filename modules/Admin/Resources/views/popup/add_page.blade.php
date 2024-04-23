<md-dialog aria-label="@lang('profile.add_website')">
	<form name="form" ng-cloak  ng-submit="ok()">
    <md-toolbar>
      <div class="md-toolbar-tools">
        <h2>@lang('profile.add_website')</h2>
		
        <span flex></span>
        <md-button class="md-icon-button" ng-click="$dismiss()">
          <md-icon class="fa fa-times" aria-label="Close dialog"></md-icon>
        </md-button>
      </div>
    </md-toolbar>
	<md-dialog-content>
		<div class="md-dialog-content">
			<md-input-container class="md-block">
				<label>@lang('profile.entry_name')</label>
				<input ng-model="data.name" name="name" required >
			</md-input-container>
			<md-input-container class="md-block">
				<label>@lang('profile.entry_title')</label>
				<input ng-model="data.title" >
			</md-input-container>
			<md-input-container class="md-block">
				<label>@lang('profile.entry_keywords')</label>
				<input ng-model="data.keywords">
			</md-input-container class="md-block">
			<md-input-container>
				<label>@lang('profile.entry_description')</label>
				<textarea  rows="5" ng-model="data.description"></textarea>
			</md-input-container>
		</div>
	</md-dialog-content>
	<md-dialog-actions layout="row">
		
    <span flex></span>
		<md-button type="submit">
			@lang('builder.ok')
		</md-button>
      <md-button ng-click="$dismiss()">
        @lang('builder.cancel')
      </md-button>
    </md-dialog-actions>
  </form>
</md-dialog>