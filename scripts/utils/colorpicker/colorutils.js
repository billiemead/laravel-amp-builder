(function () { "use strict";
var hue2rgb = function(m1, m2, h)
{
	if(h < 0){ ++h; }
	if(h > 1){ --h; }
	var h6 = 6 * h;
	if(h6 < 1){ return m1 + (m2 - m1) * h6; }
	if(2 * h < 1){ return m2; }
	if(3 * h < 2){ return m1 + (m2 - m1) * (2 / 3 - h) * 6; }
	return m1;
};
var confine = function(c, low, high)
{
	// summary:
	//		sanitize a color component by making sure it is a number,
	//		and clamping it to valid values
	c = Number(c);
	return isNaN(c) ? high : c < low ? low : c > high ? high : c;	// Number
};
var Color = function(color)
{
	this.r = 255;
	this.g = 255;
	this.b = 255;
	this.a = 1;
	
	this.h ;
	this._set = function(r, g, b, a)
	{
		var t = this; t.r = r; t.g = g; t.b = b; t.a = a;
	};
	this._setHsv = function(h,s,v)
	{
		var t = this; t.h = h; t.s = s; t.v = v;
	};
	this.setColor = function(/*Array|String|Object*/ color)
	{
		// summary:
		//		Takes a named string, hex string, array of rgb or rgba values,
		//		an object with r, g, b, and a properties, or another `Color` object
		//		and sets this color instance to that value.
		//
		// example:
		//	|	var c = new Color(); // no color
		//	|	c.setColor("#ededed"); // greyish
		if(typeof(color) == 'string'){
			Color.fromString(color, this);
		}else if($.isArray(color)){
		
			Color.fromArray(color, this);
		}else{
			this._set(color.r, color.g, color.b, color.a);
			this._setHsv(color.h, color.s, color.v, color.a);
			if(!(color instanceof Color)){ this.sanitize(); }
		}
		return this;	// Color
	};
	this.clone = function()
	{
		var c = new Color(this);
		
		return c;
	};
	this.sanitize = function(){
		// summary:
		//		makes sure that the object has correct attributes
		var t = this;
		t.r = Math.round(confine(t.r, 0, 255));
		t.g = Math.round(confine(t.g, 0, 255));
		t.b = Math.round(confine(t.b, 0, 255));
		t.a = confine(t.a, 0, 1);
		return this;	// dojo/_base/Color
	};
	this.lighten = function (by, shade) 
	{

		if (undefined === by) {
			by = 0.60;
		} else if (by < 0) return this.darken( -by, shade);

		if (undefined === shade) {
			shade = 38;
		}

		var c = this.clone();

		if ((c["r"]+= parseInt((255 - c["r"]) * by)) > 0xff) c["r"] = 0xff;
		if ((c["g"]+= parseInt((255 - c["g"]) * by)) > 0xff) c["g"] = 0xff;
		if ((c["b"]+= parseInt((255 - c["b"]) * by)) > 0xff) c["b"] = 0xff;
		return c;
	};
	this.darken = function (by, shade) 
	{

		if (undefined === by) {
			by = 1;
		} else if (by < 0) return this.lighten(-by, shade);

		if (undefined === shade) {
			shade = 38;
		}

		var c = this.clone();

		if ((c["r"]-= shade * by) < 0) c["r"] = 0;
		if ((c["g"]-= shade * by) < 0) c["g"] = 0;
		if ((c["b"]-= shade * by) < 0) c["b"] = 0;
		return c;
	};
	this.toCmy = function(){
		// summary:
		//		Convert this Color to a CMY definition.
		var cyan=1-(this.r/255), magenta=1-(this.g/255), yellow=1-(this.b/255);
		return { c:Math.round(cyan*100), m:Math.round(magenta*100), y:Math.round(yellow*100) };		//	Object
	},
	this.toCmyk = function(){
		// summary:
		//		Convert this Color to a CMYK definition.
		var cyan, magenta, yellow, black;
		var r=this.r/255, g=this.g/255, b=this.b/255;
		black = Math.min(1-r, 1-g, 1-b);
		cyan = (1-r-black)/(1-black);
		magenta = (1-g-black)/(1-black);
		yellow = (1-b-black)/(1-black);
		return { c:Math.round(cyan*100), m:Math.round(magenta*100), y:Math.round(yellow*100), b:Math.round(black*100) };	//	Object
	};
		
	this.toHsl = function(){
		// summary:
		//		Convert this Color to an HSL definition.
		var r=this.r/255, g=this.g/255, b=this.b/255;
		var min = Math.min(r, b, g), max = Math.max(r, g, b);
		var delta = max-min;
		var h=0, s=0, l=(min+max)/2;
		if(l>0 && l<1){
			s = delta/((l<0.5)?(2*l):(2-2*l));
		}
		if(delta>0){
			if(max==r && max!=g){
				h+=(g-b)/delta;
			}
			if(max==g && max!=b){
				h+=(2+(b-r)/delta);
			}
			if(max==b && max!=r){
				h+=(4+(r-g)/delta);
			}
			h*=60;
		}
		return { h:h, s:Math.round(s*100), l:Math.round(l*100), a:this.a };	//	Object
	};
	this.toHsv =  function(){
		// summary:
		//		Convert this Color to an HSV definition.
		if(this.h!=undefined)
		{
			return { h:this.h, s:Math.round(this.s*100), v:Math.round(this.v*100), a:this.a  };	//	Object
		}
		var r=this.r/255, g=this.g/255, b=this.b/255;
		var min = Math.min(r, b, g), max = Math.max(r, g, b);
		var delta = max-min;
		var h = null, s = (max==0)?0:(delta/max);
		if(s==0){
			h = 0;
		}else{
			if(r==max){
				h = 60*(g-b)/delta;
			}else if(g==max){
				h = 120 + 60*(b-r)/delta;
			}else{
				h = 240 + 60*(r-g)/delta;
			}
	
			if(h<0){ h+=360; }
		}
		return { h:h, s:Math.round(s*100), v:Math.round(max*100), a:this.a };	//	Object
	};
	this.toRgb = function()
	{
		// summary:
		//		Returns 3 component array of rgb values
		// example:
		//	|	var c = new Color("#000000");
		//	|	console.log(c.toRgb()); // [0,0,0]
		var t = this;
		return [t.r, t.g, t.b]; // Array
	};
	this.toRgba = function()
	{
		// summary:
		//		Returns a 4 component array of rgba values from the color
		//		represented by this object.
		var t = this;
		return [t.r, t.g, t.b, t.a];	// Array
	};
	this.toHex = function()
	{
		// summary:
		//		Returns a CSS color string in hexadecimal representation
		// example:
		//	|	console.log(new Color([0,0,0]).toHex()); // #000000
		var a = ["r", "g", "b"];
		var rs = '';
		for(var i = 0;i < a.length; i++)
		{
			var s = this[ a[i] ].toString(16);
			s = s.length < 2 ? "0" + s : s;
			rs = rs + s;
		}
		return '#' + rs;
	
	};
	this.toCss = function(/*Boolean?*/ includeAlpha)
	{
		// summary:
		//		Returns a css color string in rgb(a) representation
		// example:
		//	|	var c = new Color("#FFF").toCss();
		//	|	console.log(c); // rgb('255','255','255')
		var t = this, rgb = t.r + ", " + t.g + ", " + t.b;
		return (includeAlpha ? "rgba(" + rgb + ", " + t.a : "rgb(" + rgb) + ")";	// String
	};
	this.setHue = function(h) 
	{
		var alpha = this.a;
		var value = this.toHsv();
		value.h = (1- h) * 360;
		var c = Color.fromHsv(value);
		this.setColor(c);
		this.a = alpha;
	};
	this.setHue2 = function(h) 
	{
		var alpha = this.a;
		var value = this.toHsv();
		value.h = h;
		var c = Color.fromHsv(value);
		this.setColor(c);
		this.a = alpha;
	};
	
	this.setSaturation = function(s) 
	{
		var alpha = this.a;
		var value = this.toHsv();
		value.s = s * 100;
		var c = Color.fromHsv(value);
		this.setColor(c);
		this.a = alpha;
	};
	this.setSaturation2 = function(s) 
	{
		var alpha = this.a;
		var value = this.toHsv();
		value.s = s;
		var c = Color.fromHsv(value);
		this.setColor(c);
		this.a = alpha;
	};
	this.setLightness = function(v) 
	{
		var alpha = this.a;
		var value = this.toHsv();
		value.v = (1 -v) * 100;
		var c = Color.fromHsv(value);
		this.setColor(c);
		this.a = alpha;
	};
	this.setLightness2 = function(v) 
	{
		var alpha = this.a;
		var value = this.toHsv();
		value.v = v;
		var c = Color.fromHsv(value);
		this.setColor(c);
		this.a = alpha;
	};
	
	this.setAlpha = function(a) 
	{
		this.a = parseInt((1 - a)*100, 10)/100;
	};
	this.toString = function()
	{
		// summary:
		//		Returns a visual representation of the color
		return this.toCss(true); // String
	};
	if(color)
	{ 
		this.setColor(color); 
	}
};
Color.fromHsv = function(/* Object|Array|int */hue, /* int */saturation, /* int */value, /* int */alpha){
	// summary:
	//		Create a dojox.color.Color from an HSV defined color.
	//		hue from 0-359 (degrees), saturation and value 0-100.

	if($.isArray(hue)){
		saturation=hue[1], value=hue[2], hue=hue[0];
		if(hue[3] != undefined) alpha = hue[3];
	} else if (typeof(hue) == 'object'){
		saturation=hue.s, value=hue.v, hue=hue.h;alpha = hue.a || 1;
	}
	if(hue==360){ hue=0; }
	saturation/=100;
	value/=100;
	
	var r, g, b;
	if(saturation==0){
		r=value, b=value, g=value;
	}else{
		var hTemp=hue/60, i=Math.floor(hTemp), f=hTemp-i;
		var p=value*(1-saturation);
		var q=value*(1-(saturation*f));
		var t=value*(1-(saturation*(1-f)));
		switch(i){
			case 0:{ r=value, g=t, b=p; break; }
			case 1:{ r=q, g=value, b=p; break; }
			case 2:{ r=p, g=value, b=t; break; }
			case 3:{ r=p, g=q, b=value; break; }
			case 4:{ r=t, g=p, b=value; break; }
			case 5:{ r=value, g=p, b=q; break; }
		}
	}
	var color= new Color({ r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) });	//	dojox.color.Color
	color.h = hue;
	color.s = saturation;
	color.v = value;
	color.a = alpha;
	return color;
};
Color.fromCmy = function(/* Object|Array|int */cyan, /*int*/magenta, /*int*/yellow)
{
	// summary:
	//		Create a dojox.color.Color from a CMY defined color.
	//		All colors should be expressed as 0-100 (percentage)

	if($.isArray(cyan)){
		magenta=cyan[1], yellow=cyan[2], cyan=cyan[0];
	} else if(lang.isObject(cyan)){
		magenta=cyan.m, yellow=cyan.y, cyan=cyan.c;
	}
	cyan/=100, magenta/=100, yellow/=100;

	var r=1-cyan, g=1-magenta, b=1-yellow;
	return new Color({ r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) });	//	dojox.color.Color
};

