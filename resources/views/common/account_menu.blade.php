<md-menu-bar>
  <md-menu md-position-mode="left bottom">
	<button ng-click="$mdMenu.open()">
		<i class="fa fa-user"></i>
		<span hide-sm hide-xs>{{auth()->user()->name}}</span>
		<i class="fa fa-angle-down"></i>
	</button>
	<md-menu-content>
		@hasanyrole('admin|super_admin')
		<md-menu-item>
			<md-button href="{{url('/admin')}}">
				@lang('menu.admin')
			</md-button>
	  </md-menu-item>
	  @endhasrole
	  <md-menu-item>
		<md-button href="{{url('profile')}}">
			@lang('profile.profile')
		</md-button>
	  </md-menu-item>
	  <md-menu-divider></md-menu-divider>
	  <md-menu-item>
		<md-button href="{{route("logout")}}">
			@lang('profile.sign_out')
		</md-button>
	  </md-menu-item>
	</md-menu-content>
	</md-menu>
</md-menu-bar>