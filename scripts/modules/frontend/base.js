var widgetFunc = require('../../utils/widget');

var Mustache = require('mustache');
var _ = require('../../libraries/lodash');
var resolutionFunc = require('../../utils/resolution')


var templates = require.context('./templates', true, /^\.\/.*\.tmpl$/);
var classes = {};
const Layout = {
  NODISPLAY: 'nodisplay',
  FIXED: 'fixed',
  FIXED_HEIGHT: 'fixed-height',
  RESPONSIVE: 'responsive',
  CONTAINER: 'container',
  FILL: 'fill',
  FLEX_ITEM: 'flex-item',
  FLUID: 'fluid',
  INTRINSIC: 'intrinsic',
};


class base{
	constructor(type, element)
	{
		this.property = {}
		this.styles = {};
		this.offset = this.offset || {};
		this.visibles = {};
	
		this.type = type;
		this.edit_mode = (window.edit_mode == 1);
		var info = widgetFunc.getWidgetInfomation(type);
		if(info != undefined){
			this.setProperty(info);
		}
		if(element != undefined)
			this.loadElement(element);
	}
	getType()
	{
		return this.type;
	}
	calculateDefaultSize()
	{
		var parentModule = this.getParentModule();
		var parent;
		var padding = {};
		if(parentModule){
			parent = parentModule.getElement();
			if(parentModule.getContainer)
				parent = parentModule.getContainer();
		}
		else
			parent = this.getElement().parent();
		var parentWidth, parentHeight;
		if(parent.length){
			parentWidth = parent.outerWidth();
			parentHeight = parent.outerHeight();
			parentWidth -= (padding.left || 0) - (padding.right || 0);
			parentHeight -= (padding.top || 0) - (padding.bottom || 0);
		}
		this.offset = this.offset || {};
		var breakpoint = pageEdit.getDefaultBreakpoint();
		var default_offset = {};
		if(this.property.width != undefined){
			
			if(this.property.width == '100%'){
				default_offset.width = parentWidth;
			}
			else if(this.property.width != 'auto'){
				default_offset.width = this.property.width;
			}
			else{
				default_offset.width = this.property.width;
			}
			if(typeof default_offset.width == 'string'){
				default_offset.width = parseFloat(default_offset.width);
			}
		}
		if(this.property.height != undefined){
			if(this.property.height != 'auto'){
				default_offset.height = this.property.height;
			}
			else{
				default_offset.height = this.property.height;
			}
			if(typeof default_offset.height == 'string'){
				default_offset.height = parseFloat(default_offset.height);
			}
		}
		this.offset = $.extend(this.offset, default_offset);
	}
	setDefaultSize()
	{
		this.calculateDefaultSize();
		var default_offset = this.offset;
		this.setSize(default_offset.width, default_offset.height);
	}
	getPaddingValue()
	{
		var border = pageEdit.StyleSheet.getBorderValue(this.element);
		var padding = pageEdit.StyleSheet.getMarginValue(this.element, 'padding');
		var values = ['top', 'left', 'bottom', 'right'];
		var rs = {};
		for(var i in values){
			rs[values[i]] = border[values[i]].value + padding[values[i]];
		}
		return rs;
	}
	setSize(width, height)
	{
		this.setOffset({width:width, height:height});
	}
	setPosition(top, left)
	{
	}
	getVisibility(mode)
	{
		return true;
	}
	getDefaultDisplayValue()
	{
		if(this.getElement().is(':hidden')){
			var clone = this.getElement().clone();
			this.getElement().after(clone);
			clone.removeAttr('id');
			var value = clone.css('display');
			clone.remove();
			return value;
		}
		
	}
	setVisibility(visibility, trigger)
	{
		var css_value = visibility ? undefined : 'none';
		if(!resolutionFunc.isDefaultBreakpoint()){
			css_value = visibility ? this.getDefaultDisplayValue() : 'none';
		}
		
		this.setStyle('display', css_value);
		trigger && this.getElement().trigger('widget_visibility_changed');
	}
	getOffset(mode)
	{
		return this.offset;
	}
	getStyleOverride(mode, selector)
	{
		var element = this.__getSelector(selector);
		var styles = pageEdit.StyleSheet.getStyleOverride(element, mode);
		return styles;
	}
	getStyles()
	{
		var element = '#' + this.getElement().attr('id');
		var styles = pageEdit.StyleSheet.getStyle(element);
		return styles;
	}
	getItemStyles(selector)
	{
		var element = this.__getSelector(selector);
		var styles = pageEdit.StyleSheet.getStyle(element);
		return styles;
	}
	setOffsets(offset)
	{
		this.offset = $.extend({}, this.offset, offset);
		for(var i in offset)
		{
			this.setStyle(i, offset[i]);
		}
	}
	_setOffset(offset)
	{
		this.offset = $.extend({}, this.offset, offset);
		for(var i in offset){
			if(offset[i] != undefined){
				if(!isNaN(offset[i]) && this.getElement()[0]){
					this.getElement()[0].style[i] = "";
					this.setStyle(i, offset[i] + 'px');
				}
			}
			else if(this.getElement()[0]){
				this.getElement()[0].style[i] = "";
			}
		}
	}
	setOffset(offset)
	{
		this._setOffset(offset);
	}
	setProperty(property){
		this.property = property;
		this.data = this.data || {}
		if(this.property.properties){
			
			for(var i in this.property.properties){
				this.data[i] = this.property.properties[i].default ||  this.property.properties[i];
			}
		}
		if(this.property.amp_layout){
			
			this.amp_layout = $.extend({}, this.property.amp_layout);
		}
		if(this.property.children){
			
			this.items = this.property.children;
		}
	}
	
