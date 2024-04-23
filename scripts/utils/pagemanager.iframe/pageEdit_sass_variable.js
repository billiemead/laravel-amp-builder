var scssToJson = require('./sass-to-json/main');
var cssjson = require('./cssjson');
import '../../utils/colorutils';
var cache = {};
//var sass = require('sass');
export default function(pageEdit, pageEdit_event,$q, pageEdit_layout,$dialog)
{
	"ngInject";
	this.getSass = function()
	{
		if(this.sassObject)
			return this.sassObject;
		var Sass = pageEdit_event.iframe.getWindow().Sass;
		this.sassObject = new Sass;
		return this.sassObject;
	}
	this.createCSS = function(css) {

		if(!this.styleElement){
			this.styleElement = jQuery_iframe('<style></style>').appendTo('head');
		}
		this.styleElement.html(css);
	};
	this.fetchUrl = function(url)
	{
		var defer = $q.defer();
		if(!cache[url]){
			$.get(url).then(function(json){
				cache[url] = json;
				defer.resolve(cache[url]);
			});
			return;
		}
		defer.resolve(cache[url]);
		return defer.promise;
	}
	this.refreshStyle = function()
	{
		this.init();
		var defer = $q.defer();
		var result = {};
		defer.resolve(result);
		return defer.promise;
	}
	
	this.getStyleContent = function()
	{
		if(this.styleElement)
			return this.styleElement.html();
		return "";
	}

	this.init = function()
	{
		if(this.inited)	return;
		
		if(window.siteInfo.themeConfig && window.siteInfo.themeConfig.preload){
			this.createCSS(window.siteInfo.themeConfig.preload);
			
		}
		this.inited = true;
	}
	this.compileScheme = function(json)
	{
		var varsDef = scssToJson(json);
		var newscheme = {};
		var display = [];
		for (var k in varsDef) {
			
			var name = k;
			var value = varsDef[k];
			if(display.length < 5)
				if(name.indexOf("color"))
					display.push(value);
			newscheme[name] = value;
		}
		return ({content: json, value:newscheme, display:display});;
	}
	this.compileSchemes = function(loadSchemes) {
		var that = this;
		var colorSchemes = {};
		for(var i in loadSchemes) {
			if(loadSchemes[i] == undefined) continue;
			
			var newscheme = that.compileScheme(loadSchemes[i]);
			if(newscheme != undefined)
				colorSchemes[i] = newscheme;

		}
		return colorSchemes;
	}
	this.applyCustomScheme = function(colors)
	{
		var scheme = {name:':userdefined', content:''};
		for(var i in colors)
		{
			scheme.content += colors[i].name + ':' + colors[i].value + ';';
		}
		return this.applyScheme(scheme.name, scheme);
	}
	this.applyScheme = function(name, scheme)
	{
		this.init();
		return this.refreshScheme(scheme.content);
	}
	this.refreshScheme = function(content)
	{
		var defer = $q.defer();
		var sass = this.getSass();
		if(!sass)	{
			console.log('sass doesn\'t inited');
			return;
		}
		var css = window.siteInfo.themeConfig.css_variable;
		if(!css)
			return;
		css = content + css;
		var that = this;
		//console.log('refreshScheme', css)
		$('#less_loadingSpinner').show();
		sass.options({linefeed:'\n'}, function () {
		sass.compile(css, function(result) {
			$('#less_loadingSpinner').hide();
			if (result.status === 0) {
				defer.resolve(result);
				
				that.refreshCSSVariables(result.text);
			}
			else{
				console.log('less compile failed', result);
				
				defer.reject(result);
			}
		});
		});
		return defer.promise;
	}
	this.refreshCSSVariables = function(css)
	{
		var variables = this.getCSSVariables(css);
		if(!variables)
			return;
		
		for(var i in variables){
			this.setCSSVariable(i, variables[i]);
		}
		this.generateCSSVariableRGB(variables);
		
	}
	this.generateCSSVariableRGB = function(variables)
	{
		var colors = getColorFromConfig();
		for(var i in variables){
			for(var j in colors){
				if(i == '--' + colors[j]){
					var rgbString = this.convertToRgbString(variables[i]);
					this.setCSSVariable(i + '-rgb', rgbString)
				}
			}
		}
	}
	this.convertToRgbString = function(color_string)
	{
		var color = new window.Color(color_string);
		return [color.r, color.g, color.b].join(',');
	}
	this.setCSSVariable = function(name, value)
	{
		var doc = pageEdit_event.iframe.getDocument();
		var root = doc.documentElement;
		if(!root)
			return;
		root.style.setProperty(name, value);
	}
	this.getCSSVariables = function(css)
	{
		var json = cssjson.toJSON(css);
		
		var rs;
		for(var k in json.children){
			if(k == ':root'){
				rs = json.children[k].attributes;
				
			}
		}
		return rs;
	}
	this.getColorPalette = function(theme, variant)
	{
		this.colorPalettes = this.colorPalettes || {};
		if(this.colorPalettes[variant] != undefined)
			return this.colorPalettes[variant];
		var rs = this.getPalleteFromRoot();
		this.colorPalettes[variant] = rs;
		return rs;
	}
	this.displayError = function(response)
	{
		$dialog.message({message:response.formatted, title:'Error'});
	}
	this.generateColorPaletteCSS = function()
	{
		if(window.siteInfo.colorPaletteCSS == undefined)
		{
			return window.siteInfo.colorPaletteCSS;
		}
		
		var colors = getColorFromConfig();
		if(colors == undefined )
		{
			return;
		}
		var css = "";
		for(var i in colors){
				var name = '$' + colors[i];
				for(var j in StyleSheet.colorPalettePrefixes){
					css += "." + StyleSheet.colorPalettePrefixes[j] + "-" + colors[i] +"{" + j + ":" + name + " !important}";
				}
			}
		return css;
	}
	
	this._getRealColor = function(colors)
	{
		var rs = [];
		for(var i in colors){
			var name = "--" + colors[i];
			var value = this.getCSSVariable(name);
			rs.push({name:'$' + colors[i], value:value});
			
		}
		return rs;
	}
	this.getPalleteFromRoot = function()
	{
		var rs = [];
		var colors = getColorFromConfig();
		for(var i in colors){
			var name = "--" + colors[i];
			var value = this.getCSSVariable(name);
			rs.push({name:name, value:value});
		}
		return rs;
		
	}
	this.getCSSVariable = function(name)
	{
		var doc = pageEdit_event.iframe.getDocument();
		var root = doc.documentElement;
		if(!root)
			return;
		var style = getComputedStyle(root);
		return style.getPropertyValue(name)

	}
	
}