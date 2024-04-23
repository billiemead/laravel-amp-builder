export default function(API,pageEdit_event,$rootScope, pageEdit_layout,pageEdit_iframe,pageEdit_modules, pageEdit_less,pageEdit_sass,pageEdit_font, pageEdit_snapManager)
{
	"ngInject";
	this.mode = "content";
	this.resolution = "desktop";
	this.setMode = function(mode)
	{
		this.mode = mode;
	}
	this.getPageType = function()
	{
		var url = window.location.href;
		var pattern = /edit_(\w+)\/(\d+)/i;
		var match = url.match(pattern);
		if(match != null){
			this.pageType = match[1];
			this.pageId = match[2];
		}

	}
	this.getTemplateType = function()
	{
		var type = window.siteInfo.structure.type;
		return type;
	}
	this.checkEmptyPage = function()
	{
		var type = this.getTemplateType();
		jQuery_iframe('html').attr('edit-type', type);
		if(type == 'page' || type =='section'){
			var container = jQuery_iframe('body > #main_sections');
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
			
			var container = jQuery_iframe('body > #popup-container');
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
	this.changeResolution = function(mode){
		this.resolution = mode;
		jQuery_iframe('html').attr('mode', mode);
		if(pageEdit_modules.modules){
			for(var i in pageEdit_modules.modules){
				pageEdit_modules.modules[i].changeResolution(mode);
			}
		}
	}
	this.initModule = function()
	{
		
		var that = this;
		pageEdit_modules.modules = {};
		
		var section_elements = jQuery_iframe('body > #main_sections').children("section." + pageEdit_layout.zone_class);
		section_elements.each(function()
		{
			pageEdit_layout.createZone(this);
		});
		var section_elements = jQuery_iframe('body > #popup-container').children("." + pageEdit_layout.popup_class);
		section_elements.each(function()
		{
			pageEdit_layout.createModule(this);
		});
		//empty page
		this.checkEmptyPage();
	};
	this.getChilrenIframe = function()
	{
		return this.iframe.getWindow().pageEdit;
	}
	
	this.init= function(iframe) {
		this.modules = {};
		this.edited_modules = {};
		pageEdit_event.iframe = this.iframe = new pageEdit_iframe(iframe);
		this.page_id = iframe.page_id;
		this.page_name = iframe.page_name;
		
		this.page_file_name = iframe.page_file_name;
		this.script_url = iframe.script_url;
		this.getPageType();
		var that = this;
		jQuery_iframe(this.iframe.getDocument()).on('pageImported', function()
		{
			that._init();
		});
	};
	
	this._init = function(iframe)
	{
		
		if(iframe != undefined)
		{
			pageEdit_event.iframe = this.iframe = new pageEdit_iframe(iframe);
			this.page_id = iframe.page_id;
			this.page_name = iframe.page_name;
			
			this.page_file_name = iframe.page_file_name;
			this.script_url = iframe.script_url;
		}
		
		delete pageEdit_modules.modules;
		this.bindEvent();
		this.initCSSPreprocessor();
		pageEdit_layout.bindEvent();
		pageEdit_font.init();
		pageEdit_snapManager.init();
		this.initModule();
		$rootScope.$emit('editorReady');
	};
	this.initCSSPreprocessor = function()
	{
		var preprocessor = window.siteInfo.preprocessor || 'sass';
		if(preprocessor == 'less'){
			this.preprocessor = pageEdit_less;
		}
		if(preprocessor == 'sass' || preprocessor == 'scss'){
			this.preprocessor = pageEdit_sass;
		}
		if(this.preprocessor){
			$rootScope.$emit('cssPreprocessorReady');
			return this.preprocessor.init();
		}
		return 	pageEdit_less.initLess();
	}
	this.changeTheme = function( theme_name, success)
	{
		return this.initCSSPreprocessor();
		
	};
	this.bindEvent = function()
	{
//		jQuery_iframe('a').off();
		jQuery_iframe('body').on('click', 'a', function(event)
		{
			event.preventDefault();
		});
		
		
	};
	this.getDocument = function()
	{
		return this.iframe.getDocument();
	};
	this.getWindow = function()
	{
		return this.iframe.getWindow();
	};
	this.getStyleSheets = function()
	{
		return this.getDocument().styleSheets;
	};
	this.importPageContent = function(content, structure) {
		
		
		var html = "";
		var bodyClass = "";
		var bodyStyle = "";
		$('#iframe_loadingSpinner').show();
		var html = '';
		if(content != undefined){
			jQuery_iframe(this.iframe.getDocument()).trigger('clear_prepared');
			html = content;
			jQuery_iframe('body').html("");
			if(structure != undefined){
				bodyClass = structure.bodyClass || "";
				bodyStyle = structure.bodyStyle || "";
			}
			
		}
		
		jQuery_iframe(this.iframe.getDocument()).trigger('clear_prepared');
		jQuery_iframe('body').html('');
		
		var type = this.getTemplateType();
		var holder;
		if(type == 'page' || type =='section'){
			var container = jQuery_iframe('body > #main_sections');
			if(container.length == 0)
			{
				container = jQuery_iframe('<div id="main_sections" class="section-container"></div>');
				jQuery_iframe('body').append(container);
			}
			holder = container;
			
		}
		if(type == 'popup'){
			jQuery_iframe('html').attr('edit-type', 'popup');
			var container = jQuery_iframe('body > #popup-container');
			if(container.length == 0)
			{
				container = jQuery_iframe('<div id="popup-container" class="section-container"></div>');
				jQuery_iframe('body').append(container);
			}
			holder = container;
		}
		if(holder)
		holder.append(html);
		if(structure['lessInlineStyle'] != undefined){
			jQuery_iframe('body').attr('less-inline-style', structure['lessInlineStyle']);
		}
		
		jQuery_iframe(this.iframe.getDocument()).trigger('domupdated');
		jQuery_iframe(this.iframe.getDocument()).trigger('pageImported');
		//this._init();
		$('#iframe_loadingSpinner').hide();
	}
	this.changePage = function( item, success)
	{
		var title = item.title || "";
		var description = item.description || "";
		var keywords = item.keywords || "";
		jQuery_iframe("head title").html(title);
		jQuery_iframe("head title").html(title);
		jQuery_iframe("head meta[name=\"description\"").attr("content", description);
		jQuery_iframe("head meta[name=\"keywords\"").attr("content", keywords);
		var pageContent = item.content;
		if(pageContent != undefined){
			return this.importPageContent(pageContent, item.structure);
		}
		
	};
	this.getParameterByName = function(name) 
	{
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	};
	
	this.deleteModule = function(el)
	{
		var module_id = jQuery_iframe(el).attr('vid');
		delete pageEdit_modules.modules[module_id];
		pageEdit_modules.deleted_modules.push(module_id);
	};
	this.getModule = function(el)
	{
		var module = this.getModuleByVid(el);
		if(module != undefined)
			return module;
		return this.getFloatModule(el);
	};
	this.getModuleByVid = function(el)
	{
		var module_id = jQuery_iframe(el).attr('vid');
		if(module_id != undefined)
			return pageEdit_modules.modules[module_id];
	};
	this.getFloatModule = function(el)
	{
		var module_id = jQuery_iframe(el).attr('id');
		return this.getModuleById(module_id);
	};
	this.getModuleById = function(module_id)
	{
		return pageEdit_modules.modules[module_id];
	};
	this.archiveEditedModule = function(m)
	{
		var id = jQuery_iframe(m.getElement()).attr('id');
		this.edited_modules = this.edited_modules || {};
		this.edited_modules[id] = m;
	};
	this.compareModule = function(m1, m2)
	{
		if(!m1 || !m2)
			return false;
		var id1 = m1.getElement().attr('id');
		var id2 = m2.getElement().attr('id');
		return id1 == id2;
	};
	this.get_page_name = function()
	{
		var p = this.page_name;
		return p;
	};
	this.get_page_id = function()
	{
		var p = this.page_id;
		return p;
	};
	this.get_page_file_name = function()
	{
		var p = this.page_file_name;
		return p;
	};
	this.get_script_url = function()
	{
		var p = this.script_url;
		return p;
	};
	this.generateModuleId = function()
	{
		var h = '';
		h = this.get_page_file_name();
		var p =  h +'-module';
		return this.getUniqueId(p);
	};
	this.getUniqueId = function(a)
	{
		var timestamp = $.now()
		var id = a+ timestamp;//Math.floor(Math.random()*101);
		while( jQuery_iframe('#' + id).length > 0)
		{
			id = a + timestamp+Math.floor(Math.random()*101);
		}
		return id;
	};
	
	
	
	
	this.getModuleStructure= function(module)
	{
		var s = {};
		var moduleInstance = this.getModule(module);
		if(!moduleInstance)
		{
			return s;
		}
		return moduleInstance.getStructure();
	};
	
	this.getPageScreenshot= function()
	{
		var s = {};
		s.structure = {};
		s.structure.sections = [];
		var that = this;
		var  html2canvas = pageEdit_event.iframe.getWindow().html2canvas;
		//return;
		jQuery_iframe('body').children('section'+'.'+pageEdit_layout.zone_class).each(function(i)
		{
			html2canvas(this, {
				allowTaint: true,
				taintTest: false,
				logging: true,
				onrendered: function(canvas) {
					jQuery_iframe('body').append(canvas);
				}
			});
			
			
		});
		return s;
	};
	this.getSectionStructure= function(module, plainHtml)
	{
		var s = {};
		var moduleInstance = this.getModule(module);
		if(!moduleInstance)
		{
			return;
		}
		
		return moduleInstance.getStructure(plainHtml);
	};
	this.getPopupStructure= function(module, plainHtml)
	{
		var s = {};
		var moduleInstance = this.getModule(module) || this.getFloatModule(module);
		if(!moduleInstance)
		{
			return;
		}
		
		return moduleInstance.getStructure(plainHtml);
	};
	this.getPageStructure = function(plainHtml)
	{
		var s = {};
		s.sections = [];
		
		var that = this;
		s.header = [];
		jQuery_iframe('body > #header_sections').children('section'+'.'+pageEdit_layout.zone_class).each(function(i)
		{
			var part = that.getSectionStructure(this, plainHtml);
			if(part != undefined)
			s.header.push(part);
			
		});
		s.footer = [];
		jQuery_iframe('body > #footer_sections').children('section'+'.'+pageEdit_layout.zone_class).each(function(i)
		{
			var part = that.getSectionStructure(this, plainHtml);
			if(part != undefined)
			s.footer.push(part);
			
		});
		jQuery_iframe('body > #main_sections').children('section'+'.'+pageEdit_layout.zone_class).each(function(i)
		{
			var part = that.getSectionStructure(this, plainHtml);
			if(part != undefined)
			s.sections.push(part);
			
		});
		s.popups = [];
		jQuery_iframe('body > #popup-container').children('.' + pageEdit_layout.popup_class).each(function(i)
		{
			var part = that.getPopupStructure(this, plainHtml);
			if(part != undefined)
			s.popups.push(part);
			
		});
		if(jQuery_iframe('body').attr('data-video-bg')) {
			s.bodyVideo = jQuery_iframe('body').attr('data-video-bg');
		}
		if(jQuery_iframe('body').attr('less-inline-style')) {
			s.lessInlineStyle = jQuery_iframe('body').attr('less-inline-style');
		}
		s.bodyClass = jQuery_iframe('body').attr('class');
		s.bodyStyle = jQuery_iframe('body').attr('style');
		return s;
	};
	this.getHiddenLayers = function(container)
	{
		container = jQuery_iframe(container);
		var module_elements = jQuery_iframe('.'+pageEdit_layout.float_module_class, container);
		var rs = [];
		var that = this;
		module_elements.each(function(i)
		{
			var module = that.getModule(this);
			if(module != undefined){
				var visible = module.getVisibility();
				if(visible == false){
					rs.push(module);
				}
			}
		});
		return rs;
	}
}