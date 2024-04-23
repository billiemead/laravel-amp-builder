var scssToJson = require('./sass-to-json/main');
var cssjson = require('./cssjson');
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
		this.sassObject = Sass;
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
		if(pageEdit_event.iframe && window.top.siteInfo && window.top.siteInfo.theme) {
			var l = jQuery_iframe('link[title="theme_style_id"]');
			var url = window.top.getThemeStylePath(window.top.siteInfo.theme);
			l.attr('href', url);
			l.href = url;
			l.title = 'theme_style_id';
			var sass = this.getSass();
			if(!sass)	{
				console.log('sass doesn\'t inited');
				return;
			}
			$('#less_loadingSpinner').show();
			var that = this;
			var startTime = new Date();
			console.log("start fetch css");
			var env = {
				baseUrl: window.top.getThemePath(window.top.siteInfo.theme),
				useFileCache: true
			};
			var modifyVars = {};
			
			var defer = $q.defer();
			function compileContent(text){
				sass.compile(text, function(result) {
				$('#less_loadingSpinner').hide();
				if (result.status === 0) {
					console.log("css for all links generated in " + (new Date() - startTime) + 'ms');
					that.createCSS(result.text);
					cache[url] = text;
					defer.resolve(result);
				}
				else{
					console.log('less compile failed', result);
					
					defer.reject(result);
				}
			});
			}
			if(cache[url] != undefined){
				compileContent(cache[url]);
			}
			else{
				if(window.siteInfo.themeConfig && window.siteInfo.themeConfig.preload){
					var preloadTheme = window.siteInfo.themeConfig.preload;
					if(preloadTheme.preloads){
						for(var i  in preloadTheme.preloads){
							sass.writeFile(i, preloadTheme.preloads[i])
						}
					}
					compileContent(preloadTheme.main);
				}
				else{
					$.get(url).then(function(json){
						console.log("load css " + url + " in  " + (new Date() - startTime) + 'ms');
						if(json.preloads){
							for(var i  in json.preloads){
								sass.writeFile(i, json.preloads[i])
							}
						}
						compileContent(json.main).then(function(result){
							console.log(result);
							if(result.error == 'out of memory'){
								
							}
							return result;
						})
					});
				}
				
			}
			
			return defer.promise;
		}
	}
	
	this.getStyleContent = function()
	{
		if(this.styleElement)
			return this.styleElement.html();
		return "";
	}
	this.refreshStylesheets = function(fileToRemoves)
	{
		return this.refreshStyle();
	}
	this.init = function()
	{
		if(this.inited)	return;
		this.inited = true;
		
		return this.refreshStyle();
		
	}
	this.compileScheme = function(json)
	{
		var sass = this.getSass();
		if(!sass){
			console.log("Sass hasn't been loaded");
			return;
		}
		window.globalSass = sass;
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
		var sass = this.getSass();
		if(!sass)	{
			console.log('less doesn\'t inited');
			return;
		}
		sass.writeFile('custom_colors.scss', scheme.content);
		return this.refreshStyle();
		
	}
	this.getColorPalette = function(theme, variant)
	{
		
		this.colorPalettes = this.colorPalettes || {};
		if(this.colorPalettes[variant] != undefined)
			return this.colorPalettes[variant];
		var sassContent = this.getStyleContent();
		var json = cssjson.toJSON(sassContent);
		var rs = this.getPalleteFromJSON(json);
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
		var sassContent = this.getStyleContent();
		var rs = [];
		var json = cssjson.toJSON(sassContent);
		
		for(var j in StyleSheet.colorPalettePrefixes){
			
			for(var i in colors){
				var name = "." + StyleSheet.colorPalettePrefixes[j] + "-" + colors[i];
				for(var k in json.children){
					if(k == name){
						var value = json.children[k].attributes[j].replace("!important", "");
						value = $.trim(value);
						if(value != undefined){
							rs.push({name:'$' + colors[i], value:value});
						}
					}
				}
			}
		}
		return rs;
	}
	this.getPalleteFromJSON = function(json)
	{
		var rs = [];
		var colors = getColorFromConfig();
		if(!colors)
			return [];
		for(var j in StyleSheet.colorPalettePrefixes){
			
			for(var i in colors){
				var name = "." + StyleSheet.colorPalettePrefixes[j] + "-" + colors[i];
				for(var k in json.children){
					if(k == name){
						var value = json.children[k].attributes[j].replace("!important", "");
						value = $.trim(value);
						if(value != undefined){
							rs.push({name:'$' + colors[i], value:value});
						}
					}
				}
			}
			break;
		}
		return rs;
	}
	this.writeFile = function(pathToCss, content)
	{
		var sass = this.getSass();
		if(!sass)	{
			console.log('sass doesn\'t inited');
			return;
		}
		return sass.writeFile2(pathToCss, content);
	}
	this.readFile = function(pathToCss)
	{
		var sass = this.getSass();
		if(!sass)	{
			console.log('sass doesn\'t inited');
			return;
		}
		return sass.readFile2(pathToCss);
	}
	this.changeCustomVariableContent = function(data, themeConfig){
		var sass = this.getSass();
		if(!sass)	{
			console.log('sass doesn\'t inited');
			return;
		}
		var defer = $q.defer();
		var cache = this.readFile(themeConfig.variablePath);
		sass.writeFile2(themeConfig.variablePath, data);
		var rs = this.refreshStylesheets();
		if(rs != undefined){
			rs.then(function(result) {
				defer.resolve(result);
			},
			function(error){
				sass.writeFile2(themeConfig.variablePath, cache);
				defer.reject(error);
			});
		}
		else{
			defer.reject({message:'Something wrong'});
		}
		return defer.promise;
	}
	this.changeSectionContent = function(data, themeConfig){
		var sass = this.getSass();
		if(!sass)	{
			console.log('sass doesn\'t inited');
			return;
		}
		var cache = this.readFile(themeConfig.sectionStylePath);
		var defer = $q.defer();
		
		sass.writeFile2(themeConfig.sectionStylePath, data);
		var rs = this.refreshStylesheets();
		if(rs != undefined){
			rs.then(function(result) {
				defer.resolve(result);
			},
			function(error){
				sass.writeFile2(themeConfig.sectionStylePath, cache);
				defer.reject(error);
			});
		}
		else{
			defer.reject({message:'Something wrong'});
		}
		return defer.promise;
	}
	this.changeThemeContent = function(data, themeConfig){
		var sass = this.getSass();
		if(!sass)	{
			console.log('sass doesn\'t inited');
			return;
		}
		var cache = this.readFile(themeConfig.themePath);
		var defer = $q.defer();
		
		sass.writeFile2(themeConfig.themePath, data);
		var rs = this.refreshStylesheets();
		if(rs != undefined){
			rs.then(function(result) {
				defer.resolve(result);
			},
			function(error){
				sass.writeFile2(themeConfig.themePath, cache);
				defer.reject(error);
			});
		}
		else{
			defer.reject({message:'Something wrong'});
		}
		return defer.promise;
	}
}