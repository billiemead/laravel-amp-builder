export default function($window, pageEdit_ddManager, pageEdit_layout, $animate)
{
	"ngInject";
	return {
		controller: function($scope, $element, $attrs){
			"ngInject";
			this.tabs = {};
			this.addTab = function(name, tab)
			{
				this.tabs[name] = tab;
			}
			this.hideAllTab = function(tabs)
			{
				for(var i in this.tabs)
				{
					this.tabs[i].hide();
				}
			}
			this.showTabs = function(tabs)
			{
				for(var i in this.tabs)
				{
					if(!tabs[i])
						this.tabs[i].hide();
				}
				for(var i in tabs)
				{
					if(this.tabs[i] != undefined)
						this.tabs[i].show();
				}
			}
			this.hideTab = function(name)
			{
				if(this.tabs[name])
					this.tabs[name].hide();
			}
			this.showTab = function(name)
			{
				if(this.tabs[name])
					this.tabs[name].show();
			}
			var that = this;
			
			$scope.$watchCollection($attrs.editorTabs, function(value, oldvalue){
				var isHideAll = true;
				if(value == undefined)
					return;
				that.showTabs(value);
			});
		}
	}
}
