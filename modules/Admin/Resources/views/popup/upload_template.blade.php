<md-dialog aria-label="@lang('admin.page_templates.upload_dialog.title')">
	<form name="form" ng-cloak  ng-submit="ok()">
    <md-toolbar>
      <div class="md-toolbar-tools">
        <h2>@lang('admin.page_templates.upload_dialog.title')</h2>
		
        <span flex></span>
        <md-button class="md-icon-button" ng-click="$dismiss()">
          <md-icon class="fa fa-times" aria-label="Close dialog"></md-icon>
        </md-button>
      </div>
    </md-toolbar>
	<md-dialog-content>
		<div class="md-dialog-content">
			<div ng-if="!uploaded">
			<p>@lang('admin.page_templates.upload_dialog.instructions')</p>
			<md-button file-upload-button upload-options="upload_options" class="md-raised md-secondary">@lang('admin.page_templates.import')</md-button>
			</div>
			<div ng-if="uploaded">
				<p>@lang('admin.page_templates.upload_dialog.imported_templates')</p>
				<md-list ng-cloak>
					<md-list-item class="secondary-button-padding" ng-repeat="template in uploaded_templates">
						<p>@{{template.name}}</p><br>
						<p class="badge badge-secondary" ng-if="template.isUpdated">@lang('admin.page_templates.upload_dialog.updated')</p>
						<p class="badge badge-primary" ng-if="!template.isUpdated">@lang('admin.page_templates.upload_dialog.new')</p>
						<md-button class="md-secondary" href="@{{template.view_url}}" target="_blank">@lang('admin.view')</md-button>
				  </md-list-item>
				</md-list>
			</div>
		</div>
	</md-dialog-content>
	<md-dialog-actions layout="row">
		
    <span flex></span>
      <md-button ng-click="$dismiss()">
        @lang('common.close')
      </md-button>
    </md-dialog-actions>
  </form>
</md-dialog>