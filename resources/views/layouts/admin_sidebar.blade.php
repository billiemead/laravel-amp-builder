<md-sidenav ld-nav-is-compacted="false" ms-nav-is-folded-directive="true" class="md-sidenav-left" id="md-sidenav-left" md-is-locked-open="$mdMedia('gt-sm')" md-component-id="navigation" md-whiteframe="4">
  <md-toolbar class="" layout="row">
	<h1 class="md-toolbar-tools">
		<md-icon md-svg-src="{{config('general.logo_svg')}}"></md-icon>
		<span hide-sm hide-xs>{{config('general.brand_name')}}</span>
		<h2 flex></h2>
	<md-button class="md-icon-button" aria-label="" ld-sidenav-toggle="navigation" hide-gt-sm>
		<md-icon class="fa fa-arrow-left"></md-icon>
	</md-button>
	<md-button class="md-icon-button" aria-label="" ld-nav-compact-switcher hide-sm hide-xs>
		<md-icon class="fa fa-bars"></md-icon>
	</md-button>
	</h1>
  </md-toolbar>
  <ld-navigation class="ms-navigation">
	  @yield('sidebar_menu')
  </ld-navigation>

</md-sidenav>