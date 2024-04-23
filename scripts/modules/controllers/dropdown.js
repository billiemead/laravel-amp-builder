var base = require('./base').default;
var form_element = require('./form_element').default;
export default createModuleDefinition([base, form_element], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		$scope.data.values = $scope.data.values || [];
		
		$scope.d = {values_string : $scope.data.values};
		if($.isArray($scope.data.values))
			$scope.d.values_string = $scope.data.values.join("\n");
		$scope.changeValues = function()
		{
			$scope.data.values = $scope.d.values_string.split("\n");
			$scope.changeData(true);
		}
	}
	this.tab_editor = ['advance', 'offset', 'margin', 'dropdown', 'input_validation', 'text', 'border'];
});