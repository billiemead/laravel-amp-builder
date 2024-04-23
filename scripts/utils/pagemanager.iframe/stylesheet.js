var cacheStyles = {};
var StyleSheet = new function()
{
	this.lessInlineStyles = [];
	this.initInlineLess = function()
	{
	}
	this.getInlineStyle = function(element)
	{
		var id = element;
		if(typeof element == 'jQuery'){
			id = '#' + element.attr('id');
		}
		if(cacheStyles[id] != undefined){
			return cacheStyles[id];
		}
		var inlineStyle = new InlineStyle(id);
		cacheStyles[id] = inlineStyle;
		return inlineStyle;
	}
	
	this.applyStyleOverride = function(element, resolution)
	{
		var inlineStyle = this.getInlineStyle(element);
		if(inlineStyle != undefined){
			inlineStyle.applyStyleOverride(resolution);
		}
	}
	this.setStyleOverride  = function(element, name, value, opacity)
	{
		var inlineStyle = this.getInlineStyle(element);
		if(inlineStyle != undefined){
			inlineStyle.setStyleOverride(name, value, opacity);
		}
	}
	this.setStyle = function(element, name, value, opacity)
	{
		var inlineStyle = this.getInlineStyle(element);
		if(inlineStyle != undefined){
			inlineStyle.set(name, value, opacity);
		}
	}
	this.addOpacity = function(element, name, value){
		var inlineStyle = this.getInlineStyle(element);
		if(inlineStyle != undefined){
			inlineStyle.addOpacity(name, value);
		}
	}
	this.getCurrentStyle = function(element, attribute)
	{
		var styles;
		var inlineStyle = this.getInlineStyle(element);
		if(inlineStyle != undefined)
			styles = inlineStyle.getCurrentStyle();
		if(attribute != undefined)
			return styles[attribute];
		return styles;
	}
	this.getStyle = function(element, attribute)
	{
		var styles;
		var inlineStyle = this.getInlineStyle(element);
		if(inlineStyle != undefined)
			styles = inlineStyle.get();
		if(attribute != undefined)
			return styles[attribute];
		return styles;
	}
	this.getStyleOverride = function(element, resolution)
	{
		var styles;
		var inlineStyle = this.getInlineStyle(element);
		if(inlineStyle != undefined)
			styles = inlineStyle.getOverrideStyle(resolution);
		return styles;
	}
	this.changeInlineStyleElement = function(old_element, element)
	{
		for(var i in cacheStyles){
			if(i.indexOf(old_element) == 0){
				var newIndex = i.replace(old_element, element);
				cacheStyles[i].changeElement(newIndex);
				cacheStyles[i].flushAll();
				cacheStyles[newIndex] = cacheStyles[i];
				delete cacheStyles[i];
			}
		}
	}
	this.copyInlineStyleElement = function(old_element, element)
	{
		for(var i in cacheStyles){
			if(i.indexOf(old_element) == 0){
				var newIndex = i.replace(old_element, element);
				var newInline = new InlineStyle(newIndex);
				newInline.copy(cacheStyles[i]);
				newInline.flushAll();
				cacheStyles[newIndex] = newInline;
			}
		}
	}
	this.checkStyleExist = function(element){
		for(var i in cacheStyles){
			if(i.indexOf(element) == 0){
				return true;
			}
		}
	}
	this.removeAllStyles = function(element)
	{
		for(var i in cacheStyles){
			if(i.indexOf(element) == 0){
				cacheStyles[i].removeAll();
			}
		}
	}
	this.onChangePalette = function(newPalette)
	{
		for(var i in cacheStyles){
			cacheStyles[i].onChangePalette(newPalette);
		}
	}
	this.getUnits = function(value)
	{
		value = (value+"").replace(/(\s)*!important(\s)*/g, "");
		var unit = value.replace(/[^%|em|ex|px|in|cm|mm|pt|pc]/g, '');
		
		return unit.search("%|em|ex|px|in|cm|mm|pt|pc") == -1 ? 'px' : unit;
	};
	this.stripUnits = function (value) 
	{
		var numb = ( (value+"").replace(/%|e(?:m|x)|p(?:x|t|c)|i(?:n)|c(?:m)|m(?:m)/g, '') );
		return isNaN(parseFloat(numb)*1) ? 0 : parseFloat(numb);
	};
	this.getBorderValue = function(element, with_unit)
	{
		var element = $(element);
		var style = element[0].style;
		function getValue(v)
		{
		   var value = element.css('border-'+v+'-width');
		   value = StyleSheet.stripUnits(value);
			var unit = StyleSheet.getUnits(value);
			var style = element.css('border-'+v+'-style');
			var color = element.css('border-'+v+'-color');
			if(with_unit)
				return {value:value, unit:unit,style:style,color:color};
			else
				return {value:value,style:style,color:color};
		}
		var borders = {};
		var sides = ['top','bottom','left','right'];
		for(var i = 0;i < sides.length;i++)
		{
		   borders[sides[i]] = getValue(sides[i]);
		}
	
		return borders;
	}
	this.getMarginValue = function(element,type,with_unit)
	{
	   var element = $(element);
	   function getValue(v)
	   {
		   var value = element.css(type + '-' + v);
		   value = StyleSheet.stripUnits(value);
			var unit = StyleSheet.getUnits(value);
			if(with_unit)
				return {value:value, unit:unit};
			else
				return value;
	   }
	   var sides = ['top','bottom','left','right'];
	   var margins = {};
	   for(var i = 0;i < sides.length;i++)
	   {
		   margins[sides[i]] = getValue(sides[i]);
	   }
	   return margins;
	}
}

var InlineStyle = require('./pageEdit_front/cssApplier').default;
InlineStyle.attributes = {
	'box-shadow':{
		applier: function(value, opacity)
		{
			var shadow_copy = value;
			opacity = opacity || value.opacity;
			if(value.color != undefined  && value.color.value != undefined){
				if(opacity != undefined)
					value.color.opacity = opacity;
				shadow_copy.color = this.convertToRealColor(value.color);
			}
			else if(opacity != undefined)
				value.color = this.toRgba(value.color, opacity);
			
			var shadow_css = stringify([shadow_copy]);
			this.element.css('box-shadow', shadow_css);
		},
		onChangePalette: function(newPalette){
			for(var j in newPalette)
				this.updateBoxShadowColor(newPalette[j], this.style['box-shadow']);
		}
	},
	'background-gradient':{
		applier: function(value)
		{
			if(value != undefined)
				value = 'url("' + value + '")';
			if(!this.checkBackgroundGradientEnabled())
				this.element.css(name, value);
		},
		onChangePalette: function(newPalette){
			for(var j in newPalette){
				this.updateGradientColor(newPalette[j], this.style['box-gradient']);
			}
		}
	}
}
export {StyleSheet, InlineStyle};