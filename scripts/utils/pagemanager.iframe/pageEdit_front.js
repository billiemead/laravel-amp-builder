var resolution = require('../resolution');
var widgetFunc = require('../widget');

var natv = require('../native');
var _ = require('../../libraries/lodash');
var front_req = require.context("../../modules/frontend", true, /^\.\/.*\.js$/);
const { parse, stringify } = require('../css-box-shadow')
require('../colorutils');
var Grapick = require('../colorpicker/gradient/grapick').default;
import { StyleSheet, InlineStyle } from './stylesheet'; 
global.Grapick = Grapick;
global.stringify = stringify;
var LazyLoad = require('../../../node_modules/vanilla-lazyload/dist/lazyload');

	
function init(t)
{
	var page_type = $('body').attr('page-type');
	if(!page_type)
		page_type = 'page';
	createModule($('body'), page_type);
	$(document).trigger('module_loaded');
}
function initModules(t){
	
	var section_elements = $('body > #main_sections').children("section.section");
	section_elements.each(function()
	{
		createModule(this);
	});
	var section_elements = $('body > #popup-container').children(".popup-section");
	section_elements.each(function()
	{
		createModule(this);
	});
}
global.modules = {};
function getModules(){
	return modules
}
function getModule(el){
	var widget_id = $(el)[0].widget_id;
	return modules[widget_id];
}
function getModuleById(module_id){
	
	return modules[module_id];
}
function getElementModuleType(element)
{
	var type;
	if((type = $(element).attr('data-type')) != undefined){
		$(element).removeAttr('data-type');	
		return type;
	}
	var redkeys = front_req.keys();
	for(var i in redkeys){
		var name  = redkeys[i];
		name = name.replace("./", "").replace(".js", "");
		if($(element).hasClass(name)){
			return name;
		}
	}
	return 'base';
}
function moduleDefinitionExist(type)
{
	var redkeys = front_req.keys();
	for(var i in redkeys){
		var name  = redkeys[i];
		name = name.replace("./", "").replace(".js", "");
		if(name == type){
			return true;
		}
	}
	return false;
}
function createModule(el, type, trigger)
{
	var instance = getModule(el);
	if(instance != undefined)
	{
		instance.loadElement(el);
		return instance;
	}
	if(!type)
	{
		type = getElementModuleType(el);
		
	}
		
	var that = this;
	var moduleDefinition = natv.g_loadModule(type, front_req);
	if(moduleDefinition != undefined)
	{
		var module = new moduleDefinition(type, el);
		if(!module || !module.loadElement)
			return;
		
		saveModule(el, module);
		trigger && $(document).trigger('block_frontend_inited', {block: el});
		return module;
	}
}
function saveModule(el, module){
	if($(el)[0].widget_id != undefined)
		delete modules[$(el)[0].widget_id];
	var timestamp = $.now();
	var id = timestamp;
	while( modules[id] != undefined)
		id = timestamp + Math.floor(Math.random()*101);
	$(el)[0].widget_id = id;
	modules[id] = module;
}
function getUniqueId(a)
{
	var timestamp = $.now();
	var id = a+ timestamp;
	while( $('#' + id).length > 0)
	{
		id = a + timestamp+Math.floor(Math.random()*101);
	}
	return id;
};
function insertModule(insert_point, type, dropInfo)
{
	if(!type)
		return null;;
	type = type.substring(0,1).toLowerCase() + type.substring(1);
	var m  = null;
	var insert_point = $(dropInfo.node);
	var pos = dropInfo.direction;
	var that = this;
	var prefix = getClass('module_class') + '-';
	var module_id = getUniqueId(prefix);
	dropInfo.element_identifier = module_id;
	var moduleDefinition = natv.g_loadModule(type, front_req);
	if(moduleDefinition != undefined)
	{
		var module = new moduleDefinition(type);
		if(!module)
			return;
		module.type = type;
		if(dropInfo.drag_drop)
			module.is_drag_drop = true;
		module.insertTo(dropInfo);
		
		return module;
		
	}
}
function createCloneModule(el,source_el)
{
	var instance = getModule(source_el);
	
	if(instance == undefined)
	{
		return false
	}
	var module_id = $(el).attr('id');
	var type = instance.getType();
	var moduleDefinition = natv.g_loadModule(type, front_req);
	if(moduleDefinition != undefined)
	{
		var module = new moduleDefinition(type);
		if(!module || !module.loadElement)
			return;
		module.is_clone_element = true;
		module.loadElement(el);
		module.setCloneData(instance.getCloneData());
		modules[module_id] = module;
		saveModule(module.getElement(), module);
		$(document).trigger('block_cloned', {block: el});
		
		return module;
	}
	
	
}
function insertSection(place_section, section)
{
	if(!section)
	{
		section = $('<section class="section"><div class="overlay"></div><div class="container"></div></section>');
		section.attr('data-type', 'section');
		var uniqueID = getUniqueId('section-');
		section.attr('id', uniqueID);
		//section.height(200);
	}
	
	
	if(place_section != undefined){
		place_section.after(section);
	}
	else{
		$('#main_sections').append(section);
	}
		
	var module = createModule(section, 'section');
	
	module.shouldChangePageId();
	$(document).trigger('zone_added', {block: section});
	return module;
}

