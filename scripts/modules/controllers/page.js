var base = require('./base').default;
var base_structure = require('./base_structure').default;
var button = require('./base_button').default;

var colorController = require('../../app.builder/controllers/colors').default;
var pageController = require('../../app.builder/controllers/page').default;
var templates = require.context('../templates', true, /^\.\/.*\.tmpl$/);
var base_template = require('./base_template').default;
var structure = require('./base_structure').default;
var base_page = require('./base_page').default;

export default createModuleDefinition([base, base_template, base_page,structure,button], function(pageEdit_event, $rootScope, $dialog,popup,pageEdit,pageEdit_layout,pageEdit_undoManager, pageEdit_function, API, pageEdit_font, pageEdit_less,pageEdit_sass, pageEdit_sass_variable, pageEdit_modules, pageEdit_widgets, popup_section_list, $controller, $compile, $timeout, safeApply) 
{
	"ngInject";
	this.draggable = false;
	this.tab_editor = ['template','page_offset', 'mobile_page', 'page_colors', 'page_fonts', 'text', 'background', 'page_settings'];
	this.type = 'page';
	this.sharedControllerCode = '$pagecontrollerScope';
	this.getEditorHolder = function()
	{
		return $('#page-edit-container');
	}
	this.getBaseTemplate = function()
	{
		return templates('./common_page.tmpl');
	}
	this.handleDragEvent = function(event, ui)
	{
	};
	this.getShadowElement = function()
	{
		return jQuery_iframe(this.element);
	};
	this.loadElement = function(el)
	{
		this.element = el;
		this.frontend_module = pageEdit.getChilrenIframe().getModule('body');
		this.loadContent();
		this.initResponsive();
	};
	this.createGroupWidget = function()
	{
		var childModule = pageEdit.getChilrenIframe().insertGroup();
		var module = pageEdit_layout.createModule(childModule.getElement());
		return module;
	}
	this.refresh = function()
	{
		pageEdit.getChilrenIframe().StyleSheet.removeAllStyles(this.getIdentify());
		var dataDiv = jQuery_iframe('script[type="text/json"]#body_data');
		var data = {}
		try
		{
			data = $.parseJSON(unescape(dataDiv.html()));
			data = $.extend({},true,data);
		}
		catch(e)
		{
		}
		if(data.styles){
			for(var i in data.styles){
				pageEdit.getChilrenIframe().StyleSheet.setStyle(this.getIdentify(), i, data.styles[i]);
			}
		}
		if(data.fonts){
			this.setDataByKey('fonts', data.fonts)
			this.loadFonts(data.fonts)
		}
		if(data.settings){
			this.setDataByKey('settings', data.settings)
		}
		if(data.colors){
			this.setDataByKey('colors', data.colors);
		}
		if(!this.currentEditTab)
			this.currentEditTab = 'main';
		this.changeEditTab(this.currentEditTab, true);
		this.resolution = this.getDefaultBreakpoint();
		this.changeResolution(this.resolution, true);
		
	}
	this.loadFonts = function(fonts)
	{
		pageEdit.getChilrenIframe().webFontLoad(fonts);
	}
	this.getDefaultBreakpoint = function()
	{
		var resolutionFunc = require('../../utils/resolution')
		return resolutionFunc.getDefaultBreakpoint();
		
	}
	this.loadContent = function()
	{
		var that = this;
		
		var structure = API.service('site').withHttpConfig({blockScreen: true}).get('structure').then(function(json)
		{
			if(json == 0) {
				
			}
			else {
				window.siteInfo = $.extend(true, window.siteInfo, json);
				$rootScope.$broadcast('siteStructureLoaded');
				that.importProjectFromJson(json);
			}
		});
	}
	this.changeEditTab = function(type, onRefresh = false)
	{
		if(type == this.currentEditTab && !onRefresh)
			return;
		this.previousEditTab = this.currentEditTab;
		
		this.currentEditTab = type;
		$rootScope.currentEditTab = type;
		if(type == 'main'){
			$('html').attr('edit-type', 'main');
			jQuery_iframe('html').attr('edit-type', 'main');
			this.buildLeftPanel();
			this.buildRightPanel();
		}
		else{
			
			var element = jQuery_iframe('#' + type);
			var module = pageEdit.getModule(element);
			console.log(element,type)
			if(module){
				module.startEditMode();
			}
			
		}
		$(window).trigger('changePageTab', [type]);
		if(!onRefresh)
			pageEdit_undoManager.manager.registerUndoAction(this, this.changeEditTab, [this.previousEditTab]);
	}
	this.getFrontendModule = function()
	{
		var module = pageEdit.getChilrenIframe().getModule(jQuery_iframe('body'));
		return module;
	}
	this.changeResolution = function(mode, onRefresh = false){
		if(mode == this.resolution && !onRefresh)
			return;
		
		this._changeResolution(mode, onRefresh);
		pageEdit.resolution = mode;
		$(window).trigger('changeResolution');
	}
	this.getCurrentResolution = function()
	{
		return this.resolution;
	}
	this._changeResolution = function(mode, onRefresh){
		this.previousSolution = this.resolution;
		this.resolution = mode;
		$rootScope.currentResolution = mode;
		jQuery_iframe('html').attr('mode', mode);
		if(pageEdit_modules.modules){
			for(var i in pageEdit_modules.modules){
				if(pageEdit_modules.modules[i] != this)
					pageEdit_modules.modules[i].changeResolution(mode);
			}
		}
		var module = this.getFrontendModule();
		if(module && module.onChangeResolution)
			module.onChangeResolution(mode, onRefresh);
		if(!onRefresh)
			pageEdit_undoManager.manager.registerUndoAction(this, this.changeResolution, [this.previousSolution]);
	}
	
	this.afterPageChanged = function()
	{
		var that = this;
		this.refresh();
		this.initCSSPreprocessor().then(function()
		{
			$rootScope.$emit('initCSSPreprocessorCompleted');
			var emptyImage = $('<amp-img layout="responsive" width="1" height="1"></amp-img>');
			that.getElement().append(emptyImage);
			emptyImage.remove();
		});
		pageEdit_font.init();
		this.initModules();
		
		$rootScope.$emit('editorReady');
	};
	this.initCSSPreprocessor = function()
	{
		var preprocessor = window.siteInfo.themeConfig.css_preprocessor || 'sass';
		
		if(preprocessor == 'less'){
			pageEdit.preprocessor = this.preprocessor = pageEdit_less;
		}
		if(preprocessor == 'sass' || preprocessor == 'scss'){
			if(window.siteInfo.themeConfig.use_css_variable)
				pageEdit.preprocessor = this.preprocessor = pageEdit_sass_variable;
			else
				pageEdit.preprocessor = this.preprocessor = pageEdit_sass;
		}
		

		if(this.preprocessor){
			$rootScope.$emit('cssPreprocessorReady');
			var that = this;
			return that.applyDefaultVariant();
			
		}
	}
	this.applyPageColorScheme = function(colors)
	{
		this.setPageColorScheme(colors);
		var rs = pageEdit.preprocessor.applyCustomScheme(colors);
		if(rs.then){
			return rs.then(function()
			{
				var name = ":pageColors";
				var newPalette = angular.copy(pageEdit.preprocessor.getColorPalette(window.siteInfo.theme, name));
				pageEdit.getChilrenIframe().StyleSheet.onChangePalette(newPalette);
				window.siteInfo.variant = name;
			})
		}
		return;
	}
	this.applyDefaultVariant = function()
	{
		var defaultScheme = window.siteInfo.variant || 'default';
		var colorList = this.getColorFromConfig();
		
		if(colorList && colorList[defaultScheme]){
			return pageEdit.preprocessor.applyScheme(defaultScheme, {content: colorList[defaultScheme]});
		}
		else if(defaultScheme == ':pageColors'){
			var colors = this.getDataByKey('colors');
			return pageEdit.preprocessor.applyCustomScheme(colors);
		}
	}
	this.getColorFromConfig = function()
	{
		var colorList;
		if(window.siteInfo){
			colorList = window.siteInfo.colorList;
		}
		if(!colorList && window.siteInfo.structure){
			colorList = window.siteInfo.structure.colorList;
		}
		if(!colorList && window.siteInfo.themeConfig){
			colorList = window.siteInfo.themeConfig.colorList;
		}
		return colorList;
	}
	this.compileColorSchemes = function()
	{
		var colorList = this.getColorFromConfig();
		if(!pageEdit.preprocessor || !colorList)
			return;
		var schemes = pageEdit.preprocessor.compileSchemes(colorList);
		return schemes;
		
		
	}
	this.applyColorScheme = function(name, colorScheme)
	{
		var rs = pageEdit.preprocessor.applyScheme(name, colorScheme);
		
		if(rs.then){
			
			return rs.then(function()
			{
				var newPalette = angular.copy(pageEdit.preprocessor.getColorPalette(window.siteInfo.theme, name));
				try{
					pageEdit.getChilrenIframe().StyleSheet.onChangePalette(newPalette);
				}
				catch(e)
				{
					console.log(e);
				}
				window.siteInfo.variant = name;
			})
		}
		return;
	}
	
	this.initModules = function()
	{
		var that = this;
		var section_elements = this.getElement().children('#main_sections').children("section." + pageEdit_layout.zone_class);
		section_elements.each(function()
		{
			pageEdit_layout.createModule(this);
		});
		var section_elements = this.getElement().children('#popup-container').children("." + pageEdit_layout.popup_class);
		section_elements.each(function()
		{
			pageEdit_layout.createModule(this);
		});
		this.checkEmptyPage();
		
	};
	this.checkEmptyPage = function()
	{
		var container = this.getElement().children('#main_sections');
		if(container.length == 0)
		{
			container = jQuery_iframe('<div id="main_sections" class="section-container"></div>');
			this.getElement().append(container);
		}
		var section_elements = container.children("section." + pageEdit_layout.zone_class);
		if(section_elements.length == 0) {
			var section = pageEdit_layout.create_section_helper();
		}
	}
	this.getCurrentVisibility = function()
	{
		return true;
	}
	
	this.scrollTo = function(module)
	{
		var offset = module.getElement().offset();
		jQuery_iframe('html, body').animate({
			scrollTop: offset.top
		}, 700);
	}
	
	this.getHiddenLayers = function()
	{
		var hiddenLayers = [] ;
		var rs = [];
		if($rootScope.currentEditPage == 'main')
			hiddenLayers = pageEdit.getHiddenLayers('#main_sections');
		for(var i in hiddenLayers){
			rs.push({
				name: hiddenLayers[i].getWidgetDisplayName(),
				id: hiddenLayers[i].getPage_id()
			});
		}
		return rs;
	}
	this.getChildModules = function()
	{
		var container = jQuery_iframe('#main_sections');
		var section_elements = this.getElement().children('#main_sections').children("section." + pageEdit_layout.zone_class);
		var rs = [];
		section_elements.each(function()
		{
			var module = pageEdit.getModule(this);
			if(module != undefined){
				
				rs.push(module);

			}
		});
		return rs;
	}
	
	this.createLayerTree = function()
	{
		var hiddenLayers = [] ;
		$scope.hiddenLayers = []
		if($scope.currentEditPage == 'main')
			hiddenLayers = pageEdit.getHiddenLayers('#main_sections');
		for(var i in hiddenLayers){
			$scope.hiddenLayers.push({
				name: hiddenLayers[i].getWidgetDisplayName(),
				id: hiddenLayers[i].getPage_id()
			});
		}
		safeApply($scope);
	}
	this.getPopupList = function()
	{
		var popups = [];
		var container = jQuery_iframe('#popup-container');
		if(container.length == 0)	{
			return;
		}
		container.children('.' + pageEdit_layout.popup_class).each(function(i)
		{
			var module = pageEdit_layout.getModule(this);
			if(module){
				popups.push(module);
			}
			
		});
		return popups;
	}
	this.setPageColorScheme = function(scheme)
	{
		this.setDataByKey('colors', scheme);
	}
	
	this.getPageColorScheme = function()
	{
		return this.getDataByKey('colors');
	}
	this.addCustomBreakpoint = function(data)
	{
		this.custom_breakpoints = this.custom_breakpoints || {};
		if(data.name)
		{
			this.custom_breakpoints['@' + data.name] = data;
		}
		var module = this.getFrontendModule();
		var defaultResolutions = module.getResolution();
		var resolutions = $.extend({}, defaultResolutions, this.custom_breakpoints);
		module.refreshResponsiveStyle(resolutions);
	}
	this.getCustomBreakpoint = function(name)
	{
		this.custom_breakpoints = this.custom_breakpoints || {};
		if(name != undefined && this.custom_breakpoints[name] != undefined)
		{
			return this.custom_breakpoints[data.name];
		}
		else if(name == undefined)
			return this.custom_breakpoints;
	}
	this.fontController = function($scope, $moduleInstance, popup_google_font_browser)
	{
		"ngInject";
		$scope.data.fonts = $moduleInstance.getDataFonts() || [];
		$scope.addFont = function(){
			popup.open({
				template: require('../templates/page/font.tmpl'),
				controller: function($scope, $modalInstance){
					"ngInject";
					$scope.close = function(type)
					{
						$modalInstance.close(type);
					}
				}
			}).result.then(function(type){
				switch(type){
					case 'google':
					addGoogleFont();
					break;
					case 'url':
					addUrlFont();
					break;
				}
			})
			
		}
		function refreshFontList()
		{
			$(window).trigger('page_font_changed');
			//$scope.fonts = $moduleInstance.getBodyFonts();
			//safeApply($scope);
		}
		$scope.removeFont = function(index)
		{
			var fontName = $scope.data.fonts[index].name || $scope.data.fonts[index];
			$scope.data.fonts.splice(index, 1);
			$moduleInstance.removeFontFamily(fontName);
			$moduleInstance.setDataByKey('fonts', $scope.data.fonts);
			refreshFontList();
		}
		$scope.applyFont = function(index)
		{
			$scope.changeStyle('font-family', $scope.data.fonts[index]);
		}
		function addGoogleFont(){
			popup_google_font_browser.open().result.then(function(font_name){
				$scope.data.fonts = $scope.data.fonts || [];
				if($scope.data.fonts.indexOf(font_name) >= 0){
					return;
				}
				$scope.data.fonts.push({name:font_name, type: 'google'});
				$moduleInstance.loadFonts($scope.data.fonts);
				$moduleInstance.setDataByKey('fonts', $scope.data.fonts);
				refreshFontList();
			});
		}
		function addUrlFont(){
			popup.open({
				template: require('../templates/page/font_url.tmpl'),
				controller: function($scope, $modalInstance){
					"ngInject";
					$scope.data = {url:''};
					$scope.ok = function()
					{
						API.service('site/font').get('url', {url:$scope.data.url}).then(function(json){
							
							$modalInstance.close({fonts:json, url:$scope.data.url});
						});
						
					}
				}
			}).result.then(function(result){
				if(result == undefined)	return;
				for(var i in result.fonts)
					$scope.data.fonts.push({name:result.fonts[i], type: 'url', url: result.url});
				$moduleInstance.loadFonts($scope.data.fonts);
				$moduleInstance.setDataByKey('fonts', $scope.data.fonts);
				refreshFontList();
			})
		}
		
	}
	this.removeFontFamily = function(font)
	{
		this.__callSuper('removeFontFamily', font);
		var modules = this.getChildModules();
		for(var i in modules){
			modules[i].removeFontFamily(font);
		}
		var popups = this.getPopupList();
		for(var i in popups){
			popups[i].removeFontFamily(font);
		}
	}
	this.getssElement = function(){
		return jQuery_iframe('body');
	}
	this.controller = function($scope, $moduleInstance, AclService){
		"ngInject";
		$controller(colorController, {$scope: $scope, $moduleInstance: $moduleInstance});
		$controller(pageController, {$scope: $scope, $moduleInstance: $moduleInstance});
		$controller($moduleInstance.fontController, {$scope: $scope, $moduleInstance: $moduleInstance});
		$scope.arrange = function()
		{
			$moduleInstance.arrange();
		}
		$scope.range = function(n) {
			return new Array(n);
		};
		$scope.openSettingPage = function(page)
		{
			var template = require('../templates/page/' + page + '.tmpl');
			popup.open({
				template:template,
				controller: function($scope, $modalInstance, $http, $sce){
					"ngInject";
					$scope.data = $moduleInstance.getSettings(page) || {};
					$scope.fetchTrackingCode = function()
					{
						$http.get(window.basePath + '/tracking_code').then(function(json){
							$scope.tracking_code = (json.data);
						})
					}
					$scope.ok = function()
					{
						$modalInstance.close($scope.data);
					}
				}
			}).result.then(function(data){
				$moduleInstance.setSettings(page, data);
			});
		}
		
		
	}
	this.setData = function(data, updateView)
	{
		return this.data = data;
	};
	this.setDataByKey = function(name, data, updateView)
	{
		this.data = this.data || {};
		this.data[name] = data;
	};
	this.getDataByKey = function(name)
	{
		if(this.data)
			return this.data[name];
	};
	this.getSettings = function(key)
	{
		this.data = this.data || {};
		this.data['settings'] = this.data['settings'] || {};
		if(key != undefined)
			return this.data['settings'][key];
		return this.data['settings'];
	}
	this.setSettings = function(key, data)
	{
		this.data = this.data || {};
		this.data['settings'] = this.data['settings'] || {};
		if($.isArray(this.data['settings'])){
			this.data['settings'] = {};
		}
		this.data['settings'][key] = data;
	}
	this.setStyle = function(name, value)
	{
		pageEdit.getChilrenIframe().StyleSheet.setStyle(this.getIdentify(), name, value);
	}
	this.getFonts = function()
	{
		this.data = this.data || {};
		var fonts = this.data['fonts'];
		var rs = [];
		for(var i in fonts){
			if($.type(fonts[i]) == 'string' && rs.indexOf(fonts[i]) < 0){
				rs.push(fonts[i]);
			}
			else if(fonts[i].name && rs.indexOf(fonts[i].name) < 0)
				rs.push(fonts[i].name);
		}
		return rs;
	}
	this.getDataFonts = function()
	{
		this.data = this.data || {};
		var fonts = this.data['fonts'];
		
		for(var i in fonts){
			if($.type(fonts[i]) == 'string'){
				fonts[i] = {name: fonts[i], type:'google'};
			}
		}
		return fonts;
	}
	this.getOffset = function()
	{
		return {};
	};
	this.getVisibility = function()
	{
		return {};
	};
	this.doSelect = function()
	{
		var iframe_document = pageEdit.iframe.getWindow();
		var $context = jQuery_iframe(iframe_document);
		var that = this;
		$context.trigger('click');
		$(window).trigger('widget_deselected', []);
	}
	this.getIdentify = function()
	{
		return 'body';
	}
	this.getStyles = function()
	{
		return pageEdit.getChilrenIframe().StyleSheet.getStyle(this.getIdentify());
	};
	
	this.getData = function()
	{
		var data = {};
		//data = this.getStructure();
		data.pageProperties = {};
		data.pageProperties.styles = this.getStyles();
		data.pageProperties.fonts = this.getDataFonts();
		data.pageProperties.settings = this.getSettings();
		data.pageProperties.colors = this.getPageColorScheme();

		return data;
	}
	this.getExportedData = function()
	{
		var data = this.getStructure();
		data.pageProperties = this.getData().pageProperties;
		return data;
	}
	
	this.getStructure = function()
	{
		var s = {};
		s.sections = [];
		
		var that = this;
		this.getElement().children('#main_sections').children('section'+'.'+ pageEdit_layout.zone_class).each(function(i)
		{
			var part = that.getSectionStructure(this);
			if(part != undefined)
			s.sections.push(part);
			
		});
		s.popups = [];
		this.getElement().children('#popup-container').children('.' + pageEdit_layout.popup_class).each(function(i)
		{
			var part = that.getPopupStructure(this);
			if(part != undefined)
			s.popups.push(part);
		});
		return s;
	}
	this.getSectionStructure = function(module)
	{
		var s = {};
		var moduleInstance = pageEdit.getModule(module);
		if(!moduleInstance)
		{
			return;
		}
		
		return moduleInstance.getStructure();
	};
	this.getPopupStructure = function(module)
	{
		var s = {};
		var moduleInstance = pageEdit.getModule(module);
		if(!moduleInstance)
		{
			return;
		}
		
		return moduleInstance.getStructure();
	};
	this.importPageContent = function(content, structure) {
		pageEdit_event.fire('domupdated');
		pageEdit_event.fire('pageImported');
		this.afterPageChanged();
		$('#iframe_loadingSpinner').hide();
		return;
		
		
	}
	this.importPageStructure = function(structure) {
		pageEdit_event.fire('domupdated');
		pageEdit_event.fire('pageImported');
		this.populatePageData(structure);
		this.afterPageChanged();
		$('#iframe_loadingSpinner').hide();
		return;
	}
	this.populatePageData = function(structure) {
		if(structure.variant){
			window.siteInfo.variant = structure.variant;
			delete structure.variant;
		}
			
	}
	this.getTemplateStructure = function()
	{
		var structure = this.getExportedData();
		return structure;
	}
	this.save = function()
	{
		var plainHtml = false;
		var pageInfo = {};
		pageInfo.variant = window.siteInfo.variant;
		pageInfo.theme = window.siteInfo.theme;
		pageInfo.structure = this.getExportedData();
		
		API.service("site/update").post({pageInfo:pageInfo}).then(function(json){
			
			$dialog.message({
				title: window.t("save_successful_title"),
				message:window.t("save_successful_message"),
			});
			$(window).trigger('update_content');
		});
		
		
	}
	this.importProjectFromJson = function(data) {
		try{
			window.siteInfo = window.siteInfo || {};
			if(data.pages != undefined) {
				
				window.siteInfo.pages = angular.copy(data.pages);
				delete data.pages;
			}
			if(data.structure != undefined) {
				return this.importPageStructure(data.structure);
			}
			if(data.custom_styleSheet != undefined) {
				window.siteInfo.custom_styleSheet = angular.copy(data.custom_styleSheet);
				if(pageEdit.preprocessor && pageEdit.preprocessor.refreshCustomCode)
					pageEdit.preprocessor.refreshCustomCode(window.siteInfo.custom_styleSheet);
				delete data.custom_styleSheet;
			}
			
			if(data.variant != undefined && data.variant != 'default') {
				window.siteInfo.variant = angular.copy(data.variant);
				delete data.variant;
				
			}
			
		}
		catch(e){
			$('#iframe_loadingSpinner').hide();
			console.log(e);
			$dialog.message({
				title:"Import Error",
				message:"An error occurs when import. Error detail: " + e
			});
			throw e;
		}
	}
	this.reLayout = function()
	{
		this.getElement().children('#main_sections').children('section'+'.'+ pageEdit_layout.zone_class).each(function(i)
		{
			var module = pageEdit.getModule(this);
			if(module != undefined)
				module.reLayout();
		});
	}
	
	this.getSectionInViewport = function()
	{
		var rs = [];
		this.getElement().children('#main_sections').children('section'+'.'+ pageEdit_layout.zone_class).each(function(i)
		{
			var module = pageEdit.getModule(this);
			if(module != undefined && module.isInViewport != undefined && module.isInViewport())
				rs.push(module);
		});
		return rs;
	}
	this.resizeWidth = function()
	{
		pageEdit_undoManager.beginGrouping();
		this.getElement().children('#main_sections').children('section'+'.'+ pageEdit_layout.zone_class).each(function(i)
		{
			var module = pageEdit.getModule(this);
			if(module != undefined)
				module.resizeWidth();
		});
		pageEdit_undoManager.endGrouping();
	}
	this.checkFontExist = function(currentFonts, font)
	{
		if($.type(font) == 'string')
			return currentFonts.indexOf(font) >= 0;
		for(var i in currentFonts){
			if(currentFonts[i].type == font.type && currentFonts[i].name == font.name){
				return true;
			}
		}
		return false;
	}
	this.addFonts = function(fonts){
		
		var currentFonts = this.getDataFonts() || [];
		for(var i in fonts){
			var font = fonts[i];
			if($.type(font) == 'string')
			{
				font = {name:font, type:'google'};
			}
			if(!this.checkFontExist(currentFonts, font)){
				currentFonts.push(font);
			}
		}
		
		var scope = this.getSharedScope();
		if(scope){
			scope.data.fonts = currentFonts;
			safeApply(scope);
		}
		this.setDataByKey('fonts', currentFonts)
		this.loadFonts(fonts)
			return;
		
	}
	this.initResponsive = function(){
		var resolutions = this.getFrontendModule().getResolution();
		this.refreshResponsiveStyle(resolutions);
	}
	this.refreshResponsiveStyle = function(resolutions)
	{
		if(!resolutions)
			return;
		var style = "";
		for(var i in resolutions)
		{
			var resolution = resolutions[i];
			if(resolution.default)	continue;
			var css = '';
			var prefix = "";
			if(!resolution.default){
				prefix = '#frameWrapper.' + i + ' ';
			}
			
			css += prefix + 'iframe#edit_page {';
			var container_size = resolution.editting_container_size || resolution.container_size;
			
			css += 'width:' + container_size + 'px';;
			css += '}';
			

			style += css;
		}
		var styleElement = $('style#responsive_screens');
		if(!styleElement.length){
			styleElement = $('<style id="responsive_screens"></style>');
			$('head').append(styleElement);
		}
		styleElement.html(style);
	}
	this.flexBoxController = function($scope, $moduleInstance){
		"ngInject";
	}
	this._addPopup = function(data, template)
	{
		if(template == 'blank'){
			pageEdit_event.getChilrenIframe().insertPopup(data);
		}
		else{
			API.service('template/structure/').get(template.id).then(function(structure){
				if(structure.pageContent != undefined){
					pageEdit_event.getChilrenIframe().insertPopup(data, structure.pageContent);
				}
			});
		}
	}
	this.addPopup = function(data, template)
	{
		var use_template = pageEdit_widgets.checkModuleExists('popup_template');
		var that = this;
		
		if(!use_template){
			popup.open({
				name:'addpopup',
				controller: function($scope, $modalInstance){
					"ngInject";
					$scope.data = {type:'lightbox', name:'Lightbox'};
					$scope.ok = function()
					{
						$modalInstance.close($scope.data);
					}
				}
			}).result.then(function(data){
				that._addPopup(data, 'blank');
			});
			return;
		}
		popup_section_list.open({
			type:'popup',
			controller: function($scope, $modalInstance){
				"ngInject";
				
			}
		}).result.then(function(template){
			
			popup.open({
				name:'addpopup',
				controller: function($scope, $modalInstance){
					"ngInject";
					$scope.data = {type:'lightbox', name:'Lightbox'};
					$scope.ok = function()
					{
						$modalInstance.close($scope.data);
					}
				}
			}).result.then(function(data){
				that._addPopup(data, template);
			});
			
		});
		
		
	}
	
});