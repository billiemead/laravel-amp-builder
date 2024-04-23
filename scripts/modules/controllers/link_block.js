var base = require('./base').default;
var box = require('./box').default;
var button = require('./base_button').default;
var structure = require('./base_structure').default;
var widgetFunc = require('../../utils/widget');

//var additional_fields = require('../../../tools.json').tools.link_block.additional_fields;

export default createModuleDefinition([base, structure, button, box], function($file_manager,$dialog, safeApply, pageEdit, pageEdit_layout) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'click_action', 'additional_fields', 'flex_layout', 'border', 'text', 'background'];
	this.getAdditionalFields = function()
	{
		var info = widgetFunc.getWidgetInfomation('link_block');
		return info.additional_fields;
	}
	this.isDropTarget = function(event, ui)
	{
		var additional_fields = this.getAdditionalFields();
		if(ui.helper.module != undefined){
			var type = ui.helper.module.getType();
			return additional_fields != undefined && additional_fields[type] != undefined;
		}
		return false;
	}
	this.loadElement = function(element)
	{
		this.__callSuper('loadElement', element);
		this.getElement().attr('href', 'javascript:void(0);');
		this.getElement().attr('draggable', 'false');
	};
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.changeData = function(updateView = false)
		{
			$scope._changeData($scope.data, updateView);
		}
		$scope.additional_fields = $moduleInstance.getAdditionalFields();
	}
});