	getElement()
	{
		return $(this.element);
	}
	getPage_id()
	{
		return this.page_id || $(this.getElement() ).attr('id');
	}
	getSystem_id()
	{
		return this.system_id || 0;
	}
	getData()
	{
		return this.data;
	}
	getSyncModules()
	{
		var rs = [];
		if(!this.isGlobalModule())
			return [];
		$('[id="' + this.getPage_id() + '"]').not(this.element).each(function(){
			var module = pageEdit.getModule(this);
			if(module != undefined && module.isGlobalModule())
				rs.push(module);
		});
		return rs;
	}
	isGlobalModule()
	{
		var parentModules = this.getParentModules();
		for(var i in parentModules){
			var type = parentModules[i].getType();
			if(this.endsWith(type, '_global') && parentModules[i].findGlobalBlocks != undefined)
				return true;
		}
		return false;
	}
	endsWith(string, search) {
		var this_len = string.length;
		return string.substring(this_len - search.length, this_len) === search;
	}
	syncWithGlobalModule(action, params)
	{
		var modules = this.getSyncModules();
		
		for(var i in modules)
		{
			var p = params;
			if(typeof params == 'function'){
				p = params();
			}
			p.push({sync: true});
			modules[i][action].apply(modules[i], p);
		}
	}
	isSyncAction(args)
	{
		if(args && args.length){
			var last = args[args.length - 1];
			return last && last.sync;
			
		}
	}
	setData(data, updateView)
	{
		this.data = data;
		if(updateView)
			this.updateView();
		if(!this.isSyncAction(arguments))
			this.syncWithGlobalModule('setData', [data, updateView, false]);
	}
	setDataByKey(name, data, updateView)
	{
		this.data[name] = data;
		if(updateView)
			this.updateView();
		if(!this.isSyncAction(arguments))
			this.syncWithGlobalModule('setDataByKey', [name, data, updateView, false]);
	}
	getDataByKey(name)
	{
		return this.data[name];
	}
	getStyles()
	{
		return this.styles;
	}
	__getDataElement()
	{
		return this.getElement().next('script[type="text/json"]#' + this.page_id + '_data');
	}
	_getDataFromElement(remove = true)
	{
		var dataDiv = this.__getDataElement();
		if(!dataDiv.length)
			return {};
		var dataString = dataDiv.html();
		var data = {}
		try
		{
			data = $.parseJSON(unescape(dataString));
			data = $.extend({},true,data);
		}
		catch(e)
		{
		}
		if(remove)
			dataDiv.remove();
		return data;
	}
	_isAMPElement(element)
	{
		if(!element || !element.length) return false;
		var e = (element[0] ? element[0] : e);
		if(e.tagName.indexOf("-") !== -1) {
			return true;
		}
		if(!e.getLayout)
			return false;
		let isAttribute = e.getAttribute("is");
		if(isAttribute === null) {
			return false;
		}
		return isAttribute.indexOf("-") !== -1;
	}
	isAMPElement()
	{
		var element = this.getAMPElement();
		return this._isAMPElement(element);
	}
	getAMPElement()
	{
		
	}
	extractAMPLayoutFromElement(element)
	{
		if(element.getLayout == undefined)
			return;
		var rs = {
			layout:element.getLayout(),
		};
		if(rs.layout == Layout.RESPONSIVE || Layout.INTRINSIC){
			rs.width = element.getAttribute('width');
			rs.height = element.getAttribute('height');
		}
		if(rs.layout == Layout.FIXED_HEIGHT)
			rs.height == $(element).height();
		if(rs.layout == Layout.FIXED){
			rs.width == $(element).width();
			rs.height == $(element).height();
		}
		return rs;
	}
	getAMPLayout()
	{
		var rs = this.amp_layout || {};
		if(this.isAMPElement() &&  this.amp_layout == undefined){
			var element = this.getAMPElement();
			element = element[0];
			rs = $.extend({}, rs, this.extractAMPLayoutFromElement(element));

		}
		if((rs.layout == Layout.RESPONSIVE ||
			rs.layout == Layout.INTRINSIC) && !rs.ratio){
			rs.ratio = (rs.height * 1 / (rs.width || 1 * 1)) * 100;
			rs.ratio = rs.ratio.toFixed(2);

		}
		return rs;
	}
	getRealAMPLayout()
	{
		var rs = {};
		if(this.isAMPElement()){
			var element = this.getAMPElement();
			element = element[0];
			rs = this.extractAMPLayoutFromElement(element);
		}
		return rs;
	}
	changeAMPLayout(data)
	{
		var element = this.getAMPElement();
		if(!element || !element.length)
			return;
		
		element = element[0];
		var layout = data.layout;
		var currentLayout = this.getRealAMPLayout().layout;
		if (
			layout == Layout.RESPONSIVE ||
			layout == Layout.INTRINSIC
		){
			  if(!data.ratio)	return;
			  data.width = this.getElement().width();
			  data.height = data.width * data.ratio / 100;
		}
		if (
			layout == Layout.FIXED ||
			layout == Layout.FIXED_HEIGHT
		){
			  if(!data.height)	return;
		}
		if (layout == Layout.FIXED_HEIGHT) delete data.width;
		if (
			layout == Layout.FIXED 
		){
			if(!data.width)	return;
		}
		this.amp_layout = data;
		if(layout != currentLayout){
			this.updateView();
			return;
		}
		//console.log(data, layout, element, element.implementation_)
		if (layout == Layout.FIXED) {
			//element.changeSize(data.height, data.width);
			$(element).attr('width', data.width)
			$(element).css('width', data.width);
			$(element).attr('height', data.height)
			$(element).css('height', data.height);
		} else if (layout == Layout.FIXED_HEIGHT) {
			$(element).attr('height', data.height)
			$(element).css('height', data.height);
			
			//element.changeSize(data.height);
		} else if (layout == Layout.RESPONSIVE) {
			var sizer = element.sizerElement;
			sizer && (sizer.style['padding-top'] = data.ratio + '%');
		}
		this.getElement().trigger('resize');	
	
	}
	removeEmptyTextNode()
	{
		var next = this.getElement()[0].nextSibling;
		if(next && next.nodeType == 3){
			next.remove();
		}
	}
	loadElement(element){
		
		this.element = element;
		if(element.length > 1)
			this.element = element[0];
		this.page_id = this.page_id || $(this.element).attr('id');
		
		if(this.is_clone_element)
		{
			this.contextMenuCreated = false;
		}
		if(this.is_new_element)
		{
			this.setDefaultSize();
			if(!this.is_clone_element)
				this.module_data = this.initializeData;
			
		}
		else if(!this.is_clone_element)
		{
			var data = this._getDataFromElement();
			if(data.data)
				this.data = data.data;
			if(data.offset && this.edit_mode){
				this.setOffsets(data.offset);
			}
			else if(data.offset){
				this.loadOffsets(data.offset);
			}
			if(data.classAttribute && this.edit_mode){
				this.setClass(data.classAttribute);
			}
			this.initStyles(data);
			if(data.amp_layout && this.edit_mode){
				this.amp_layout = data.amp_layout;
			}
			this.module_data = this.module_data || data;
		}
		$(element).removeAttr('rel');
		var that = this;
		this.bindEvent();
		if(this.edit_mode)
			this.removeEmptyTextNode();
		this.is_new_element = false;
		
	}
	initStyles(module_data)
	{
		if(module_data.styles && this.edit_mode){
			this.setStyles(module_data.styles);
		}
		if(module_data.override_style && this.edit_mode){
			this.setOverride_styles(module_data.override_style)
		}
		if(module_data.item_styles && this.edit_mode){
			
			if(this.items){
				for(var i in this.items){
					var style = module_data.item_styles[i];
					if(!style)	continue;
					style.main != undefined && (this.setStyles(style.main, this.items[i]));
					style.override != undefined && this.setOverride_styles(style.override, this.items[i]);
				}
			}
		}
	}
	setCloneData(module_data)
	{
		this.module_data = $.extend(true, {}, module_data);
		if(this.edit_mode && module_data.offset){
			this.setOffsets(module_data.offset);
		}
		if(module_data.data)
			this.data = $.extend(true, {}, module_data.data);
		if(module_data.classAttribute){
			this.setClass(module_data.classAttribute);
		}
		this.initStyles(module_data);
		
	}
	getCloneData()
	{
		var data = this.getData();
		var offset = this.getOffset('all');
		var styles = this.getStyles();
		var item_styles = this.getItemsStyles();
		var override_style = this.getStyleOverride();
		var classAttribute = this.getClassAttribute();
		//console.log('getCloneData', classAttribute);
		return {data:data, offset:offset, styles:styles, item_styles: item_styles, override_style: override_style, classAttribute:classAttribute};
	}
	getItemsStyles()
	{
		var items = this.items;
		if(!items)	return;
		var rs = {};
		for(var i in items){
			rs[i]  = {};
			rs[i].main = this.getItemStyles(items[i]);
			rs[i].override = this.getStyleOverride(undefined, items[i]);
		}
		return rs;
	}
	loadOffsets(offset)
	{
		this.offset = $.extend({}, this.offset, offset);
	}
	resetOffsets(top = 0, left = 0){
		
	}
	
