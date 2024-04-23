/*
Stylesheet helper functions
*/
var _ = require('lodash');
const { parse, stringify } = require('./css-box-shadow')
var StyleSheet = new function()
{
	
	this.colorPalettePrefixes = {
		'color':'text',
		'background-color':'background',
		'border':'border',
	};
	this.fonts = [
		'Arial,Helvetica,sans-serif',
		'"Times New Roman",Times, serif',
		'"Courier New",Courier,monospace',
		'Georgia,"Times New Roman",Times, serif',
		'"Trebuchet MS",Arial,Helvetica,sans-serif',
		'Verdana,Arial,Helvetica,sans-serif',
		'Geneva,Arial, Helvetica,sans-serif',
		'Lobster,cursive',
		'Geneva,Tahoma,sans-serif',
	];
	this.csstag = 
	[
		['font-family','select',this.fonts],
		['font-size','number'] ,
		['font-weight','select',['inherit', 'normal', 'bold', 'bolder', 'lighter'] ], 
		['line-height','number', ['normal','8px','9px','10px','11px','12px','14px','16px','18px','20px','22px','24px','26px','28px','36px','48px','72px'] ], 
		['font-variant','select',['inherit', 'normal', 'small-caps'] ], 
		['letter-spacing','number', 0, 100],  
		['font-style','select',['inherit', 'normal', 'italic', 'oblique']], 
		['color','color'], 
		['text-align','select',['inherit', 'left', 'center', 'left', 'justify'] ], 
		['text-decoration','select',['inherit', 'none', 'underline', 'overline', 'line-through', 'blink'] ], 
		['text-transform','select',['inherit', 'none', 'capitalize', 'uppercase', 'lowercase'] ], 
		['text-indent','number', 0, 100], 
		['word-wrap','select',['normal', 'break-word'] ], 
		['word-spacing','number', 0, 100] ,
		['margin-top','number', 0, 100],  
		['margin-left','number', 0, 100], 
		['margin-right','number', 0, 100] , 
		['margin-bottom','number', 0, 100] , 
		['padding-top','number', 0, 100], 
		['padding-left','number', 0, 100] , 
		['padding-right','number', 0, 100] , 
		['padding-bottom','number', 0, 100] ,
		['display','select',['inherit', 'none', 'block', 'inline', 'list-item']], 
		['float','select',['inherit', 'none', 'left', 'right']], 
		['overflow','select',['inherit', 'none', 'visible', 'scroll', 'auto']], 
		['position','select',['none','absolute', 'relative', 'fixed', 'static']], 
		['opacity','percent'], 
		['visibility','select',['inherit', 'visible', 'hidden'] ], 
		['clear','select',['none', 'left', 'right', 'bold'] ], 
		['cursor','select',['auto', 'crosshair', 'default', 'hand', 'move', 'e-resize', 'ne-resize', 'nw-resize', 'n-resize', 'se-resize', 'sw-resize', 's-resize', 'w-resize', 'text', 'wait', 'help'] ], 
		['z-index','number', 0, 100000],
		['background-color','color'], 
		['background-image','image'], 
		['background-repeat','select',['repeat', 'repeat-x', 'repeat-y', 'no-repeat'] ], 
		['background-position','select',['left top', 'left center', 'left bottom', 'center top', 'center center', 'center bottom', 'right top', 'right center', 'right bottom'] ], 
		['background-attachment','select',['scroll', 'fixed'] ],
		['box-shadow-color','color'],
		['borderradius-width','number', 0, 30],
		['box-shadow-horizontal-offset','number', 0, 30], 
		['box-shadow-vertical-offset','number', 0, 30], 
		['box-shadow-blur-radius','number', 0, 30], 
		['box-shadow-spread-radius','number', 0, 30], 
		['width','number', 50, 2000],
		['height','number', 1, 10000],
		['border-bottom-right-radius','number', 0, 100], 
		['border-top-right-radius','number', 0, 100], 
		['border-top-left-radius','number', 0, 100], 
		['border-bottom-left-radius','number', 0, 100], 
		['border-width','number', 0, 50],
		['border-color','color'],
		['border-style','select',['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']],
		['margin','margin', 0, 100],
		['padding','padding', 0, 100],
		['border-radius','border-radius', 0, 50],
		['border-top-left-radius','number', 0, 50],
		['border-top-right-radius','number', 0, 50],
		['border-bottom-left-radius','number', 0, 50],
		['border-bottom-right-radius','number', 0, 50],
		['border-bottom-color','color'],
		['border-top-color','color'],
		['border-top-width','number', 0, 100],
		['border-bottom-width','number', 0, 100],
		['border-left-width','number', 0, 100],
		['border-right-width','number', 0, 100],
		['bottom','number', -1000, 1000],
		['top','number', -1000, 1000],
		['content','content', -100, 100],
	];
	this.font_tags = 
	[
		['Entire website','body','<div/>'],
		['Heading XL','h1', '<h1/>'],
		['Heading L','h2', '<h2/>'],
		['Heading M','h3', '<h3/>'],
		['Heading S','h4', '<h4/>'],
		['Paragraph','p', '<p/>'],
		['Link','a', '<a/>'],
		['Link hover','a:hover', '<a/>'],
	];
	

	this.fontPreviewText = 'The quick brown for jump over the lazy dogs';
	this.background_tags = 
	[
		['Entire Website','body'],
		['Header','#header_wrapper'],
		['Main','#main_wrapper'],
		['Footer','#footer_wrapper'],

	];
	this.defaultUnit = 'px';
	this.cssunit =  
	[
		['pixel', 'px'],
		['em space', 'em'],
		['x space', 'ex'],
		['percent', '%'],
		['point', 'pt'],
		['picas', 'pc'],
		['centimeters', 'cm'],
		['inches', 'in'],
		['milimeters', 'mm'],
	];
	
	this.convertPropertiesArrayToString = function ( propertiesArray ) 
	{
		var ret = '';
		if (propertiesArray.length > 0) {
			for( var i in propertiesArray ) {
				if( !propertiesArray.hasOwnProperty( i ) ) continue;
				ret += propertiesArray[i][0]+": "+propertiesArray[i][1]+"; ";
			}
		}
		return ret;
	};
	this.easing = ['linear','easeInCubic','easeOutCubic','easeInOutCubic','easeInCirc','easeOutCirc','easeInOutCirc','easeInExpo','easeOutExpo','easeInOutExpo','easeInQuad','easeOutQuad','easeInOutQuad','easeInQuart','easeOutQuart','easeInOutQuart','easeInQuint','easeOutQuint','easeInOutQuint','easeInSine','easeOutSine','easeInOutSine','easeInBack','easeOutBack','easeInOutBack'];
	this.isStyleObjEqual = function ( styleObj1, styleObj2 ) 
	{
		return styleObj1.file_name == styleObj2.file_name && styleObj1.selector == styleObj2.selector && styleObj1.prop_index_file == styleObj2.prop_index_file;
	};
	this.parseURI = function(url) {
		var m = String(url).match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
		// authority = '//' + user + ':' + pass '@' + hostname + ':' port
		return (m ? {
			href     : m[0] || '',
			protocol : m[1] || '',
			authority: m[2] || '',
			host     : m[3] || '',
			hostname : m[4] || '',
			port     : m[5] || '',
			pathname : m[6] || '',
			search   : m[7] || '',
			hash     : m[8] || ''
		} : null);
	};
	this.isNumberValue = function(name)
	{
		for(var i in this.csstag)
		{
			if(this.csstag[i][0] == name && this.csstag[i][1] && this.csstag[i][1] == 'number'){
				return true;
			} 
		}
	}
	this.isListValue = function(name)
	{
		for(var i in this.csstag)
		{
			if(this.csstag[i][0] == name && this.csstag[i][1] && this.csstag[i][1] == 'select'){
				return true;
			} 
		}
	}
	this.getListValue = function(name)
	{
		for(var i in this.csstag)
		{
			if(this.csstag[i][0] == name && this.csstag[i][1] && this.csstag[i][1] == 'select'){
				return this.csstag[i][2];
			} 
		}
	}
	this.stripUnits = function (value) 
	{
		var numb = ( (value+"").replace(/%|e(?:m|x)|p(?:x|t|c)|i(?:n)|c(?:m)|m(?:m)/g, '') );
		return isNaN(parseFloat(numb)*1) ? 0 : parseFloat(numb);
	};
	this.getValidUnitList = function(style)
	{

		var unit_list = [
			'px', 'em', '%', 'auto', 'rem', 'vh', 'vw'
		]
		var emptyElement = $('<div/>').appendTo('body');
		//console.log('getValidUnitList', emptyElement[0].style.hasOwnProperty(style),style);
		//if(!emptyElement[0].style.hasOwnProperty(style))
			//return [];
		emptyElement.hide();
		var rs = [];
		for(var i in unit_list){
			var test_value = 1 + unit_list[i];
			emptyElement.css(style, test_value);
			var currentValue = emptyElement[0].style[style];
			if(currentValue == test_value)
				rs.push(unit_list[i]);
		}
		
		
		emptyElement.remove();
		return rs;
	}
	this.getUnits = function(value)
	{
		value = (value+"").replace(/(\s)*!important(\s)*/g, "");
		var unit = value.replace(/[^%|em|ex|px|in|cm|mm|pt|pc|vh|vm]/g, '');
		
		return unit.search("%|em|ex|px|in|cm|mm|pt|pc") == -1 ? 'px' : unit;
	};
	this.rgbToHexCSS = function(value)
	{
		if(value.indexOf("rgb") == -1) return value;
		return value.replace(/\brgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/gi, function(_, r, g, b) {
			return '#' + ((1 << 24) + (r << 16) + (g << 8) + (b << 0)).toString(16).substr(-6).toUpperCase();
		});
	};
	this.HexToRgbaCSS = function(value)
	{
		if (!value.match(/^#?([0-9A-Fa-f]){3}\s*$|^#?([0-9A-Fa-f]){6}\s*$|^#?([0-9A-Fa-f]){8}\s*$/)) 
		{
		  return false;
		}
		var hex = value.replace(' ','');
    	hex = ( hex.charAt(0) == "#" ? hex.substr(1) : hex );
		if (hex.length == 8) 
		{
		  r = parseInt(hex.substring(0, 2), 16);
		  g = parseInt(hex.substring(2, 4), 16);
		  b = parseInt(hex.substring(4, 6), 16);
		  a = parseInt(hex.substring(6, 8), 16) ;
		  a = Math.precision(a / 255, 2)
		}
		if (hex.length == 6) 
		{
		  r = parseInt(hex.substring(0, 2), 16);
		  g = parseInt(hex.substring(2, 4), 16);
		  b = parseInt(hex.substring(4, 6), 16);
		  a = 1;
		}
		else if (hex.length == 3) 
		{
		  r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
		  g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
		  b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
		  a = 1;
		}
		var rs = a == 1 ? 'rgb(' + r + ',' + g + ',' + b + ')' : 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		return rs;
	};

	this.getBackgroundSrc = function ( url ) 
	{
		if( url == "undefined" ) return;
		if(this.isGradientValue(url))
			return;
		url = url.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
		return url;
	};
	this.isGradientValue = function(url){
		for(var i in this.gradient_tags){
			if(_.startsWith(url, this.gradient_tags[i])){
				return true;
			}
		}
	}
	this.convertBgPosToInt = function ( string ) 
	{
		if( string == "undefined" ) return "undefined";
		return string
		.replace(/top/g, "0%")
		.replace(/center/g, "50%")
		.replace(/bottom/g, "100%")
	};
	this.isArrEl = function( elem ) 
	{
		if( typeof elem == "function" ) return false;
		if( typeof elem == "undefined" ) return false;
		return true;
	};
	this.gradient_tag_strings =
	[
	  '-moz-linear-gradient( {0}, {1}, {2} )',
	  '-webkit-gradient(linear, {0}, from({1}), to({2}))',
	  '-webkit-linear-gradient( {0}, {1}, {2} )',
	  '-o-linear-gradient( {0}, {1}, {2} )',
	  'linear-gradient( {0}, {1}, {2} )'
	 ];
	this.gradient_tags =
	[
	  '-moz-linear-gradient',
	  '-webkit-gradient',
	  '-webkit-linear-gradient',
	  '-o-linear-gradient',
	  'linear-gradient'
	 ];
	this.gradient_pos_tags = 
	[
	 	['90deg', '-90deg', '180deg', '-180deg'],
		['left top, left bottom', 'left top, left bottom', 'left top, left bottom' , 'left top, left bottom'],
		['90deg', '-90deg', '180deg', '-180deg'],
		['90deg', '-90deg', '180deg', '-180deg'],
		['to bottom', 'to top', 'to left', 'to right']
	 ];
	
	this.gradient_css_values =
	[
	 	{
			name:'None'
		},
		{
			name:'Gradient style 1', 
			value: 
			[ 
				'-moz-linear-gradient(top, rgba(125,126,125,0.3) 0%, rgba(14,14,14,0.3) 100%)', 
				'-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(125,126,125,0.3)), color-stop(100%,rgba(14,14,14,0.3)))',
				'-webkit-linear-gradient(top, rgba(125,126,125,0.3) 0%,rgba(14,14,14,0.3) 100%)',
				'-o-linear-gradient(top, rgba(125,126,125,0.3) 0%,rgba(14,14,14,0.3) 100%)',
				'-ms-linear-gradient(top, rgba(125,126,125,0.3) 0%,rgba(14,14,14,0.3) 100%)',
				'linear-gradient(to bottom, rgba(125,126,125,0.3) 0%,rgba(14,14,14,0.3) 100%)'
			]
		},
		{
			name:'Gradient style 2',
			value:
			[
			 	'-moz-linear-gradient(top, rgba(69,72,77,0.2) 0%, rgba(0,0,0,0.4) 100%)',
				'-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(69,72,77,0.2)), color-stop(100%,rgba(0,0,0,0.4)))',
				'-webkit-linear-gradient(top, rgba(69,72,77,0.2) 0%,rgba(0,0,0,0.4) 100%)',
				'-o-linear-gradient(top, rgba(69,72,77,0.2) 0%,rgba(0,0,0,0.4) 100%)',
				'-ms-linear-gradient(top, rgba(69,72,77,0.2) 0%,rgba(0,0,0,0.4) 100%)',
				'linear-gradient(to bottom, rgba(69,72,77,0.2) 0%,rgba(0,0,0,0.4) 100%)'
			 ]
		},
		{
			name:'Gradient style 3',
			value:
			[
			 	'-moz-linear-gradient(top, rgba(181,189,200,0.24) 0%, rgba(130,140,149,0.28) 36%, rgba(40,52,59,0.36) 100%)',
				'-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(181,189,200,0.24)), color-stop(36%,rgba(130,140,149,0.28)), color-stop(100%,rgba(40,52,59,0.36)))',
				'-webkit-linear-gradient(top, rgba(181,189,200,0.24) 0%,rgba(130,140,149,0.28) 36%,rgba(40,52,59,0.36) 100%)',
				'-o-linear-gradient(top, rgba(181,189,200,0.24) 0%,rgba(130,140,149,0.28) 36%,rgba(40,52,59,0.36) 100%)',
				'-ms-linear-gradient(top, rgba(181,189,200,0.24) 0%,rgba(130,140,149,0.28) 36%,rgba(40,52,59,0.36) 100%)',
				'linear-gradient(to bottom, rgba(181,189,200,0.24) 0%,rgba(130,140,149,0.28) 36%,rgba(40,52,59,0.36) 100%)'
			 ]
		},
		{
			name:'Gradient style 4',
			value:
			[
			 	'-moz-linear-gradient(top, rgba(174,188,191,0.2) 0%, rgba(110,119,116,0.2) 50%, rgba(10,14,10,0.2) 51%, rgba(10,8,9,0.2) 100%)',
				'-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(174,188,191,0.2)), color-stop(50%,rgba(110,119,116,0.2)), color-stop(51%,rgba(10,14,10,0.2)), color-stop(100%,rgba(10,8,9,0.2)))',
				'-webkit-linear-gradient(top, rgba(174,188,191,0.2) 0%,rgba(110,119,116,0.2) 50%,rgba(10,14,10,0.2) 51%,rgba(10,8,9,0.2) 100%)',
				'-o-linear-gradient(top, rgba(174,188,191,0.2) 0%,rgba(110,119,116,0.2) 50%,rgba(10,14,10,0.2) 51%,rgba(10,8,9,0.2) 100%)',
				'-ms-linear-gradient(top, rgba(174,188,191,0.2) 0%,rgba(110,119,116,0.2) 50%,rgba(10,14,10,0.2) 51%,rgba(10,8,9,0.2) 100%)',
				'linear-gradient(to bottom, rgba(174,188,191,0.2) 0%,rgba(110,119,116,0.2) 50%,rgba(10,14,10,0.2) 51%,rgba(10,8,9,0.2) 100%)'
			 ]
		},
		{
			name:'Gradient style 5',
			value:
			[
			 	'-moz-linear-gradient(top, rgba(76,76,76,0.3) 0%, rgba(89,89,89,0.3) 12%, rgba(102,102,102,0.3) 25%, rgba(71,71,71,0.3) 39%, rgba(44,44,44,0.3) 50%, rgba(0,0,0,0.3) 51%, rgba(17,17,17,0.3) 60%, rgba(43,43,43,0.3) 76%, rgba(28,28,28,0.3) 91%, rgba(19,19,19,0.3) 100%)',
				'-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(76,76,76,0.3)), color-stop(12%,rgba(89,89,89,0.3)), color-stop(25%,rgba(102,102,102,0.3)), color-stop(39%,rgba(71,71,71,0.3)), color-stop(50%,rgba(44,44,44,0.3)), color-stop(51%,rgba(0,0,0,0.3)), color-stop(60%,rgba(17,17,17,0.3)), color-stop(76%,rgba(43,43,43,0.3)), color-stop(91%,rgba(28,28,28,0.3)), color-stop(100%,rgba(19,19,19,0.3)))',
				'-webkit-linear-gradient(top, rgba(76,76,76,0.3) 0%,rgba(89,89,89,0.3) 12%,rgba(102,102,102,0.3) 25%,rgba(71,71,71,0.3) 39%,rgba(44,44,44,0.3) 50%,rgba(0,0,0,0.3) 51%,rgba(17,17,17,0.3) 60%,rgba(43,43,43,0.3) 76%,rgba(28,28,28,0.3) 91%,rgba(19,19,19,0.3) 100%)',
				'-o-linear-gradient(top, rgba(76,76,76,0.3) 0%,rgba(89,89,89,0.3) 12%,rgba(102,102,102,0.3) 25%,rgba(71,71,71,0.3) 39%,rgba(44,44,44,0.3) 50%,rgba(0,0,0,0.3) 51%,rgba(17,17,17,0.3) 60%,rgba(43,43,43,0.3) 76%,rgba(28,28,28,0.3) 91%,rgba(19,19,19,0.3) 100%)',
				'-ms-linear-gradient(top, rgba(76,76,76,0.3) 0%,rgba(89,89,89,0.3) 12%,rgba(102,102,102,0.3) 25%,rgba(71,71,71,0.3) 39%,rgba(44,44,44,0.3) 50%,rgba(0,0,0,0.3) 51%,rgba(17,17,17,0.3) 60%,rgba(43,43,43,0.3) 76%,rgba(28,28,28,0.3) 91%,rgba(19,19,19,0.3) 100%)',
				'linear-gradient(to bottom, rgba(76,76,76,0.3) 0%,rgba(89,89,89,0.3) 12%,rgba(102,102,102,0.3) 25%,rgba(71,71,71,0.3) 39%,rgba(44,44,44,0.3) 50%,rgba(0,0,0,0.3) 51%,rgba(17,17,17,0.3) 60%,rgba(43,43,43,0.3) 76%,rgba(28,28,28,0.3) 91%,rgba(19,19,19,0.3) 100%)'
			 ]
		}
	 ],
	this.getBorderValue = function(element, with_unit)
	{
		var element = jQuery(element);
		var style = element[0].style;
		function getValue(v)
		{
		   var value = element.css('border-'+v+'-width');
		   value = StyleSheet.stripUnits(value);
			var unit = StyleSheet.getUnits(value);
			var style = element.css('border-'+ v +'-style');
			var color = element.css('border-'+ v +'-color');
			if(with_unit)
				return {width:value + unit, style:style, color:color};
			else
				return {width:value,style:style,color:color};
		}
		var borders = {};
		var sides = ['top','bottom','left','right'];
		for(var i = 0;i < sides.length;i++)
		{
		   borders[sides[i]] = getValue(sides[i]);
		}
	
		return borders;
	}
	/*this.getBorderValue = function(element, side, with_unit)
	{
		var element = jQuery(element);
		var style = element[0].style;
		function getValue(v)
		{
		   var value = element.css('border-'+v+'-width');
		   value = StyleSheet.stripUnits(value);
			var unit = StyleSheet.getUnits(value);
			var style = element.css('border-'+ v +'-style');
			var color = element.css('border-'+ v +'-color');
			if(with_unit)
				return {width:value + unit, style:style, color:color};
			else
				return {width:value,style:style,color:color};
		}
		var borders = {};
		var sides = ['top','bottom','left','right'];
		for(var i = 0;i < sides.length;i++)
		{
		   borders[sides[i]] = getValue(sides[i]);
		}
	
		return borders;
	}*/
	this.getBoxShadowValue = function(element, property = 'box-shadow')
	{
		var element = jQuery_iframe(element);
		var box_shadow = element.css(property);
		if(box_shadow == 'none')
			return [];
		box_shadow = parse(box_shadow);

		return box_shadow;
	}
	
	this.mostFreqStr = function(arr) {
		var obj = {}, mostFreq = 0, which = [];

		arr.forEach(ea => {
		if (!obj[ea]) {
		obj[ea] = 1;
		} else {
		obj[ea]++;
		}

		if (obj[ea] > mostFreq) {
		mostFreq = obj[ea];
		which = [ea];
		} else if (obj[ea] === mostFreq) {
		which.push(ea);
		}
		});

		return which;
	}
	this.getMainCornerValue = function(element, with_unit){
		var childCorners = this.getCornerValue(element, with_unit);
		var arr = _.values(childCorners);
		
		var corner = this.mostFreqStr(arr);
		return corner;
	}
	this.getColorOpacityValue = function(element, name)
	{
		var element = jQuery_iframe(element);
		var css_value = element.css(name);
		return this.extractAlphaFromColor(css_value);
	}
	this.extractAlphaFromColor = function(color)
	{
		var v = new window.Color(color);
		return v.a;
	}
	this.getMainBorderValue = function(element, with_unit)
	{
		var that = this;
		function getValue(name, childBorders)
		{
		   var arr = _.map(childBorders, name);
		   var most = that.mostFreqStr(arr);
		   return (most.length ? most[0] : undefined);
		}
		var element = jQuery(element);
		var style = element[0].style;
		var borders = {};
		
		var childBorders = this.getBorderValue(element, with_unit);
		if(style.borderStyle == undefined || !style.borderStyle.length){
			borders.style = getValue('style', childBorders);
		}
		else 
			borders.style = style.borderStyle || "none";
		if(style.borderWidth == undefined || !style.borderWidth.length){
			borders.width = getValue('width', childBorders);
		}
		else 
			borders.width = StyleSheet.stripUnits(style.borderWidth) || 1;
		if(style.borderColor == undefined || !style.borderColor.length){
			borders.color = getValue('color', childBorders);
		}
		else 
			borders.color = style.borderColor || "#000";
		return borders;
   }
   this.getCornerValue = function(element,with_unit)
   {
	   var element = jQuery(element);
		var style = element[0].style;
	   function getValue(v)
	   {
			var value = element.css('border-'+v+'-radius');
			value = StyleSheet.stripUnits(value);
			var unit = StyleSheet.getUnits(value);
			if(with_unit)
				return value + unit;
			else
				return value
	   }
	   var borders = {};
	   var sides = ['top-left','top-right','bottom-left','bottom-right'];
	   for(var i = 0;i < sides.length;i++)
	   {
		   borders[sides[i]]=getValue(sides[i]);
	   }
	   return borders;
	}
   this.getMarginValue = function(element,type,with_unit)
   {
	   var element = jQuery_iframe(element);
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
	
	this.getLessVars = function(string,parseNumbers) {
		var bNumbers = parseNumbers===undefined?true:parseNumbers
			,oLess = {}
			,rgId = /\#[\w-]+/
			,rgKey = /\.([\w-]+)/
			,rgUnit = /[a-z]+$/
			,aUnits = 'em,ex,ch,rem,vw,vh,vmin,cm,mm,in,pt,pc,px,deg,grad,rad,turn,s,ms,Hz,kHz,dpi,dpcm,dppx'.split(',')
			,rgValue = /:\s?(.*)\s?;\s?\}/
			,rgStr = /^'([^']+)'$/
			,sId = '#'+id
			,oStyles = document.styleSheets
			sRule = string;
		for (var i=0,l=oStyles.length;i<l;i++) {
			var oRules;
			try{ oRules = oStyles[i].cssRules; }
			catch (e) { continue; }
			if (oRules) {
				for (var j=0,k=oRules.length;j<k;j++) {
					try { var sRule = oRules[j].cssText; }
					catch (e) { continue; }
					var aMatchId = sRule.match(rgId);
					if (aMatchId&&aMatchId[0]==sId) {
						var aKey = sRule.match(rgKey)
							,aVal = sRule.match(rgValue);
						if (aKey&&aVal) {
							var sKey = aKey[1]
								,oVal = aVal[1]
								,aUnit
								,aStr;
							if (bNumbers&&(aUnit=oVal.match(rgUnit))&&aUnits.indexOf(aUnit[0])!==-1) {
								oVal = parseFloat(oVal);
							} else if (aStr=oVal.match(rgStr)) {
								oVal = aStr[1];
							}
							oLess[sKey] = oVal;
						}
					}
				}
			}
		}
		return oLess;
	}
	this.getFontAwesomeCode = function()
	{
		if(this.font_awsome_codes)
			return this.font_awsome_codes;
		this.font_awsome_codes = [];
		var a = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e', 'f'];
		var prefix = '\\f';
		var rs = [];
		for(var i = 0; i < a.length;i++)
		{
			if(a[i] != 'b')
				for(var j = 0; j < a.length - 1;j++)
					rs.push(prefix + '0' + a[i] + a[j]);
		}
		for(var i = 0; i <= 8;i++)
		{
			for(var j = 0; j < a.length - 1;j++)
				rs.push(prefix + '1' + a[i] + a[j]);
		}
		rs.push('\f02f');
		this.font_awsome_codes = rs;
		return this.font_awsome_codes;
	};
	
	this.parsePaddingValue = function(v)
	{
		var v = v.split(' ');
		var l = v.length;
		if(l == 1)
		{
			return {top: v[0],right: v[0],bottom: v[0],left: v[0] };
		}
		else if(l == 2)
		{
			return {top: v[0], bottom: v[0], right: v[1], left: v[1] } ;
		}
		else if(l == 3)
		{
			return {top: v[0], bottom: v[2], right:v[1], left:v[1]};
		}
		else if(l == 4)
		{
			return {top: v[0],right: v[1],bottom: v[2],left: v[3] };
		}
	};
	this.parseBorderRadiusValue = function(v)
	{
		var v = v.split(' ');
		var l = v.length;
		if(l == 1)
		{
			return {topleft: v[0],topright: v[0],bottomright: v[0],bottomleft: v[0] };
		}
		else if(l == 2)
		{
			return {topleft: v[0], bottomright: v[0], topright: v[1], bottomleft: v[1] } ;
		}
		else if(l == 3)
		{
			return {topleft: v[0], bottomleft: v[2], topright:v[1], bottomright:v[1]};
		}
		else if(l == 4)
		{
			return {topleft: v[0],topright: v[1],bottomright: v[2],bottomleft: v[3] };
		}
	};
	this.checkGradientBackground = function(p)
	{
		return p.indexOf('gradient') != -1;
	};
	
	this.createGradient = function(pos, color1, color2 )
	{
		var arr = [];
		for(var i = 0; i < this.gradient_tag_strings.length; i++)
		{
			var str = this.gradient_tag_strings[i];
			var gpt = this.gradient_pos_tags[i];
			var p = gpt[pos];
			str = str.format([ p, color1, color2 ]);
			arr.push(str);
		}
		return arr;
	};
	this.createGradientString = function(s )
	{
		var p = s;
		var arr = [];
		var i = 0;
		while(i < s.length - 1)
		{
			if(s[i] == '#' && s[i + 1] == '#')
			{
				var j = i;
				var t = '';
				while(s[j] != ')' && s[j] != ',' && s[j] != ' ' )
				{
					t = t +s[j];
					j++;
				}
				var v = '';
				if(window.palette)
				{
					v = '';
					var index = parseInt(t.substring(2));
					v += window.palette.getColor(index);
				}	
				arr.push( {o: t, n : v} );
			}
			i++;
		}
		for(var i = 0; i < arr.length;i++)
		{
			p = p.replace(arr[i].o, arr[i].n);
		}
		return p;
	};
	this.getMediaType = function(selector)
	{
		if(selector[0] != '@')
			return false;
		var s = selector.split(' ');
		s = s[0];
		return s.substr(1);
	}
	this.isMediaType = function(selector)
	{
		if(selector[0] != '@')
			return false;
		return true;
	}
	this.isMediaCombinableType = function(selector)
	{
		var combinable_media_query = {
			'font-face':false,
			'keyframes':true,
			'media':true,
			'charset':false
		}
		var type = this.getMediaType(selector);
		if(type == false)
			return false;
		return combinable_media_query[type];
		
	}
};

window.StyleSheet = StyleSheet;
module.exports = {
	StyleSheet: StyleSheet,
	//getPalleteFromJSON:getPalleteFromJSON
}


