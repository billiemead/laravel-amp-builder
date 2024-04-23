var base = require('./base').default;
export default createModuleDefinition([base], function(popup) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'video'];
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
		
		this.overlayDiv = jQuery_iframe("<div style=\"width:100%;height:100%;z-index:10;top:0;left:0;position:absolute;\"></div>");
		var request_source = this.is_new_inserted_element && !this.frontend_module.is_clone_element;
		if(request_source){
			this.getElement().children('div:first').html(window.t('htmlmodule.previewString'));
			this.setDefaultSource();
		}
	}
	this.setDefaultSource = function()
	{
		var that = this;
		popup.open({
			name:'code',
			controller: function($scope, $modalInstance){
				"ngInject";
				$scope.data = that.getCode() || '';
				$scope.mode = 'html';
				$scope.aceOption = {useWrapMode : true, theme:'twilight', mode: $scope.mode,
					onLoad: function (_ace) {
						$scope.ace = _ace;
					}
				};
				$scope.refresh = true;
				$scope.aceChanged = function(e) {
					$(window).trigger('resize');
				};
				$scope.ok = function()
				{
					$modalInstance.close($scope.data);
				}
			}
		}).result.then(function(data){
			if(data){
				that.setCode(data);
			}
			
		});
	}
	this.getCode = function()
	{
		var data = this.getData();
		if(data && data.code)
			return data.code;
	}
	this.setCode = function(code)
	{
		this.setDataByKey('code', code, false);
	}
});