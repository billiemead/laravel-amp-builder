<section class="content-header">
	<h1>
		@lang('profile.add_website')
	</h1>
</section>

<section class="content">
	<md-content class="md-padding" layout-xs="column" layout="column" >
		<md-nav-bar md-selected-nav-item="current_tab.name">
			<md-nav-item md-nav-click="changeTab($index)" name="@{{tab.name}}" ng-class="{active: current_tab.id==tab.id }" ng-repeat="tab in tabs">
				<i class="@{{tab.icon}}"></i>@{{tab.name}}
			</md-nav-item>
		</md-nav-bar>
		<div layout="row" layout-xs="column">
		<div flex-xs flex-gt-xs="30">
			<md-sidenav class="filter_theme_nav" md-component-id="sidenav"  md-is-locked-open="$mdMedia('gt-md')" md-whiteframe="4">
				<md-toolbar layout="row" class="">
					<div class="md-toolbar-tools">
						<span>Filter</span>
					</div>
				</md-toolbar>
				<md-divider></md-divider>
				<md-content>
				<md-list>
					<md-list-item  ng-click="filter('all')" ng-class="{selected: !category}">
						All
					</md-list-item>
					<md-list-item ng-repeat="cat in themes_categories"  ng-click="filter(cat.id)" ng-class="{selected: category==cat.id}">
						@{{cat.title}}
					</md-list-item>
				</md-list>
				</md-content>
			</md-sidenav>
			
		</div>
		<div flex-xs flex-gt-xs="70">
			<md-toolbar layout="row" class="">
				<div class="md-toolbar-tools">
					<span ng-if="category_name == false">All templates</span>
					<span ng-if="category_name !== false">@{{category_name}}</span>
					<span ng-if="templates.length">(@{{templates.length}})</span>
				</div>
			</md-toolbar>
			<md-content layout-padding md-whiteframe="3" layout="column">
				<div layout="row" infinite-scroll='loader.nextPage()' infinite-scroll-container="'.content-wrapper'" infinite-scroll-disabled='loader.disabled' infinite-scroll-distance='1' layout-wrap>
					<div flex-xs flex-gt-xs="50" layout="column">
						<md-card class="template-item">
							<div class="card-image">
								<img src="{{url('/')}}/assets/images/noimg.png" class="md-card-image" alt="">
							</div>
							<md-card-title>
							  <md-card-title-text>
								<span class="md-headline">Blank</span>
							  </md-card-title-text>
							</md-card-title>
							<md-card-actions layout="row" layout-align="end center">
							  <md-button class="md-raised md-primary" ng-click="selectTheme('blank')">@lang('profile.select_template')</md-button>
							</md-card-actions>
						</md-card>
					</div>
					<div flex-xs flex-gt-xs="50" layout="column" ng-repeat="template in loader.items">
						<md-card class="template-item">
							<div class="card-image">
								<img ng-src="@{{template.screenshot_url_nc}}" class="md-card-image" alt="@{{template.name}}">
							</div>
							<md-card-title>
							  <md-card-title-text>
								<span class="md-headline">@{{template.name}}</span>
							  </md-card-title-text>
							</md-card-title>
						
							<md-card-actions layout="row" layout-align="end center">
							  <md-button class="md-raised md-primary" ng-click="selectTheme(template.id, -1)">@lang('profile.select_template')</md-button>
							  <md-button href="@{{template.preview_url}}" target="_blank">@lang('profile.preview_template')</md-button>
							</md-card-actions>
						</md-card>
					</div>
					<div ng-show='loader.busy'>Loading data...</div>
				</div>
				
			</md-content>
		</div>
		</div>
	</md-content>
	
</section>