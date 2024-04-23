class Css {
  static of (json, id = "") {
    const selectors = Object.keys(json);
	if(!selectors.length) {return};
    return selectors.map((selector) => {
		if(id.length) selector = id + ' ' + selector;
      const definition = json[selector]
      const rules = Object.keys(definition)
	  if(!rules.length) {return};
      const result = rules.map((rule) => {
		  var rule_name = rule;
		  if(rule == 'background-gradient') rule_name = "background-image";
        return `${rule_name}:${definition[rule]}`
      }).join(';')
      return `${selector}{${result}}`
    }).join('\n')
  }
}


var classApplier = function()
{
	
}
var inlineApplier = function(name, value, opacity)
{
	if(opacity != undefined)
		value.opacity = opacity;
	this.style[name] = value;
	var v = this.convertToRealColor(value);
}
var resolutionFunc = require('../../resolution');

var default_unit = 'px';
export default function(element)
{
	this.constructor = function()
	{
		this.element = element;
		this.style = {};
		this.override_style = {};
		this.styleElements = {};
	}
	this.changeElement = function(element)
	{
		this.element = element;
	}
	this.copy = function(source)
	{
		this.style = $.extend({}, source.style);
		this.override_style = $.extend({}, source.override_style);
		this.styleElements = {};
	}
	this.getOverrideStyle = function(resolution)
	{
		return (resolution == undefined ? this.override_style : this.override_style[resolution]);
	}
	this.getCurrentResolution = function()
	{
		return $('html').attr('mode');
	}
	this.importStyleOverride = function(styles)
	{
		for(var i in styles){
			var info = resolutionFunc.getBreakpointInfo(i);
			if(info){
				this.override_style[i] = $.extend({}, styles[i]);
				
				this.flush(i);
			}
			
		}
	}
	this.applyStyleOverride = function(resolution)
	{
	}
	this.get = function(name)
	{
		if(name == undefined)
			return this.style;
		return this.style[name];
	}
	this.getCurrentStyle = function(name)
	{
		var resolution = this.getCurrentResolution();
		if(resolution == undefined || resolutionFunc.isDefaultBreakpoint(resolution))
			return this.get(name);
		else{
			return this.getOverrideStyle(resolution);
		}
	}
	this.set = function(name, value, opacity)
	{
		var resolution = this.getCurrentResolution();
		if(resolution == undefined || resolutionFunc.isDefaultBreakpoint(resolution))
			this._set(name, value, opacity);
		else
			this._setStyleOverride(name, value, opacity);
		this.flush(resolution);	
	}
	this.flush = function(resolution)
	{
		var element_id = this.element;
		if(element_id == undefined)
			return;
		var styleElement;
		if(!resolution)
			resolution = resolutionFunc.getDefaultBreakpoint();
		if(!this.styleElements[resolution]){
			this.styleElements[resolution] = $( "<style></style>" ).appendTo( "body" );
			if(resolution != undefined && !resolutionFunc.isDefaultBreakpoint(resolution)){
				var info = resolutionFunc.getBreakpointInfo(resolution);
				info != undefined && this.styleElements[resolution].attr('media', 'screen and (width:' + info.breakpoint + 'px)');
			}
		}
		this.styleElements[resolution].html('');
		var stylesSelected = this.style;
		if(!resolutionFunc.isDefaultBreakpoint(resolution)){
			stylesSelected = this.getOverrideStyle(resolution);
		}
		
		if(!stylesSelected)
			return;
		var json = {};
		var styles = {};
		for(var i in stylesSelected){
			var style = this.toCSSStyle(i, stylesSelected[i]);
			if(style != undefined && typeof style == 'string')
				styles[i] = style;
			else if(typeof style == 'object'){
				for(var j in style){
					styles[j] = style[j];
				}
			}
		}
		json[element_id] = styles;
		
		var css = Css.of(json);
		
		css != undefined && this.styleElements[resolution].html(css);
	}
	this.flushAll = function()
	{
		var breakpoints = resolutionFunc.getBreakpointList();
		for(var i in breakpoints){
			this.flush(breakpoints[i]);
		}
	}
	this.addOpacity = function(name, value)
	{
		var style = this.get(name);
		if(style != undefined){
			if(style.value != undefined){
				style.opacity = value;
				this.set(name, style);
			}
			else{
				style = this.toRgba(style, value);
				this.set(name, style);
			}
			
		}
	}
	this.initGradient = function(value)
	{
		var grapick = new Grapick;
		var colorStops = value.colorStops;
		if(colorStops == undefined)
			return;
		if(colorStops.length < 1){
			return;
		}
		for(var i = 0; i < colorStops.length;i++){
			var color = this.convertToRealColor(colorStops[i].color);
			grapick.addHandler(colorStops[i].position, color);
		}
		var direction = value.direction;
		var directions = ['top', 'right', 'bottom', 'center', 'left'];
		if(directions.indexOf(direction) >= 0)
			direction = 'to ' + direction;
		var gradientString = grapick.getSafeValue(value.type, direction);
		return gradientString;
	}
	this._get = function(name)
	{
		return this.style[name];
	}
	this.toDashCase = function(name) {
	  return name.replace(/([A-Z])/g, function(match) {
		return '-' + match[0].toLowerCase();
	  });
	};
	this._set = function(name, value, opacity)
	{
		name = this.toDashCase(name);
		if(value == undefined){
			delete this.style[name];
			return;
		}
		if(typeof value == 'string' && value.length == 0){
			delete this.style[name];
			return;
		}
		
		if(opacity != undefined){
			value.opacity = opacity;
		}
		this.style[name] = value;
	}
	this._setStyleOverride = function(name, value, opacity)
	{
		name = this.toDashCase(name);
		var resolution = this.getCurrentResolution();
		this.override_style[resolution] = this.override_style[resolution] || {};
		if(value == undefined){
			delete this.override_style[resolution][name];
			return;
		}
		if(typeof value == 'string' && value.length == 0){
			delete this.override_style[resolution][name];
			return;
		}
		if(opacity != undefined){
			value.opacity = opacity;
		}
		this.override_style[resolution][name] = value;
	}
	this.toCornerCSS = function(value)
	{
		if(typeof value == 'string')
			return value;
		var directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
		var rs = [];
		for(var i in directions){
			var value_side = value[directions[i]];
			if(value_side != undefined){
				if(this.isNumber(value_side))
					rs.push(value_side + default_unit);
				else
					rs.push(value_side);
			}
			else 
				rs.push(0);
		}
		return rs.join(' ');
	}
	this.toPaddingCSS = function(value){
		var directions = ['top', 'right', 'bottom', 'left'];
		var rs = [];
		for(var i in directions){
			var value_side = value[directions[i]];
			if(value_side != undefined){
				if(this.isNumber(value_side))
					rs.push(value_side + default_unit);
				else
					rs.push(value_side);
			}
			else 
				rs.push(0);
		}
		return rs.join(' ');
	}
	this.toBorderCSS = function(value)
	{
		var value_object = value;
		if(value_object.style == undefined)
			return;
		if(value_object.color != undefined  && value_object.color.value != undefined){
			value_object.color = this.convertToRealColor(value_object.color);
		}
		var border_units = ['width', 'style', 'color'];
		var rs = "";
		for(var i in border_units){
			rs += ' ' + (value_object[border_units[i]] != undefined ? value_object[border_units[i]] : '');
		}
		return rs
	}
	this.isNumber = function(value)
	{
		return window.isNumber(value);
	}
	this.isBorderProperty = function(name)
	{
		var sides = ['border','border-right','border-top','border-bottom','border-left'];
		return sides.indexOf(name) >=0;
	}
	this.toShadowCSS = function(shadows, opacity)
	{
		var valid_shadows = [];
		var calculateOffset = function(angle, distance)
		{
			return {
				offsetX: Math.round(Math.cos(angle * Math.PI / 180) * distance),
				offsetY: Math.round(Math.sin(angle * Math.PI / 180) * distance),
			}
		}
		for(var i in shadows){
			var shadow = shadows[i];
			if((shadow.offsetX == undefined || shadow.offsetY == undefined) && (shadow.distance == undefined || shadow.angle == undefined))
				continue;
			opacity = opacity || shadow.opacity;
			if(shadow.color != undefined  && shadow.color.value != undefined){
				if(opacity != undefined)
					shadow.color.opacity = opacity;
				shadow.color = this.convertToRealColor(shadow.color);
			}
			
			if(shadow.distance != undefined && shadow.angle != undefined){
				var distance = parseFloat(shadow.distance)
				var angle = parseFloat(shadow.angle)
				var offset = calculateOffset(angle, distance);
				shadow.offsetX = offset.offsetX;
				shadow.offsetY = offset.offsetY;
			}
			valid_shadows.push(shadow);
		}
		
		if(valid_shadows.length)
			return stringify(valid_shadows);
	}
	
	this.toBackgroundImageCSS = function(value){
		var bg_image = "";
		
		var separator = "";
		var extra_properties = {
			'position':'top left',
			'repeat': 'repeat',
			'size':'auto',
			'attachment':'scroll'
		}
		var extra_values = {
		}
		for(var i in value){
			var item = value[i];
			var type = item.type;
			var data = item.data;
			if(data == undefined)
				continue;
			switch(type){
				case 'image':
					bg_image += separator + 'url("' + data.src + '")';
				break;
				case 'color':
					var color = data;
					if(color != undefined  && color.value != undefined){
						color = this.convertToRealColor(color);
					}
					bg_image += separator + 'linear-gradient(180deg, ' + color + ', ' + color + ')';
				break;
				
				case 'gradient':
					bg_image += separator + this.initGradient(data);
				break;
				default:
				break;
			}
			for(var j in extra_properties){
				var default_value = extra_properties[j];
				extra_values['background-' + j] = extra_values['background-' + j] || '';
				if(data[j] != undefined && typeof data[j] == 'string'){
					extra_values['background-' + j] += separator + data[j]
				}
				else
					extra_values['background-' + j] += separator + default_value
			}

			separator = ', ';
			
		}
		return $.extend({'background-image': bg_image}, extra_values);
	}
	this.toCSSStyle = function(name, value, opacity)
	{
		var rs;
		if(name == 'box-shadow' || name == 'text-shadow'){
			var shadow_copy = $.isArray(value) ? value: [value];
			var shadow_css = this.toShadowCSS(shadow_copy);
			rs = shadow_css;
		}
		else if(name == 'background-gradient'){
			rs = this.initGradient(value);
		}
		else if(name == 'background'){
			rs = this.toBackgroundImageCSS(value);
		}
		else if(name == 'background-image'){
			if($.isArray(value)){
				rs = this.toBackgroundImageCSS(value);
			}
			else if(typeof value == 'string'){
				var css = '';
				if(value != undefined || value != 'none')
					css = 'url("' + value + '")';
				if(!this.checkBackgroundGradientEnabled())
					rs = css;
			}
			
		}
		else if(name == 'padding' || name == 'margin'){
			rs = this.toPaddingCSS(value);
		}
		else if(name == 'border-radius'){
			rs = this.toCornerCSS(value);
		}
		else if(this.isBorderProperty(name)){
			rs = this.toBorderCSS(value);
		}
		else{
			if(value == undefined){
				rs = undefined;
			}
			else if(value.name != undefined && value.value != undefined){
				if(opacity != undefined)
					value.opacity = opacity;
				rs = this.convertToRealColor(value);
			}
				
			else{
				if(opacity != undefined)
					value = this.toRgba(value,opacity);
				rs = value;
			}
		}
		if(!isNaN(value)){
			if(this.isUnittedValue(name))
				rs = value + default_unit;
			
		}
		
		return rs;
	}
	this.isUnittedValue = function(name)
	{
		var non_unitStyles = ['font-weight', 'z-index','opacity'];
		return non_unitStyles.indexOf(name) < 0;
		
	}
	
	this.toRgba = function(color, opacity)
	{
		if(color == 'transparent')
			return color;
		opacity = parseInt(opacity, 10) / 100;
		var v = new window.Color(color);
		v.a = opacity;
		return v.toString();
	}
	
	this.convertToRealColor = function(color)
	{
		if(this.isUseCSSVariable()){
			var name = color.name;
			name = this.toCSSVariable(name);
			if(color.opacity){
				var opacity = parseInt(color.opacity, 10) / 100;
				if(opacity < 1)
					return 'rgba(var(' + name + '-rgb),' + opacity + ')';
			}
			return 'var(' + name + ')';
		}
		var v = color.value.replace("!important", "");
		var rs = v;
		
		if(color.opacity){
			v = new window.Color(v);
			var opacity = parseInt(color.opacity, 10) / 100;
			v.a = opacity;
			rs = v.toString();
		}
		return rs;
	}
	
	
	this.removeAll = function()
	{
		for(var i in this.style){
			delete this.style[i];
		}
		this.flush();
	}
	this.checkBackgroundGradientEnabled = function()
	{
		var gradient = this.get('background-gradient');
		var isValid = (gradient && gradient.colorStops && gradient.colorStops.length > 0);
		return isValid;
	}
	this.onChangePalette = function(newPalette)
	{
		var shouldTrigger = true;
		this._changePalette(newPalette, this.style);
		if(!this.isUseCSSVariable())	this.flush();
		for(var i in this.override_style){
			this._changePalette(newPalette, this.override_style[i]);
			if(!this.isUseCSSVariable())	this.flush(i);
		}
	}
	this.isUseCSSVariable = function()
	{
		//return true;
		return window.top.siteInfo.use_css_variable;
	}
	this.toCSSVariable = function(name)
	{
		if(!name.startsWith('--')) {
			var prefixes = ['@', '$', '--'];
			name = name.stripPrefixes(prefixes);
			name = '--' + name;
		}
		return name;
	}
	this.compareWithPalette = function(currentName, paletteName)
	{
		var stripPrefix = function(name)
		{
			var prefixes = ['@', '$', '--'];
			
			return name.stripPrefixes(prefixes);
		}
		return stripPrefix(currentName) == stripPrefix(paletteName);
	}
	this._changePalette = function(newPalette, styles, resolution)
	{
		var compositeProperties = ['box-shadow', 'text-shadow', 'background-gradient'];
		
		for(var i in styles){
			if(!styles[i] || !styles[i].name)	continue;
			for(var j in newPalette){
				//is color palette value
				var name = styles[i].name;
				if(name != undefined){
					
					if(this.compareWithPalette(styles[i].name, newPalette[j].name)){
						styles[i].value = newPalette[j].value;

					}
				}
				if(i == 'box-shadow')
					this.updateBoxShadowColor(newPalette[j], styles[i]);
				if(i == 'text-shadow')
					this.updateTextShadowColor(newPalette[j], styles[i]);
				if(i == 'background-gradient')
					this.updateGradientColor(newPalette[j], styles[i]);
				
			}
		}
	}
	this.updateBoxShadowColor = function(palette, value)
	{
		var arr = value;
		if(!$.isArray(value)){
			arr = [value];
		}
		for(var i in arr)
		{
			this._updateShadowColor(palette, arr[i]);
		}
	}
	this._updateShadowColor = function(palette, value)
	{
		var color = value.color;
		if(!color)	return;
		var name = value.name;
		if(!name)	return;
		if(this.compareWithPalette(name, palette.name)){
			value.color.value = palette.value;
		}
	}
	this.updateTextShadowColor = function(palette, value)
	{
		var arr = value;
		if(!$.isArray(value)){
			arr = [value];
		}
		for(var i in arr)
		{
			this._updateShadowColor(palette, arr[i]);
		}
	}
	this.updateGradientColor = function(palette, value)
	{
		var colorStops = value.colorStops;
		if(!colorStops)	return;
		var flag = false;
		for(var i in colorStops){
			var color = colorStops[i].color;
			if(!colorStops)	continue;
			var name = color.name;
			
			if(this.compareWithPalette(name, palette.name)){
				flag = true;
				value.colorStops[i].color.value = palette.value;
				
			}
		}
	}
	this.constructor();
}