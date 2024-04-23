var base = require('./base').default;
var form_element = require('./form_element').default;
export default createModuleDefinition([base, form_element], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.data = $scope.data || {};
		$scope.data.validators = $scope.data.validators || {};
		if($.isArray($scope.data.validators)){
			$scope.data.validators = {};
		}
		$scope.data.masks = $scope.data.masks || {};
		if($.isArray($scope.data.masks))
			$scope.data.masks = {};
		$scope.field_type = $moduleInstance.frontend_module.getFieldType();
		
	};
	
	this.tab_editor = ['advance', 'offset', 'margin', 'input', 'input_validation', 'input_mask', 'input_autocomplete', 'border', 'background'];
});