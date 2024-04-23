var base = require('./base').default;
export default createModuleDefinition([base], function(popup) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'list'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.changeSource = function()
		{
			$moduleInstance.setDefaultSource();
		}
	}
	this.loadElement = function(el)
	{
		this._loadElement(el);
		jQuery_iframe(el).on('click', 'a', function(event)
		{
			event.preventDefault();
		})
		jQuery_iframe(el).on('submit', 'form', function(event)
		{
			event.preventDefault();
		})
		var request_source = this.is_new_inserted_element && !this.frontend_module.is_clone_element;
		if(request_source){
			this.setDefaultSource();
		}
	}
	this.setDefaultSource = function()
	{
		var that = this;
		popup.open({
			name:'amp-list',
			controller: function($scope, $modalInstance){
				"ngInject";
				$scope.data = that.getData();
				
				$scope.ok = function()
				{
					$.get( $scope.data.src, function( data, textStatus, request) {
						var header = request.getResponseHeader('access-control-allow-origin');
						console.log(header);
						$modalInstance.close($scope.data);
						if(typeof header !== 'undefined') {
						}
					});
				}
			}
		}).result.then(function(data){
			if(data){
				that.setData(data, true);
			}
			
		});
	}
	
});