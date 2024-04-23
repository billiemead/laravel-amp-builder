var base = require('./base').default;
var texteditor = require('./base_texteditor').default;
var structure = require('./base_structure').default;

export default createModuleDefinition([base, structure, texteditor], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button) 
{
	"ngInject";
	this.tab_editor = ['advance', 'offset', 'margin', 'heading', 'text', 'text-shadow', 'border', 'background'];
	this.controller = function($scope, $moduleInstance)
	{
		"ngInject";
		!$scope.data.tag && ($scope.data.tag = $moduleInstance.getCurrentTag());
		$scope.changeHeadingType = function()
		{
			var tag = $scope.data.tag;
			$scope.changeData(false);
			$moduleInstance.destroyEditor();
			$moduleInstance.changeTagName(tag);
		}
		
	};
	this.getCurrentTag = function(newTag) {
		return this.getElement()[0].tagName.toLowerCase();
	}
	this.changeTagName = function(newTag) {
		var element = this.frontend_module.changeTagName(newTag);
		this.element = element;
		this.bindEvent();
	}
	this.getEditorElement = function()
	{
		return this.getElement();
	}
	this.getStructure = function(){
		var structure = this.__call('getStructure');
		structure.data = {tag: this.getCurrentTag()};
		structure.contents = this.getContents();
		return structure;
	}
	
});