	getIsDeleted()
	{
		return this.is_deleted;
	}
	setIsDeleted(value)
	{
		return this.is_deleted = value;
	}
	changeResolution(newResolution)
	{
	}
	
	getCurrentResolution()
	{
		return $('html').attr('mode');
	}
	getCurrentVisibility(css)
	{
		if(css){
			return this.getElement().css('display') == 'none' ? true : false;
		}
		return this.getElement().is(':hidden') ? false : true;
	}
	setStyles(styles, selector)
	{
		for(var i in styles){
			this.setStyle(i, styles[i], selector);
		}
	}
	setStyle(name, value, selector)
	{
		var element = this.__getSelector(selector);
		pageEdit.StyleSheet.setStyle(element, name, value);
	}
	getStyles()
	{
		var element = this.__getSelector();
		var styles = pageEdit.StyleSheet.getStyle(element);
		return styles;
	}
	getCurrentStyles()
	{
		var element = this.__getSelector();
		var styles = pageEdit.StyleSheet.getCurrentStyle(element);
		return styles;
	}
	makeSafeForCSS(name) {
		return name.replace(/[^a-z0-9]/g, function(s) {
			var c = s.charCodeAt(0);
			if (c == 32) return '-';
			if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
			return '__' + ('000' + c.toString(16)).slice(-4);
		});
	}
	getClassAttribute()
	{
		return this.classAttribute;
	}
	removeOldClass(classAttribute)
	{
		var list = classes[this.type];
		if(list != undefined){
			for(var i in list){
				this.getElement().removeClass('c_' + list[i].class);
			}
		}
	}
	getClassByName(name)
	{
		var list = classes[this.type];
		if(list != undefined){
			for(var i in list){
				if(list[i].name == name)
					return list[i];
			}
		}
	}
	getAllClasses()
	{
		return classes[this.type];
	}
	createClass(name)
	{
		var new_class = this.makeSafeForCSS(name);
		classes[this.type] = classes[this.type] || {};
		var unique_class = new_class;
		var i = 0;
		while(classes[this.type][unique_class] != undefined){
			unique_class = new_class + '-' + i;
			i++;
		}
		var rs = {
			name:name,
			class: unique_class
		}
		classes[this.type][unique_class] = rs;
		return rs;
	}
	saveClass(cl)
	{
		classes[this.type] = classes[this.type] || {};
		classes[this.type][cl.class] == undefined && (classes[this.type][cl.class] = cl);
		return classes[this.type][cl.class];
	}
	setClass(name)
	{
		var old_selector = this.__getSelector();
		 
		if(this.classAttribute){
			this.removeOldClass(this.classAttribute)
		}
			
		if(name != undefined){
			var new_class = name;
			if(typeof name == "string"){
				new_class = this.getClassByName(name);
				if(!new_class)
					new_class = this.createClass(name);
			}
			else{
				new_class = this.saveClass(name);
			}
				
			this.getElement().addClass('c_' + new_class.class);
			this.classAttribute = new_class;
		}
		else
			delete this.classAttribute;
		var new_selector = this.__getSelector();
		if(!pageEdit.StyleSheet.checkStyleExist(new_selector) || new_selector[0] == '#'){
			pageEdit.StyleSheet.copyInlineStyleElement(old_selector, new_selector);
		
	//	else
			//pageEdit.StyleSheet.copyInlineStyleElement(old_selector, new_selector);
		}
		if(old_selector[0] == '#')
			pageEdit.StyleSheet.removeAllStyles(old_selector);
			
	}
	__getSelector(selector)
	{
		var element = '#' + this.getElement().attr('id');
		if(this.classAttribute){
			element = '.module.' + this.getType() + '.c_' + this.classAttribute.class;
		}
		if(selector != undefined){
			var separator = ' ';
			var end = '';
			if(selector[0] == ':'){
				separator = '[state="';
				end = '"]';
			}
				
			element = element + separator + selector + end;
		}
		return element;
	}
	getCurrentItemStyles(selector)
	{
		var element = this.__getSelector(selector);
		var styles = pageEdit.StyleSheet.getCurrentStyle(element);
		return styles;
	}
	setOverride_styles(styles, selector)
	{
		var element = this.__getSelector(selector);
		var inlineStyle = pageEdit.StyleSheet.getInlineStyle(element);
		if(inlineStyle != undefined){
			inlineStyle.importStyleOverride(styles)
		}
	}