Color.fromCmyk = function(/* Object|Array|int */cyan, /*int*/magenta, /*int*/yellow, /*int*/black){
	// summary:
	//		Create a dojox.color.Color from a CMYK defined color.
	//		All colors should be expressed as 0-100 (percentage)

	if($.isArray(cyan)){
		magenta=cyan[1], yellow=cyan[2], black=cyan[3], cyan=cyan[0];
	} else if(lang.isObject(cyan)){
		magenta=cyan.m, yellow=cyan.y, black=cyan.b, cyan=cyan.c;
	}
	cyan/=100, magenta/=100, yellow/=100, black/=100;
	var r,g,b;
	r = 1-Math.min(1, cyan*(1-black)+black);
	g = 1-Math.min(1, magenta*(1-black)+black);
	b = 1-Math.min(1, yellow*(1-black)+black);
	return new Color({ r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) });	//	dojox.color.Color
};
	
Color.fromHsl = function(/* Object|Array|int */hue, /* int */saturation, /* int */luminosity)
{
	// summary:
	//		Create a dojox.color.Color from an HSL defined color.
	//		hue from 0-359 (degrees), saturation and luminosity 0-100.

	if($.isArray(hue)){
		saturation=hue[1], luminosity=hue[2], hue=hue[0];
	} else if(lang.isObject(hue)){
		saturation=hue.s, luminosity=hue.l, hue=hue.h;
	}
	saturation/=100;
	luminosity/=100;

	while(hue<0){ hue+=360; }
	while(hue>=360){ hue-=360; }
	
	var r, g, b;
	if(hue<120){
		r=(120-hue)/60, g=hue/60, b=0;
	} else if (hue<240){
		r=0, g=(240-hue)/60, b=(hue-120)/60;
	} else {
		r=(hue-240)/60, g=0, b=(360-hue)/60;
	}
	
	r=2*saturation*Math.min(r, 1)+(1-saturation);
	g=2*saturation*Math.min(g, 1)+(1-saturation);
	b=2*saturation*Math.min(b, 1)+(1-saturation);
	if(luminosity<0.5){
		r*=luminosity, g*=luminosity, b*=luminosity;
	}else{
		r=(1-luminosity)*r+2*luminosity-1;
		g=(1-luminosity)*g+2*luminosity-1;
		b=(1-luminosity)*b+2*luminosity-1;
	}
	return new Color({ r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) });	//	dojox.color.Color
};
Color.fromRgb =  function(/*String*/ color, /*dojo/_base/Color?*/ obj)
{
	var m = color.toLowerCase().match(/^(rgba?|hsla?)\(([\s\.\-,%0-9]+)\)/);
	if(m){
		var c = m[2].split(/\s*,\s*/), l = c.length, t = m[1], a;
		if((t == "rgb" && l == 3) || (t == "rgba" && l == 4)){
			var r = c[0];
			if(r.charAt(r.length - 1) == "%"){
				// 3 rgb percentage values
				var a = [];
				for(var i = 0; i < c.length; i++)
				{
					a.push(parseFloat( c[i] ) * 2.56);
					
				}
				if(l == 4){ a[3] = c[3]; }
				return Color.fromArray(a, obj); // dojo/_base/Color
			}
			return Color.fromArray(c, obj); // dojo/_base/Color
		}
		if((t == "hsl" && l == 3) || (t == "hsla" && l == 4)){
			// normalize hsl values
			var H = ((parseFloat(c[0]) % 360) + 360) % 360 / 360,
				S = parseFloat(c[1]) / 100,
				L = parseFloat(c[2]) / 100,
				// calculate rgb according to the algorithm
				// recommended by the CSS3 Color Module
				m2 = L <= 0.5 ? L * (S + 1) : L + S - L * S,
				m1 = 2 * L - m2;
			a = [
				hue2rgb(m1, m2, H + 1 / 3) * 256,
				hue2rgb(m1, m2, H) * 256,
				hue2rgb(m1, m2, H - 1 / 3) * 256,
				1
			];
			if(l == 4){ a[3] = c[3]; }
			return Color.fromArray(a, obj); // dojo/_base/Color
		}
	}
	return null;
};
Color.fromHex = function(/*String*/ color, /*Color?*/ obj)
{
	// summary:
	//		Converts a hex string with a '#' prefix to a color object.
	//		Supports 12-bit #rgb shorthand. Optionally accepts a
	//		`Color` object to update with the parsed value.
	//
	// returns:
	//		A Color object. If obj is passed, it will be the return value.
	//
	// example:
	//	 | var thing = dojo.colorFromHex("#ededed"); // grey, longhand
	//
	// example:
	//	| var thing = dojo.colorFromHex("#000"); // black, shorthand
	var t = obj || new Color(),
		bits = (color.length == 4) ? 4 : 8,
		mask = (1 << bits) - 1;
	color = Number("0x" + color.substr(1));
	if(isNaN(color)){
		return null; // Color
	}
	var x = ["b", "g", "r"];
	for(var i = 0;i< x.length;i++)
	{
		var c = color & mask;
		color >>= bits;
		t[x[i]] = bits == 4 ? 17 * c : c;
	};
	t.a = 1;
	return t;	// Color
};
Color.fromArray = function(/*String*/ a, /*Color?*/ obj)
{
	var t = obj || new Color();
	t._set(Number(a[0]), Number(a[1]), Number(a[2]), Number(a[3]));
	if(isNaN(t.a)){ t.a = 1; }
	return t.sanitize();	// Color
};
Color.named = {
	// summary:
	//		Dictionary list of all CSS named colors, by name. Values are 3-item arrays with corresponding RG and B values.
	"black":  [0,0,0],
	"silver": [192,192,192],
	"gray":	  [128,128,128],
	"white":  [255,255,255],
	"maroon": [128,0,0],
	"red":	  [255,0,0],
	"purple": [128,0,128],
	"fuchsia":[255,0,255],
	"green":  [0,128,0],
	"lime":	  [0,255,0],
	"olive":  [128,128,0],
	"yellow": [255,255,0],
	"navy":	  [0,0,128],
	"blue":	  [0,0,255],
	"teal":	  [0,128,128],
	"aqua":	  [0,255,255],
	"transparent": [0,0,0,0]
};
Color.fromString = function(/*String*/ str, /*Color?*/ obj)
{
	// summary:
	//		Parses `str` for a color value. Accepts hex, rgb, and rgba
	//		style color values.
	// description:
	//		Acceptable input values for str may include arrays of any form
	//		accepted by dojo.colorFromArray, hex strings such as "#aaaaaa", or
	//		rgb or rgba strings such as "rgb(133, 200, 16)" or "rgba(10, 10,
	//		10, 50)"
	// returns:
	//		A Color object. If obj is passed, it will be the return value.
	var a = Color.named[str];
	return a && Color.fromArray(a, obj) || Color.fromRgb(str, obj) || Color.fromHex(str, obj);	// Color
};

function rangeDiff(val, low, high)
{
	return high-((high-val)*((high-low)/high));
};
window.Color = Color;
window.rangeDiff = rangeDiff;
window.hue2rgb = hue2rgb;
window.confine = confine;
}());