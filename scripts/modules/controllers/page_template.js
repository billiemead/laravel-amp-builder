var base = require('./base').default;
var base_page = require('./base_page').default;

var page = require('./page').default;
var structure = require('./base_structure').default;
var template = require('./base_template').default;

export default createModuleDefinition([base, page, base_page, structure,template], function($window, $dialog,popup,$controller,pageEdit,pageEdit_event,pageEdit_layout,pageEdit_modules,pageEdit_function, $timeout) 
{
	"ngInject";
	this.isDropTarget = function(event, ui)
	{
		return false;
	}
	this.getEditorTabs = function()
	{
		var type = this.getTemplateType();
		if(type == 'page')
			return this.tab_editor;
		return ['page_colors', 'page_fonts'];
	}
	
	this.controller = function($scope, $moduleInstance){
		"ngInject";
		var controlModule = $moduleInstance.getControlModule();
		$scope.selected_font = controlModule.getStyles()['font-family'];
		$scope.applyFont = function(index)
		{
			$scope.selected_font = $scope.data.fonts[index];
			
			controlModule.getSharedScope().changeStyle('font-family', $scope.data.fonts[index]);
		}
	}
	this.populatePageData = function(structure) {
		//console.log('populatePageData', structure)
	}
	this.getTemplateType = function()
	{
		var type = window.siteInfo.type;
		return type;
	}
	
	this.importPageContent = function(content, structure) {
		
		var html = "";
		var bodyClass = "";
		var bodyStyle = "";
		$('#iframe_loadingSpinner').show();
		var html = '';
		if(content != undefined){
			pageEdit_event.fire('clear_prepared');
			html = content;
			jQuery_iframe('body').html("");
			if(structure != undefined){
				bodyClass = structure.bodyClass || "";
				bodyStyle = structure.bodyStyle || "";
			}
			
		}
		
		pageEdit_event.fire('clear_prepared');
		jQuery_iframe('body').html('');
		
		var type = this.getTemplateType();
		var holder;
		if(type == 'page' || type =='section' || type =='global_section'){
			var container = this.getElement().children('#main_sections');
			if(container.length == 0)
			{
				container = jQuery_iframe('<div id="main_sections" class="section-container"></div>');
				this.getElement().append(container);
			}
			holder = container;
			if(type == 'page')
				holder = this.getElement();
			
		}
		if(type == 'popup'){
			jQuery_iframe('html').attr('edit-type', 'popup');
			$('html').attr('edit-type', 'popup');
			var container = this.getElement().children('#popup-container');
			if(container.length == 0)
			{
				container = jQuery_iframe('<div id="popup-container" class="section-container"></div>');
				jQuery_iframe('body').append(container);
			}
			holder = container;
		}
		if(holder)
		holder.append(html);
		pageEdit_event.fire('domupdated');
		pageEdit_event.fire('pageImported');
		this.afterPageChanged();
		$('#iframe_loadingSpinner').hide();
	}
	this.refresh = function()
	{
		this.__callSuper('refresh', this);
		var t = this.getTemplateType();
		
		if(t == 'popup'){
			var popup = jQuery_iframe('#popup-container').children('.popup-section:first');
			if(popup.length){
				
				this.changeEditTab.call(this, t)
			}
		}
	}
	this.initModules = function()
	{
		var that = this;
		var p = (this.getTemplateType() == 'page') ? '' : '_template';
		var section_elements = this.getElement().children('#main_sections').children("section." + pageEdit_layout.zone_class);
		section_elements.each(function()
		{
			pageEdit_layout.createModule(this, 'section' + p);
		});
		var section_elements = this.getElement().children('#popup-container').children("." + pageEdit_layout.popup_class);
		section_elements.each(function()
		{
			pageEdit_layout.createModule(this, 'popup' + p);
		});
		this.checkEmptyPage();
		
	};
	this.changeEditTab = function(type, onRefresh = false){
		var parent = this.bases[1];
		//console.log('changeEditTab', type, this.getTemplateType());
		if(!type)
			type = this.getTemplateType();
		if(type == 'page' || type == 'section' || type == 'global_section')
		{
			this.__call('changeEditTab',  'main', true);
			//parent.changeEditTab.call(this, 'main', true)
		}
		else if(type == 'popup'){
			
			this.buildRightPanel();
			var that = this;
			$timeout(function()
			{
				var popup = jQuery_iframe('#popup-container').children('.popup-section:first');
				if(popup.length){
					that.__call('changeEditTab', popup.attr('id'), onRefresh);
					//parent.changeEditTab.call(that, popup.attr('id'), onRefresh)
				}
				
			});
			
		}
		else
			parent.changeEditTab.call(this, type, onRefresh)
	}
	this.checkEmptyPage = function()
	{
		var type = this.getTemplateType();
		jQuery_iframe('html').attr('edit-type', type);
		if(type == 'page' || type =='section'){
			var container = this.getElement().children('#main_sections');
			if(container.length == 0)
			{
				container = jQuery_iframe('<div id="main_sections" class="section-container"></div>');
				jQuery_iframe('body').append(container);
			}
			var section_elements = container.children("section." + pageEdit_layout.zone_class);
			if(section_elements.length == 0) {
				var section = pageEdit_layout.create_section_helper();
			}
		}
		if(type == 'popup'){
			
			var container = this.getElement().children('#popup-container');
			if(container.length == 0)
			{
				container = jQuery_iframe('<div id="popup-container" class="section-container"></div>');
				jQuery_iframe('body').append(container);
			}
			var section_elements = container.children("." + pageEdit_layout.popup_class);
			if(section_elements.length == 0) {
				var popup = pageEdit_layout.create_popup_helper();
			}
		}
	}
	this.setFonts = function(fonts){
		this.setDataByKey('fonts', fonts);
		var scope = this.getSharedScope();
		if(!scope)
			return;
		scope.data.fonts = fonts;
		safeApply(scope);
	}
	this.getControlModule = function()
	{
		var type = this.getTemplateType();
		if(type == 'page')
			return this;
		if(type =='section' || type =='global_section'){
			var section_element = this.getElement().children('#main_sections').children("section." + pageEdit_layout.zone_class).first();
			var module = pageEdit.getModule(section_element);
			return module;
		}
		if(type =='popup'){
			var popup_element = this.getElement().children('#popup-container').children("." + pageEdit_layout.popup_class).first();
			var module = pageEdit.getModule(popup_element);
			return module;
		}
	}
});