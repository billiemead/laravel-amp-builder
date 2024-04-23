var base = require('./base').default;
var base_structure = require('./base_structure').default;
var base_template = require('./base_template').default;

var box = require('./box').default;

export default createModuleDefinition([base, base_structure, base_template, box], function($q,pageEdit,pageEdit_layout, $controller, safeApply) 
{
	"ngInject";
	this.initializeData =
	{
	};
	this.tab_editor = ['advance', 'offset', 'margin', 'template', 'flex_layout', 'column', 'border', 'text', 'background'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		//$scope.size = $moduleInstance.getColumnSize();
		$scope.setSize = function(size){
			$moduleInstance.setColumnSize(size);
		}
	};
	this._design = function($scope, $modalInstance, $moduleInstance)
	{
		"ngInject";
		$controller($moduleInstance.bases[0]._design, {$scope: $scope, $modalInstance: $modalInstance, $moduleInstance: $moduleInstance});
		$scope.extra_data.size = $moduleInstance.getColumnSize();
		safeApply($scope);
		console.log('size', $scope.extra_data.size);
	}
	this.canDropTo = function(module)
	{
		return module.getType() == 'row';
	}
	this.checkInnerDrop = function(direction, info, ui)
	{
		if(ui.helper.module != undefined){
			var type = ui.helper.module.getType();
			return type != 'column';
		}
	}
	this.setColumnSize = function(size)
	{
		return this.frontend_module.setColumnSize(size);
	}
	this.getColumnSize = function()
	{
		return this.frontend_module.getColumnSize();
	}
	this.createResizer = function()
	{
		
	}
	this.isDropTarget = function(event, ui)
	{
		if(this.getElement().is(':hidden'))
			return false;
		if(ui.helper.module != undefined){
			var type = ui.helper.module.getType();
			return type != 'column';
		}
		return true;
	}
	this.move = function(dropInfo)
	{
		var oldRow = this.getParentModule();
		this.__callSuper('move', dropInfo);
		var currentRow = this.getParentModule();
		if(currentRow){
			currentRow.calculateColumnSize();
		}
		if(oldRow){
			oldRow.calculateColumnSize();
		}
	};
	this.softDelete = function(){
		this.__callSuper('softDelete');
		var currentRow = this.getParentModule();
		if(currentRow){
			currentRow.calculateColumnSize();
		}
	}
	
});