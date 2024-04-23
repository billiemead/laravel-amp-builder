export default function(pageEdit, pageEdit_widgets, pageEdit_event, pageEdit_layout){
	"ngInject";
	
	this.getTemplateType = function()
	{
		var type = window.siteInfo.type;
		return type;
	}
	this.getEditorTabs = function()
	{
		if(window.template_edit_mode && this.template_tab_editor)
			return this.template_tab_editor;
		return this.tab_editor;
	}
	this.getTemplateStructure = function()
	{
		return this.getStructure();
	}
	this.getTemplateData = function()
	{
		var structure = this.getTemplateStructure(); 
		structure.fonts = pageEdit.getBodyModule().getFonts();
		structure.variant = window.siteInfo.variant;
		var type = this.getLocalTemplateType();
		return {type: type, structure: structure};
	}
	this.getLocalTemplateType = function()
	{
		var type = this.getType();
		type = type.replace('_template', '');
		return type;
	}
	
	this.controller = function($scope, API, $moduleInstance, popup, AclService, pageEdit, $dialog){
		"ngInject";
		$scope.template_edit_mode = window.template_edit_mode;
		$scope.template_type = $moduleInstance.getTemplateType();
		$scope.canConvertToGlobal = pageEdit_widgets.checkModuleExists($moduleInstance.getType() + '_global');
		$scope.canConvertToTemplate = pageEdit_widgets.checkModuleExists($moduleInstance.getType() + '_template');
		function getExportedData(dialog_data)
		{
			var templateData = $moduleInstance.getTemplateData();
			var data = $.extend(dialog_data, templateData);
			return data;
		}
		function openTemplatePopup(opt)
		{
			return popup.open(
			{
				template:require('../templates/saveTemplatePopup.tmpl'),
				controller: function($scope, $modalInstance)
				{
					"ngInject";
					var type = opt.type || $moduleInstance.getLocalTemplateType();
					$scope.basePath = window.basePath;
					
					var filterCategory = function(categories, type){
						var rs = [];
						if($.isArray(categories)){
							rs = categories.filter(function(item){
								return item[type] != undefined && item[type] == 1;
							});
						}
						return rs;
					}
					API.service('theme_categories').getList().then(function(json)
					{
						$scope.theme_categories = filterCategory(json, type);
					});
					var saveFunction = function(data)
					{
						API.service(opt.submit_url).post(data).then(function(json)
						{
							$modalInstance.close(json);
						});
					}
					$scope.ok = function()
					{
						var data = getExportedData($scope.data);
						if(window.screenshot_handler == 'javascript')
							pageEdit.getChilrenIframe().captureScreenshot($moduleInstance.getElement()).then(canvas => {
								var img = canvas.toDataURL("image/jpg");
								data.screenshot = img;
								saveFunction(data);
							}, ()=> { saveFunction(data);});
						else
							saveFunction(data);
					}
				}
			})
		}
		$scope.saveTemplate = function()
		{
			if(!AclService.can($scope.saveTemplatePermission)){
				alert('Permission denied');
				return;
			}
			openTemplatePopup({submit_url:'template/createFromWebsite'}).result.then(function(json){
				$dialog.message({
					title:'Success',
					message:json.message
				})
			});;
		}
		$scope.saveMyTemplate = function()
		{
			openTemplatePopup({submit_url:'template/saveMySection'}).result.then(function(json){
				$dialog.message({
					title:'Success',
					message:json.message
				})
			});
		}
		$scope.saveGlobalTemplate = function()
		{
			openTemplatePopup({submit_url:'site/symbols'}).result.then(function(json){
				if(json && json.id){
					$dialog.message({
						title:'Success',
						message:json.message
					})
					$moduleInstance.convertToGlobalObject(json);
				}
			});
		}
		$scope.saveTemplatePermission = 'manage_template';
	}
};