	applyStyleOverride(styles, selector)
	{
		var element = this.__getSelector(selector);
		for(var i in styles){
			pageEdit.StyleSheet.applyStyleOverride(element, i, styles[i]);
		}
	}
	setStyleOverride(name, value, opacity, selector)
	{
		var element = this.__getSelector(selector);
		pageEdit.StyleSheet.setStyleOverride(element, name, value, opacity);
	}
	bindEvent()
	{
	}
	fireEvent(name, params)
	{
		this.getElement().trigger(name, params);
	}
	addEventListener(name, func){
		this.getElement().on(name, func);
	}
	removeEventListener(name,){
		this.getElement().off(name);
	}
	_loadAnimation()
	{
		
	}
	createElementWrapper(dropInfo)
	{
		var wrapper = $('<div/>');
		if(this.property.wrapper)
			wrapper = $(this.property.wrapper);
		var id = dropInfo.element_identifier;
		this.is_new_element = true;
		wrapper.attr('id', id);
		var float_module_class = widgetFunc.getClass('float_module_class');
		wrapper.addClass(float_module_class);
		wrapper.addClass(this.type);
		return wrapper;
	}
	createElement(dropInfo)
	{
		var wrapper = this.createElementWrapper(dropInfo);
		var defered = $.Deferred();
		var that = this;
		return this.getModuleTemplate().then(function(template)
		{
			var compiledTemplate = that.compileTemplate(template);
			wrapper.append(compiledTemplate.html());
			defered.resolve(wrapper);
			return wrapper;
		});
		return defered.promise();
	}
	isInsertedByDragDrop()
	{
		return this.is_drag_drop;
	}
	insertModule(module, dropInfo)
	{
		var direction = dropInfo.direction;
		var inner = dropInfo.inner;
		if(inner && (this.getContainer == undefined || !this.getContainer())){
			dropInfo.inner = false;
		}
		if(direction == 'top' || direction == 'left'){
			this.insertBefore(module.element, dropInfo);
		}
		if(direction == 'bottom' || direction == 'right'){
			this.insertAfter(module.element, dropInfo);
		}
		if(module.element.length){
			module.loadElement(module.element);
			
			pageEdit.saveModule(module.element, module);
			$(document).trigger('block_added', {block: module.getElement(), insert:this, dropInfo: dropInfo});
			if(module.insertCompleted)
				module.insertCompleted();
		}
		if(!this.isSyncAction(arguments)){
			var callback = function(module, dropInfo)
			{
				var instance = module.clone(false);
				if(instance == undefined)
					return;
				instance.insertCompleted = false;
				return [instance, dropInfo];
			}
			this.syncWithGlobalModule('insertModule', callback.bind(this, module, dropInfo));
		};
		
	}
	insertAfter(element, dropInfo)
	{
		if(!dropInfo.inner)
			this.getElement().after(element);
		else
			this.getContainer().append(element);
	}
	insertBefore(element, dropInfo)
	{
		if(!dropInfo.inner)
			this.getElement().before(element);
		else
			this.getContainer().prepend(element);
	}
	insertTo(dropInfo)
	{
		var that = this;
		var insert_point = dropInfo.node;
		if(dropInfo.data != undefined){
			this.data = $.extend({}, this.data, dropInfo.data);
		}
		this.createElement(dropInfo).then(function(element){
			
			var module = pageEdit.getModule(insert_point);
			if(module){
				that.element = element;
				module.insertModule(that, dropInfo);
				
			}
				
		});
		return;
		
	}
	
	
	
