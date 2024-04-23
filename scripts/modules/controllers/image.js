var base = require('./base').default;
//var StyleSheet = require('../../ssultils').StyleSheet;

export default createModuleDefinition([base], function($file_manager,$dialog, $cacheFactory) 
{
	"ngInject";
	this.resizable = true;
	this.initializeData = {src:window.top.basePath + '/assets/samples/default-placeholder.png'};
	this.tab_editor = ['advance', 'offset', 'margin', 'image', 'border_image'];
	this.loadElement = function(el)
	{
		jQuery_iframe('a', el).on('click', function(event){
			event.preventDefault();
		});
		this.bases[0].loadElement.call(this, el);
		
		var request_source = this.is_new_inserted_element && !this.frontend_module.is_clone_element;
		if(request_source){
			this.setDefaultSource();
		}
		
	}
	this.bindEvent =  function()
	{
		var that = this;
		this.getElement().on('dblclick', function(){
			that.setDefaultSource();
		});
		return this.__call('bindEvent');
	};
	this.setDefaultSource = function()
	{
		var that = this;
		
		return $file_manager.open({onlyImage: true}).result.then(function(images)
		{
			if(images.length == 0){
				return;
			}
			var image = images[0];
			that.changeSource(image.full_url);
			
			
		});
	}
	this.changeSource = function(src)
	{
		this.setDataByKey('src', src, true);
		var that = this;
		setTimeout(function(){
			that.reCalculateAMPSize();
		}, 100);
	}
	this.reCalculateAMPSize = function()
	{
		this.frontend_module.reCalculateAMPSize();
	}
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.fixedAMPLayout = false;
		$scope.selectFile = function()
		{
			$file_manager.open({onlyImage: true}).result.then(function(images)
			{
				if(images.length == 0)
					return;
				var image = images[0];
				$scope.data.src = image.full_url;
				//$scope.changeData();
				$moduleInstance.changeSource(image.full_url);
			});
		}
		$scope.changeAlign = function(value)
		{
			$scope.styles.textAlign = value;
			$scope.changeStyle('text-align', $scope.styles.textAlign);
		}
	};
	this._design = function($scope, $modalInstance, $moduleInstance, $controller)
	{
		"ngInject";
		$controller($moduleInstance.bases[0]._design, {$scope: $scope, $modalInstance:{}, $moduleInstance:$moduleInstance});
		$scope.image_styles = $moduleInstance.getCurrentItemStyles('> amp-img') || {};
		$scope.changeImageStyle = function(name, value, opacity)
		{
			$scope.changeItemStyle(name, value, '> amp-img');
		}
	}
	this.calculateDefaultSize = function()
	{
		var that = this;
		
		var image = jQuery_iframe('img', this.getElement() );
			
		var callback = function() {
			
			if(that.offset.width == undefined){
				that.offset.width = this.naturalWidth;
			}
			if(that.offset.height == undefined){
				that.offset.height = this.naturalHeight;
			}
			that.setSize(that.offset.width, that.offset.height);
		};
		
		
		if ((image[0] && image[0].complete) || (image[0] && image[0].naturalWidth > 0)) {
			callback.apply(image[0]);
		}
		else{
			image.on('load', function(){
				callback.apply(this);
			});
		}
	}
	
	
});