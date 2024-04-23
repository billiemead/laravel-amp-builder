var base = require('./base').default;
var box = require('./box').default;
var button = require('./base_button').default;
var base_structure = require('./base_structure').default;

var widgetFunc = require('../../utils/widget');

var integrations = require.context("../../../modules/Builder/integrations", true, /^\.\/.*\popup.js$/);
export default createModuleDefinition([base, button, base_structure, box], function($q,pageEdit,pageEdit_layout, pageEdit_ddManager, pageEdit_float_editor_button, safeApply, API) 
{
	"ngInject";
	this.initializeData =
	{
	};
	this.resizable = false;
	this.tab_editor = ['advance', 'offset', 'margin', 'form', 'form_integration', 'form_fields'];
	this.controller = function($scope, $moduleInstance, popup)
	{
		"ngInject";
		$scope.providers = [];
		$scope.basePath = window.basePath;
		$scope.data.integrations = $scope.data.integrations || {};
		if($.isArray($scope.data.integrations)){
			$scope.data.integrations = {};
		}
		API.service('provider').withHttpConfig({cache: true}).get('list').then(function(json)
		{
			delete json.restangularEtag;
			$scope.providers = json;
		});
		$scope.openIntegrationDialog = function(type)
		{
			var redkeys = integrations.keys();
			var c = integrations('./' + type + '/js/popup.js');
			if(c != undefined){
				c.parentForm = $moduleInstance;
				c.providerInfo = $scope.providers[type];
				c.providerType = type;
				popup.open(c).result.then(function(data){
					$scope.data.integrations = $scope.data.integrations || {};
					$scope.data.integrations[type] = data;
					$moduleInstance.setDataByKey('integrations', $scope.data.integrations);
					safeApply($scope);
				});
			}
		}
		$scope.removeIntegration = function(key){
			delete $scope.data.integrations[key];
			$moduleInstance.setDataByKey('integrations', $scope.data.integrations);
			safeApply($scope);
		}
		$scope.show_integration_providers = function(){
			var parentScope = $scope;
			popup.open({
				name:'form_providers',
				controller: function($scope, $modalInstance)
				{
					"ngInject";
					$scope.providers = {};
					for(var i in parentScope.providers){
						if(parentScope.data && parentScope.data.integrations && parentScope.data.integrations[i] != undefined)	continue;
						$scope.providers[i] = parentScope.providers[i];
					}
					$scope.basePath = window.basePath;
					$scope.openIntegrationDialog = function(key){
						$modalInstance.close(key);
					}
				}
			}).result.then(function(key){
				parentScope.openIntegrationDialog(key);
			});
		}
		$scope.manageFields = function()
		{
			var parentScope = $scope;
			popup.open({
				name:'form_fields',
				controller: function($scope, $modalInstance)
				{
					"ngInject";
					$scope.fields = parentScope.data.hidden_fields || [];
					$scope.hidden_fields = $moduleInstance.getHiddenModules();
					$scope.add = function()
					{
						$scope.fields.push({name:"New field", source:"default", value:"Field Value"});
					}
					$scope.ok = function()
					{
						if ($scope.form.$valid) {
							//$modalInstance.close($scope.fields);
						}
					}
				}
			}).result.then(function(json){
				$moduleInstance.setDataByKey('hidden_fields', json);
				$scope.data = $moduleInstance.getData();
			})
		}
		$scope.form_fields = widgetFunc.getFormFields();
		$scope.addField = function(name, data)
		{
			var template = require('../templates/form/input.tmpl');
			if(name =='hidden'){
				template = require('../templates/form/hidden.tmpl');
			}
			if(name =='label'){
				template = require('../templates/form/label.tmpl');
			}
			if(["checkbox", "radio", "dropdown", "multi_dropdown"].indexOf(name) >= 0){
				template = require('../templates/form/checkbox.tmpl');
			}
			popup.open({
				template: template,
				controller: function($scope, $modalInstance){
					"ngInject";
					$scope.data = {};
					$scope.ok = function()
					{
						
						if ($scope.form.$valid) {
							$modalInstance.close($scope.data);
						}
					}
				}
			}).result.then(function(data){
				var field = {type:name, data:data};
				$moduleInstance.frontend_module.insertNewDataField(field);
			});
		}
		$scope.connectRecaptcha = function()
		{
			var c = integrations('./g_recaptcha/js/popup.js');
			if(c != undefined){
				c.parentForm = $moduleInstance;
				c.providerInfo = $scope.providers['g_recaptcha'];
				c.providerType = 'g_recaptcha';
				popup.open(c).result.then(function(data){
					$moduleInstance.setDataByKey('g_recaptcha', data);
					$scope.data = $moduleInstance.getData();
				});
			}
		}
		$scope.configNotification = function()
		{
			var c = integrations('./notify/js/popup.js');
			if(c != undefined){
				c.parentForm = $moduleInstance;
				c.providerInfo = $scope.providers['notify'];
				c.providerType = 'notify';
				popup.open(c).result.then(function(data){
					$moduleInstance.setDataByKey('notify', data);
					$scope.data = $moduleInstance.getData();
				});
			}
		}
	};
	this.setData = function(data, updateView)
	{
		return this.frontend_module.setData(data, false);
	};
	this.setDataByKey = function(name, data, updateView)
	{
		return this.frontend_module.setDataByKey(name, data, false);
	};
	this.getDataByKey = function(name)
	{
		var data = this.frontend_module.getData();
		if(data && data[name] != undefined)
			return data[name];
	};
	this.isDropTarget = function(event, ui)
	{
		var form_fields = widgetFunc.getFormFields();
		if(ui.helper.module != undefined){
			var type = ui.helper.module.getType();
			return form_fields[type] != undefined;
		}
		return false;
	}
	this.checkInnerDrop = function(direction, info)
	{
		return false;
	}
	this.getHiddenModules = function()
	{
		var s = [];
		var that = this;
		this.getElement().children('form').children('.'+pageEdit_layout.module_class + '.hidden').each(function(i)
		{
			var module = pageEdit.getFloatModule(this);
			if(module != undefined){
				s.push(module);
			}
		});
		return s;
	}
	this.getChildModules = function()
	{
		var s = [];
		var that = this;
		this.getElement().children('form').children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var module = pageEdit.getFloatModule(this);
			if(module != undefined){
				s.push(module);
			}
		});
		return s;
	}
	this.getFieldList = function()
	{
		var list = this.frontend_module.getFieldList();
		return list;
	};
	this.loadElement = function(element)
	{
		this._loadElement(element);
		this.checkEmptyBox();
		this.initFloatModules();
	};
	this.insertCompleted = function()
	{
		
	}
	
	this.afterElementMoved = function(module)
	{
	
	
	}
	this.checkIsModuleOutside = function(module)
	{
		
	}
	this.onDblclick = function(event)
	{
		
	}
	this.dragEnter = function(event, ui){
		
		this.getElement().addClass('dropping');
	}
	this.dragLeave = function(event, ui){
		this.getElement().removeClass('dropping');
	}


	
	this.initFloatModules = function()
	{
		var that = this;
		this.getElement().children('form').children('.' + pageEdit_layout.module_class).each(function(i)
		{
			var moduleInstance = pageEdit_layout.createFloatModule(this);
			if(!moduleInstance)
			{
				return;
			}
		});
	}
	
	this.insertFloatModulePlaceholder = function(placeholder)
	{
		this.getElement().children('form').append(placeholder);
		this.checkEmptyBox();
	};
	this.checkEmptyBox = function()
	{
		var element = this.getElement();
	
		if(element.children('form').children('.' + pageEdit_layout.module_class).length){
			element.removeClass('empty');
		}
		else
			element.addClass('empty');
	};
	this.getFloatModule = function()
	{
		var s = [];
		var that = this;
		this.getElement().children('form').children('.'+pageEdit_layout.module_class).each(function(i)
		{
			var structure = that.getFloatModuleStructure(this);
			if(structure != undefined){
				s.push(structure);
			}
		});
		return s;
	}
	this.getFloatModuleStructure = function(module)
	{
		var s = {};
		var moduleInstance = pageEdit.getFloatModule(module);
		if(!moduleInstance)
		{
			return;
		}
		
		return moduleInstance.getStructure();
	};
	
	
});