	updateView()
	{
		var that = this;
		this.getModuleTemplate().then(function(template)
		{
			var newElement = that.compileTemplate(template);
			that.getElement().html(newElement.html());
		});
		
	}
	compileTemplate(template){
		var mustache_variables = {};
		mustache_variables.data = this.getData();
		mustache_variables.amp_layout = this.getAMPLayout();
		var compiled = Mustache.render(template, mustache_variables);
		
		var newelement = $('<div>' + compiled + '</div>');
		return newelement;
	}
	
	clone(newID = true)
	{
		var new_element = this.getElement().clone();
		this.getElement().after(new_element);

		var new_module = this.copyDataTo(new_element, newID);
		if(new_module){
			pageEdit.saveModule(new_module.element, new_module);
			return new_module;
		}
		new_element.remove();
	}
	copyTo(module, newID = true)
	{
		var new_element = this.getElement().clone();
		module.getElement().after(new_element);

		var new_module = this.copyDataTo(new_element, newID);
		var offsets = this.getOffset('all');
		new_module.setOffsets(offsets);
		if(new_module){
			pageEdit.saveModule(new_module.element, new_module);
			return new_module;
		}
		new_element.remove();
	}
	copyDataTo(new_element, newID = true)
	{
		new_element = $(new_element);
		if(newID){
			var id = this.generateModuleId();
			new_element.attr('id',id);
		}
		var module = pageEdit.createCloneModule(new_element, this.element);
		return module;
	}
	getDefaultClass()
	{
		return pageEdit.getClass('module_class');
	}
	changePageId(copyStyle = false)
	{
		//console.log('changePageId', this, copyStyle);
		var old_selector = this.__getSelector();
		var newId = this.generateModuleId();
		this.getElement().attr('id', newId);
		this.page_id = newId;
		var new_selector = this.__getSelector();
		if(copyStyle)
			pageEdit.StyleSheet.copyInlineStyleElement(old_selector, new_selector);
	}
	generateModuleId()
	{
		var prefix = this.getDefaultClass() + '-';
		var id = pageEdit.getUniqueId(prefix);
		while($('#' + id).length)
		{
			id = pageEdit.getUniqueId(prefix);
		}
		return id;
	}
	getModuleTemplate()
	{
		var template;
		var defered = $.Deferred();
		
		if(this.property.html != undefined)
		{
			template = this.property.html;
		}
		else{
			template = templates('./' + this.type + '.tmpl');
			
		}
		if(template != undefined)
		{
			defered.resolve(template);
		}
		else
			defered.reject(0);
		return defered.promise();
	}
	getParentModule()
	{
		var parentElement = this.getElement().parents("." + this.getDefaultClass() + ", section.section, .popup-section");
		var module = pageEdit.getModule(parentElement);
		return module;
	}
	
