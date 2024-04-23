export default function(API,pageEdit_event,$rootScope, pageEdit_layout,pageEdit_iframe,pageEdit_modules,pageEdit_font)
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
		var pattern = /edit_(\w+)\/(\w+)/i;
		var pattern = /(\w+)\/([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})\/edit/i;
		var match = url.match(pattern);
		if(match != null){
			this.pageType = match[1];
			this.pageId = match[2];
		}
		

	}
	
	this.changeResolution = function(mode){
		this.resolution = mode;
		var bodyModule = this.getBodyModule();
		if(bodyModule)
			bodyModule.changeResolution(mode);
	}
	this.getCurrentResolution = function()
	{
		return this.resolution;
	}
	this.initModule = function()
	{
		var that = this;
		pageEdit_modules.modules = {};
		var body = jQuery_iframe('body')[0];
		if(this.pageType == 'template'){
			pageEdit_layout.createModule(body, 'page_template');
		}
		else
			pageEdit_layout.createModule(body, 'page');
		
	};
	this.getChilrenIframe = function()
	{
		return this.iframe.getWindow().pageEdit;
	}
	this.findSection = function(type)
	{
		var section_elements = jQuery_iframe('body > #main_sections').children("section." + pageEdit_layout.zone_class);
		var module;
		var that = this;
		section_elements.each(function () {
			
			var t;
			t = jQuery_iframe(this).attr('section-type');
			if (module == undefined && t == type) {

				var m  = that.getModule(this);
				if(m != undefined)
					module = m;
			}
		});
		return module;
	}
	this._getSectionList = function(container)
	{
		var section_elements = jQuery_iframe(container).children("section." + pageEdit_layout.zone_class);
		var list = [];
		var that = this;
		section_elements.each(function () {
			var m  = that.getModule(this);
			if(m != undefined)
				list.push(m);
		});
		return list;
		
	}
	this.getSectionList = function()
	{
		if(!window.jQuery_iframe)
			return;
		return {
			header: this._getSectionList('body > #header_sections'),
			main: this._getSectionList('body > #main_sections'),
			footer: this._getSectionList('body > #footer_sections')
		};
		
	}
	this.initDesign = function()
	{
		
	};
	this.init = function(iframe) {
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
			//that._init();
		});
		pageEdit_layout.bindEvent();
		this.initModule();
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
		
		//delete pageEdit_modules.modules;
		this.bindEvent();
		//this.initCSSPreprocessor();
		pageEdit_layout.bindEvent();
		pageEdit_font.init();
		pageEdit_snapManager.init();
		
		$rootScope.$emit('editorReady');
	};
	
	this.changeTheme = function( theme_name, success)
	{
		//return this.initCSSPreprocessor();
		
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
	this.getBodyModule = function()
	{
		return this.getModule(jQuery_iframe('body'));
	}
	this.importPageContent = function(content, structure) {
		var module = this.getBodyModule();
		return module.importPageContent(content, structure);
	}
	this.changePage = function( item, success)
	{
		var title = item.title || "";
		var description = item.description || "";
		var keywords = item.keywords || "";
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
		
		var module = this.getModule(el);
		if(module){
			var index = false;
			for(var i in pageEdit_modules.modules){
				if(pageEdit_modules.modules[i] == module){
					index = i;
				}
			}
			if(index !== false)
				delete pageEdit_modules.modules[index]
		}
		
	};
	this.getModule = function(el)
	{
		return this.getFloatModule(el);
	};
	this.getModuleByVid = function(el)
	{
		var module_id = jQuery_iframe(el).attr('vid');
		if(module_id != undefined)
			return pageEdit_modules.modules[module_id];
	};
	this.isWidgetObject = function(obj)
	{
		return obj && obj.getElement != undefined;
	}
	this.getFloatModule = function(el)
	{
		if(this.isWidgetObject(el))
			return el;
		if(jQuery_iframe(el)[0] != undefined){
			
			var widget_id = jQuery_iframe(el)[0].widget_id;
			return pageEdit_modules.modules[widget_id];
		}
		
	};
	this.getModuleById = function(module_id)
	{
		var element = jQuery_iframe('#' + module_id);
		return this.getModule(element);
	};
	this.getModuleByWidgetId = function(widget_id)
	{
		return pageEdit_modules.modules[widget_id];
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
		var bodyModule = this.getModule(jQuery_iframe('body'));
		var data = bodyModule.getData();
		return data;
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
		var module_elements = jQuery_iframe('.' + pageEdit_layout.float_module_class, container);
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