function insertGlobalSection(place_section, section)
{
	if(!section)
	{
		section = $('<section class="section"><div class="overlay"></div><div class="container"></div></section>');
		section.attr('data-type', 'section_global');
		var uniqueID = getUniqueId('section-');
		section.attr('id', uniqueID);
		section.height(200);
	}
	else{
		section.attr('data-type', 'section_global');
	}
	
	if(place_section != undefined){
		place_section.after(section);
	}
	else{
		$('#main_sections').append(section);
	}
		
	var module = createModule(section, 'section_global');
	$(document).trigger('block_added', {block: section});
	return module;
}

function insertPopup(data, popup, place_section)
{
	if(!popup)
	{
		popup = $('<div class="popup-section"><div class="container"></div></div>');
		popup.attr('data-type', 'popup');
		var uniqueID = getUniqueId('popup-');
		popup.attr('id', uniqueID);
	}
	else if($.type( popup ) === "string"){
		popup = $(popup);
	}
	$('body > #popup-container').append(popup);
	if(place_section != undefined){
		place_section.after(popup);
	}
	
	if(popup.length > 1)
		popup = $(popup[0]);
	var module = createModule(popup, 'popup');
	if(module){
		module.setPopupType(data.type);
		module.setPopupName(data.name)
	}
	
	module.shouldChangePageId();
	$(document).trigger('block_added', {block: popup});
	return module;
}
function lazyLoad()
{
	new LazyLoad({
		elements_selector: "." + getClass('module_class') + ".svg",
		callback_enter: function(el) {
			var module = getModule(el);
			if(module)	module.lazyLoad();
		}
	});
}
function insertGroup(place_section)
{
	
}
function webFontLoad(fonts)
{
	var google_fonts = require('../../../storage/api-response.json');
	var google_font_to_loads = [];
	var custom_fonts = {families: [], urls:[]};
	for(var i in fonts)
	{
		if($.type(fonts[i]) == 'string' || fonts[i].type == 'google'){
			for(var j in google_fonts)
			{
				var font_name = fonts[i].name || fonts[i];
				var font_to_load = font_name;
				if(google_fonts[j].family == font_name){
					
					var variants = google_fonts[j].variants;
					var subsets =  google_fonts[j].subsets;
					if(variants != undefined){
						font_to_load += ':' + variants.join(',') + '|';
					}
					if(subsets != undefined){
						font_to_load += '' + subsets.join(',');
					}
					google_font_to_loads.push(font_to_load);
					break;
				}
			}
		}
		else if(fonts[i].type == 'url'){
			if(custom_fonts.families.indexOf(fonts[i].name) < 0){
				custom_fonts.families.push(fonts[i].name);
			}
			if(custom_fonts.urls.indexOf(fonts[i].url) < 0){
				custom_fonts.urls.push(fonts[i].url);
			}
		}
	}
	try{
		WebFont.load({
			google: {
				families: google_font_to_loads
			},
			custom: custom_fonts
		});
	}
	catch(e)
	{}
}
function svgToCanvas($container)
{
	var svgElements= $container.find('svg');

	svgElements.each(function () {
		var canvas, xml;

		canvas = document.createElement("canvas");
		xml = (new XMLSerializer()).serializeToString(this);

		xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');

		canvg(canvas, xml);
		$(canvas).insertAfter(this);
		$(canvas).addClass('screenShotTempCanvas');
		$(canvas).css({width:'100%', height:'100%'})
		$(this).hide();
		$(this).addClass('tempHide');
	});
}
function captureScreenshot(element)
{
	$('.ui-resizable-handle').hide();
	$('body').addClass('screenshot-mode');
	var defered = jQuery.Deferred();
	var $container = $(element);
	svgToCanvas($container);
	html2canvas($(element)[0]).then(canvas => {
		$('body').removeClass('screenshot-mode');
		$('canvas.screenShotTempCanvas', element).remove();
		$('svg.tempHide', element).removeClass('tempHide').show();
		$('.ui-resizable-handle').show();
		defered.resolve( canvas);
	}, ()=> {
		$('body').removeClass('screenshot-mode');
		$('canvas.screenShotTempCanvas', element).remove();
		$('svg.tempHide', element).removeClass('tempHide').show();
		defered.reject(1)
		});
	return defered.promise();
}
function loadScript(src, callback, callBackPointer)
{
	var s,
	  r,
	  t;
	r = false;
	s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = src;
	s.async  = true;
	s.defer  = true;
	var that = this;
	s.onload = s.onreadystatechange = function() {
	
	if ( !r && (!this.readyState || this.readyState == 'complete') )
	{
		r = true;
		if(callBackPointer)
			callback.call(callBackPointer);
		else{
			callback.call(that);
		}
			
	}
	};
	t = document.getElementsByTagName('script')[0];
	t.parentNode.insertBefore(s, t);
}
function getClass(type)
{
	return widgetFunc.getClass(type);
}
global.pageEdit = module.exports = $.extend({
	initModules: initModules,
	createModule: createModule,
	getModule: getModule,
	getModules:getModules,
	getClass:getClass,
	getModuleById: getModuleById,
	init: init,
	StyleSheet: StyleSheet,
	getUniqueId: getUniqueId,
	insertModule: insertModule,
	insertPopup: insertPopup,
	insertSection: insertSection,
	createCloneModule: createCloneModule,
	webFontLoad: webFontLoad,
	captureScreenshot: captureScreenshot,
	insertGroup: insertGroup,
	loadScript:loadScript,
	saveModule:saveModule,
	moduleDefinitionExist:moduleDefinitionExist
	
}, resolution)