var base = require('./base').default;
var embed_resolve = require('../../libraries/embed_resolve');
export default createModuleDefinition([base], function(popup) 
{
	"ngInject";
	this.clone_need_reload = true;
	this.tab_editor = ['advance', 'offset', 'margin', 'video'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.changeSource = function()
		{
			$moduleInstance.setDefaultSource();
		}
		$scope.fixedAMPLayout = true;
	}
	this.loadElement = function(el)
	{
		this._loadElement(el);
		this.overlayDiv = jQuery_iframe("<div style=\"width:100%;height:100%;z-index:10;top:0;left:0;position:absolute;\"></div>");//.appendTo(el);
		var request_source = this.is_new_inserted_element && !this.frontend_module.is_clone_element;
		if(request_source){
			this.setDefaultSource();
		}
	}
	this.setDefaultSource = function()
	{
		var that = this;
		popup.open({
			name:'video',
			controller: function($scope, $modalInstance){
				"ngInject";
				$scope.data = {};
				$scope.ok = function()
				{
					var obj = embed_resolve.parseEmbedURL($scope.data.url);
					
					if(obj){
						var code = obj.getAMPCode();
						if(code == undefined){
							alert('invalid url')
							return;
						}
						that.setDataByKey('url', $scope.data.url, false);
						$modalInstance.close(obj);
					}
						
				}
			}
		}).result.then(function(data){
			if(data){
				var code = data.getAMPCode();
				
				var stub = data.stub;
				if(stub['embed-width'] && stub['embed-height']){
					//that.setSize(stub['embed-width'] * 1, stub['embed-height'] * 1);
				}
				
				that.setCode(code);
			}
			
		});
	}
	this.setCode = function(code)
	{
		this.setDataByKey('code', code, true);
	}
});
