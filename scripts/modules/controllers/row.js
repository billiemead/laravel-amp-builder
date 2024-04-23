var base = require('./base').default;
var base_structure = require('./base_structure').default;
var box = require('./box').default;
var maxColumn = 4;
var base_template = require('./base_template').default;

export default createModuleDefinition([base, base_structure, base_template, box], function($q, pageEdit, pageEdit_layout, pageEdit_undoManager) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'rows', 'template', 'border', 'text', 'background'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.sizes = $moduleInstance.getColumnSizes();
		$scope.addColumn = function()
		{
			$moduleInstance.frontend_module.insertColumn(6);
		}
		$scope.changeDirection = function(direction)
		{
			pageEdit_undoManager.beginGrouping();
			$scope.changeStyle('flex-direction', direction);
			if(direction == 'column'){
				$scope.changeItemStyle('width', '100%', '> .column');
			}
			else
				$scope.changeItemStyle('width', undefined, '> .column');
			pageEdit_undoManager.endGrouping();
		}
		
	};
	this.setStyle = function(name, value, element)
	{
		if(name == 'flex-direction')
		{
			if(value == 'column'){
				this.setStyle('width', '100%', '> .column');
			}
			else
				this.setStyle('width', undefined, '> .column');
		}
		return this.__call('setStyle', name, value, element);
	};
	this.getColumnSizes = function()
	{
		var children = this.getChildModules();
		var rs = [];
		for(var i in children){
			if(children[i].getColumnSize != undefined)
				rs.push(children[i].getColumnSize());
		}
		return rs;
	}
	this.getColumnCount = function()
	{
		var childs = this.getChildModules();
		return childs.length;
	}
	this.calculateColumnSize = function()
	{
		this.frontend_module.calculateColumnSize();
	}
	this.canDropTo = function(module)
	{
		return module && (module.getType() == 'section' || module.getType() == 'section_global');
	}
	this.isDropTarget = function(event, ui)
	{
		if(ui.helper.module != undefined){
			var column = this.getColumnCount();
			var type = ui.helper.module.getType();
			if(type == 'column' || type == 'column_global'){
				if(column == maxColumn){
					if(this.contains(ui.helper.module))
						return true;
				}
				else
					return true;
			}
		}
		return false;
	}
});