	getAmpImplement()
	{
		var amp = this.getAMPElement()[0];
		for(var i in amp) {
			if(typeof amp[i] == 'object') {
				if(this.endsWith(i, '_')){
					return amp[i];
				}
			}
		}
	}
	getParentModules()
	{
		var rs = [];
		var parentElements = this.getElement().parents("." + this.getDefaultClass() + ", section.section, .popup-section").each(function(){;
			var module = pageEdit.getModule(this);
			if(module)
				rs.push(module);
		});
		return rs;
	}
	getParentPopup()
	{
		var parentElement = this.getElement().parents(".popup-section");
		if(parentElement.length){
			
			var module = pageEdit.getModule(parentElement);
			return module;
		}
	}
	isInPopup()
	{
		var popup = this.getParentPopup()
		return popup != undefined;
	}
	getParentWidth()
	{
		var parentWidth = 0;
		var parentModule = this.getParentModule();
		if(parentModule){
			var padding = parentModule.getPaddingValue();
			var p = parentModule.getElement();
			if(parentModule.getContainer)
				var p = parentModule.getContainer();
			
			parentWidth = p.width();
		}
		return parentWidth;
	}
	
	_getInlineOffset()
	{
		var offset = this.getOffset();
		offset.width = this.getElement().outerWidth();
		offset.height = this.getElement().outerHeight();
		return offset;
		
	}
	getModulesInfo(modules, inlineOffset)
	{
		var that = this;
		return modules.map(function(module){
			
			var offset = {};
			if(inlineOffset)
				offset = module._getInlineOffset();
			else
				offset = module.getRealOffset();
			offset.right = offset.left + offset.width;
			offset.bottom = offset.top +offset.height;
			return $.extend({
				'module': module,
			}, offset)
		})
	}
	getBoundingByChildren(inlineOffset)
	{
		if(this.getChildModules == undefined)
			return {};
		var modules = this.getChildModules();
		modules = _.filter(modules, function(module){
			return module.getCurrentVisibility() == true;
		});
		modules = this.getModulesInfo(modules, inlineOffset);
		var top,left,bottom,right;
		modules.forEach((num, index) => {
			if(top== undefined)	top = modules[index].top;
			if(left == undefined)	left = modules[index].left;
			if(bottom== undefined)	bottom = modules[index].bottom;
			if(right== undefined)	right = modules[index].right;
			
			if(top > modules[index].top) top = modules[index].top;
			if(left > modules[index].left) left = modules[index].left;
			if(right < modules[index].right) right = modules[index].right;
			if(bottom < modules[index].bottom) bottom = modules[index].bottom;
		});
		
		return {top:top, left:left, bottom:bottom, right:right};
	}
	getVisibleChildModules(orderBy)
	{
		if(this.getChildModules == undefined)
			return [];
		var s = this.getChildModules();
		
		return s;
	}
	getRealOffset()
	{
		var offset = this.getElement().offset();
		return $.extend(offset, {width:this.getElement().outerWidth(), height:this.getElement().outerHeight()} );
	}
	
	getCurrentTimezoneOffset()
	{
		var d = new Date();
		return -(d.getTimezoneOffset() / 60);
	}
	convertToDateObject(dobj)
	{
		if(!dobj)
			return new Date();
		var d = new Date();
		d.setDate(dobj.date);
		d.setMonth(dobj.month - 1);
		d.setFullYear(dobj.year);
		d.setMinutes(dobj.minute);
		d.setHours(dobj.hour);
		var offset_delta = (this.getCurrentTimezoneOffset() - dobj.offset || 0) * 60000 * 60;
		return new Date(d.getTime() + offset_delta);
	}
	loadScript(src, callback, callBackPointer)
	{
		pageEdit.loadScript(src, callback, this);
	}
	
}
module.exports = {
	onReady: function(t)
	{
		$('#site-preloader').hide();
		new WOW().init();

	},
	default: base
}