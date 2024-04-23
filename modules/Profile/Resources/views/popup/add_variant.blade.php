<md-dialog rc-drag="md-toolbar" aria-label=" @lang('builder::builder.pagepopup.add_title')">
	<form ng-cloak ng-submit="ok()">
    <md-toolbar>
      <div class="md-toolbar-tools">
        <h2> @lang('builder::builder.pagepopup.add_title')</h2>
		
        <span flex></span>
        <md-button class="md-icon-button" ng-click="$dismiss()">
          <i class="fa fa-times" aria-label="Close dialog"></i>
        </md-button>
      </div>
    </md-toolbar>
	<md-dialog-content>
		<div class="md-dialog-content">
			<md-input-container class="md-block">
				<label> @lang('builder::builder.pagepopup.entry_name')</label>
				<input ng-model="data.name" required>
			</md-input-container>
			<span class="alert alert-danger" ng-repeat="error in errors.name">@{{error}}</span>
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

