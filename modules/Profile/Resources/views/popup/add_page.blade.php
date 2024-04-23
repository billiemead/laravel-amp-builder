<md-dialog aria-label="@lang('profile.add_website')">
	<form ng-cloak ng-submit="ok()">
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
				<input ng-model="data.name" required >
			</md-input-container>
			
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